from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.photo import Photo
from app.models.album import Album
from app.models.exhibition import Exhibition
from app.models.user import User
from app.models.order import Order
from app.models.download import Download
from app.models.favourite import Favourite
from app.schemas.analytics import AnalyticsOverview, SalesData, PhotoStats, DashboardAnalytics


class AnalyticsService:
    async def get_overview(self, db: AsyncSession) -> AnalyticsOverview:
        total_photos = (await db.execute(select(func.count()).select_from(Photo))).scalar()
        total_albums = (await db.execute(select(func.count()).select_from(Album))).scalar()
        total_exhibitions = (await db.execute(select(func.count()).select_from(Exhibition))).scalar()
        total_users = (await db.execute(select(func.count()).select_from(User))).scalar()
        total_orders = (await db.execute(select(func.count()).select_from(Order))).scalar()
        total_revenue = (await db.execute(
            select(func.coalesce(func.sum(Order.total_amount), 0))
            .where(Order.status == "paid")
        )).scalar()
        total_downloads = (await db.execute(select(func.count()).select_from(Download))).scalar()
        total_views = (await db.execute(
            select(func.coalesce(func.sum(Photo.view_count), 0))
        )).scalar()

        return AnalyticsOverview(
            total_photos=total_photos,
            total_albums=total_albums,
            total_exhibitions=total_exhibitions,
            total_users=total_users,
            total_orders=total_orders,
            total_revenue=float(total_revenue),
            total_downloads=total_downloads,
            total_views=total_views,
        )

    async def get_dashboard(self, db: AsyncSession) -> DashboardAnalytics:
        overview = await self.get_overview(db)

        sales_chart = []
        top_photos = []
        recent_orders = []

        return DashboardAnalytics(
            overview=overview,
            sales_chart=sales_chart,
            top_photos=top_photos,
            recent_orders=recent_orders,
        )
