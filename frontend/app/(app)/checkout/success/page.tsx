"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center"
      >
        <Card>
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
            {orderNumber && (
              <p className="text-sm text-muted-foreground mb-2">
                Order number: <span className="font-mono font-medium">{orderNumber}</span>
              </p>
            )}
            <p className="text-muted-foreground mb-6">
              Thank you for your purchase. You can now download your photographs from your profile.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/profile/orders">
                <Button className="w-full">
                  View Orders
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/gallery">
                <Button variant="outline" className="w-full">
                  Continue Browsing
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
