export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "PhotoExhibit";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/albums", label: "Albums" },
  { href: "/exhibitions", label: "Exhibitions" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/photos/upload", label: "Upload" },
  { href: "/admin/albums", label: "Albums" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/exhibitions", label: "Exhibitions" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/downloads", label: "Downloads" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export const USER_LINKS = [
  { href: "/profile", label: "Profile" },
  { href: "/favourites", label: "Favourites" },
  { href: "/collections", label: "Collections" },
  { href: "/cart", label: "Cart" },
  { href: "/profile/orders", label: "Orders" },
] as const;

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
] as const;

export const PAYMENT_PROVIDERS = [
  { value: "stripe", label: "Stripe" },
  { value: "paypal", label: "PayPal" },
  { value: "razorpay", label: "Razorpay" },
] as const;
