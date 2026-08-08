from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://photoapp:password@localhost:5432/photoapp"

    # JWT
    JWT_SECRET: str = "your-super-secret-key-min-32-characters-long"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # pCloud
    PCLOUD_EMAIL: str = ""
    PCLOUD_PASSWORD: str = ""
    PCLOUD_ACCESS_TOKEN: str = ""
    PCLOUD_FOLDER_ID: int = 0

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # PayPal
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    PAYPAL_MODE: str = "sandbox"
    PAYPAL_WEBHOOK_ID: str = ""

    # Razorpay
    RAZORPAY_KEY_ID: str = ""
    RAZORPAY_KEY_SECRET: str = ""
    RAZORPAY_WEBHOOK_SECRET: str = ""

    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"

    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "noreply@yourdomain.com"

    # CORS
    CORS_ORIGINS: List[str] = []

    # App
    APP_NAME: str = "PhotoExhibit"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    model_config = {
        "env_file": ".env",
        "case_sensitive": True,
    }


settings = Settings()
