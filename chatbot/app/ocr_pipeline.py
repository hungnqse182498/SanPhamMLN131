from __future__ import annotations

from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from typing import List

from PIL import Image, ImageFilter, ImageOps

from app.config import DATA_DIR, OCR_IMAGES_DIR, PROCESSED_DIR


try:
    RESAMPLING_LANCZOS = Image.Resampling.LANCZOS
except AttributeError:
    RESAMPLING_LANCZOS = Image.LANCZOS


def log(message: str) -> None:
    print(message, flush=True)


def render_progress(current: int, total: int, prefix: str, width: int = 30) -> None:
    if total <= 0:
        return
    filled = int(width * current / total)
    bar = "#" * filled + "-" * (width - filled)
    end = "\n" if current >= total else "\r"
    sys.stdout.write(f"{prefix} [{bar}] {current}/{total}")
    sys.stdout.write(end)
    sys.stdout.flush()


def preprocess_image(image_path: Path) -> Path:
    with Image.open(image_path) as image:
        grayscale = image.convert("L")
        upscaled = grayscale.resize(
            (grayscale.width * 2, grayscale.height * 2),
            RESAMPLING_LANCZOS,
        )
        denoised = upscaled.filter(ImageFilter.MedianFilter(size=3))
        contrasted = ImageOps.autocontrast(denoised)
        thresholded = contrasted.point(lambda value: 255 if value > 180 else 0)

        temp_dir = Path(tempfile.mkdtemp(prefix="ocr_pre_", dir=str(OCR_IMAGES_DIR)))
        output_path = temp_dir / image_path.name
        thresholded.save(output_path)
        return output_path


def cleanup_preprocessed_image(image_path: Path) -> None:
    temp_dir = image_path.parent
    if image_path.exists():
        image_path.unlink()
    if temp_dir.exists() and temp_dir.name.startswith("ocr_pre_"):
        temp_dir.rmdir()


def run_command(command: List[str]) -> None:
    completed = subprocess.run(command, capture_output=True, text=True)
    if completed.returncode != 0:
        raise RuntimeError(
            f"Command failed: {' '.join(command)}\n"
            f"stdout: {completed.stdout}\n"
            f"stderr: {completed.stderr}"
        )


def ensure_tools() -> None:
    for tool in ["pdftoppm", "pdftotext", "tesseract"]:
        if shutil.which(tool) is None:
            raise RuntimeError(f"Missing required tool: {tool}")


def extract_pdf_text(pdf_path: Path, output_path: Path) -> Path:
    ensure_tools()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    image_prefix = OCR_IMAGES_DIR / pdf_path.stem
    OCR_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    log(f"\n[1/3] Extract text trực tiếp từ PDF: {pdf_path.name}")

    direct_text_path = output_path.with_name(f"{pdf_path.stem}.direct.txt")
    run_command(["pdftotext", "-layout", str(pdf_path), str(direct_text_path)])
    direct_text = direct_text_path.read_text(encoding="utf-8", errors="ignore").strip()

    image_files = sorted(OCR_IMAGES_DIR.glob(f"{pdf_path.stem}-*.png"))
    if image_files:
        log(f"[2/3] Dùng lại {len(image_files)} ảnh đã tách sẵn: {pdf_path.name}")
    else:
        log(f"[2/3] Chuyển PDF thành ảnh: {pdf_path.name}")
        run_command(["pdftoppm", "-png", str(pdf_path), str(image_prefix)])
        image_files = sorted(OCR_IMAGES_DIR.glob(f"{pdf_path.stem}-*.png"))

    ocr_pages = []

    log(f"[3/3] OCR {len(image_files)} trang với Tesseract")

    for index, image_file in enumerate(image_files, start=1):
        preprocessed_image = preprocess_image(image_file)
        page_txt = image_file.with_suffix("")
        try:
            run_command(
                [
                    "tesseract",
                    str(preprocessed_image),
                    str(page_txt),
                    "-l",
                    "vie",
                    "--oem",
                    "1",
                    "--psm",
                    "6",
                ]
            )
        finally:
            cleanup_preprocessed_image(preprocessed_image)
        txt_path = page_txt.with_suffix(".txt")
        page_text = txt_path.read_text(encoding="utf-8", errors="ignore").strip()
        if page_text:
            ocr_pages.append(page_text)
        render_progress(index, len(image_files), prefix="OCR progress")

    merged_parts = []
    if direct_text:
        merged_parts.append("[DIRECT_TEXT]\n" + direct_text)
    if ocr_pages:
        merged_parts.append("[OCR_TEXT]\n" + "\n\n".join(ocr_pages))

    output_path.write_text("\n\n".join(merged_parts), encoding="utf-8")
    log(f"Hoàn tất: {output_path}")
    return output_path


def process_data_folder() -> List[Path]:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    outputs = []
    pdf_files = sorted(DATA_DIR.glob("*.pdf"))
    if not pdf_files:
        log(f"Không tìm thấy file PDF nào trong {DATA_DIR}")
        return outputs

    log(f"Tìm thấy {len(pdf_files)} file PDF trong {DATA_DIR}")
    for index, pdf_path in enumerate(pdf_files, start=1):
        log(f"\n=== File {index}/{len(pdf_files)}: {pdf_path.name} ===")
        output_path = PROCESSED_DIR / f"{pdf_path.stem}.txt"
        outputs.append(extract_pdf_text(pdf_path, output_path))
    log(f"\nĐã xử lý xong {len(outputs)} file PDF.")
    return outputs


if __name__ == "__main__":
    files = process_data_folder()
    for file_path in files:
        print(file_path)
