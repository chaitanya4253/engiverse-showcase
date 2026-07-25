# ⚡ Engiverse - 100% Free Supabase Cloud Database Setup Guide

This guide provides step-by-step instructions to connect **Engiverse Engineering Showcase** to **Supabase Cloud PostgreSQL** (100% Free Forever, 500 MB Database + Visual Admin UI).

---

## 🛠️ Step-by-Step Supabase Setup (5 Minutes)

### Step 1: Create a Free Supabase Account & Project
1. Go to **[Supabase.com](https://supabase.com)** and click **Start your project**.
2. Log in with GitHub or Email.
3. Click **+ New Project**.
4. Fill in:
   - **Name**: `engiverse-db`
   - **Database Password**: Create a strong password (save this password!).
   - **Region**: Choose the closest region to your users (e.g. `South Asia (Mumbai)`).
   - **Pricing Plan**: Free ($0/month).
5. Click **Create new project** (Supabase will take ~1 minute to provision your database).

---

### Step 2: Create All Database Tables (1-Click SQL Script)
1. In your Supabase Dashboard, click **SQL Editor** on the left menu (icon looks like `>_`).
2. Click **+ New query**.
3. Open the file [server/supabase_schema.sql](file:///C:/Users/HP/.gemini/antigravity/scratch/engiverse-showcase/server/supabase_schema.sql) in your project code, copy all SQL lines, and paste them into the Supabase SQL Editor.
4. Click **Run** (Green play button).

🎉 **Result**: All 8 database tables (`users`, `services`, `projects`, `trainer_kits`, `inquiries`, `site_config`, `audit_logs`, `refresh_tokens`) and sample seed data are created instantly!

---

### Step 3: Copy Your Supabase Database Connection String
1. In Supabase Dashboard, click **Project Settings** (Gear icon at the bottom left) -> **Database**.
2. Scroll down to **Connection String** -> Select **URI** tab.
3. Copy your URI string. It looks like this:
   ```text
   postgres://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```
4. Replace `[YOUR-PASSWORD]` with the actual database password you set in **Step 1**.

---

### Step 4: Add Supabase URL to `server/.env`
Open `server/.env` in your code and add your Supabase URI string:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=engiverse_super_secret_jwt_key_9405456978_8010895511_8788705811
CLIENT_URL=http://localhost:5173

# Paste your Supabase Connection URI here:
SUPABASE_DB_URL=postgres://postgres.yourref:YourPassword@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

---

### Step 5: Create Super Admin Account in Supabase
Run the admin creation tool inside the `server/` directory:

```bash
cd server
npm run create-admin
```
*(Or run non-interactively)*:
```bash
npx ts-node src/scripts/createAdmin.ts engiverse_lead chaitanyasoni40@gmail.com Engiverse@2026! "Super Admin"
```

---

### Step 6: Launch Backend & Enjoy 24/7 Supabase Cloud Sync!
Start your server:
```bash
npm run dev
```

You will see terminal output:
```text
⚡ Connecting to Supabase Cloud PostgreSQL Database...
✅ Supabase PostgreSQL Pool initialized.
====================================================
⚡ Engiverse Backend Server Live on port 5000
🔒 Security Hardened: OWASP Top 10 Aligned
====================================================
```

---

## 📊 Viewing Data in Supabase Visual Dashboard
In your Supabase Dashboard, click **Table Editor** on the left menu to view, edit, or search your live database tables (`inquiries`, `services`, `projects`, `users`, `audit_logs`) visually with point-and-click ease!
