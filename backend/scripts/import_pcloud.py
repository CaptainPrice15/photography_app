"""Sync albums and photos from pCloud into the database.

For every image-bearing subfolder under the pCloud Photos folder, an album is
created (title = folder name) and each image file becomes a published photo
linked to that album. Photos/albums that do not come from pCloud are removed,
so the frontend only shows pCloud content.

Usage: python -m scripts.import_pcloud
Idempotent: skips photos whose slug already exists.
"""

import asyncio
import re
import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import bindparam, delete, select, text

from app.core.security import hash_password
from app.models.album import Album, album_photos
from app.models.photo import Photo
from app.models.user import User
from app.storage.pcloud import PCloudStorage

PCLOUD_ROOT_FOLDER = 32426733211
ADMIN_EMAIL = "photosback15@gmail.com"
ADMIN_PASSWORD = "gourabdas123"
PRICE = 25.0

# Only these folders become albums; everything else is ignored/pruned.
FOLDER_ALBUM_SLUG = {
    "kedarnath": "kedarnath",
    "sikkim": "sikkim",
}

# Cover photo filename per folder, taken from manifest.json.
FOLDER_COVER_FILE = {
    "kedarnath": "IMG20250523192204.jpg",
    "sikkim": "IMG20231029075117.jpg",
}

IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".bmp", ".tiff")


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s or "photo"


def title_from_filename(filename: str) -> str:
    stem = Path(filename).stem
    words = re.sub(r"[^a-zA-Z0-9 ]+", " ", stem).strip()
    return words if words else stem


async def fetch_manifest_cover(storage: PCloudStorage) -> dict:
    """Best-effort read of manifest.json at the Photos root -> {folder: filename}."""
    covers = {}
    listing = await storage._request("listfolder", params={"folderid": PCLOUD_ROOT_FOLDER})
    for item in listing.get("metadata", {}).get("contents", []):
        if item.get("name") == "manifest.json":
            try:
                raw = await storage.download_file(int(item["fileid"]))
                import json
                manifest = json.loads(raw.decode("utf-8"))
                for coll in manifest.get("collections", []):
                    cover = (coll.get("cover") or "").rsplit("/", 1)[-1]
                    if cover:
                        covers[coll.get("slug", "").lower()] = cover
            except Exception as e:
                print(f"  manifest.json read failed: {e}")
    return covers


async def ensure_album(db, slug: str, title: str) -> Album:
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


async def prune_non_pcloud(db, allowed_album_slugs: set, allowed_file_ids: set) -> None:
    """Remove albums not backed by pCloud folders and photos not backed by pCloud files."""
    albums = (await db.execute(select(Album))).scalars().all()
    remove_albums = [a for a in albums if a.slug not in allowed_album_slugs]

    for album in remove_albums:
        await db.execute(delete(album_photos).where(album_photos.c.album_id == album.id))
    await db.commit()

    photos = (await db.execute(select(Photo))).scalars().all()
    remove_photo_ids = [
        p.id
        for p in photos
        if not (p.original_file_id or "").isdigit()
        or int(p.original_file_id) not in allowed_file_ids
    ]
    if remove_photo_ids:
        id_list = list(remove_photo_ids)
        for table in ("favourites", "comments", "order_items", "exhibition_photos", "album_photos"):
            try:
                await db.execute(
                    text(f"DELETE FROM {table} WHERE photo_id IN :ids").bindparams(
                        bindparam("ids", expanding=True)
                    ),
                    {"ids": id_list},
                )
            except Exception as e:
                print(f"  prune {table}: {e}")
        # Drop cover references before deleting photos.
        await db.execute(
            text("UPDATE albums SET cover_photo_id = NULL WHERE cover_photo_id IN :ids").bindparams(
                bindparam("ids", expanding=True)
            ),
            {"ids": id_list},
        )
        await db.commit()

    for album in remove_albums:
        await db.delete(album)
    await db.commit()

    for photo in photos:
        if photo.id in remove_photo_ids:
            await db.delete(photo)
    await db.commit()

    if remove_albums:
        print(f"Pruned albums: {[a.title for a in remove_albums]}")
    if remove_photo_ids:
        print(f"Pruned photos: {len(remove_photo_ids)}")


async def main() -> None:
    from app.api.deps import init_db, async_session_factory
    await init_db()

    from app.repositories.photo_repo import PhotoRepository
    from app.repositories.user_repo import UserRepository

    storage = PCloudStorage()

    root = await storage._request("listfolder", params={"folderid": PCLOUD_ROOT_FOLDER})
    if root.get("result") != 0:
        print(f"ERROR listing root folder: {root.get('error')}")
        return

    covers = await fetch_manifest_cover(storage)

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

        photo_repo = PhotoRepository()
        created = 0
        skipped = 0

        allowed_album_slugs = set()
        allowed_file_ids = set()

        for subfolder in root.get("metadata", {}).get("contents", []):
            if subfolder.get("isfolder") != 1:
                continue
            folder_name = subfolder.get("name", "")
            album_slug = FOLDER_ALBUM_SLUG.get(folder_name.lower())
            if not album_slug:
                print(f"Skipping folder (no album mapping): {folder_name}")
                continue

            allowed_album_slugs.add(album_slug)
            album = await ensure_album(db, album_slug, folder_name)
            print(f"\nImporting folder: {folder_name} (album {album.slug})")

            listing = await storage._request(
                "listfolder", params={"folderid": subfolder["folderid"]}
            )
            files = [
                f
                for f in listing.get("metadata", {}).get("contents", [])
                if f.get("isfolder") == 0
                and f.get("name", "").lower().endswith(IMAGE_EXTS)
            ]
            files.sort(key=lambda f: f.get("name", ""))
            print(f"  {len(files)} image files")

            linked_photo_ids = set()
            cover_photo_id = None

            for file in files:
                name = file["name"]
                file_id = int(file["fileid"])
                allowed_file_ids.add(file_id)
                slug = f"{slugify(title_from_filename(name))}_{file_id}"

                existing = await photo_repo.get_by_slug(db, slug)
                if existing:
                    skipped += 1
                    linked_photo_ids.add(existing.id)
                    if cover_photo_id is None and name == covers.get(album_slug):
                        cover_photo_id = existing.id
                    print(f"  skip (exists): {name}")
                    continue

                fmt = name.rsplit(".", 1)[-1].lower()
                width = file.get("width") or 1600
                height = file.get("height") or 1200

                photo = await photo_repo.create(
                    db,
                    title=title_from_filename(name),
                    slug=slug,
                    description=None,
                    original_file_id=str(file_id),
                    thumbnail_file_id=None,
                    width=width,
                    height=height,
                    file_size=file.get("size", 0),
                    format=fmt,
                    camera_make=None,
                    camera_model=None,
                    lens=None,
                    focal_length=None,
                    aperture=None,
                    shutter_speed=None,
                    iso=None,
                    taken_at=None,
                    latitude=None,
                    longitude=None,
                    price=PRICE,
                    is_free=False,
                    is_featured=False,
                    is_published=True,
                    tags=[folder_name.lower()],
                    has_watermark=True,
                    uploaded_by=str(admin.id),
                )

                linked_photo_ids.add(photo.id)
                if cover_photo_id is None and name == covers.get(album_slug):
                    cover_photo_id = photo.id

                await db.execute(
                    album_photos.insert().values(album_id=album.id, photo_id=photo.id, sort_order=0)
                )
                album.photo_count += 1
                await db.commit()
                created += 1
                print(f"  OK: {name} ({photo.id})")

            # Link existing photos that are not yet linked to this album.
            for photo_id in linked_photo_ids:
                link = await db.execute(
                    select(album_photos.c.photo_id).where(
                        album_photos.c.album_id == album.id,
                        album_photos.c.photo_id == photo_id,
                    )
                )
                if link.scalar_one_or_none() is None:
                    await db.execute(
                        album_photos.insert().values(album_id=album.id, photo_id=photo_id, sort_order=0)
                    )
            await db.commit()

            if cover_photo_id is None and linked_photo_ids:
                cover_photo_id = sorted(linked_photo_ids)[0]
            if cover_photo_id:
                album.cover_photo_id = cover_photo_id
            album.photo_count = len(linked_photo_ids)
            await db.commit()
            print(f"  album {album.slug}: {len(linked_photo_ids)} photos, cover set")

        print(f"\nImport done: {created} created, {skipped} skipped")
        print("Pruning non-pCloud content...")
        await prune_non_pcloud(db, allowed_album_slugs, allowed_file_ids)
        print("Sync complete.")


if __name__ == "__main__":
    asyncio.run(main())
