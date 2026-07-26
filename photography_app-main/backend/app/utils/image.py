import io
from typing import Tuple
from PIL import Image


def optimize_image(
    file_bytes: bytes,
    max_width: int = 2400,
    quality: int = 85,
    format: str = "JPEG",
) -> Tuple[bytes, int, int, str]:
    img = Image.open(io.BytesIO(file_bytes))

    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    width, height = img.size

    if width > max_width:
        ratio = max_width / width
        new_height = int(height * ratio)
        img = img.resize((max_width, new_height), Image.LANCZOS)
        width, height = img.size

    output = io.BytesIO()
    img.save(output, format=format, quality=quality, optimize=True)
    output.seek(0)

    return output.getvalue(), width, height, format.lower()


def generate_thumbnail(
    file_bytes: bytes,
    width: int = 800,
    height: int = 600,
    quality: int = 80,
) -> Tuple[bytes, int, int]:
    img = Image.open(io.BytesIO(file_bytes))

    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    img.thumbnail((width, height), Image.LANCZOS)
    new_width, new_height = img.size

    output = io.BytesIO()
    img.save(output, format="JPEG", quality=quality, optimize=True)
    output.seek(0)

    return output.getvalue(), new_width, new_height
