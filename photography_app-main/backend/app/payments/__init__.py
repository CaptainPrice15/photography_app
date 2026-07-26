from app.payments.base import PaymentProvider
from app.payments.stripe_provider import StripeProvider
from app.payments.paypal_provider import PayPalProvider
from app.payments.razorpay_provider import RazorpayProvider

providers = {
    "stripe": StripeProvider(),
    "paypal": PayPalProvider(),
    "razorpay": RazorpayProvider(),
}


def get_payment_provider(provider_name: str) -> PaymentProvider:
    provider = providers.get(provider_name)
    if not provider:
        raise ValueError(f"Unknown payment provider: {provider_name}")
    return provider
