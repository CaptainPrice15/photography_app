# Photo Exhibition Web Application — Complete Build Plan

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                         │
│               Next.js 15+ App Router                         │
│     React 19 · TypeScript · Tailwind CSS · Shadcn UI        │
│              Framer Motion · next-themes                     │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐  ┌──────────────┐ │
│  │ Public  │  │ Protected │  │  Admin  │  │  API Routes  │ │
│  │ Pages   │  │  Pages    │  │Dashboard│  │  (webhooks)  │ │
│  └────┬────┘  └─────┬────┘  └────┬────┘  └──────┬───────┘ │
│       └──────────────┴────────────┴───────────────┘         │
│                          │                                    │
│                    REST API calls                             │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────┼──────────────────────────────────┐
│                    RENDER (Backend)                          │
│               Python 3.11+ FastAPI                            │
│          SQLAlchemy 2.0 · Alembic · Pydantic v2              │
│                                                              │
│  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Auth     │ │ Business  │ │ Payment  │ │   Storage    │ │
│  │ JWT+RBAC │ │ Logic     │ │ Stripe/  │ │   pCloud     │ │
│  │          │ │ Services  │ │ PayPal/  │ │   API        │ │
│  │          │ │           │ │ Razorpay │ │              │ │
│  └──────────┘ └───────────┘ └──────────┘ └──────────────┘ │
│         │              │              │            │         │
│         └──────────────┴──────────────┴────────────┘         │
│                          │                                    │
│                    PostgreSQL                                 │
│               (Render Managed DB)                            │
└──────────────────────────────────────────────────────────────┘
```

**Key Decisions:**
- **Single photographer** — simplified user model (Admin + Visitor roles only)
- **pCloud** stores all images (originals + thumbnails), DB stores metadata + pCloud file IDs
- **3 payment providers** from day one via abstract `PaymentProvider` interface
- **JWT with refresh tokens** for stateless auth
- **Clean Architecture**: Router → Schema → Service → Repository → Model

---

## 2. Complete Directory Structure

### Backend (`/backend`)

```
backend/
├── alembic/                          # Database migrations
│   ├── versions/                     # Migration files
│   └── env.py
├── alembic.ini
├── app/
│   ├── __init__.py
│   ├── main.py                       # FastAPI app factory, middleware, CORS
│   ├── config.py                     # Pydantic Settings (env vars)
│   │
│   ├── api/                          # Route handlers (thin controllers)
│   │   ├── __init__.py
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── router.py             # Main v1 router aggregation
│   │   │   ├── auth.py               # POST login, register, refresh, logout
│   │   │   ├── users.py              # GET/PUT profile, avatar
│   │   │   ├── photos.py             # CRUD photos, search, filters
│   │   │   ├── albums.py             # CRUD albums, assign photos
│   │   │   ├── categories.py         # CRUD categories
│   │   │   ├── exhibitions.py        # CRUD exhibitions
│   │   │   ├── favourites.py         # Add/remove favourites
│   │   │   ├── cart.py               # Cart operations
│   │   │   ├── orders.py             # Order management
│   │   │   ├── downloads.py          # Secure download links
│   │   │   ├── comments.py           # Photo comments
│   │   │   ├── notifications.py      # User notifications
│   │   │   ├── uploads.py            # Multi-image upload (admin)
│   │   │   ├── analytics.py          # Dashboard analytics
│   │   │   └── admin.py              # Admin-specific endpoints
│   │   └── deps.py                   # Shared dependencies (get_db, get_current_user)
│   │
│   ├── core/                         # Core configuration
│   │   ├── __init__.py
│   │   ├── security.py               # JWT creation/verification, password hashing
│   │   ├── permissions.py            # Role-based access (IsAdmin, IsAuthenticated)
│   │   ├── rate_limit.py             # Rate limiting middleware
│   │   └── cache.py                  # Redis/in-memory caching
│   │
│   ├── models/                       # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── photo.py
│   │   ├── album.py
│   │   ├── category.py
│   │   ├── exhibition.py
│   │   ├── favourite.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   ├── order_item.py
│   │   ├── download.py
│   │   ├── comment.py
│   │   ├── notification.py
│   │   └── base.py                   # Base model with id, created_at, updated_at
│   │
│   ├── schemas/                      # Pydantic v2 request/response schemas
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── photo.py
│   │   ├── album.py
│   │   ├── category.py
│   │   ├── exhibition.py
│   │   ├── favourite.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   ├── download.py
│   │   ├── comment.py
│   │   ├── notification.py
│   │   ├── upload.py
│   │   ├── analytics.py
│   │   ├── common.py                 # Pagination, message responses
│   │   └── token.py
│   │
│   ├── services/                     # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── photo_service.py
│   │   ├── album_service.py
│   │   ├── category_service.py
│   │   ├── exhibition_service.py
│   │   ├── favourite_service.py
│   │   ├── cart_service.py
│   │   ├── order_service.py
│   │   ├── download_service.py
│   │   ├── comment_service.py
│   │   ├── notification_service.py
│   │   ├── upload_service.py
│   │   ├── analytics_service.py
│   │   └── image_processor.py        # EXIF extraction, thumbnail gen, optimization
│   │
│   ├── repositories/                 # Data access layer
│   │   ├── __init__.py
│   │   ├── base.py                   # Generic CRUD repository
│   │   ├── user_repo.py
│   │   ├── photo_repo.py
│   │   ├── album_repo.py
│   │   ├── category_repo.py
│   │   ├── exhibition_repo.py
│   │   ├── favourite_repo.py
│   │   ├── cart_repo.py
│   │   ├── order_repo.py
│   │   ├── download_repo.py
│   │   ├── comment_repo.py
│   │   └── notification_repo.py
│   │
│   ├── storage/                      # External storage integrations
│   │   ├── __init__.py
│   │   ├── pcloud.py                 # pCloud API client wrapper
│   │   └── storage_interface.py      # Abstract storage interface
│   │
│   ├── payments/                     # Payment provider integrations
│   │   ├── __init__.py
│   │   ├── base.py                   # Abstract PaymentProvider interface
│   │   ├── stripe_provider.py
│   │   ├── paypal_provider.py
│   │   └── razorpay_provider.py
│   │
│   ├── middleware/                    # FastAPI middleware
│   │   ├── __init__.py
│   │   ├── logging_middleware.py      # Structured request logging
│   │   └── error_handler.py          # Global exception handler
│   │
│   └── utils/                        # Utility functions
│       ├── __init__.py
│       ├── exif.py                   # EXIF data extraction (Pillow/exifread)
│       ├── image.py                  # Image optimization (Pillow)
│       ├── validators.py             # Custom validators
│       └── email.py                  # Email sending (verification, password reset)
│
├── tests/                            # Test suite
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_photos.py
│   ├── test_albums.py
│   ├── test_cart.py
│   ├── test_orders.py
│   └── test_downloads.py
│
├── requirements.txt
├── pyproject.toml
├── Dockerfile
├── .env.example
└── README.md
```

### Frontend (`/frontend`)

```
frontend/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout (providers, fonts, metadata)
│   ├── page.tsx                      # Homepage
│   ├── loading.tsx                   # Root loading skeleton
│   ├── error.tsx                     # Root error boundary
│   ├── not-found.tsx                 # 404 page
│   │
│   ├── (marketing)/                  # Public pages group
│   │   ├── layout.tsx                # Marketing layout (navbar + footer)
│   │   ├── gallery/
│   │   │   ├── page.tsx              # Gallery grid with filters
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Photo detail page
│   │   │       └── loading.tsx
│   │   ├── albums/
│   │   │   ├── page.tsx              # Albums listing
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Album detail
│   │   │       └── loading.tsx
│   │   ├── exhibitions/
│   │   │   ├── page.tsx              # Exhibitions listing
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Exhibition detail
│   │   ├── about/
│   │   │   └── page.tsx              # About the photographer
│   │   └── contact/
│   │       └── page.tsx              # Contact form
│   │
│   ├── (auth)/                       # Authentication pages
│   │   ├── layout.tsx                # Centered card layout
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── verify-email/
│   │       └── page.tsx
│   │
│   ├── (app)/                        # Authenticated user pages
│   │   ├── layout.tsx                # App layout with sidebar
│   │   ├── profile/
│   │   │   ├── page.tsx              # View/edit profile
│   │   │   └── orders/
│   │   │       └── page.tsx          # Order history
│   │   ├── favourites/
│   │   │   └── page.tsx              # Saved favourites
│   │   ├── collections/
│   │   │   ├── page.tsx              # Personal collections
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx              # Shopping cart
│   │   └── checkout/
│   │       ├── page.tsx              # Checkout page
│   │       ├── success/
│   │       │   └── page.tsx          # Payment success
│   │       └── cancel/
│   │           └── page.tsx          # Payment cancelled
│   │
│   ├── (admin)/                      # Admin dashboard
│   │   ├── layout.tsx                # Admin layout with sidebar
│   │   ├── admin/
│   │   │   ├── page.tsx              # Dashboard overview (analytics)
│   │   │   ├── photos/
│   │   │   │   ├── page.tsx          # Photo management table
│   │   │   │   └── upload/
│   │   │   │       └── page.tsx      # Multi-image upload
│   │   │   ├── albums/
│   │   │   │   ├── page.tsx          # Album management
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Edit album
│   │   │   ├── categories/
│   │   │   │   └── page.tsx          # Category management
│   │   │   ├── exhibitions/
│   │   │   │   ├── page.tsx          # Exhibition management
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx      # Edit exhibition
│   │   │   ├── users/
│   │   │   │   └── page.tsx          # User management
│   │   │   ├── orders/
│   │   │   │   └── page.tsx          # Order management
│   │   │   ├── downloads/
│   │   │   │   └── page.tsx          # Download statistics
│   │   │   └── settings/
│   │   │       └── page.tsx          # Site settings
│   │   └── page.tsx                  # Redirect to /admin/dashboard
│   │
│   └── api/                          # Next.js API routes
│       └── webhook/
│           └── stripe/
│               └── route.ts          # Stripe webhook proxy (optional)
│
├── components/
│   ├── Providers.tsx                 # Combined providers wrapper (Theme, Auth, Query)
│   ├── ui/                           # Shadcn UI components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── navigation-menu.tsx
│   │   ├── select.tsx
│   │   ├── sheet.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── separator.tsx
│   │   ├── scroll-area.tsx
│   │   ├── skeleton.tsx
│   │   ├── table.tsx
│   │   ├── data-table.tsx
│   │   ├── pagination.tsx
│   │   ├── textarea.tsx
│   │   ├── switch.tsx
│   │   ├── tooltip.tsx
│   │   ├── sonner.tsx
│   │   └── ... (all shadcn components)
│   │
│   ├── layout/                       # Layout components
│   │   ├── Navbar.tsx                # Main navigation bar
│   │   ├── MobileNav.tsx             # Mobile hamburger menu (Sheet)
│   │   ├── Footer.tsx                # Site footer
│   │   ├── AdminSidebar.tsx          # Admin dashboard sidebar
│   │   ├── UserSidebar.tsx           # User dashboard sidebar
│   │   └── ThemeToggle.tsx           # Dark/light mode toggle
│   │
│   ├── home/                         # Homepage sections
│   │   ├── HeroBanner.tsx            # Fullscreen hero with parallax
│   │   ├── FeaturedPhotos.tsx        # Featured photograph grid
│   │   ├── LatestUploads.tsx         # Latest uploads carousel
│   │   ├── PopularCollections.tsx    # Popular collections
│   │   ├── FeaturedAlbums.tsx        # Featured albums showcase
│   │   ├── ExhibitionsPreview.tsx    # Upcoming/ongoing exhibitions
│   │   ├── PhotographerIntro.tsx     # Photographer introduction
│   │   └── StatsSection.tsx          # Photo count, followers, etc.
│   │
│   ├── gallery/                      # Gallery components
│   │   ├── PhotoGrid.tsx             # Masonry/grid layout
│   │   ├── PhotoCard.tsx             # Individual photo card
│   │   ├── PhotoFilters.tsx          # Filter sidebar/toolbar
│   │   ├── PhotoLightbox.tsx         # Full-screen image preview
│   │   ├── PhotoDetail.tsx           # Photo detail page content
│   │   ├── InfiniteScroll.tsx        # Infinite scroll wrapper
│   │   ├── SearchBar.tsx             # Search input
│   │   └── SortDropdown.tsx          # Sort options
│   │
│   ├── albums/                       # Album components
│   │   ├── AlbumCard.tsx             # Album preview card
│   │   ├── AlbumGrid.tsx             # Albums grid layout
│   │   └── AlbumDetail.tsx           # Album detail content
│   │
│   ├── photo/                        # Photo-related shared components
│   │   ├── ExifInfo.tsx              # EXIF data display
│   │   ├── CameraSettings.tsx        # Camera settings display
│   │   ├── RelatedPhotos.tsx         # Related images section
│   │   ├── PhotoComments.tsx         # Comments section
│   │   ├── FavouriteButton.tsx       # Heart toggle button
│   │   ├── ShareButton.tsx           # Share dropdown
│   │   ├── DownloadButton.tsx        # Download trigger
│   │   └── AddToCartButton.tsx       # Add to cart button
│   │
│   ├── cart/                         # Shopping cart components
│   │   ├── CartSidebar.tsx           # Slide-in cart (Sheet)
│   │   ├── CartItem.tsx              # Single cart item
│   │   └── CartSummary.tsx           # Cart totals + checkout link
│   │
│   ├── checkout/                     # Checkout components
│   │   ├── CheckoutForm.tsx          # Checkout details form
│   │   ├── PaymentSelector.tsx       # Stripe/PayPal/Razorpay selector
│   │   └── OrderSummary.tsx          # Order summary sidebar
│   │
│   ├── admin/                        # Admin dashboard components
│   │   ├── AnalyticsCards.tsx         # KPI stat cards
│   │   ├── SalesChart.tsx            # Sales over time chart
│   │   ├── UploadZone.tsx            # Drag-and-drop upload area
│   │   ├── UploadProgress.tsx        # Upload progress indicators
│   │   ├── PhotoTable.tsx            # Photo management data table
│   │   ├── UserTable.tsx             # User management data table
│   │   ├── OrderTable.tsx            # Order management data table
│   │   ├── ActivityLog.tsx           # Recent activity feed
│   │   └── WatermarkPreview.tsx      # Watermark overlay preview
│   │
│   └── shared/                       # Shared/reusable components
│       ├── ImageWithLoader.tsx       # Lazy loading image with skeleton
│       ├── EmptyState.tsx            # Empty state placeholder
│       ├── ConfirmDialog.tsx         # Confirmation dialog
│       ├── ShareDialog.tsx           # Share modal
│       ├── SEOHead.tsx               # Dynamic SEO metadata
│       ├── Pagination.tsx            # Pagination component
│       └── Breadcrumbs.tsx           # Breadcrumb navigation
│
├── lib/                              # Utility libraries
│   ├── api.ts                        # Axios/fetch wrapper for backend API
│   ├── auth.ts                       # Auth helpers (token management)
│   ├── utils.ts                      # cn() helper, general utilities
│   ├── constants.ts                  # API URLs, config constants
│   ├── types.ts                      # TypeScript type definitions
│   └── validations.ts               # Zod schemas for form validation
│
├── hooks/                            # Custom React hooks
│   ├── useAuth.ts                    # Auth state management
│   ├── useCart.ts                    # Cart state management
│   ├── usePhotos.ts                  # Photo fetching/pagination
│   ├── useInfiniteScroll.ts          # Infinite scroll logic
│   ├── useDebounce.ts                # Debounced search input
│   └── useMediaQuery.ts              # Responsive breakpoints
│
├── store/                            # Zustand state stores
│   ├── authStore.ts                  # Auth state (user, token, login/logout)
│   ├── cartStore.ts                  # Cart state (items, add/remove/clear)
│   ├── themeStore.ts                 # Theme state (dark/light)
│   └── uiStore.ts                    # UI state (sidebar, modals)
│
├── providers/                        # Context providers
│   ├── ThemeProvider.tsx             # next-themes provider
│   ├── AuthProvider.tsx              # Auth context wrapper
│   └── QueryProvider.tsx             # React Query / SWR provider
│
├── public/                           # Static assets
│   ├── images/                       # Static images (logo, hero, etc.)
│   ├── fonts/                        # Custom fonts
│   └── favicon.ico
│
├── styles/
│   └── globals.css                   # Tailwind base + Shadcn CSS variables
│
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json                   # Shadcn UI config
├── package.json
├── .env.local.example
├── .eslintrc.json
├── proxy.ts                          # Next.js 16 proxy (replaces middleware.ts)
└── README.md
```

---

## 3. Database Schema (SQLAlchemy Models)

### Base Model
```python
class BaseModel:
    id: UUID (PK, default=uuid4)
    created_at: DateTime (auto, UTC)
    updated_at: DateTime (auto, UTC, onupdate)
```

### User
```python
class User(BaseModel):
    email: String(255, unique, indexed)
    username: String(50, unique, indexed)
    hashed_password: String(255)
    full_name: String(100)
    avatar_url: String(500, nullable)          # pCloud URL
    bio: Text, nullable
    role: Enum('visitor', 'admin', default='visitor')
    is_verified: Boolean(default=False)
    verification_token: String(255, nullable)
    reset_password_token: String(255, nullable)
    reset_password_expires: DateTime, nullable
    is_active: Boolean(default=True)
    last_login: DateTime, nullable
    # relationships: favourites, collections, orders, comments
```

### Category
```python
class Category(BaseModel):
    name: String(100, unique)
    slug: String(100, unique)
    description: Text, nullable
    sort_order: Integer(default=0)
    # relationships: photos
```

### Photo
```python
class Photo(BaseModel):
    title: String(200)
    slug: String(200, unique, indexed)
    description: Text, nullable
    # pCloud storage references
    original_file_id: String(100)              # pCloud file ID (original)
    thumbnail_file_id: String(100, nullable)   # pCloud file ID (thumbnail)
    original_url: String(500, nullable)        # Cached URL (regenerated)
    thumbnail_url: String(500, nullable)       # Cached URL (regenerated)
    # Image metadata
    width: Integer
    height: Integer
    file_size: BigInteger                      # bytes
    format: String(10)                         # jpeg, png, webp
    # EXIF / Camera info
    camera_make: String(100, nullable)
    camera_model: String(100, nullable)
    lens: String(200, nullable)
    focal_length: String(50, nullable)
    aperture: String(20, nullable)
    shutter_speed: String(50, nullable)
    iso: Integer, nullable
    taken_at: DateTime, nullable
    # Location
    location_name: String(200, nullable)
    latitude: Float, nullable
    longitude: Float, nullable
    # Commerce
    price: Numeric(10, 2), nullable             # NULL = not for sale
    is_free: Boolean(default=False)
    is_featured: Boolean(default=False)
    is_published: Boolean(default=True)
    view_count: Integer(default=0)
    download_count: Integer(default=0)
    # Tags stored as PostgreSQL array
    tags: ARRAY(String), default=[]
    # Watermark settings
    has_watermark: Boolean(default=True)
    # Foreign keys
    category_id: UUID (FK -> categories.id, nullable)
    uploaded_by: UUID (FK -> users.id)
    # relationships: category, photographer, favourites, comments, order_items
```

### Album
```python
class Album(BaseModel):
    title: String(200)
    slug: String(200, unique, indexed)
    description: Text, nullable
    cover_photo_id: UUID (FK -> photos.id, nullable)
    is_published: Boolean(default=True)
    is_featured: Boolean(default=False)
    sort_order: Integer(default=0)
    photo_count: Integer(default=0)
    # relationships: photos (many-to-many via album_photos)
```

### AlbumPhoto (association table)
```python
class AlbumPhoto:
    album_id: UUID (FK -> albums.id)
    photo_id: UUID (FK -> photos.id)
    sort_order: Integer(default=0)
    # composite PK: (album_id, photo_id)
```

### Exhibition
```python
class Exhibition(BaseModel):
    title: String(200)
    slug: String(200, unique, indexed)
    description: Text
    long_description: Text, nullable           # Rich text / markdown
    venue: String(200, nullable)
    location: String(200, nullable)
    start_date: Date
    end_date: Date, nullable
    cover_image_url: String(500, nullable)     # pCloud URL
    cover_image_file_id: String(100, nullable)
    is_virtual: Boolean(default=False)
    exhibition_url: String(500, nullable)      # Virtual exhibition link
    is_published: Boolean(default=True)
    # relationships: photos (many-to-many via exhibition_photos)
```

### ExhibitionPhoto (association table)
```python
class ExhibitionPhoto:
    exhibition_id: UUID (FK -> exhibitions.id)
    photo_id: UUID (FK -> photos.id)
    sort_order: Integer(default=0)
    # composite PK: (exhibition_id, photo_id)
```

### Favourite
```python
class Favourite(BaseModel):
    user_id: UUID (FK -> users.id)
    photo_id: UUID (FK -> photos.id)
    # composite unique: (user_id, photo_id)
```

### Collection (user-created, like Pinterest boards)
```python
class Collection(BaseModel):
    name: String(100)
    user_id: UUID (FK -> users.id)
    description: Text, nullable
    is_public: Boolean(default=True)
    # relationships: photos (many-to-many via collection_photos)
```

### CollectionPhoto
```python
class CollectionPhoto:
    collection_id: UUID (FK -> collections.id)
    photo_id: UUID (FK -> photos.id)
    # composite PK: (collection_id, photo_id)
```

### Cart
```python
class Cart(BaseModel):
    user_id: UUID (FK -> users.id, unique)     # One cart per user
    # relationships: items
```

### CartItem
```python
class CartItem(BaseModel):
    cart_id: UUID (FK -> carts.id)
    photo_id: UUID (FK -> photos.id)
    # composite unique: (cart_id, photo_id)
```

### Order
```python
class Order(BaseModel):
    order_number: String(50, unique, indexed)   # e.g., ORD-2026-000001
    user_id: UUID (FK -> users.id)
    status: Enum('pending', 'paid', 'failed', 'refunded', 'completed')
    total_amount: Numeric(10, 2)
    currency: String(3, default='USD')
    payment_provider: Enum('stripe', 'paypal', 'razorpay')
    payment_session_id: String(255, nullable)   # Provider session ID
    payment_id: String(255, nullable)           # Provider payment ID
    payment_status: String(50, nullable)
    billing_name: String(100, nullable)
    billing_email: String(255, nullable)
    paid_at: DateTime, nullable
    # relationships: items
```

### OrderItem
```python
class OrderItem(BaseModel):
    order_id: UUID (FK -> orders.id)
    photo_id: UUID (FK -> photos.id)
    photo_title: String(200)                   # Denormalized
    price: Numeric(10, 2)                      # Price at purchase time
    # composite unique: (order_id, photo_id)
```

### Download
```python
class Download(BaseModel):
    user_id: UUID (FK -> users.id)
    photo_id: UUID (FK -> photos.id)
    order_id: UUID (FK -> orders.id, nullable)  # NULL for free downloads
    download_token: String(255, unique)         # Signed JWT token
    expires_at: DateTime
    download_count: Integer(default=0)
    max_downloads: Integer(default=5)
    ip_address: String(45, nullable)
    # relationships: user, photo, order
```

### Comment
```python
class Comment(BaseModel):
    user_id: UUID (FK -> users.id)
    photo_id: UUID (FK -> photos.id)
    content: Text
    is_approved: Boolean(default=True)
    # relationships: user, photo
```

### Notification
```python
class Notification(BaseModel):
    user_id: UUID (FK -> users.id)
    title: String(200)
    message: Text
    type: Enum('order', 'download', 'system', 'comment')
    is_read: Boolean(default=False)
    link: String(500, nullable)                 # Deep link to related page
```

### ActivityLog
```python
class ActivityLog(BaseModel):
    user_id: UUID (FK -> users.id, nullable)
    action: String(100)                        # 'photo.uploaded', 'order.created', etc.
    resource_type: String(50)                  # 'photo', 'order', 'user'
    resource_id: UUID, nullable
    details: JSON, nullable
    ip_address: String(45, nullable)
```

---

## 4. REST API Endpoints (v1)

All endpoints prefixed with `/api/v1`.

### Authentication
```
POST   /auth/register              Register new user
POST   /auth/login                 Login (returns access + refresh tokens)
POST   /auth/logout                Logout (invalidate refresh token)
POST   /auth/refresh               Refresh access token
POST   /auth/verify-email          Verify email with token
POST   /auth/forgot-password       Request password reset
POST   /auth/reset-password        Reset password with token
GET    /auth/me                    Get current user info
```

### Users
```
GET    /users/profile              Get own profile
PUT    /users/profile              Update own profile
PUT    /users/avatar               Upload/update avatar
PUT    /users/change-password      Change password
GET    /users/:id                  Get public user profile (photographer info)
```

### Photos
```
GET    /photos                     List photos (paginated, filterable, sortable)
       ?search=&category=&location=&camera=&lens=&year=
       &sort=newest|popular|price_asc|price_desc&page=&limit=
GET    /photos/featured            Get featured photos
GET    /photos/latest              Get latest photos
GET    /photos/popular             Get most viewed photos
GET    /photos/:id                 Get single photo detail
GET    /photos/:id/related         Get related photos
POST   /photos                     Create photo (admin only, multipart)
PUT    /photos/:id                 Update photo (admin only)
DELETE /photos/:id                 Delete photo (admin only)
```

### Albums
```
GET    /albums                     List albums (paginated)
GET    /albums/featured            Get featured albums
GET    /albums/:id                 Get album with photos
POST   /albums                     Create album (admin only)
PUT    /albums/:id                 Update album (admin only)
DELETE /albums/:id                 Delete album (admin only)
POST   /albums/:id/photos         Add photo to album (admin only)
DELETE /albums/:id/photos/:photoId Remove photo from album (admin only)
```

### Categories
```
GET    /categories                 List all categories
POST   /categories                 Create category (admin only)
PUT    /categories/:id             Update category (admin only)
DELETE /categories/:id             Delete category (admin only)
```

### Exhibitions
```
GET    /exhibitions                List exhibitions (paginated)
GET    /exhibitions/current        Get current/ongoing exhibitions
GET    /exhibitions/:id            Get exhibition with photos
POST   /exhibitions                Create exhibition (admin only)
PUT    /exhibitions/:id            Update exhibition (admin only)
DELETE /exhibitions/:id            Delete exhibition (admin only)
POST   /exhibitions/:id/photos    Add photo to exhibition (admin only)
DELETE /exhibitions/:id/photos/:photoId Remove photo (admin only)
```

### Favourites
```
GET    /favourites                 Get user's favourites
POST   /favourites/:photoId       Add photo to favourites
DELETE /favourites/:photoId       Remove photo from favourites
GET    /favourites/check/:photoId Check if photo is favourited
```

### Collections
```
GET    /collections                Get user's collections
GET    /collections/:id            Get collection with photos
POST   /collections                Create collection
PUT    /collections/:id            Update collection
DELETE /collections/:id            Delete collection
POST   /collections/:id/photos    Add photo to collection
DELETE /collections/:id/photos/:photoId Remove photo from collection
```

### Cart
```
GET    /cart                       Get user's cart with items
POST   /cart/items                 Add item to cart
DELETE /cart/items/:photoId       Remove item from cart
DELETE /cart                       Clear entire cart
```

### Orders & Payments
```
POST   /orders/checkout            Create order + payment session
       Body: { items: [photoId, ...], payment_provider: "stripe"|"paypal"|"razorpay" }
       Returns: { session_url, session_id }
GET    /orders                     Get user's order history
GET    /orders/:id                 Get order detail
POST   /orders/:id/invoice         Download invoice PDF

# Payment webhooks (no auth - verified by provider signature)
POST   /webhooks/stripe            Stripe webhook handler
POST   /webhooks/paypal            PayPal webhook handler
POST   /webhooks/razorpay          Razorpay webhook handler
```

### Downloads
```
GET    /downloads                  Get user's download history
POST   /downloads/:photoId         Generate download link for purchased photo
       Returns: { download_url, expires_at, token }
GET    /downloads/access/:token    Download file via signed token (public)
```

### Comments
```
GET    /photos/:photoId/comments   Get comments for a photo
POST   /photos/:photoId/comments   Add comment (authenticated)
DELETE /comments/:id               Delete own comment (or admin)
```

### Notifications
```
GET    /notifications              Get user's notifications
PUT    /notifications/:id/read     Mark as read
PUT    /notifications/read-all     Mark all as read
GET    /notifications/unread-count Get unread count
```

### Admin - Upload
```
POST   /admin/upload               Upload multiple images
       multipart: files[], category_id, tags[], price, is_featured
       Returns: { photos: [...], progress: [...] }
POST   /admin/upload/process/:id   Process uploaded image (generate thumbnail, extract EXIF)
```

### Admin - Analytics
```
GET    /admin/analytics/overview    KPIs (total photos, users, revenue, downloads)
GET    /admin/analytics/sales       Sales data (daily/weekly/monthly)
GET    /admin/analytics/downloads   Download statistics
GET    /admin/analytics/popular     Most popular photos
GET    /admin/activity              Activity log (paginated)
```

### Admin - Users
```
GET    /admin/users                 List all users (admin only)
PUT    /admin/users/:id/role       Update user role
PUT    /admin/users/:id/status     Activate/deactivate user
```

---

## 5. Implementation Phases & Build Order

### Phase 1: Project Scaffolding (Files 1-44) ✅ COMPLETED
**Goal:** Both projects bootstrapped, database connected, auth working.
**Status:** All 89 files created and verified. Build passes successfully.

> **Migration Note:** `middleware.ts` → `proxy.ts` (Next.js 16 convention). Function renamed from `middleware()` to `proxy()`.

| # | File | Purpose | Status |
|---|------|---------|--------|
| 1 | `backend/pyproject.toml` | Python project config, dependencies | ✅ |
| 2 | `backend/requirements.txt` | Pin all Python deps | ✅ |
| 3 | `backend/.env.example` | Environment variables template | ✅ |
| 4 | `backend/app/__init__.py` | Package init | ✅ |
| 5 | `backend/app/config.py` | Pydantic Settings | ✅ |
| 6 | `backend/app/main.py` | FastAPI app factory: CORS, middleware, router includes, lifespan | ✅ |
| 7 | `backend/app/models/base.py` | SQLAlchemy Base, mixins | ✅ |
| 8 | `backend/app/models/user.py` | User model | ✅ |
| 9 | `backend/app/schemas/common.py` | Pagination, MessageResponse | ✅ |
| 10 | `backend/app/schemas/token.py` | TokenPair, TokenPayload | ✅ |
| 11 | `backend/app/schemas/auth.py` | RegisterRequest, LoginRequest | ✅ |
| 12 | `backend/app/schemas/user.py` | UserResponse, UserUpdate | ✅ |
| 13 | `backend/app/core/security.py` | JWT create/verify, password hash/verify | ✅ |
| 14 | `backend/app/core/permissions.py` | get_current_user, require_admin | ✅ |
| 15 | `backend/app/repositories/base.py` | Generic CRUD repository | ✅ |
| 16 | `backend/app/repositories/user_repo.py` | User-specific queries | ✅ |
| 17 | `backend/app/services/auth_service.py` | Register, login, refresh, verify, reset | ✅ |
| 18 | `backend/app/services/user_service.py` | Profile CRUD | ✅ |
| 19 | `backend/app/api/deps.py` | get_db, get_current_user, require_admin | ✅ |
| 20 | `backend/app/api/v1/auth.py` | Auth endpoints | ✅ |
| 21 | `backend/app/api/v1/users.py` | User endpoints | ✅ |
| 22 | `backend/app/api/v1/router.py` | v1 router aggregation | ✅ |
| 23 | `backend/alembic.ini` | Alembic config | ✅ |
| 24 | `backend/alembic/env.py` | Migration environment | ✅ |
| 25 | `backend/alembic/versions/001_initial.py` | Initial migration | ✅ |
| 26 | `frontend/package.json` | Next.js project deps | ✅ |
| 27 | `frontend/next.config.ts` | Next.js config | ✅ |
| 28 | `frontend/tailwind.config.ts` | Tailwind config | ✅ |
| 29 | `frontend/tsconfig.json` | TypeScript config | ✅ |
| 30 | `frontend/app/layout.tsx` | Root layout (with Providers) | ✅ |
| 31 | `frontend/app/globals.css` | Tailwind + Shadcn CSS variables | ✅ |
| 32 | `frontend/lib/api.ts` | Axios instance with interceptors | ✅ |
| 33 | `frontend/lib/auth.ts` | Token storage helpers | ✅→`hooks/useAuth.ts` + `providers/AuthProvider.tsx` |
| 34 | `frontend/lib/types.ts` | TypeScript interfaces | ✅ |
| 35 | `frontend/lib/constants.ts` | API URL, site name | ✅ |
| 36 | `frontend/lib/validations.ts` | Zod schemas | ✅ |
| 37 | `frontend/providers/ThemeProvider.tsx` | next-themes provider | ✅ |
| 38 | `frontend/providers/AuthProvider.tsx` | Auth context | ✅ |
| 39 | `frontend/store/authStore.ts` | Zustand auth store | ✅ |
| 40 | `frontend/store/cartStore.ts` | Zustand cart store | ✅ |
| 41 | `frontend/store/themeStore.ts` | Zustand theme store | ✅ |
| 42 | `frontend/components/ui/*` | Shadcn UI components (19 installed) | ✅ |
| 43 | `frontend/app/page.tsx` | Homepage (full implementation) | ✅ |
| 44 | Shadcn init + install | `npx shadcn@latest init` + `add` commands | ✅ |

**Additional files created in Phase 1:**

| File | Purpose | Status |
|------|---------|--------|
| `backend/app/middleware/__init__.py` | Package init | ✅ |
| `backend/app/middleware/error_handler.py` | Global exception handler | ✅ |
| `backend/app/middleware/logging_middleware.py` | Request logging | ✅ |
| `frontend/proxy.ts` | Next.js 16 proxy (replaces middleware.ts) | ✅ |
| `frontend/components/Providers.tsx` | Combined providers wrapper | ✅ |
| `frontend/components/layout/Navbar.tsx` | Responsive navbar with glassmorphism | ✅ |
| `frontend/components/layout/Footer.tsx` | Site footer | ✅ |
| `frontend/components/layout/ThemeToggle.tsx` | Dark/light mode toggle | ✅ |
| `frontend/components/shared/EmptyState.tsx` | Empty state placeholder | ✅ |
| `frontend/components/shared/ImageWithLoader.tsx` | Lazy loading image | ✅ |
| `frontend/components/shared/Skeletons.tsx` | Loading skeletons | ✅ |
| `frontend/hooks/useAuth.ts` | Auth state hook | ✅ |
| `frontend/hooks/useCart.ts` | Cart operations hook | ✅ |
| `frontend/hooks/useDebounce.ts` | Debounced input hook | ✅ |
| `frontend/hooks/useInfiniteScroll.ts` | Infinite scroll hook | ✅ |
| `frontend/hooks/useMediaQuery.ts` | Responsive breakpoint hook | ✅ |
| `frontend/hooks/usePhotos.ts` | Photo fetching hook | ✅ |
| `frontend/store/uiStore.ts` | UI state store | ✅ |
| `frontend/providers/QueryProvider.tsx` | React Query provider | ✅ |
| `frontend/app/loading.tsx` | Root loading skeleton | ✅ |
| `frontend/app/error.tsx` | Global error boundary | ✅ |
| `frontend/app/not-found.tsx` | 404 page | ✅ |
| `frontend/app/(marketing)/layout.tsx` | Marketing layout | ✅ |
| `frontend/app/(marketing)/gallery/page.tsx` | Gallery page | ✅ |
| `frontend/app/(marketing)/gallery/loading.tsx` | Gallery loading | ✅ |
| `frontend/app/(marketing)/albums/page.tsx` | Albums page | ✅ |
| `frontend/app/(marketing)/exhibitions/page.tsx` | Exhibitions page | ✅ |
| `frontend/app/(marketing)/about/page.tsx` | About page | ✅ |
| `frontend/app/(marketing)/contact/page.tsx` | Contact page | ✅ |
| `frontend/app/(auth)/layout.tsx` | Auth layout | ✅ |
| `frontend/app/(auth)/login/page.tsx` | Login page | ✅ |
| `frontend/app/(auth)/register/page.tsx` | Register page | ✅ |
| `frontend/app/(app)/layout.tsx` | App layout (auth guard) | ✅ |
| `frontend/app/(app)/profile/page.tsx` | Profile page | ✅ |
| `frontend/app/(app)/profile/orders/page.tsx` | Orders page | ✅ |
| `frontend/app/(app)/favourites/page.tsx` | Favourites page | ✅ |
| `frontend/app/(app)/collections/page.tsx` | Collections page | ✅ |
| `frontend/app/(app)/cart/page.tsx` | Cart page | ✅ |
| `frontend/app/(app)/checkout/page.tsx` | Checkout page | ✅ |
| `frontend/app/(app)/checkout/success/page.tsx` | Payment success | ✅ |
| `frontend/app/(app)/checkout/cancel/page.tsx` | Payment cancelled | ✅ |
| `frontend/app/(admin)/layout.tsx` | Admin layout (role guard) | ✅ |
| `frontend/app/(admin)/admin/page.tsx` | Admin dashboard | ✅ |

### Phase 2: Core Backend (Files 45-107)
**Goal:** All models, repositories, services, and API routes.

| # | File | Purpose |
|---|------|---------|
| 45-56 | `backend/app/models/*.py` | All remaining models (category, photo, album, exhibition, favourite, collection, cart, order, order_item, download, comment, notification, activity_log) |
| 57 | `backend/alembic/versions/002_all_tables.py` | Migration for all tables |
| 58-69 | `backend/app/repositories/*.py` | All repository files |
| 70-83 | `backend/app/services/*.py` | All service files |
| 84-95 | `backend/app/schemas/*.py` | All schema files |
| 96-107 | `backend/app/api/v1/*.py` | All API route files |

### Phase 3: Storage & Image Processing (Files 108-113)
**Goal:** pCloud integration, EXIF extraction, thumbnail generation.

| # | File | Purpose |
|---|------|---------|
| 108 | `backend/app/storage/storage_interface.py` | Abstract StorageInterface |
| 109 | `backend/app/storage/pcloud.py` | pCloud client |
| 110 | `backend/app/utils/exif.py` | EXIF extraction |
| 111 | `backend/app/utils/image.py` | Image optimization |
| 112 | `backend/app/services/image_processor.py` | Processing pipeline |
| 113 | `backend/app/services/upload_service.py` | Multi-file upload |

### Phase 4: Payment Integration (Files 114-126)
**Goal:** All 3 payment providers, checkout, webhooks, downloads.

| # | File | Purpose |
|---|------|---------|
| 114 | `backend/app/payments/base.py` | Abstract PaymentProvider |
| 115 | `backend/app/payments/stripe_provider.py` | Stripe integration |
| 116 | `backend/app/payments/paypal_provider.py` | PayPal integration |
| 117 | `backend/app/payments/razorpay_provider.py` | Razorpay integration |
| 118 | `backend/app/services/order_service.py` | Order + payment orchestration |
| 119 | `backend/app/services/download_service.py` | Signed download tokens |

### Phase 5: Frontend Layout & Navigation (Files 120-136) ✅ COMPLETED
**Goal:** Responsive navbar, footer, dark mode, routing.
**Status:** All layout components, hooks, and providers built in Phase 1.

| # | File | Purpose | Status |
|---|------|---------|--------|
| 120-125 | `frontend/components/layout/*.tsx` | Navbar, MobileNav, Footer, AdminSidebar, UserSidebar, ThemeToggle | ✅ Phase 1 |
| 126-131 | `frontend/hooks/*.tsx` | useAuth, useCart, useInfiniteScroll, useDebounce, useMediaQuery | ✅ Phase 1 |
| 132 | `frontend/proxy.ts` | Protected/admin route guards (Next.js 16 proxy convention) | ✅ Phase 1 |
| 133-136 | `frontend/app/**/layout.tsx` | Marketing, Auth, App, Admin layouts | ✅ Phase 1 |

### Phase 6: Frontend Public Pages (Files 137-185)
**Goal:** Homepage, Gallery, Photo Detail, Albums, Exhibitions, About, Contact.

| # | File | Purpose |
|---|------|---------|
| 137-144 | `frontend/components/home/*.tsx` | All homepage sections |
| 145-152 | `frontend/components/gallery/*.tsx` | Gallery components |
| 153-155 | `frontend/components/albums/*.tsx` | Album components |
| 156-163 | `frontend/components/photo/*.tsx` | Photo detail components |
| 164-171 | `frontend/app/(marketing)/*.tsx` | All marketing pages |

### Phase 7: Frontend Auth & User Pages (Files 172-198)
**Goal:** Login, register, profile, favourites, cart, checkout.

| # | File | Purpose |
|---|------|---------|
| 172-176 | `frontend/app/(auth)/*.tsx` | Auth pages |
| 177-183 | `frontend/app/(app)/*.tsx` | User pages |
| 184-186 | `frontend/components/cart/*.tsx` | Cart components |
| 187-189 | `frontend/components/checkout/*.tsx` | Checkout components |

### Phase 8: Frontend Admin Dashboard (Files 190-207)
**Goal:** Full admin dashboard with analytics, CRUD management, upload.

| # | File | Purpose |
|---|------|---------|
| 190-200 | `frontend/app/(admin)/admin/*.tsx` | Admin pages |
| 201-207 | `frontend/components/admin/*.tsx` | Admin components |

### Phase 9: Shared Components & Polish (Files 208-225)
**Goal:** Shared components, animations, SEO, error handling, loading states.

| # | File | Purpose |
|---|------|---------|
| 208-214 | `frontend/components/shared/*.tsx` | Shared components |
| 215-220 | `frontend/app/**/loading.tsx` | Loading skeletons |
| 221 | `frontend/app/error.tsx` | Global error boundary |
| 222 | `frontend/app/not-found.tsx` | 404 page |

### Phase 10: Testing & Deployment (Files 223-235)
**Goal:** Tests, Docker, deployment configs.

| # | File | Purpose |
|---|------|---------|
| 223-228 | `backend/tests/*.py` | Backend test suite |
| 229 | `backend/Dockerfile` | Backend Docker image |
| 230 | `backend/.dockerignore` | Docker ignore |
| 231 | `frontend/vercel.json` | Vercel config |
| 232 | `backend/render.yaml` | Render blueprint |
| 233 | `docker-compose.yml` | Local dev compose |
| 234 | `README.md` | Project documentation |

---

## 6. Key Code Patterns

### Pattern A: Backend Auth (JWT + Refresh Tokens)

```python
# backend/app/core/security.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(user_id: str, role: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user_id, "role": role, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")

def create_refresh_token(user_id: str) -> str:
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {"sub": user_id, "exp": expire, "type": "refresh"}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")

def verify_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"])
```

```python
# backend/app/api/deps.py
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(status_code=401, detail="Invalid token")
    try:
        payload = verify_token(token)
        user_id = payload.get("sub")
        if payload.get("type") != "access":
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await user_repo.get(db, id=user_id)
    if not user or not user.is_active:
        raise credentials_exception
    return user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
```

### Pattern B: Generic Repository

```python
# backend/app/repositories/base.py
from typing import TypeVar, Generic, Type, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.base import BaseModel

ModelType = TypeVar("ModelType", bound=BaseModel)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, db: AsyncSession, id: UUID) -> Optional[ModelType]:
        result = await db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_multi(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 20,
        filters: dict = None, order_by: str = "created_at"
    ) -> tuple[List[ModelType], int]:
        query = select(self.model)
        if filters:
            for key, value in filters.items():
                if value is not None:
                    query = query.where(getattr(self.model, key) == value)
        count_query = select(func.count()).select_from(query.subquery())
        total = (await db.execute(count_query)).scalar()
        query = query.order_by(desc(getattr(self.model, order_by)))
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all(), total

    async def create(self, db: AsyncSession, **kwargs) -> ModelType:
        obj = self.model(**kwargs)
        db.add(obj)
        await db.commit()
        await db.refresh(obj)
        return obj

    async def update(self, db: AsyncSession, id: UUID, **kwargs) -> Optional[ModelType]:
        obj = await self.get(db, id)
        if obj:
            for key, value in kwargs.items():
                setattr(obj, key, value)
            await db.commit()
            await db.refresh(obj)
        return obj

    async def delete(self, db: AsyncSession, id: UUID) -> bool:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
            return True
        return False
```

### Pattern C: pCloud Storage Client

```python
# backend/app/storage/pcloud.py
import httpx
from app.config import settings

class PCloudStorage:
    BASE_URL = "https://api.pcloud.com"

    def __init__(self):
        self.access_token = settings.PCLOUD_ACCESS_TOKEN
        self.headers = {"Authorization": f"Bearer {self.access_token}"}

    async def upload_file(self, file_bytes: bytes, filename: str, folder_id: int = 0) -> dict:
        async with httpx.AsyncClient(timeout=120) as client:
            response = await client.post(
                f"{self.BASE_URL}/uploadfile",
                headers=self.headers,
                files={"file": (filename, file_bytes)},
                data={"folderid": folder_id, "renameifexists": 1}
            )
            data = response.json()
            if data.get("result") != 0:
                raise Exception(f"pCloud upload failed: {data.get('error')}")
            return data["metadata"][0]

    async def get_file_link(self, file_id: int) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/getfilelink",
                headers=self.headers,
                data={"fileid": file_id}
            )
            data = response.json()
            if data.get("result") != 0:
                raise Exception(f"pCloud get link failed: {data.get('error')}")
            host = data["hosts"][0]
            path = data["path"]
            return f"https://{host}{path}"

    async def get_thumb_link(self, file_id: int, width: int = 800, height: int = 600) -> str:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/getthumblink",
                headers=self.headers,
                data={"fileid": file_id, "size": f"{width}x{height}"}
            )
            data = response.json()
            if data.get("result") != 0:
                raise Exception(f"pCloud thumb failed: {data.get('error')}")
            host = data["hosts"][0]
            path = data["path"]
            return f"https://{host}{path}"

    async def delete_file(self, file_id: int) -> bool:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.BASE_URL}/deletefile",
                headers=self.headers,
                data={"fileid": file_id}
            )
            return response.json().get("result") == 0
```

### Pattern D: Payment Provider Interface

```python
# backend/app/payments/base.py
from abc import ABC, abstractmethod
from typing import Optional
from decimal import Decimal

class PaymentProvider(ABC):
    @abstractmethod
    async def create_checkout_session(
        self, order_id: str, items: list[dict],
        success_url: str, cancel_url: str
    ) -> dict:
        """Return {session_id, session_url}"""
        pass

    @abstractmethod
    async def verify_webhook(self, payload: bytes, signature: str) -> dict:
        """Verify webhook signature, return parsed event"""
        pass

    @abstractmethod
    async def get_payment_status(self, session_id: str) -> str:
        """Return payment status string"""
        pass

    @abstractmethod
    async def refund(self, payment_id: str, amount: Decimal) -> bool:
        """Process refund"""
        pass
```

```python
# backend/app/payments/stripe_provider.py
import stripe
from app.payments.base import PaymentProvider
from app.config import settings

class StripeProvider(PaymentProvider):
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY

    async def create_checkout_session(self, order_id, items, success_url, cancel_url):
        line_items = [{
            "price_data": {
                "currency": "usd",
                "product_data": {"name": item["photo_title"]},
                "unit_amount": int(item["price"] * 100),
            },
            "quantity": 1,
        } for item in items]

        session = stripe.checkout.Session.create(
            line_items=line_items,
            mode="payment",
            success_url=f"{success_url}?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=cancel_url,
            metadata={"order_id": order_id},
        )
        return {"session_id": session.id, "session_url": session.url}

    async def verify_webhook(self, payload, signature):
        return stripe.Webhook.construct_event(
            payload, signature, settings.STRIPE_WEBHOOK_SECRET
        )
```

### Pattern E: EXIF Extraction + Image Processing

```python
# backend/app/services/image_processor.py
from PIL import Image
from PIL.ExifTags import TAGS
import io

class ImageProcessor:
    THUMBNAIL_SIZES = {"small": (400, 300), "medium": (800, 600), "large": (1200, 900)}

    def extract_exif(self, image_bytes: bytes) -> dict:
        img = Image.open(io.BytesIO(image_bytes))
        exif_data = {}
        raw_exif = img._getexif()
        if raw_exif:
            for tag_id, value in raw_exif.items():
                tag = TAGS.get(tag_id, tag_id)
                if tag in ("Make", "Model", "LensModel", "FocalLength",
                           "FNumber", "ExposureTime", "ISOSpeedRatings",
                           "DateTimeOriginal"):
                    exif_data[tag] = str(value)
        return {
            "width": img.width,
            "height": img.height,
            "camera_make": exif_data.get("Make"),
            "camera_model": exif_data.get("Model"),
            "lens": exif_data.get("LensModel"),
            "focal_length": exif_data.get("FocalLength"),
            "aperture": exif_data.get("FNumber"),
            "shutter_speed": exif_data.get("ExposureTime"),
            "iso": int(exif_data.get("ISOSpeedRatings", 0)) or None,
            "taken_at": exif_data.get("DateTimeOriginal"),
        }

    def create_thumbnail(self, image_bytes: bytes, size: tuple = (800, 600)) -> bytes:
        img = Image.open(io.BytesIO(image_bytes))
        img.thumbnail(size, Image.Resampling.LANCZOS)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        output = io.BytesIO()
        img.save(output, format="JPEG", quality=85, optimize=True)
        return output.getvalue()

    def optimize(self, image_bytes: bytes, max_width: int = 2400) -> bytes:
        img = Image.open(io.BytesIO(image_bytes))
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        output = io.BytesIO()
        img.save(output, format="JPEG", quality=90, optimize=True)
        return output.getvalue()
```

### Pattern F: Frontend API Client with Token Refresh

```typescript
// frontend/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh_token = localStorage.getItem("refresh_token");
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
          { refresh_token }
        );
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Pattern G: Frontend Masonry Gallery with Framer Motion

```tsx
// frontend/components/gallery/PhotoGrid.tsx
"use client";
import { motion } from "motion/react";
import { PhotoCard } from "./PhotoCard";

interface PhotoGridProps {
  photos: Photo[];
  columns?: number;
}

export function PhotoGrid({ photos, columns = 3 }: PhotoGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {photos.map((photo, index) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.4 }}
          className="break-inside-avoid"
        >
          <PhotoCard photo={photo} />
        </motion.div>
      ))}
    </div>
  );
}
```

### Pattern H: Infinite Scroll Hook

```typescript
// frontend/hooks/useInfiniteScroll.ts
import { useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            callback();
          }
        },
        { threshold: 0.1 }
      );
      if (node) observer.current.observe(node);
    },
    [callback, hasMore]
  );

  useEffect(() => {
    return () => { observer.current?.disconnect(); };
  }, []);

  return lastElementRef;
}
```

### Pattern I: Dark Theme CSS Variables (Glassmorphism)

```css
/* frontend/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --muted: 240 4.8% 95.9%;
    --accent: 240 4.8% 95.9%;
    --border: 240 5.9% 90%;
    --ring: 240 5.9% 10%;
    --radius: 0.75rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 6%;
    --card-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --muted: 240 3.7% 15.9%;
    --accent: 240 3.7% 15.9%;
    --border: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }
}

@layer utilities {
  .glass {
    @apply bg-background/60 backdrop-blur-xl border border-border/50;
  }
  .glass-strong {
    @apply bg-background/80 backdrop-blur-2xl border border-border/30;
  }
}
```

---

## 7. Environment Variables

### Backend `.env.example`
```env
# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/photoapp

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# pCloud
PCLOUD_ACCESS_TOKEN=your_pcloud_oauth_token
PCLOUD_FOLDER_ID=0

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox
PAYPAL_WEBHOOK_ID=...

# Razorpay
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Frontend
FRONTEND_URL=http://localhost:3000

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=noreply@yourdomain.com

# CORS
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend `.env.local.example`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_NAME=PhotoExhibit
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 8. Key Dependencies

### Backend `requirements.txt`
```
fastapi==0.115.0
uvicorn[standard]==0.30.0
sqlalchemy[asyncio]==2.0.35
asyncpg==0.30.0
alembic==1.14.0
pydantic==2.10.0
pydantic-settings==2.6.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.12
httpx==0.28.0
stripe==11.0.0
Pillow==11.0.0
python-dotenv==1.0.1
structlog==24.4.0
slowapi==0.1.9
pyjwt==2.10.0
aiofiles==24.1.0
```

### Frontend `package.json` (key deps)
```json
{
  "dependencies": {
    "next": "15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^12.0.0",
    "next-themes": "^0.4.0",
    "axios": "^1.7.0",
    "zustand": "^5.0.0",
    "zod": "^3.24.0",
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.9.0",
    "react-masonry-css": "^1.0.16",
    "date-fns": "^4.1.0",
    "lucide-react": "^0.468.0",
    "recharts": "^2.15.0",
    "sonner": "^1.7.0",
    "@stripe/stripe-js": "^5.0.0",
    "@tanstack/react-table": "^8.20.0"
  }
}
```

---

## 9. Deployment Configuration

### Frontend (Vercel)
- Framework: Next.js (auto-detected)
- Build Command: `npm run build`
- Output Directory: `.next`
- Environment Variables: Set in Vercel dashboard
- Node.js version: 20.x

### Backend (Render)
- Runtime: Python 3.11
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Environment: Python environment with all env vars set
- Database: Render PostgreSQL (managed)

### Docker Compose (Local Development)
```yaml
version: "3.9"
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: photoapp
      POSTGRES_PASSWORD: password
      POSTGRES_DB: photoapp
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - ./backend/.env
    depends_on:
      - db
    volumes:
      - ./backend:/app

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    env_file:
      - ./frontend/.env.local
    depends_on:
      - backend

volumes:
  pgdata:
```

---

*Plan generated for Photo Exhibition Web Application*
*Single photographer portfolio · 3 payment providers · ~260 files*
