# Chatbot triết học dùng OCR + Gemini

Ứng dụng này thực hiện 3 việc:

1. Đọc tài liệu trong thư mục `data/` để trả lời câu hỏi cho môn triết học / MLN131.
2. OCR file PDF và lưu kết quả thành file text trong `data/processed/`.
3. Gọi Gemini API để sinh câu trả lời dựa trên ngữ cảnh được truy xuất.

## Kiến trúc

- `app/ocr_pipeline.py`: chuyển PDF -> text bằng `pdftotext` và `tesseract`.
- `app/retriever.py`: cắt chunk và truy xuất ngữ cảnh bằng `LangChain BM25Retriever`.
- `app/gemini_client.py`: gọi Gemini qua `LangChain` + `ChatGoogleGenerativeAI`.
- `app/main.py`: cung cấp API `FastAPI`.

## Yêu cầu

- Python 3.11+
- Có sẵn các lệnh hệ thống: `pdftotext`, `pdftoppm`, `tesseract`
- Biến môi trường `GEMINI_API_KEY`

## Cài đặt

```bash
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Sau đó cập nhật `GEMINI_API_KEY` trong file `.env`.

Nếu muốn dùng biến môi trường shell thay vì `.env`, bạn vẫn có thể:

```bash
export GEMINI_API_KEY="your_key_here"
```

Có thể đổi model nếu cần:

```bash
export GEMINI_MODEL="gemini-1.5-flash"
```

## Chạy OCR và indexing

OCR tất cả file PDF trong `data/`:

```bash
python3 -m app.ocr_pipeline
```

Kết quả text sẽ nằm trong `data/processed/`.

## Chạy chatbot API

```bash
uvicorn app.main:app --reload
```

## API

### `POST /ingest`

Tiền xử lý lại toàn bộ PDF trong `data/`.

### `POST /chat`

Ví dụ request:

```json
{
  "question": "Chủ nghĩa xã hội khoa học là gì?"
}
```

Ví dụ `curl`:

```bash
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"Chủ nghĩa xã hội khoa học là gì?"}'
```

## Ghi chú

- Hiện tại pipeline OCR xử lý `*.pdf` đúng theo yêu cầu. File `.pptx` trong `data/` chưa được ingest.
- Retriever hiện dùng `LangChain BM25`, chưa cần vector database.
- Nếu tài liệu scan tiếng Việt, cần bảo đảm `tesseract` có language pack `vie`.
