# 🚀 Complete Master Manual: Netlify + Supabase + Render Free Deployment

This manual provides complete step-by-step instructions to deploy **Engiverse Engineering Showcase** from zero to 100% FREE live deployment using **Supabase** (Database), **Render** (Backend API), **Netlify** (Frontend Website), and **GitHub** (Code Storage).

---

## 📊 Free Deployment Architecture Overview

```text
┌──────────────────────────────────┐
│   React Frontend Website         │
│   Hosted 100% FREE on NETLIFY    │
│   (https://engiverse.netlify.app)│
└──────────────────────────────────┘
                 │
                 │ API Requests (/api/v1/...)
                 ▼
┌──────────────────────────────────┐
│   Node.js Express Backend API    │
│   Hosted 100% FREE on RENDER     │
│   (https://engiverse-api.onrender)│
└──────────────────────────────────┘
                 │
                 │ SQL Queries (Bcrypt Hashed & Parameterized)
                 ▼
┌──────────────────────────────────┐
│   Supabase PostgreSQL Cloud DB   │
│   Hosted 100% FREE on SUPABASE   │
│   (500 MB Free Cloud Storage)    │
└──────────────────────────────────┘
```

---

## PHASE 1: Set Up Supabase Cloud Database (5 Mins)

1. **Sign Up**: Go to **[Supabase.com](https://supabase.com)** and sign up for free using GitHub or Email.
2. **Create Project**:
   - Click **+ New Project**.
   - **Project Name**: `engiverse-db`
   - **Database Password**: Set a strong password (e.g. `EngiverseCloudDB2026!`). Save this password!
   - **Region**: Choose `South Asia (Mumbai)` or the region closest to your users.
   - **Pricing Plan**: Free ($0/month).
   - Click **Create new project**.
3. **Execute 1-Click SQL Script**:
   - In Supabase Dashboard, click **SQL Editor** on the left menu (icon looks like `>_`).
   - Click **+ New query**.
   - Open **[server/supabase_schema.sql](file:///C:/Users/HP/.gemini/antigravity/scratch/engiverse-showcase/server/supabase_schema.sql)**, copy ALL SQL lines, paste into the SQL Editor, and click **RUN** (Green play button).
   - *Result*: All 8 database tables (`users`, `services`, `projects`, `trainer_kits`, `inquiries`, `site_config`, `audit_logs`, `refresh_tokens`) and sample seed data are created.
4. **Copy Database Connection String**:
   - Go to **Project Settings** (Gear icon at bottom left) -> **Database**.
   - Scroll down to **Connection String** -> Select **URI** tab.
   - Copy your URI string. It looks like:
     ```text
     postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
     ```
   - Replace `[YOUR-PASSWORD]` with your actual password set in step 2.

---

## PHASE 2: Push Code to GitHub (3 Mins)

1. Create a free account at **[GitHub.com](https://github.com)**.
2. Create a new repository named `engiverse-showcase`.
3. Open terminal in `C:\Users\HP\.gemini\antigravity\scratch\engiverse-showcase` and push your code:
   ```bash
   git init
   git add .
   git commit -m "Engiverse Netlify & Supabase Release"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/engiverse-showcase.git
   git push -u origin main
   ```

---

## PHASE 3: Deploy Backend API to Render.com (5 Mins)

1. Go to **[Render.com](https://render.com)** and sign up with GitHub.
2. Click **New +** -> Select **Web Service**.
3. Connect your `engiverse-showcase` GitHub repository.
4. Fill in service parameters:
   - **Name**: `engiverse-backend-api`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Instance Type**: `Free`
5. Add **Environment Variables** under *Advanced*:
   - `SUPABASE_DB_URL`: Paste your Supabase URI from Phase 1.
   - `JWT_SECRET`: `engiverse_super_secret_jwt_key_2026`
   - `NODE_ENV`: `production`
6. Click **Create Web Service**. Render will build your server and provide your API URL (e.g. `https://engiverse-backend-api.onrender.com`).
7. **Create Admin User in Supabase**:
   - In Render Dashboard, click your `engiverse-backend-api` service.
   - Click **Shell** (Terminal tab on the left).
   - Run the admin creation command:
     ```bash
     npx ts-node src/scripts/createAdmin.ts engiverse_lead chaitanyasoni40@gmail.com Engiverse@2026! "Super Admin"
     ```

---

## PHASE 4: Deploy Frontend Website to Netlify (5 Mins)

1. Go to **[Netlify.com](https://netlify.com)** and sign up with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Select your `engiverse-showcase` GitHub repository.
4. Configure Netlify build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Click **Deploy engiverse-showcase**.

---

## PHASE 5: Configure Netlify API Proxying & Rewrites

To make Netlify route `/api/v1/*` requests directly to your Render backend API:

1. Create a `_redirects` file in `client/public/_redirects`:
   ```text
   /api/*  https://engiverse-backend-api.onrender.com/api/:splat  200
   /*      /index.html                                            200
   ```
2. Commit and push to GitHub:
   ```bash
   git add client/public/_redirects
   git commit -m "Add Netlify redirects rule"
   git push origin main
   ```
Netlify will automatically re-deploy in ~30 seconds.

---

## 🎉 FINAL RESULT

- **Public Website URL**: `https://engiverse-showcase.netlify.app`
- **Hidden Admin Panel URL**: `https://engiverse-showcase.netlify.app/admin`
- **Admin Username**: `engiverse_lead`
- **Admin Password**: `Engiverse@2026!`
- **Database**: 100% Free Supabase Cloud PostgreSQL (visual editing via Supabase Dashboard Table Editor).
- **Uptime**: **100% Online 24/7/365** with zero manual server management!
