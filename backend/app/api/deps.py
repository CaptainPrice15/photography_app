from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy import select, func

from app.config import settings
from app.models.base import Base

def _create_engine():
    url = settings.DATABASE_URL
    if "sqlite" in url:
        return create_async_engine(url, echo=settings.DEBUG, connect_args={"check_same_thread": False})
    return create_async_engine(url, echo=settings.DEBUG, pool_pre_ping=True)

engine = _create_engine()

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    global engine, async_session_factory
    if "sqlite" not in str(engine.url):
        try:
            async with engine.connect() as conn:
                await conn.execute(select(1))
        except Exception as e:
            print(f"Database connection failed ({e}), falling back to SQLite photoapp.db")
            fallback_url = "sqlite+aiosqlite:///./photoapp.db"
            engine = create_async_engine(fallback_url, echo=settings.DEBUG, connect_args={"check_same_thread": False})
            async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    import app.models  # Ensure all models are registered
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    from app.models.album import Album, album_photos
    from app.models.photo import Photo
    from app.models.user import User
    from app.core.security import hash_password

    async with async_session_factory() as db:
        try:
            # Seed Admin User if missing
            u_res = await db.execute(select(User).where(User.role == "admin"))
            admin = u_res.scalar_one_or_none()
            if not admin:
                admin = User(
                    email="photosback15@gmail.com",
                    username="photosback15",
                    full_name="Gourab Das",
                    hashed_password=hash_password("gourabdas123"),
                    role="admin",
                    is_verified=True,
                    is_active=True,
                )
                db.add(admin)
                await db.commit()
                await db.refresh(admin)

            # Seed Albums if missing
            count_res = await db.execute(select(func.count()).select_from(Album))
            if count_res.scalar() == 0:
                albums = [
                    Album(title="Nature & Landscapes", slug="nature-landscapes", description="Breathtaking landscape photography from around the world.", is_published=True, is_featured=True, sort_order=1, photo_count=0),
                    Album(title="Urban Architecture", slug="urban-architecture", description="Stunning architectural marvels and cityscape photography.", is_published=True, is_featured=True, sort_order=2, photo_count=0),
                    Album(title="Portrait & Fine Art", slug="portrait-fine-art", description="Expressive portraits and dramatic lighting compositions.", is_published=True, is_featured=True, sort_order=3, photo_count=0),
                    Album(title="Wildlife in the Wild", slug="wildlife-in-the-wild", description="Rare moments of wildlife captured in natural habitats.", is_published=True, is_featured=False, sort_order=4, photo_count=0),
                    Album(title="Monochrome Stories", slug="monochrome-stories", description="Timeless black and white photography exploring light and shadow.", is_published=True, is_featured=False, sort_order=5, photo_count=0),
                ]
                db.add_all(albums)
                await db.commit()

            # Seed Photos if missing
            p_res = await db.execute(select(func.count()).select_from(Photo))
            if p_res.scalar() == 0:
                sample_photos = [
                    Photo(title="Alpine Sunset Peak", slug="alpine-sunset-peak", description="Golden hour illumination over snow-capped mountain range.", original_file_id="sample_1", width=1920, height=1080, file_size=2048000, format="jpg", price=35.0, is_published=True, is_featured=True, uploaded_by=admin.id),
                    Photo(title="Emerald Forest Valley", slug="emerald-forest-valley", description="Lush green canopy mist in deep alpine valley.", original_file_id="sample_2", width=1920, height=1080, file_size=2150000, format="jpg", price=29.0, is_published=True, is_featured=True, uploaded_by=admin.id),
                    Photo(title="Metropolitan Glass Spire", slug="metropolitan-glass-spire", description="Sleek skyscraper reflecting twilight skyline.", original_file_id="sample_3", width=1920, height=1080, file_size=1980000, format="jpg", price=45.0, is_published=True, is_featured=True, uploaded_by=admin.id),
                    Photo(title="Neon City Rain", slug="neon-city-rain", description="Vibrant street reflections in nighttime rain.", original_file_id="sample_4", width=1920, height=1080, file_size=2300000, format="jpg", price=40.0, is_published=True, is_featured=True, uploaded_by=admin.id),
                    Photo(title="Serene Studio Portrait", slug="serene-studio-portrait", description="Dramatic chiaroscuro studio lighting portrait.", original_file_id="sample_5", width=1920, height=1080, file_size=1850000, format="jpg", price=50.0, is_published=True, is_featured=True, uploaded_by=admin.id),
                    Photo(title="Snow Leopard Horizon", slug="snow-leopard-horizon", description="Majestic snow leopard surveying mountain terrain.", original_file_id="sample_6", width=1920, height=1080, file_size=2500000, format="jpg", price=60.0, is_published=True, is_featured=True, uploaded_by=admin.id),
                    Photo(title="Monochrome Shadows", slug="monochrome-shadows", description="High contrast black and white architectural study.", original_file_id="sample_7", width=1920, height=1080, file_size=1750000, format="jpg", price=30.0, is_published=True, is_featured=True, uploaded_by=admin.id),
                ]
                db.add_all(sample_photos)
                await db.commit()
                for p in sample_photos:
                    await db.refresh(p)

                # Link photos to albums and set cover_photo_id
                a_res = await db.execute(select(Album))
                albums = a_res.scalars().all()
                for idx, album in enumerate(albums):
                    assigned = sample_photos[idx % len(sample_photos) : (idx % len(sample_photos)) + 2] or [sample_photos[0]]
                    for p in assigned:
                        await db.execute(album_photos.insert().values(album_id=album.id, photo_id=p.id, sort_order=0))
                    album.cover_photo_id = assigned[0].id
                    album.photo_count = len(assigned)
                await db.commit()
        except Exception as e:
            print(f"Error seeding database: {e}")

