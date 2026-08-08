"use client";

import { motion } from "motion/react";
import { ShieldCheck, Lock, Eye, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
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
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-lg">
            Last updated: August 2026
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold">
                <Eye className="h-5 w-5 text-primary" />
                <h2>1. Information We Collect</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We collect personal information that you voluntarily provide when registering, making a purchase, or contacting us. This includes your name, email address, payment billing details, and download history.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold">
                <Lock className="h-5 w-5 text-primary" />
                <h2>2. How We Use Your Information</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Your information is used strictly to fulfill your orders, process payments, deliver digital photo downloads, provide customer support, and send security notifications.
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>We never sell or rent your personal data to third parties.</li>
                <li>Payment details are encrypted and securely handled directly by authorized payment processors (Stripe, PayPal, Razorpay).</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h2>3. Cookies and Data Security</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                We use essential cookies to maintain user authentication sessions and shopping cart states. Robust technical and organizational measures are implemented to protect your personal information against unauthorized access or disclosure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center gap-3 text-xl font-bold">
                <Mail className="h-5 w-5 text-primary" />
                <h2>4. Your Rights & Contact Us</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to request access to, correction of, or deletion of your personal data at any time. For questions or privacy requests, please contact our privacy team at privacy@photoexhibit.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
