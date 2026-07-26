import razorpay
import json
from decimal import Decimal
from app.payments.base import PaymentProvider
from app.config import settings


class RazorpayProvider(PaymentProvider):
    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

    async def create_checkout_session(
        self,
        order_id: str,
        items: list[dict],
        success_url: str,
        cancel_url: str,
    ) -> dict:
        total_amount = sum(item["price"] for item in items)

        order = self.client.order.create(
            {
                "amount": int(total_amount * 100),
                "currency": "USD",
                "receipt": order_id,
            }
        )

        return {
            "session_id": order.get("id"),
            "session_url": None,
            "order_data": order,
        }

    async def verify_webhook(self, payload: bytes, signature: str) -> dict:
        data = json.loads(payload)

        self.client.utility.verify_webhook_signature(
            payload.decode("utf-8"),
            signature,
            settings.RAZORPAY_WEBHOOK_SECRET,
        )

        return {
            "type": data.get("event", ""),
            "data": data.get("payload", {}),
        }

    async def get_payment_status(self, session_id: str) -> str:
        order = self.client.order.fetch(session_id)
        return order.get("status", "unknown")

    async def refund(self, payment_id: str, amount: Decimal) -> bool:
        try:
            self.client.payment.refund(
                payment_id,
                {
                    "amount": int(amount * 100),
                },
            )
            return True
        except Exception:
            return False
