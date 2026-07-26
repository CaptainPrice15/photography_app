import httpx
from decimal import Decimal
from app.payments.base import PaymentProvider
from app.config import settings


class PayPalProvider(PaymentProvider):
    BASE_URL = "https://api-m.sandbox.paypal.com" if settings.PAYPAL_MODE == "sandbox" else "https://api-m.paypal.com"

    async def _get_access_token(self) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/v1/oauth2/token",
                auth=(settings.PAYPAL_CLIENT_ID, settings.PAYPAL_CLIENT_SECRET),
                data={"grant_type": "client_credentials"},
            )
            data = response.json()
            return data["access_token"]

    async def create_checkout_session(
        self,
        order_id: str,
        items: list[dict],
        success_url: str,
        cancel_url: str,
    ) -> dict:
        access_token = await self._get_access_token()

        total_amount = sum(item["price"] for item in items)

        purchase_units = [
            {
                "reference_id": order_id,
                "amount": {
                    "currency_code": "USD",
                    "value": f"{total_amount:.2f}",
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": f"{total_amount:.2f}",
                        }
                    },
                },
                "items": [
                    {
                        "name": item["photo_title"],
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": f"{item['price']:.2f}",
                        },
                        "quantity": "1",
                    }
                    for item in items
                ],
            }
        ]

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/v2/checkout/orders",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json",
                },
                json={
                    "intent": "CAPTURE",
                    "purchase_units": purchase_units,
                    "application_context": {
                        "return_url": success_url,
                        "cancel_url": cancel_url,
                    },
                },
            )
            data = response.json()

        approval_url = None
        session_id = data.get("id")
        for link in data.get("links", []):
            if link.get("rel") == "approve":
                approval_url = link.get("href")
                break

        return {
            "session_id": session_id,
            "session_url": approval_url,
        }

    async def verify_webhook(self, payload: bytes, signature: str) -> dict:
        import json
        data = json.loads(payload)
        return {
            "type": data.get("event_type", ""),
            "data": data.get("resource", {}),
        }

    async def get_payment_status(self, session_id: str) -> str:
        access_token = await self._get_access_token()
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.BASE_URL}/v2/checkout/orders/{session_id}",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            data = response.json()
            return data.get("status", "UNKNOWN")

    async def refund(self, payment_id: str, amount: Decimal) -> bool:
        access_token = await self._get_access_token()
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/v2/payments/capture/{payment_id}/refund",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json",
                },
                json={
                    "amount": {
                        "currency_code": "USD",
                        "value": f"{amount:.2f}",
                    }
                },
            )
            return response.status_code == 201
