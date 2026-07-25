"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { CreditCard, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { PAYMENT_PROVIDERS } from "@/lib/constants";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, itemCount, clearCart } = useCart();
  const [paymentProvider, setPaymentProvider] = useState("stripe");
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Simulate checkout process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Payment successful!");
      clearCart();
      router.push("/checkout/success");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Method */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentProvider}
                  onValueChange={setPaymentProvider}
                  className="space-y-4"
                >
                  {PAYMENT_PROVIDERS.map((provider) => (
                    <div
                      key={provider.value}
                      className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50"
                    >
                      <RadioGroupItem value={provider.value} id={provider.value} />
                      <Label htmlFor={provider.value} className="flex-1 cursor-pointer">
                        {provider.label}
                      </Label>
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate flex-1 mr-2">{item.photo.title}</span>
                      <span>{item.photo.is_free ? "Free" : formatCurrency(item.photo.price || 0)}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Complete Purchase
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By completing this purchase, you agree to our Terms of Service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
