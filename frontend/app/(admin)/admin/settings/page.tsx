"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Save, Camera, CreditCard, Mail, Shield, Globe, Bell, Palette, Database, Key, Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

const SETTINGS_TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "email", label: "Email", icon: Mail },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "storage", label: "Storage", icon: Database },
  { id: "api", label: "API", icon: Key },
] as const;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Add settings API endpoint to backend
      // await api.put("/admin/settings", settings);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your site configuration</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:grid-cols-8 h-auto">
          {SETTINGS_TABS.map((tab) => (
            <TabsTrigger value={tab.id} key={tab.id} className="gap-2 py-3">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
              <CardDescription>Basic site settings and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" defaultValue="PhotoExhibit" />
                </div>
                <div>
                  <Label htmlFor="site-url">Site URL</Label>
                  <Input id="site-url" defaultValue="https://photoexhibit.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea id="site-description" rows={3} defaultValue="Professional photography portfolio and marketplace" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue="contact@photoexhibit.com" />
                </div>
                <div>
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input id="support-email" type="email" defaultValue="support@photoexhibit.com" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO & Social</CardTitle>
              <CardDescription>Search engine and social media settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="og-title">Open Graph Title</Label>
                <Input id="og-title" defaultValue="PhotoExhibit - Professional Photography" />
              </div>
              <div>
                <Label htmlFor="og-description">Open Graph Description</Label>
                <Textarea id="og-description" rows={2} defaultValue="Discover stunning photography from around the world" />
              </div>
              <div>
                <Label htmlFor="og-image">Open Graph Image URL</Label>
                <Input id="og-image" defaultValue="/og-image.jpg" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitter-handle">Twitter Handle</Label>
                  <Input id="twitter-handle" defaultValue="@photoexhibit" />
                </div>
                <div>
                  <Label htmlFor="instagram-handle">Instagram Handle</Label>
                  <Input id="instagram-handle" defaultValue="@photoexhibit" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Branding</CardTitle>
              <CardDescription>Customize the look and feel of your site</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <Input id="primary-color" type="color" defaultValue="#3b82f6" />
                </div>
                <div>
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <Input id="accent-color" type="color" defaultValue="#8b5cf6" />
                </div>
              </div>
              <div>
                <Label htmlFor="logo-url">Logo URL</Label>
                <Input id="logo-url" defaultValue="/logo.svg" />
              </div>
              <div>
                <Label htmlFor="favicon-url">Favicon URL</Label>
                <Input id="favicon-url" defaultValue="/favicon.ico" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Dark Mode Default</Label>
                  <p className="text-sm text-muted-foreground">Set dark mode as default for new visitors</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Settings</CardTitle>
              <CardDescription>Configure gallery display options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="photos-per-page">Photos Per Page</Label>
                  <Select defaultValue="24">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                      <SelectItem value="48">48</SelectItem>
                      <SelectItem value="60">60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="default-sort">Default Sort</Label>
                  <Select defaultValue="newest">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="enable-masonry">Enable Masonry Layout</Label>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-muted-foreground">Use masonry grid for gallery</p>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Providers</CardTitle>
              <CardDescription>Configure payment gateway settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-muted-foreground">Credit cards, Apple Pay, Google Pay</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="stripe-publishable">Publishable Key</Label>
                    <Input id="stripe-publishable" placeholder="pk_live_..." />
                  </div>
                  <div>
                    <Label htmlFor="stripe-secret">Secret Key</Label>
                    <Input id="stripe-secret" type="password" placeholder="sk_live_..." />
                  </div>
                </div>
                <div>
                  <Label htmlFor="stripe-webhook">Webhook Secret</Label>
                  <Input id="stripe-webhook" placeholder="whsec_..." />
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">PayPal payments</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="paypal-client">Client ID</Label>
                    <Input id="paypal-client" placeholder="Your PayPal Client ID" />
                  </div>
                  <div>
                    <Label htmlFor="paypal-secret">Secret</Label>
                    <Input id="paypal-secret" type="password" placeholder="Your PayPal Secret" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="paypal-mode">Mode</Label>
                  <Select defaultValue="sandbox">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="font-medium">Razorpay</p>
                      <p className="text-sm text-muted-foreground">Indian payment gateway</p>
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="razorpay-key">Key ID</Label>
                    <Input id="razorpay-key" placeholder="rzp_live_..." />
                  </div>
                  <div>
                    <Label htmlFor="razorpay-secret">Key Secret</Label>
                    <Input id="razorpay-secret" type="password" placeholder="Your Razorpay Secret" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Currency & Tax</CardTitle>
              <CardDescription>Payment currency and tax settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="default-currency">Default Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" step="0.01" defaultValue="0" />
                </div>
                <div>
                  <Label htmlFor="tax-inclusive">Tax Included in Price</Label>
                  <div className="flex items-center justify-between mt-2">
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email */}
        <TabsContent value="email" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>SMTP settings for transactional emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input id="smtp-host" placeholder="smtp.example.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input id="smtp-port" type="number" defaultValue="587" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input id="smtp-user" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input id="smtp-password" type="password" placeholder="••••••••" />
                </div>
              </div>
              <div>
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" type="email" placeholder="noreply@photoexhibit.com" />
              </div>
              <div>
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" placeholder="PhotoExhibit" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Use TLS</Label>
                  <p className="text-sm text-muted-foreground">Enable TLS encryption</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Customize email templates (requires backend configuration)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">Welcome Email</Button>
                <Button variant="outline" className="w-full justify-start">Order Confirmation</Button>
                <Button variant="outline" className="w-full justify-start">Download Link</Button>
                <Button variant="outline" className="w-full justify-start">Password Reset</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>Security settings for user authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Users must verify email before login</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Two-Factor Auth</Label>
                    <p className="text-sm text-muted-foreground">Allow users to enable 2FA</p>
                  </div>
                  <Switch />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="access-token-expiry">Access Token Expiry (minutes)</Label>
                  <Input id="access-token-expiry" type="number" defaultValue="15" />
                </div>
                <div>
                  <Label htmlFor="refresh-token-expiry">Refresh Token Expiry (days)</Label>
                  <Input id="refresh-token-expiry" type="number" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="max-login-attempts">Max Login Attempts</Label>
                  <Input id="max-login-attempts" type="number" defaultValue="5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CORS & Security Headers</CardTitle>
              <CardDescription>Cross-origin and security header configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="allowed-origins">Allowed Origins</Label>
                <Textarea
                  id="allowed-origins"
                  rows={3}
                  placeholder="https://photoexhibit.com&#10;https://www.photoexhibit.com"
                  className="font-mono text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable CSP</Label>
                    <p className="text-sm text-muted-foreground">Content Security Policy</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable HSTS</Label>
                    <p className="text-sm text-muted-foreground">HTTP Strict Transport Security</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { title: "New Order", desc: "Notify admin when a new order is placed" },
                  { title: "Payment Received", desc: "Notify admin when payment is confirmed" },
                  { title: "New User Registration", desc: "Notify admin when a user registers" },
                  { title: "Download Generated", desc: "Notify user when download link is ready" },
                  { title: "Low Stock Alert", desc: "Notify when digital inventory is low" },
                ].map((notif) => (
                  <div key={notif.title} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{notif.title}</p>
                      <p className="text-sm text-muted-foreground">{notif.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook Notifications</CardTitle>
              <CardDescription>Send events to external services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" placeholder="https://your-service.com/webhook" />
                </div>
                <div>
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <Input id="webhook-secret" type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Webhooks</Label>
                  <p className="text-sm text-muted-foreground">Send events to configured webhook URL</p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Events to send:</p>
                <div className="grid grid-cols-2 gap-2">
                  {["order.created", "order.paid", "order.refunded", "user.registered", "download.created", "photo.uploaded"].map((event) => (
                    <label key={event} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" defaultChecked className="rounded border-input" />
                      {event}
                    </label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Storage */}
        <TabsContent value="storage" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>pCloud Storage</CardTitle>
              <CardDescription>Configure pCloud for image storage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pcloud-client-id">Client ID</Label>
                  <Input id="pcloud-client-id" placeholder="Your pCloud App Client ID" />
                </div>
                <div>
                  <Label htmlFor="pcloud-client-secret">Client Secret</Label>
                  <Input id="pcloud-client-secret" type="password" placeholder="Your pCloud App Client Secret" />
                </div>
              </div>
              <div>
                <Label htmlFor="pcloud-folder">Root Folder ID</Label>
                <Input id="pcloud-folder" placeholder="Folder ID for uploads (optional)" />
              </div>
              <div>
                <Label htmlFor="pcloud-access-token">Access Token</Label>
                <Input id="pcloud-access-token" type="password" placeholder="OAuth2 Access Token" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Use pCloud for Thumbnails</Label>
                  <p className="text-sm text-muted-foreground">Generate and store thumbnails on pCloud</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-delete Local Files</Label>
                  <p className="text-sm text-muted-foreground">Delete local copies after successful pCloud upload</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image Processing</CardTitle>
              <CardDescription>Configure image optimization settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="thumbnail-width">Thumbnail Width</Label>
                  <Input id="thumbnail-width" type="number" defaultValue="400" />
                </div>
                <div>
                  <Label htmlFor="thumbnail-height">Thumbnail Height</Label>
                  <Input id="thumbnail-height" type="number" defaultValue="300" />
                </div>
                <div>
                  <Label htmlFor="thumbnail-quality">Thumbnail Quality</Label>
                  <Input id="thumbnail-quality" type="number" min="1" max="100" defaultValue="80" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="watermark-enabled">Watermark</Label>
                  <div className="flex items-center justify-between mt-2">
                    <Switch defaultChecked />
                  </div>
                </div>
                <div>
                  <Label htmlFor="watermark-opacity">Watermark Opacity (%)</Label>
                  <Input id="watermark-opacity" type="number" min="0" max="100" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="watermark-position">Watermark Position</Label>
                  <Select defaultValue="bottom-right">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-upload-size">Max Upload Size (MB)</Label>
                  <Input id="max-upload-size" type="number" defaultValue="50" />
                </div>
                <div>
                  <Label htmlFor="allowed-formats">Allowed Formats</Label>
                  <Input id="allowed-formats" defaultValue="jpg, jpeg, png, webp, tiff, raw" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage API access for integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Admin API Key</p>
                    <p className="text-sm text-muted-foreground">Full access to all API endpoints</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1 bg-muted rounded text-sm font-mono">pk_live_abc123...</code>
                    <Button variant="outline" size="sm">Regenerate</Button>
                    <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Read-only API Key</p>
                    <p className="text-sm text-muted-foreground">Read-only access for frontend</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1 bg-muted rounded text-sm font-mono">pk_read_xyz789...</code>
                    <Button variant="outline" size="sm">Regenerate</Button>
                    <Button variant="ghost" size="icon"><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>Configure API rate limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rate-limit-requests">Requests per Window</Label>
                  <Input id="rate-limit-requests" type="number" defaultValue="100" />
                </div>
                <div>
                  <Label htmlFor="rate-limit-window">Window (seconds)</Label>
                  <Input id="rate-limit-window" type="number" defaultValue="60" />
                </div>
                <div>
                  <Label htmlFor="rate-limit-burst">Burst Allowance</Label>
                  <Input id="rate-limit-burst" type="number" defaultValue="20" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Rate Limiting</Label>
                  <p className="text-sm text-muted-foreground">Apply rate limits to API endpoints</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}