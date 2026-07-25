from typing import Optional, List
from pydantic import BaseModel


class AnalyticsOverview(BaseModel):
    total_photos: int
    total_albums: int
    total_exhibitions: int
    total_users: int
    total_orders: int
    total_revenue: float
    total_downloads: int
    total_views: int


class SalesData(BaseModel):
    date: str
    amount: float
    count: int


class PhotoStats(BaseModel):
    photo_id: str
    title: str
    views: int
    downloads: int
    favourites: int
    revenue: float


class DashboardAnalytics(BaseModel):
    overview: AnalyticsOverview
    sales_chart: List[SalesData]
    top_photos: List[PhotoStats]
    recent_orders: List[dict]
