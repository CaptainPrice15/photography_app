import io

import pytest
from PIL import Image

from app.services.watermark_service import (
    WATERMARK_TEXT,
    apply_watermark,
    get_cached_preview,
    make_preview_bytes,
)


@pytest.fixture
def sample_image() -> bytes:
    img = Image.new("RGB", (2400, 1600), (40, 90, 160))
    output = io.BytesIO()
    img.save(output, format="JPEG", quality=90)
    output.seek(0)
    return output.getvalue()


def test_make_preview_downscales_and_returns_jpeg(sample_image):
    preview = make_preview_bytes(sample_image, max_dim=1600)
    assert preview[:2] == b"\xff\xd8"

    img = Image.open(io.BytesIO(preview))
    assert img.format == "JPEG"
    assert max(img.size) == 1600
    assert min(img.size) < 1600


def test_apply_watermark_changes_pixels(sample_image):
    original = Image.open(io.BytesIO(sample_image))
    watermarked = apply_watermark(original)
    assert watermarked.size == original.size

    wm_pixels = list(watermarked.convert("RGB").getdata())
    orig_pixels = list(original.convert("RGB").getdata())
    diff = sum(1 for a, b in zip(wm_pixels, orig_pixels) if a != b)
    assert diff > 0


def test_get_cached_preview_returns_same_bytes(sample_image):
    a = get_cached_preview("photo-1", sample_image)
    b = get_cached_preview("photo-1", sample_image)
    assert a == b
