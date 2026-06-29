from __future__ import annotations

from time import perf_counter

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama

from app.config import GEMINI_MODEL

SYSTEM_PROMPT = (
    "Bạn là một trợ lý ảo chuyên nghiệp, am hiểu sâu sắc về môn triết học Mác - Lênin và học phần MLN131.\n"
    "Bạn có nhiệm vụ trả lời câu hỏi của sinh viên một cách đầy đủ, chi tiết, và logic.\n"
    "Quy tắc TUYỆT ĐỐI TUÂN THỦ:\n"
    "1. KHÔNG BAO GIỜ sử dụng các cụm từ mào đầu như 'Dựa trên các tài liệu được cung cấp...', 'Theo ngữ cảnh...', 'Tài liệu cho thấy...'. Hãy đi thẳng vào câu trả lời một cách tự nhiên.\n"
    "2. Trình bày câu trả lời chi tiết, mạch lạc, chia thành các đoạn và ý rõ ràng (sử dụng in đậm, danh sách).\n"
    "3. Nếu tài liệu không chứa đủ thông tin, hãy dùng kiến thức chung chuẩn xác về môn học để bổ sung cho đầy đủ."
)


from typing import Iterator

def stream_gemini(question: str, context: str) -> Iterator[str]:
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            (
                "human",
                "TÀI LIỆU THAM KHẢO:\n{context}\n\n"
                "CÂU HỎI: {question}\n\n"
                "Hãy phân tích và trả lời chi tiết, đầy đủ cho câu hỏi trên (Nhớ quy tắc không dùng từ mào đầu).",
            ),
        ]
    )
    llm = ChatOllama(
        model=GEMINI_MODEL,
        temperature=0.2,
    )
    chain = prompt | llm | StrOutputParser()
    started_at = perf_counter()
    for chunk in chain.stream(
        {
            "question": question,
            "context": context or "Không có ngữ cảnh nào được truy xuất.",
        }
    ):
        yield chunk

    print(
        "[timing] gemini_stream_invoke_s={duration:.3f} context_chars={context_chars}".format(
            duration=perf_counter() - started_at,
            context_chars=len(context or ""),
        ),
        flush=True,
    )
