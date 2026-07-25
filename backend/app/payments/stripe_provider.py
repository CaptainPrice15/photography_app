import stripe
from decimal import Decimal
from app.payments.base import PaymentProvider
from app.config import settings


class StripeProvider(PaymentProvider):
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY

    async def create_checkout_session(
        self,
        order_id: str,
        items: list[dict],
        success_url: str,
        cancel_url: str,
    ) -> dict:
        line_items = [
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {"name": item["photo_title"]},
                    "unit_amount": int(item["price"] * 100),
                },
                "quantity": 1,
            }
            for item in items
        ]

        session = stripe.checkout.Session.create(
            line_items=line_items,
            mode="payment",
            success_url=f"{success_url}?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=cancel_url,
            metadata={"order_id": order_id},
        )

        return {
            "session_id": session.id,
            "session_url": session.url,
        }

    async def verify_webhook(self, payload: bytes, signature: str) -> dict:
        event = stripe.Webhook.construct_event(
            payload, signature, settings.STRIPE_WEBHOOK_SECRET
        )
        return {
            "type": event["type"],
            "data": event["data"]["object"],
        }

    async def get_payment_status(self, session_id: str) -> str:
        session = stripe.checkout.Session.retrieve(session_id)
        return session.payment_status

    async def refund(self, payment_id: str, amount: Decimal) -> bool:
        try:
            stripe.Refund.create(
                payment_intent=payment_id,
                amount=int(amount * 100),
            )
            return True
        except stripe.error.StripeError:
            return False
