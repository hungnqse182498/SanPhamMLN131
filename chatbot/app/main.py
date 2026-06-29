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

app = FastAPI(title="Philosophy Chatbot", version="1.0.0")
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
        
        if is_small_talk(question):
            # Stream small talk reply
            init_data = {"type": "meta", "sources": [], "context_preview": ""}
            yield f"data: {json.dumps(init_data, ensure_ascii=False)}\n\n"
            
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

        retrieve_started_at = perf_counter()
        context, sources = retrieve_context(question)
        retrieve_duration = perf_counter() - retrieve_started_at

        init_data = {
            "type": "meta",
            "sources": sources,
            "context_preview": context[:4000],
            "retrieve_seconds": round(retrieve_duration, 3)
        }
        yield f"data: {json.dumps(init_data, ensure_ascii=False)}\n\n"

        llm_started_at = perf_counter()
        for chunk in stream_gemini(question, context):
            chunk_data = {"type": "chunk", "text": chunk}
            yield f"data: {json.dumps(chunk_data, ensure_ascii=False)}\n\n"
        llm_duration = perf_counter() - llm_started_at
        
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
