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

    from app.models.album import Album
    async with async_session_factory() as db:
        try:
            count_res = await db.execute(select(func.count()).select_from(Album))
            count = count_res.scalar()
            if count == 0:
                albums = [
                    Album(title="Nature & Landscapes", slug="nature-landscapes", description="Breathtaking landscape photography from around the world.", is_published=True, is_featured=True, sort_order=1, photo_count=3),
                    Album(title="Urban Architecture", slug="urban-architecture", description="Stunning architectural marvels and cityscape photography.", is_published=True, is_featured=True, sort_order=2, photo_count=2),
                    Album(title="Portrait & Fine Art", slug="portrait-fine-art", description="Expressive portraits and dramatic lighting compositions.", is_published=True, is_featured=True, sort_order=3, photo_count=4),
                    Album(title="Wildlife in the Wild", slug="wildlife-in-the-wild", description="Rare moments of wildlife captured in natural habitats.", is_published=True, is_featured=False, sort_order=4, photo_count=1),
                    Album(title="Monochrome Stories", slug="monochrome-stories", description="Timeless black and white photography exploring light and shadow.", is_published=True, is_featured=False, sort_order=5, photo_count=2),
                ]
                db.add_all(albums)
                await db.commit()
        except Exception as e:
            print(f"Error seeding albums: {e}")

