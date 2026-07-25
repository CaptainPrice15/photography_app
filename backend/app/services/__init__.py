from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.services.category_service import CategoryService
from app.services.photo_service import PhotoService
from app.services.album_service import AlbumService
from app.services.exhibition_service import ExhibitionService
from app.services.favourite_service import FavouriteService
from app.services.cart_service import CartService
from app.services.order_service import OrderService
from app.services.download_service import DownloadService
from app.services.comment_service import CommentService
from app.services.notification_service import NotificationService
from app.services.analytics_service import AnalyticsService

auth_service = AuthService()
user_service = UserService()
category_service = CategoryService()
photo_service = PhotoService()
album_service = AlbumService()
exhibition_service = ExhibitionService()
favourite_service = FavouriteService()
cart_service = CartService()
order_service = OrderService()
download_service = DownloadService()
comment_service = CommentService()
notification_service = NotificationService()
analytics_service = AnalyticsService()
