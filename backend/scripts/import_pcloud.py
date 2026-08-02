"""Import photos from pCloud folder 32426733211 (Kedarnath, Sikkim) into Postgres.

Usage: python -m scripts.import_pcloud
Idempotent: skips photos whose slug already exists.
"""

import asyncio
import re
import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.api.deps import async_session_factory
from app.core.security import hash_password
from app.models.album import Album, album_photos
from app.models.user import User
from app.repositories.photo_repo import PhotoRepository
from app.repositories.user_repo import UserRepository
from app.storage.pcloud import PCloudStorage
from app.utils.exif import extract_exif

PCLOUD_ROOT_FOLDER = 32426733211
ADMIN_EMAIL = "photosback15@gmail.com"
ADMIN_PASSWORD = "gourabdas123"
VISITOR_EMAIL = "visitor@test.com"
VISITOR_PASSWORD = "visitor123"
PRICE = 25.0

FOLDER_ALBUM_SLUG = {
    "kedarnath": "kedarnath",
    "sikkim": "sikkim",
}


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s or "photo"


def title_from_filename(filename: str) -> str:
    stem = Path(filename).stem
    words = re.sub(r"[^a-zA-Z0-9 ]+", " ", stem).strip()
    return words if words else stem


async def ensure_album(db, slug: str, title: str) -> Album:
    from sqlalchemy import select
    result = await db.execute(select(Album).where(Album.slug == slug))
    album = result.scalar_one_or_none()
    if not album:
        album = Album(
            title=title,
            slug=slug,
            description=f"Photography collection: {title}",
            is_published=True,
            is_featured=True,
            sort_order=0,
            photo_count=0,
        )
        db.add(album)
        await db.commit()
        await db.refresh(album)
    return album


async def main() -> None:
    storage = PCloudStorage()

    folders = await storage._request(
        "listfolder", params={"folderid": PCLOUD_ROOT_FOLDER}
    )
    if folders.get("result") != 0:
        print(f"ERROR listing root folder: {folders.get('error')}")
        return

    async with async_session_factory() as db:
        user_repo = UserRepository()
        admin = await user_repo.get_by_email(db, ADMIN_EMAIL)
        if not admin:
            admin = await user_repo.create(
                db,
                email=ADMIN_EMAIL,
                username=ADMIN_EMAIL.split("@")[0],
                full_name="Gourab Das",
                hashed_password=hash_password(ADMIN_PASSWORD),
                role="admin",
                is_verified=True,
                is_active=True,
            )
            print(f"Created admin user: {admin.email}")
        else:
            print(f"Admin user exists: {admin.email}")

        visitor = await user_repo.get_by_email(db, VISITOR_EMAIL)
        if not visitor:
            visitor = await user_repo.create(
                db,
                email=VISITOR_EMAIL,
                username=VISITOR_EMAIL.split("@")[0],
                full_name="Test Visitor",
                hashed_password=hash_password(VISITOR_PASSWORD),
                role="visitor",
                is_verified=True,
                is_active=True,
            )
            print(f"Created visitor user: {visitor.email}")
        else:
            print(f"Visitor user exists: {visitor.email}")

        photo_repo = PhotoRepository()
        created = 0
        skipped = 0

        for subfolder in folders.get("metadata", {}).get("contents", []):
            if subfolder.get("isfolder") != 1:
                continue
            folder_name = subfolder.get("name", "")
            folder_key = folder_name.lower()
            album_slug = FOLDER_ALBUM_SLUG.get(folder_key)
            if not album_slug:
                print(f"Skipping folder (no album mapping): {folder_name}")
                continue

            album = await ensure_album(db, album_slug, folder_name)
            print(f"\nImporting folder: {folder_name} (album {album.slug})")

            listing = await storage._request(
                "listfolder", params={"folderid": subfolder["folderid"]}
            )
            files = [
                f
                for f in listing.get("metadata", {}).get("contents", [])
                if f.get("isfolder") == 0 and f.get("name", "").lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
            ]
            print(f"  {len(files)} image files")

            for file in files:
                name = file["name"]
                file_id = file["fileid"]
                slug = f"{slugify(title_from_filename(name))}_{file_id}"

                existing = await photo_repo.get_by_slug(db, slug)
                if existing:
                    skipped += 1
                    print(f"  skip (exists): {name}")
                    continue

                print(f"  fetching: {name}")
                try:
                    raw = await storage.download_file(int(file_id))
                except Exception as e:
                    print(f"  FAIL download: {name}: {e}")
                    continue

                exif = extract_exif(raw)
                fmt = name.rsplit(".", 1)[-1].lower()

                from datetime import datetime
                taken_at = None
                if exif.taken_at:
                    try:
                        taken_at = datetime.strptime(exif.taken_at, "%Y:%m:%d %H:%M:%S")
                    except ValueError:
                        pass

                photo = await photo_repo.create(
                    db,
                    title=title_from_filename(name),
                    slug=slug,
                    description=None,
                    original_file_id=str(file_id),
                    thumbnail_file_id=None,
                    width=exif.width or file.get("width", 0) or 1600,
                    height=exif.height or file.get("height", 0) or 1200,
                    file_size=file.get("size", len(raw)),
                    format=fmt,
                    camera_make=exif.camera_make,
                    camera_model=exif.camera_model,
                    lens=exif.lens,
                    focal_length=exif.focal_length,
                    aperture=exif.aperture,
                    shutter_speed=exif.shutter_speed,
                    iso=exif.iso,
                    taken_at=taken_at,
                    latitude=exif.latitude,
                    longitude=exif.longitude,
                    price=PRICE,
                    is_free=False,
                    is_featured=False,
                    is_published=True,
                    tags=[folder_name.lower()],
                    has_watermark=True,
                    uploaded_by=str(admin.id),
                )

                await db.execute(
                    album_photos.insert().values(album_id=album.id, photo_id=photo.id, sort_order=0)
                )
                album.photo_count += 1
                await db.commit()
                created += 1
                print(f"  OK: {name} ({photo.id})")

        print(f"\nDone: {created} created, {skipped} skipped")


if __name__ == "__main__":
    asyncio.run(main())
