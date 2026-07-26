from app.repositories.base import BaseRepository
from app.repositories.user_repo import UserRepository
from app.repositories.category_repo import CategoryRepository
from app.repositories.photo_repo import PhotoRepository
from app.repositories.album_repo import AlbumRepository
from app.repositories.exhibition_repo import ExhibitionRepository
from app.repositories.favourite_repo import FavouriteRepository
from app.repositories.cart_repo import CartRepository
from app.repositories.order_repo import OrderRepository
from app.repositories.download_repo import DownloadRepository
from app.repositories.comment_repo import CommentRepository
from app.repositories.notification_repo import NotificationRepository

user_repo = UserRepository()
category_repo = CategoryRepository()
photo_repo = PhotoRepository()
album_repo = AlbumRepository()
exhibition_repo = ExhibitionRepository()
favourite_repo = FavouriteRepository()
cart_repo = CartRepository()
order_repo = OrderRepository()
download_repo = DownloadRepository()
comment_repo = CommentRepository()
notification_repo = NotificationRepository()
