from typing import Optional
from decimal import Decimal

from app.payments.base import PaymentProvider


class MockProvider(PaymentProvider):
    """Sandbox payment provider — simulates checkout + payment success without external calls."""

    name = "mock"

    async def create_checkout_session(
        self,
        order_id: str,
        items: list[dict],
        success_url: str,
        cancel_url: str,
    ) -> dict:
        return {
            "session_id": f"mock_{order_id}",
            "session_url": success_url,
        }

    async def verify_webhook(self, payload: bytes, signature: str) -> dict:
        return {
            "status": "paid",
            "session_id": None,
            "order_id": None,
        }

    async def get_payment_status(self, session_id: str) -> str:
        return "paid"

    async def refund(self, payment_id: str, amount: Decimal) -> bool:
        return True
