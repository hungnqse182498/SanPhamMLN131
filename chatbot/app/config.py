from pathlib import Path
import os

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATA_DIR = BASE_DIR / "data"
PROCESSED_DIR = DATA_DIR / "processed"
OCR_IMAGES_DIR = PROCESSED_DIR / "images"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
TOP_K = int(os.getenv("TOP_K", "4"))
MAX_CONTEXT_CHARS = int(os.getenv("MAX_CONTEXT_CHARS", "6000"))
