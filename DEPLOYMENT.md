# Deployment Guide

This guide explains how to get the app fully working in production. The frontend (Next.js) is on **Vercel**, and the backend (FastAPI) must be deployed to **Render**.

> **Important:** The current backend URL `https://photography-app-api.onrender.com` is running an **old/different app**. It does not have the `/api/v1` routes (albums, exhibitions, etc.). You must deploy this repo's `backend/` folder to Render and point the frontend to the new URL.

---

## Step 1 — Push this code to GitHub

```bash
git add -A
git commit -m "fix: align frontend with /api/v1 backend"
git push origin main
```

---

## Step 2 — Deploy backend to Render

1. Go to [render.com](https://render.com) → **Dashboard** → **New** → **Web Service** → **Build and deploy from a Git repository**.
2. Select the repo `CaptainPrice15/photography_app`.
3. Configure the service:

   | Setting | Value |
   |---|---|
   | Root Directory | `backend` |
   | Build Command | `pip install -r requirements.txt` |
   | Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
   | Instance Type | Free |

4. Click **Create Web Service**.

> **Tip:** Keep the old service and create a new one — you'll get a fresh URL (e.g. `https://photography-app-api-xxxx.onrender.com`). Replacing the existing service is riskier.

---

## Step 3 — Add environment variables in Render

In the new service → **Environment** tab, add:

| Variable | Value |
|---|---|
| `JWT_SECRET` | Any random string, 32+ characters |
| `CORS_ORIGINS` | `["https://photography-app-q4be.vercel.app","http://localhost:3000"]` |
| `FRONTEND_URL` | `https://photography-app-q4be.vercel.app` |
| `PCLOUD_EMAIL` | From `backend/.env` |
| `PCLOUD_PASSWORD` | From `backend/.env` |
| `PCLOUD_ACCESS_TOKEN` | From `backend/.env` |
| `PCLOUD_FOLDER_ID` | From `backend/.env` |

Then click **Deploy**.

> The backend **auto-creates tables and seeds 5 sample albums on startup** — no manual migration is needed.

---

## Step 4 — (Recommended) Add a PostgreSQL database

Free Render services have an **ephemeral disk** — if the backend falls back to SQLite, data is lost on every restart. For persistent data:

1. In Render: **New** → **PostgreSQL** (Free).
2. Copy the **Internal Database URL** (looks like `postgresql://user:pass@host:port/dbname`).
3. Change the scheme prefix to `postgresql+asyncpg://...` and set it as the `DATABASE_URL` environment variable on the web service.
4. Redeploy the web service.

---

## Step 5 — Point the frontend to the new backend URL

Only needed if your new Render URL differs from `photography-app-api.onrender.com`:

1. Edit `frontend/.env.local`:

   ```
   NEXT_PUBLIC_API_URL=https://<your-new-render-url>
   ```

2. Commit and push:

   ```bash
   git add frontend/.env.local
   git commit -m "chore: update API URL"
   git push origin main
   ```

3. Vercel auto-deploys (or click **Redeploy** in the Vercel dashboard).

---

## Step 6 — Verify everything works

1. Open `https://<your-new-render-url>/docs` — you should see the Swagger UI with all `/api/v1` endpoints (auth, photos, albums, exhibitions, favourites, orders...).
2. Open your Vercel site and check:
   - Home page: featured photos, latest uploads, featured albums, exhibitions load from the backend.
   - `/gallery` page: photos load with search/filter/sort.
   - Login/register works.
   - No 404s in the browser console.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Backend returns 404 for `/api/v1/...` | The deployed app is not this repo's backend. Redo Steps 2–3. |
| CORS errors in browser console | Make sure `CORS_ORIGINS` includes your exact Vercel URL. |
| Photos missing after redeploy | Data was on ephemeral SQLite. Follow Step 4 (PostgreSQL). |
| Images return 400 on Vercel | Image file missing in `public/images/`. Check the path exists and redeploy. |

---

## Security Note

`backend/.env.example` contains what appear to be **real credentials** (pCloud token/password). After deployment:

- Rotate the pCloud credentials.
- Never commit real secrets to the repository.
