import io
import logging
from functools import lru_cache
from typing import Tuple
from PIL import Image, ImageDraw, ImageFont, ImageOps

logger = logging.getLogger(__name__)

WATERMARK_TEXT = "@Gourab_Das"
PREVIEW_MAX_DIM = 1600
PREVIEW_QUALITY = 80

_preview_cache: dict = {}
_PREVIEW_CACHE_SIZE = 256

_FONT_CANDIDATES = [
    "C:/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]


@lru_cache(maxsize=4)
def _load_font(size: int) -> ImageFont.FreeTypeFont:
    for path in _FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def _text_size(draw: ImageDraw.ImageDraw, text: str, font) -> Tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def apply_watermark(img: Image.Image) -> Image.Image:
    """Stamp diagonal tiled '@Gourab_Das' across the image plus a subtle center mark."""
    img = ImageOps.exif_transpose(img)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    width, height = img.size

    base_font = _load_font(max(16, int(min(width, height) * 0.045)))
    tile_w, tile_h = _text_size(draw, WATERMARK_TEXT, base_font)
    spacing = int(min(width, height) * 0.55)
    step = tile_h + int(spacing * 0.55)

    tmp = Image.new("RGBA", (tile_w, tile_h), (0, 0, 0, 0))
    tmp_draw = ImageDraw.Draw(tmp)
    tmp_draw.text((0, 0), WATERMARK_TEXT, font=base_font, fill=(255, 255, 255, 70))
    tmp = tmp.rotate(30, expand=True, resample=Image.BICUBIC)

    for y in range(-step, height + step, step):
        for x in range(-step, width + step, step):
            overlay.alpha_composite(tmp, dest=(x, y))

    center_font = _load_font(max(20, int(min(width, height) * 0.06)))
    cx, cy = _text_size(draw, WATERMARK_TEXT, center_font)
    draw.text(
        ((width - cx) // 2, (height - cy) // 2),
        WATERMARK_TEXT,
        font=center_font,
        fill=(255, 255, 255, 90),
    )

    result = Image.alpha_composite(img.convert("RGBA"), overlay)
    return result.convert("RGB")


def make_preview_bytes(original: bytes, max_dim: int = PREVIEW_MAX_DIM, quality: int = PREVIEW_QUALITY) -> bytes:
    """Downscale to max long edge, watermark, encode as JPEG. Returns bytes."""
    img = Image.open(io.BytesIO(original))
    img = ImageOps.exif_transpose(img)

    img.thumbnail((max_dim, max_dim), Image.LANCZOS)

    watermarked = apply_watermark(img)

    output = io.BytesIO()
    watermarked.save(output, format="JPEG", quality=quality, optimize=True)
    output.seek(0)
    return output.getvalue()


def get_cached_preview(photo_id: str, original: bytes, max_dim: int = PREVIEW_MAX_DIM) -> bytes:
    """Watermarked preview cached per (photo_id, max_dim) to avoid re-encoding per request."""
    key = (photo_id, max_dim)
    cached = _preview_cache.get(key)
    if cached is not None:
        return cached

    preview = make_preview_bytes(original, max_dim=max_dim)

    if len(_preview_cache) >= _PREVIEW_CACHE_SIZE:
        _preview_cache.pop(next(iter(_preview_cache)))
    _preview_cache[key] = preview
    return preview
