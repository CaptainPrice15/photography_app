from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.photos import router as photos_router
from app.api.v1.albums import router as albums_router
from app.api.v1.categories import router as categories_router
from app.api.v1.exhibitions import router as exhibitions_router
from app.api.v1.favourites import router as favourites_router
from app.api.v1.cart import router as cart_router
from app.api.v1.orders import router as orders_router
from app.api.v1.downloads import router as downloads_router
from app.api.v1.comments import router as comments_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.uploads import router as uploads_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(photos_router)
api_router.include_router(albums_router)
api_router.include_router(categories_router)
api_router.include_router(exhibitions_router)
api_router.include_router(favourites_router)
api_router.include_router(cart_router)
api_router.include_router(orders_router)
api_router.include_router(downloads_router)
api_router.include_router(comments_router)
api_router.include_router(notifications_router)
api_router.include_router(uploads_router)
api_router.include_router(analytics_router)
api_router.include_router(admin_router)
