"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto text-center"
      >
        <Card>
          <CardContent className="p-8">
            <XCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Cancelled</h1>
            <p className="text-muted-foreground mb-6">
              Your payment was not completed. Your cart items have been saved.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/cart">
                <Button className="w-full">
                  Return to Cart
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
