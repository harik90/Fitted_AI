from pathlib import Path
from fastapi import UploadFile
from PIL import Image

from backend.config import settings


def validate_image(path: Path) -> str | None:
    """Return an error message string, or None if valid."""
    if not path.exists():
        return "Image file not found."

    size_mb = path.stat().st_size / (1024 * 1024)
    if size_mb > settings.max_upload_size_mb:
        return f"File is too large. Maximum is {settings.max_upload_size_mb}MB."

    ext = path.suffix.lower().lstrip(".")
    if ext not in settings.allowed_extensions:
        return f"Unsupported format. Use: {', '.join(settings.allowed_extensions)}."

    try:
        with Image.open(path) as img:
            img.verify()
    except Exception:
        return "This image appears to be corrupted."

    with Image.open(path) as img:
        w, h = img.size
        if w < 64 or h < 64:
            return "This image is too small."

    return None


async def save_upload(upload: UploadFile, stem: Path) -> Path:
    """Save an UploadFile to disk, returning the final path."""
    ext = Path(upload.filename or "image.jpg").suffix.lower()
    if not ext:
        ext = ".jpg"
    dest = stem.with_suffix(ext)
    content = await upload.read()
    dest.write_bytes(content)
    return dest
