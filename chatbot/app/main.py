from __future__ import annotations

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Dict, List, Any
import json
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
from time import perf_counter

from app.gemini_client import stream_gemini
from app.ocr_pipeline import process_data_folder
from app.retriever import retrieve_context, refresh_retriever, is_small_talk

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Philosophy Chatbot", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

templates = Jinja2Templates(directory="templates")

@app.on_event("startup")
def warmup() -> None:
    try:
        refresh_retriever()
        retrieve_context("khởi động")
    except Exception:
        pass

@app.get("/", response_class=HTMLResponse)
def home(request: Request) -> HTMLResponse:
    return templates.TemplateResponse(request, "chat.html", {})

@app.get("/home")
def home_redirect() -> RedirectResponse:
    return RedirectResponse(url="/")

class ChatRequest(BaseModel):
    question: str

def stream_visible_answer(chunks):
    """Strip model-emitted <think> blocks and report whether the model is thinking."""
    open_tag = "<think>"
    close_tag = "</think>"
    keep_chars = max(len(open_tag), len(close_tag)) - 1
    buffer = ""
    in_think = False
    reported_thinking = False

    for chunk in chunks:
        buffer += chunk

        while buffer:
            target = close_tag if in_think else open_tag
            index = buffer.find(target)

            if index >= 0:
                visible_text = buffer[:index]
                if visible_text and not in_think:
                    yield {"type": "chunk", "text": visible_text}

                buffer = buffer[index + len(target):]
                in_think = not in_think

                if in_think and not reported_thinking:
                    reported_thinking = True
                    yield {
                        "type": "progress",
                        "step": "Gemma đang suy luận",
                        "detail": "Model đang tạo nháp suy luận nội bộ trước khi trả lời.",
                    }
                continue

            if len(buffer) <= keep_chars:
                break

            visible_text = buffer[:-keep_chars]
            buffer = buffer[-keep_chars:]
            if visible_text and not in_think:
                yield {"type": "chunk", "text": visible_text}

    if buffer and not in_think:
        yield {"type": "chunk", "text": buffer}

@app.get("/health")
def health_check() -> Dict[str, str]:
    return {"status": "ok"}

@app.post("/ingest")
def ingest_documents() -> Dict[str, List[str]]:
    try:
        outputs = process_data_folder()
        refresh_retriever()
        return {"processed_files": [str(path) for path in outputs]}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

@app.post("/chat_stream")
def chat_stream(request: ChatRequest):
    def generate():
        total_started_at = perf_counter()
        question = request.question.strip()

        def progress(step: str, detail: str):
            progress_data = {"type": "progress", "step": step, "detail": detail}
            return f"data: {json.dumps(progress_data, ensure_ascii=False)}\n\n"

        yield progress("Nhận câu hỏi", "Đã nhận câu hỏi và chuẩn bị phân tích yêu cầu.")
        
        if is_small_talk(question):
            yield progress("Nhận diện hội thoại", "Câu hỏi là lời chào/hội thoại ngắn, không cần truy xuất tài liệu.")
            # Stream small talk reply
            init_data = {"type": "meta", "sources": [], "context_preview": ""}
            yield f"data: {json.dumps(init_data, ensure_ascii=False)}\n\n"
            yield progress("Soạn phản hồi", "Đang tạo câu trả lời chào hỏi phù hợp.")
            
            chunk_data = {"type": "chunk", "text": "Xin chào! Mình là chatbot hỗ trợ môn Triết học và MLN131. Bạn cứ hỏi một khái niệm, chương học, hoặc câu hỏi ôn tập cụ thể nhé."}
            yield f"data: {json.dumps(chunk_data, ensure_ascii=False)}\n\n"
            
            end_data = {
                "type": "end",
                "debug": {
                    "mode": "small_talk",
                    "total_seconds": round(perf_counter() - total_started_at, 3)
                }
            }
            yield f"data: {json.dumps(end_data, ensure_ascii=False)}\n\n"
            return

        yield progress("Truy xuất tài liệu", "Đang tìm các đoạn nội dung liên quan trong kho kiến thức.")
        retrieve_started_at = perf_counter()
        context, sources = retrieve_context(question)
        retrieve_duration = perf_counter() - retrieve_started_at

        yield progress(
            "Tổng hợp ngữ cảnh",
            f"Tìm thấy {len(sources)} nguồn liên quan trong {round(retrieve_duration, 3)} giây."
        )

        init_data = {
            "type": "meta",
            "sources": sources,
            "context_preview": context[:4000],
            "retrieve_seconds": round(retrieve_duration, 3)
        }
        yield f"data: {json.dumps(init_data, ensure_ascii=False)}\n\n"

        yield progress("Tạo câu trả lời", "Đang gửi câu hỏi kèm ngữ cảnh cho mô hình và stream kết quả.")
        llm_started_at = perf_counter()
        for event in stream_visible_answer(stream_gemini(question, context)):
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        llm_duration = perf_counter() - llm_started_at
        yield progress("Hoàn tất", f"Đã tạo xong câu trả lời trong {round(llm_duration, 3)} giây.")
        
        end_data = {
            "type": "end",
            "debug": {
                "mode": "rag",
                "retrieve_seconds": round(retrieve_duration, 3),
                "llm_seconds": round(llm_duration, 3),
                "total_seconds": round(perf_counter() - total_started_at, 3),
                "context_chars": len(context),
                "source_count": len(sources),
                "reasoning_summary": "Hệ thống truy xuất tài liệu và stream câu trả lời."
            }
        }
        yield f"data: {json.dumps(end_data, ensure_ascii=False)}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")
