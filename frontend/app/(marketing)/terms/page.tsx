"use client";

import { motion } from "motion/react";
import { FileText, Shield, Scale, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Scale className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: August 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold">
                <FileText className="h-5 w-5 text-primary" />
                <h2>1. Acceptance of Terms</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using PhotoExhibit, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold">
                <Shield className="h-5 w-5 text-primary" />
                <h2>2. Intellectual Property & License</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                All photographs, images, and content displayed on PhotoExhibit are the exclusive property of the photographer and protected by international copyright laws.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Personal licenses grant rights for non-commercial, individual display.</li>
                <li>Commercial licenses allow specific commercial usage as specified in your purchase agreement.</li>
                <li>Unauthorised reproduction, distribution, or re-selling of photos is strictly prohibited.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold">
                <FileText className="h-5 w-5 text-primary" />
                <h2>3. Purchases and Digital Downloads</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                All sales of digital downloads and print prints are processed securely via our supported payment providers (Stripe, PayPal, Razorpay). Due to the digital nature of downloaded media, all sales are final unless otherwise required by law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h2>4. Limitation of Liability & Contact</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                PhotoExhibit shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services. If you have any questions regarding these Terms, please contact us at support@photoexhibit.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
