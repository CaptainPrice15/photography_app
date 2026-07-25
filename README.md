# PhotoExhibit

A full-stack photography portfolio and marketplace web application built with Next.js 16 and FastAPI. Designed for photographers to showcase, sell, and manage their work.

## Features

- **Gallery** — Search, filter (category, camera, lens, year, location), sort, and infinite scroll
- **Albums & Exhibitions** — Curated photo groupings and virtual/physical event pages
- **E-Commerce** — Shopping cart with multi-provider checkout (Stripe, PayPal, Razorpay) and secure download links
- **User Accounts** — JWT authentication with role-based access (admin/visitor)
- **Admin Dashboard** — Photo/album/category/exhibition CRUD, multi-image upload, user management, and analytics
- **Engagement** — Favourites, user-created collections, comments, and notifications
- **Dark/Light Theme** — Toggle with system preference support

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework |
| React 19 + TypeScript | UI library & type safety |
| Tailwind CSS v4 | Utility-first styling |
| Shadcn UI | Pre-built accessible components |
| Zustand | Client state management |
| TanStack React Query | Server state / data fetching |
| Framer Motion | Animations |
| Recharts | Admin analytics charts |

### Backend

| Technology | Purpose |
|---|---|
| Python 3.11+ / FastAPI | Async API server |
| SQLAlchemy 2.0 (async) | ORM |
| PostgreSQL + asyncpg | Database |
| Alembic | Database migrations |
| Pydantic v2 | Data validation |
| python-jose + passlib | JWT auth & password hashing |
| Pillow | Image processing (EXIF, thumbnails) |
| httpx | Async HTTP client |

### Storage & Payments

- **Cloud Storage:** pCloud API
- **Payments:** Stripe, PayPal, Razorpay

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL
- pCloud account (for image storage)

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL, JWT secret, pCloud token, payment keys, etc.

# Run database migrations
alembic upgrade head

# Start the server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
# Create .env.local with:
#   NEXT_PUBLIC_API_URL=http://localhost:8000
#   NEXT_PUBLIC_SITE_NAME=PhotoExhibit
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Start development server
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |
| `PCLOUD_ACCESS_TOKEN` | pCloud OAuth token |
| `PCLOUD_FOLDER_ID` | pCloud folder for photo storage |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `PAYPAL_CLIENT_ID` | PayPal client ID |
| `PAYPAL_CLIENT_SECRET` | PayPal client secret |
| `RAZORPAY_KEY_ID` | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `FRONTEND_URL` | Frontend URL (default: `http://localhost:3000`) |
| `SMTP_*` | Email configuration for notifications |
| `CORS_ORIGINS` | Allowed CORS origins |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: `http://localhost:8000`) |
| `NEXT_PUBLIC_SITE_NAME` | Site name |
| `NEXT_PUBLIC_SITE_URL` | Frontend URL |

## Project Structure

```
PhotoApp/
├── backend/                  # FastAPI backend
│   ├── alembic/              # Database migrations
│   ├── app/
│   │   ├── api/v1/           # API route handlers (15 modules)
│   │   ├── core/             # Auth & permissions
│   │   ├── models/           # SQLAlchemy models (16 models)
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── services/         # Business logic layer
│   │   ├── repositories/     # Data access layer
│   │   ├── payments/         # Stripe, PayPal, Razorpay providers
│   │   ├── storage/          # pCloud storage client
│   │   └── middleware/       # Error handling, logging
│   └── requirements.txt
│
└── frontend/                 # Next.js 16 frontend
    ├── app/                  # App Router pages
    │   ├── (marketing)/      # Public pages (gallery, albums, exhibitions)
    │   ├── (auth)/           # Login, register
    │   ├── (app)/            # Authenticated pages (profile, cart, checkout)
    │   └── (admin)/          # Admin dashboard
    ├── components/           # UI components (Shadcn + custom)
    ├── hooks/                # Custom React hooks
    ├── store/                # Zustand state stores
    ├── lib/                  # API client, types, validations
    └── providers/            # Theme, auth, query providers
```

## Architecture

The backend follows a clean architecture pattern:

```
Router → Schema → Service → Repository → Model
```

- **Routes** — Thin controllers handling HTTP request/response
- **Schemas** — Pydantic v2 models for validation and serialization
- **Services** — Business logic orchestration
- **Repositories** — Data access with generic CRUD base
- **Models** — SQLAlchemy ORM models with UUID primary keys

## API

The REST API is versioned at `/api/v1` with 15 route modules and 60+ endpoints:

- `POST /api/v1/auth/register` — User registration
- `POST /api/v1/auth/login` — JWT login
- `GET /api/v1/photos` — List photos with search/filter/sort/pagination
- `POST /api/v1/cart` — Add to cart
- `POST /api/v1/orders/checkout` — Process checkout
- `GET /api/v1/admin/analytics` — Dashboard analytics

Full interactive docs at `/docs` (Swagger UI) or `/redoc` (ReDoc).

## License

MIT
