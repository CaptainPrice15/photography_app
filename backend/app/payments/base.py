from abc import ABC, abstractmethod
from typing import Optional
from decimal import Decimal


class PaymentProvider(ABC):
    @abstractmethod
    async def create_checkout_session(
        self,
        order_id: str,
        items: list[dict],
        success_url: str,
        cancel_url: str,
    ) -> dict:
        pass

    @abstractmethod
    async def verify_webhook(self, payload: bytes, signature: str) -> dict:
        pass

    @abstractmethod
    async def get_payment_status(self, session_id: str) -> str:
        pass

    @abstractmethod
    async def refund(self, payment_id: str, amount: Decimal) -> bool:
        pass
