from __future__ import annotations

from functools import lru_cache
from typing import List, Tuple
import re
import string

from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import MAX_CONTEXT_CHARS, PROCESSED_DIR, TOP_K

WHITESPACE_PATTERN = re.compile(r"\s+")
GREETING_PATTERN = re.compile(r"^(chào|hello|hi|xin chào|hey)\b", re.IGNORECASE)

VI_STOPWORDS = {"là", "gì", "thế", "nào", "các", "của", "có", "và", "trong", "để", "cho", "được", "với", "không", "một", "những", "thì", "khi", "đã", "sẽ", "đó", "này", "cùng", "như", "nhưng", "tại", "theo", "về", "còn", "lại", "ra", "mới", "hơn", "đến", "từ", "lên", "xuống", "những", "các", "mọi", "sự", "những"}

def preprocess_vi(text: str) -> List[str]:
    text = text.translate(str.maketrans("", "", string.punctuation))
    tokens = text.lower().split()
    return [t for t in tokens if t not in VI_STOPWORDS]


def normalize_text(text: str) -> str:
    return WHITESPACE_PATTERN.sub(" ", text).strip()


def load_documents() -> List[Document]:
    documents: List[Document] = []
    for txt_file in sorted(PROCESSED_DIR.glob("*.txt")):
        text = txt_file.read_text(encoding="utf-8", errors="ignore")
        normalized = normalize_text(text)
        if not normalized:
            continue
        documents.append(
            Document(page_content=normalized, metadata={"source": txt_file.name})
        )
    return documents


@lru_cache(maxsize=1)
def build_retriever() -> BM25Retriever:
    documents = load_documents()
    if not documents:
        raise RuntimeError(
            f"Không tìm thấy tài liệu đã xử lý trong {PROCESSED_DIR}. Hãy chạy /ingest trước."
        )

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1200,
        chunk_overlap=200,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunked_documents = splitter.split_documents(documents)
    retriever = BM25Retriever.from_documents(chunked_documents, preprocess_func=preprocess_vi)
    retriever.k = TOP_K
    return retriever


def refresh_retriever() -> None:
    build_retriever.cache_clear()


def is_small_talk(question: str) -> bool:
    normalized = normalize_text(question).lower()
    return bool(normalized) and len(normalized) <= 20 and bool(GREETING_PATTERN.match(normalized))


def retrieve_context(question: str) -> Tuple[str, List[str]]:
    documents = build_retriever().invoke(question)
    context_parts: List[str] = []
    sources: List[str] = []
    current_size = 0

    for document in documents:
        source = str(document.metadata.get("source", "unknown"))
        block = "Nguồn: {source}\n{content}".format(
            source=source,
            content=document.page_content,
        )
        if current_size + len(block) > MAX_CONTEXT_CHARS:
            break
        context_parts.append(block)
        if source not in sources:
            sources.append(source)
        current_size += len(block)

    return "\n\n".join(context_parts), sources
