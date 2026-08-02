# Image Security Plan — Watermarked Previews, Payment-Gated Downloads (Phase-by-Phase)

## Final decisions (confirmed by user)

- **Watermark text**: `@Gourab_Das` (diagonal tiled, semi-transparent, all previews).
- **Payments**: keep **mock-pay sandbox** (no real Stripe/PayPal/Razorpay keys). Webhook endpoints structured so real keys can be dropped in later.
- **Frontend**: **full migration** from Lumen API to repo backend (auth + photos + albums + cart + checkout + admin + favourites/orders/downloads).
- **Deploy repo's FastAPI backend**; viewing = free/no-login/always watermarked; download = login + paid order → original; admin bypasses all; free photos downloadable by logged-in users.
- **Admin seed**: `photosback15@gmail.com` / `gourabdas123` (role=admin, verified, active).
- **Database**: **PostgreSQL** (`postgresql+asyncpg://...`) — Render-managed Postgres for production; local dev via Docker Postgres.

## Reality check (important)

**Screenshots cannot be 100% prevented in a browser.** OS-level tools (Snipping Tool, screenshot shortcuts, screen recording, a phone camera) capture whatever is on screen — no web tech blocks those. What we CAN do is the industry standard:

1. **Server-side watermarking** — every image the browser receives is watermarked, so even a screenshot is visibly unusable for resale.
2. **Low-res previews** — originals are never sent to the browser pre-purchase; only watermarked, downscaled versions.
3. **Right-click / long-press / drag / save-as blocking** — deters casual copying.
4. **Payment-gated downloads** — original bytes are only served after login + verified paid order (admin bypasses).

## Current state (verified)

| Area | Now |
|---|---|
| Live backend | `photography-app-api.onrender.com` (Lumen API) — **code NOT in this repo**, serves full-res photos at predictable unauth URLs |
| Repo backend (`backend/`) | FastAPI with full models (users/orders/photos/downloads), pCloud storage, Pillow — **not deployed**, DB has 5 albums, **0 photos/users/orders** |
| Photo data | Lives in pCloud folder `32426733211` → `Kedarnath` (18), `Sikkim` (12), `manifest.json` (digest auth verified working) |
| Photo model | Stores **permanent public pCloud URLs** (`original_url`) — leaks bypass protection if exposed |
| Download flow | `download_service` issues 24h/5-use tokens but **never checks payment** |
| Payment flow | `order_service.handle_payment_success` exists; **no webhooks wired**; frontend checkout is mock |
| Frontend | Talks to Lumen API (`/auth/session`, `/photos/all`); no contextmenu/long-press protection; DownloadButton unwired; gallery detail page is mock data |

---

# EXECUTION PHASES

Each phase is self-contained: **Goal → Files → Tasks → Verification**. A phase is complete only when its verification passes. Phases are sequential unless marked "can parallelize".

---

## Phase 0 — Local dev environment: Postgres + backend boot

**Goal:** Get the repo backend running against Postgres locally so all later phases can be tested end-to-end.

**Files:** `backend/.env`, `backend/app/config.py`, `backend/app/api/deps.py`, `docker-compose.yml` (if not present), `backend/requirements.txt`

**Tasks:**
- [x] Start Postgres locally (Docker `postgres:16` with db `photoapp`, user `photoapp`, password from `.env`). — Docker not installed; installed native PostgreSQL 16 via winget, created `photoapp`/`photoapp123`.
- [x] Update `backend/.env`: `DATABASE_URL=postgresql+asyncpg://photoapp:photoapp123@localhost:5432/photoapp`, plus pCloud creds, JWT secret.
- [x] Verify `init_db()` (`create_all` + album seeding) runs on Postgres — check `deps.py` engine creation and the Postgres-specific models (UUID, ARRAY).
- [x] Run `python -m uvicorn app.main:app --port 8000`; hit `/health` and `/api/v1/albums`.

**Verification:**
- [x] `/health` → 200 `{"status":"ok"}`
- [x] `/api/v1/albums` → 200 with 5 seeded albums
- [x] No Postgres dialect errors on startup (UUID/ARRAY/Enum columns created)

---

## Phase 1 — Backend: stop leaking public pCloud URLs

**Goal:** Close the security hole where permanent public pCloud links reach the client.

**Files:** `backend/app/schemas/photo.py`, `backend/app/models/photo.py`, `backend/app/storage/pcloud.py`, `backend/app/api/v1/photos.py`, `backend/app/api/v1/uploads.py`

**Tasks:**
- [x] Add `download_file(file_id) -> bytes` to `PCloudStorage` (pCloud `file_open`/`file_read` via raw request, or `getfilelink` fetch — prefer server-side byte fetch). — uses `getfilelink` + optional `auth` param.
- [x] Change `PhotoResponse` to **remove** `original_url`/`thumbnail_url`; add `preview_url` and `download_url` (paths into new Phase 2 endpoints, not yet functional → return None until Phase 2). — `model_validator` builds `/api/v1/photos/{id}/preview|download`.
- [x] Keep `original_file_id`/`thumbnail_file_id` in DB (needed for byte fetch) but exclude from response.
- [x] Update `PhotoCreate`/`PhotoUpdate` schemas accordingly.
- [x] Fix any consumers of removed fields (tests, services). — removed columns from model + Postgres; fixed `image_processor.py`, `download_service.py`.

**Verification:**
- [x] `GET /api/v1/photos` (after Phase 3 seed) returns **no** `original_url` / `thumbnail_url` / `original_file_id` fields
- [x] `pcloud.download_file(file_id)` returns correct bytes for a known pCloud file

---

## Phase 2 — Backend: watermark service (Pillow)

**Goal:** Server-side watermarking that stamps `@Gourab_Das` across any image before it leaves the server.

**Files (new):** `backend/app/services/watermark_service.py`

**Tasks:**
- [x] `apply_watermark(img: Image) -> Image`: diagonal tiled semi-transparent `@Gourab_Das` text (rotated, repeated across canvas) + subtle center placement. — `alpha_composite` (paste was dropping alpha).
- [x] `make_preview(bytes) -> bytes`: downscale to max 1600px long edge, watermark, encode JPEG q≈80.
- [x] LRU cache (`functools.lru_cache` or small dict keyed `photo_id:size`) to avoid re-encoding per request. — dict LRU capped at 256.
- [x] Unit tests with a generated sample image (Pillow), assert output has watermark dimensions and is JPEG.

**Verification:**
- [x] `pytest` watermark tests pass — 3 passed.
- [x] Visual check: sample preview clearly shows `@Gourab_Das` across the image — diff mean 4.3–5.8 vs clean (12MB → 534KB).

---

## Phase 3 — Backend: protected image endpoints

**Goal:** `/preview` (public, watermarked) and `/download` (auth + entitlement) endpoints.

**Files:** `backend/app/api/v1/photos.py`, `backend/app/services/photo_service.py`, `backend/app/core/permissions.py`

**Tasks:**
- [x] `GET /api/v1/photos/{id}/preview` — **public**. Streams watermarked+downscaled bytes via `FileResponse`/`Response(content, media_type="image/jpeg")`. 404 if photo missing.
- [x] `GET /api/v1/photos/{id}/download` — auth (`get_current_user`):
  - admin → original bytes
  - `is_free` → original bytes
  - **paid** (paid Order + OrderItem for this photo, or admin) → original bytes
  - else → `403 {"detail": "Payment required"}`
  - Sets `Content-Disposition: attachment` with sanitized filename.
- [x] `GET /api/v1/photos/{id}/entitlement` — auth optional; returns `{purchased, is_free, is_admin}` (None user → all false unless is_free).
- [x] Add entitlement check helper in `photo_service` or new `entitlement_service.py` (query: `select OrderItem join Order where user_id=…, status='paid', photo_id=…`).
- [x] Update `PhotoResponse.preview_url`/`download_url` to point at these endpoints.

**Verification (curl):**
- [x] `GET /preview` no auth → 200, `image/jpeg`, contains watermark bytes (check file size/dimensions)
- [x] `GET /download` no auth → 401
- [x] `GET /download` auth as visitor (unpaid) → 403
- [x] `GET /download` auth as admin → 200 original bytes
- [x] `GET /entitlement` reflects correct states

---

## Phase 4 — Backend: payment gating in download service

**Goal:** Download tokens only issued after payment verification.

**Files:** `backend/app/services/download_service.py`, `backend/app/api/v1/downloads.py`, `backend/app/schemas/download.py`

**Tasks:**
- [x] `create_download_token`: accept `user: User` (not just id); enforce: admin bypass / `is_free` / paid order → else raise `ValueError("Payment required")`.
- [x] Route `POST /api/v1/downloads` → 403 on unpaid, else returns token (as today, 24h/5 downloads).
- [x] Keep `GET /api/v1/downloads/verify/{token}` behavior; ensure it still increments + returns original URL **only to the token holder** (or stream bytes directly — prefer returning original bytes via new `download_file`). — now streams original bytes directly.

**Verification:**
- [x] Unpaid user POST /downloads → 403
- [x] Paid user POST /downloads → token; verify token → original bytes streamed
- [x] Admin → token regardless of order

---

## Phase 5 — Backend: mock-pay + webhook scaffolds

**Goal:** Make the "paid" state reachable end-to-end without real payment keys.

**Files:** `backend/app/api/v1/orders.py`, `backend/app/api/v1/payments.py` (new), `backend/app/services/order_service.py`

**Tasks:**
- [x] `POST /api/v1/orders` — verify it creates pending order + items (exists; check cart requirement — may need `{photo_ids, provider}` payload support for direct order creation). — added `photo_ids` support; fixed OrderResponse items eager load.
- [x] New `POST /api/v1/orders/{id}/mock-pay` (auth, owner or admin) → sets order `paid` + `paid_at` via `order_service.handle_payment_success`-equivalent (bypasses provider). — `mark_paid()`.
- [x] Webhook scaffolds: `POST /api/v1/payments/stripe/webhook`, `/payments/paypal/webhook`, `/payments/razorpay/webhook` → call `handle_payment_success` (bodies parsed generically; real signature verification TODO).
- [x] Ensure `handle_payment_success` is wired (currently dead code).

**Verification (curl):**
- [x] Create order → status `pending`
- [x] mock-pay it → status `paid`, `paid_at` set
- [x] `/entitlement` for that photo now returns `purchased: true`
- [x] `/download` now returns 200 for that user
- [x] Webhook POST (stripe body) → order paid

---

## Phase 6 — Backend: pCloud import + seed script

**Goal:** Real photo data (Kedarnath, Sikkim) + admin user in Postgres.

**Files (new):** `backend/scripts/import_pcloud.py`; possibly `backend/app/utils/exif.py` tweaks

**Tasks:**
- [x] Script connects to pCloud folder `32426733211` (digest auth), walks `Kedarnath`/`Sikkim` subfolders.
- [x] For each file: fetch bytes, extract EXIF (`app/utils/exif.py`), create `Photo` with `original_file_id`/`thumbnail_file_id` (pCloud file IDs, **no public URLs**), `price=25`, `is_free=False`, `has_watermark=True`, title from filename, attach to matching album (map folder → album slug) or create.
- [x] Create admin `photosback15@gmail.com` / `gourabdas123` (role=admin, verified, active) + 1 test visitor user.
- [x] Idempotent (skip existing slugs).

**Verification:**
- [x] Run script → photos table has 30 rows; users has 2 — 30 photos, 2 users, rerun skips all 30.
- [x] `GET /api/v1/photos` returns items with `preview_url`/`download_url`, no leaked URLs
- [x] `GET /api/v1/photos/{id}/preview` shows watermarked Kedarnath photo

---

## Phase 7 — Frontend: API client migration (auth/photos/albums base)

**Goal:** Frontend speaks the repo backend's `/v1/*` API instead of Lumen.

**Files:** `frontend/.env.local`, `frontend/lib/api.ts`, `frontend/lib/constants.ts`, `frontend/hooks/useAuth.ts`, `frontend/providers/AuthProvider.tsx`, `frontend/hooks/usePhotos.ts`, `frontend/hooks/useAlbums.ts`, `frontend/app/(marketing)/gallery/page.tsx`

**Tasks:**
- [ ] `.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] Auth: `/auth/session` → `GET /v1/auth/me` (adjust response parsing: repo returns User directly, not `{session.user}`); login/register/refresh already match `/v1/auth/*` paths — verify payloads.
- [ ] Photos: `/photos/all` → `GET /v1/photos?page=&limit=` (paginated); map `PhotoResponse` fields (`thumbnail_url`→preview, etc.). Handle new `preview_url`.
- [ ] Albums: drop Lumen collection mapping; use `/v1/albums` (paginated) + `/v1/albums/featured` + `/v1/albums/{id}`; album detail photos via album's photos or `/v1/photos`.
- [ ] Gallery page: use `usePhotos`; delete inline `/photos/all` fetch + mock fallbacks.
- [ ] Auth store: keep tokens; add user role exposure.

**Verification:**
- [ ] Login with seeded admin → session persists, `/v1/auth/me` returns admin user
- [ ] Gallery shows real photos (watermarked previews)
- [ ] Albums page + detail show real albums
- [ ] `npm run lint` + `tsc --noEmit` clean

---

## Phase 8 — Frontend: ProtectedImage component + swap all `<Image>`s

**Goal:** Right-click / drag / long-press / save-as blocking everywhere.

**Files (new):** `frontend/components/photo/ProtectedImage.tsx`
**Files (edit):** `frontend/components/gallery/PhotoCard.tsx`, `frontend/components/gallery/PhotoLightbox.tsx`, `frontend/components/home/FeaturedPhotos.tsx`, `frontend/components/home/LatestUploads.tsx`, `frontend/components/home/PopularCollections.tsx`, `frontend/components/albums/AlbumCard.tsx`, `frontend/app/(marketing)/albums/[id]/page.tsx`, `frontend/app/(marketing)/exhibitions/[id]/page.tsx`, `frontend/app/(marketing)/gallery/[id]/page.tsx`

**Tasks:**
- [ ] `ProtectedImage`: wraps `next/image`; `onContextMenu` preventDefault, `onDragStart` preventDefault, `draggable={false}`, `onCopy` preventDefault; CSS `user-select:none; -webkit-user-drag:none; -webkit-touch-callout:none;`; invisible overlay div intercepting pointer/long-press; optional `blur` on `document.hidden`.
- [ ] Global `contextmenu` blocker while any lightbox is open (PhotoLightbox mount effect).
- [ ] Swap every photo `<Image>` for `ProtectedImage` (list above).
- [ ] Lightbox image URLs → `/v1/photos/{id}/preview` (watermarked); "Compare RAW"/zoom operate on preview.

**Verification:**
- [ ] Right-click on any photo → no context menu
- [ ] Drag → image doesn't drag (no ghost / no drop-copy)
- [ ] Mobile long-press → no save-image callout
- [ ] Lightbox images visibly watermarked

---

## Phase 9 — Frontend: DownloadButton + entitlement UI

**Goal:** Download requires login; paid/free/admin get original; unpaid get lock + CTA.

**Files:** `frontend/components/photo/DownloadButton.tsx`, `frontend/app/(marketing)/gallery/[id]/page.tsx`, `frontend/hooks/useAuth.ts` (role access), `frontend/lib/api.ts` (blob download helper)

**Tasks:**
- [ ] DownloadButton states: loading → not-logged-in (redirect `/login?next=`) → unpaid (lock + "Buy for $X" → cart) → available (download).
- [ ] Fetch `/v1/photos/{id}/entitlement` on detail page mount to decide state.
- [ ] Download: `GET /v1/photos/{id}/download` with Bearer → responseType blob → anchor click with filename.
- [ ] Replace mock photo detail page (`gallery/[id]`) with real `GET /v1/photos/{id}` data.

**Verification:**
- [ ] Logged-out → download button redirects to login
- [ ] Logged-in unpaid → lock + price, no download
- [ ] Admin logged in → download works, file opens
- [ ] After mock-pay → download works for that user

---

## Phase 10 — Frontend: real checkout (orders + mock-pay)

**Goal:** Checkout creates a real order and pays via sandbox.

**Files:** `frontend/components/checkout/CheckoutForm.tsx`, `frontend/hooks/useCart.ts`, `frontend/store/cartStore.ts`, `frontend/app/checkout/success/page.tsx`, `frontend/lib/validations.ts`

**Tasks:**
- [ ] Checkout submit → `POST /v1/orders` `{photo_ids, payment_provider}` (or cart payload backend expects) → order id.
- [ ] Call `POST /v1/orders/{id}/mock-pay` → success → clear cart → `/checkout/success`.
- [ ] Success page shows order summary + link back.
- [ ] Guard: checkout requires login (redirect).

**Verification:**
- [ ] Add paid photo to cart → checkout → order created → mock-pay → success
- [ ] `/v1/orders` shows the order (profile page next phase)
- [ ] Download now works for purchased photo

---

## Phase 11 — Frontend: remaining full migration (favourites/orders/profile/admin)

**Goal:** No Lumen API calls remain; admin pages functional.

**Files:** favourites pages/hooks, `frontend/app/(app)/profile/orders/page.tsx`, `frontend/app/(admin)/admin/*` (dashboard, photos, albums, categories, exhibitions, users, orders, downloads), `frontend/app/(marketing)/exhibitions/*` (repo `/v1/exhibitions`), `frontend/components/photo/RelatedPhotos.tsx`, `frontend/components/map/PhotoMap.tsx`

**Tasks:**
- [ ] Favourites: `/v1/favourites`, `/v1/favourites/toggle`, `/v1/favourites/check/{id}`; wire heart button in PhotoCard.
- [ ] Profile orders: `GET /v1/orders` list (replace EmptyState).
- [ ] Admin dashboard: `GET /v1/analytics/dashboard`.
- [ ] Admin CRUD pages → repo endpoints (photos PUT/DELETE, albums, categories, exhibitions, users role, orders, downloads list).
- [ ] Exhibitions pages → `/v1/exhibitions`, `/v1/exhibitions/published`.
- [ ] Grep for `/photos/all`, `/auth/session`, `collectionId` mapping → all removed.
- [ ] RelatedPhotos/PhotoMap → real photo data.

**Verification:**
- [ ] `grep -r "photos/all\|auth/session"` → zero matches
- [ ] Admin login → dashboard shows real analytics; CRUD works
- [ ] Favourites toggle persists via API
- [ ] `lint` + `tsc` clean

---

## Phase 12 — Deployment (Render + Postgres)

**Goal:** Repo backend live on Render with Postgres; frontend points at it.

**Files:** `backend/render.yaml` (new — mirror `photography_app-main/backend/render.yaml`), `backend/Dockerfile` (if needed), `frontend/.env.local` / Vercel env

**Tasks:**
- [ ] Create `backend/render.yaml`: web service `photoexhibit-api` (uvicorn start), Postgres DB `photoexhibit-db`.
- [ ] Env vars: `DATABASE_URL` (from Render DB), `JWT_SECRET`, `PCLOUD_EMAIL`, `PCLOUD_PASSWORD`, `PCLOUD_ACCESS_TOKEN`, `CORS_ORIGINS=[frontend URL]`, `DEBUG=false`.
- [ ] Push; deploy backend; run `import_pcloud.py` against prod DB (render shell or a `POST /api/v1/admin/seed` dev-only endpoint — decide at execution).
- [ ] Update frontend `NEXT_PUBLIC_API_URL` → Render backend URL; redeploy frontend.

**Verification:**
- [ ] `https://<backend>.onrender.com/api/v1/photos` → 200 watermarked previews, no leaked URLs
- [ ] Frontend login (admin) works against prod
- [ ] Download gating works on prod
- [ ] CORS allows frontend origin

---

## Phase 13 — End-to-end security verification

**Goal:** Prove the whole chain on production.

**Checklist:**
- [ ] Public previews always watermarked with `@Gourab_Das` (visually confirm + screenshot)
- [ ] No endpoint returns original pCloud URLs (grep response bodies)
- [ ] Right-click/long-press/drag blocked on all photo surfaces
- [ ] Unpaid + logged-in user: download → 403; UI shows lock
- [ ] Paid user: download → original file, correct content
- [ ] Admin: download bypasses payment
- [ ] Free photo: logged-in download works
- [ ] Mock-pay end-to-end: cart → order → mock-pay → entitlement flips → download unlocks
- [ ] Screenshot caveat documented in repo README (deterrence, not absolute)

---

# Execution order & dependencies

```
Phase 0 (env) ─► Phase 1 (no leaks) ─► Phase 2 (watermark)
                  │                        │
                  └────────► Phase 3 (endpoints) ─► Phase 4 (download gating)
                                       │
                  Phase 5 (mock-pay) ──┘        Phase 6 (seed) ─► Phase 7 (FE API migration)
                                                                        │
  Phase 8 (ProtectedImage) ─► Phase 9 (download UI) ─► Phase 10 (checkout) ─► Phase 11 (rest)
        │                                                                         │
        └─────────────────────────────────────────────────────────────────────► Phase 12 (deploy) ─► Phase 13 (verify)
```

- Phases 0–6 are backend-only and sequential.
- Phase 5 (mock-pay) can be started as soon as Phase 3's entitlement helper exists (parallel w/ Phase 4).
- Phases 7–11 are frontend; 7 must precede 8–11.
- Phase 12 only after Phase 11; Phase 13 is the final gate.

# Files to change (summary)

**Backend:** `storage/pcloud.py`, `schemas/photo.py`, `models/photo.py`, `services/watermark_service.py` (new), `services/download_service.py`, `services/photo_service.py`, `api/v1/photos.py`, `api/v1/downloads.py`, `api/v1/orders.py`, `api/v1/payments.py` (new), `scripts/import_pcloud.py` (new), `render.yaml` (new), tests.

**Frontend:** `.env.local`, `lib/api.ts`, `lib/constants.ts`, `hooks/useAuth.ts`, `hooks/usePhotos.ts`, `hooks/useAlbums.ts`, `components/photo/ProtectedImage.tsx` (new), `components/photo/DownloadButton.tsx`, `components/gallery/PhotoCard.tsx`, `components/gallery/PhotoLightbox.tsx`, `components/home/*`, `components/checkout/CheckoutForm.tsx`, `store/cartStore.ts`, `app/(marketing)/gallery/*`, `app/(marketing)/albums/*`, `app/(marketing)/exhibitions/*`, `app/(app)/profile/*`, `app/(admin)/admin/*`, favourites hooks/pages.
