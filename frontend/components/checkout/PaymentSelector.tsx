"use client";

import { motion } from "motion/react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PAYMENT_PROVIDERS } from "@/lib/constants";

interface PaymentSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
}

export function PaymentSelector({ selectedProvider, onProviderChange }: PaymentSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedProvider}
            onValueChange={onProviderChange}
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
    </motion.div>
  );
}