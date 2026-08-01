export interface User {
  id: string;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  role: "visitor" | "admin";
  is_verified: boolean;
  created_at: string;
}

export interface Photo {
  id: string;
  title: string;
  slug: string;
  description?: string;
  original_url?: string;
  thumbnail_url?: string;
  width: number;
  height: number;
  file_size: number;
  format: string;
  camera_make?: string;
  camera_model?: string;
  lens?: string;
  focal_length?: string;
  aperture?: string;
  shutter_speed?: string;
  iso?: number;
  taken_at?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  price?: number;
  is_free: boolean;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  download_count: number;
  tags: string[];
  category_id?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface Album {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_photo_id?: string;
  cover_photo_url?: string;
  is_published: boolean;
  is_featured: boolean;
  photo_count: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  sort_order: number;
}

export interface Exhibition {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  venue?: string;
  location?: string;
  start_date: string;
  end_date?: string;
  cover_image_url?: string;
  is_virtual: boolean;
  exhibition_url?: string;
  is_published: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  photo: Photo;
  added_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: "pending" | "paid" | "failed" | "refunded" | "completed";
  total_amount: number;
  currency: string;
  payment_provider: string;
  items: OrderItem[];
  created_at: string;
  paid_at?: string;
}

export interface OrderItem {
  id: string;
  photo_id: string;
  photo_title: string;
  price: number;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "download" | "system" | "comment";
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface AnalyticsOverview {
  total_photos: number;
  total_users: number;
  total_revenue: number;
  total_downloads: number;
  recent_orders: Order[];
  popular_photos: Photo[];
}
