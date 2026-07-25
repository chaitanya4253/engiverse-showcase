# ⚡ Engiverse Engineering Showcase - Complete Manual & Installation Guide

A production-ready, OWASP Top 10 security-hardened full-stack platform for **Engiverse Engineering Showcase**. Featuring custom local business web development services, website management, engineering & diploma projects, electronics trainer kits ("Coming Soon"), and a hidden Admin Panel at `/admin`.

---

## 📌 Quick Summary of Features

- **Cyber-Futuristic Frontend**: Interactive circuit grid canvas, glassmorphism design system, mobile-first responsive layout, and dark cyber theme (`#030712`).
- **Hidden Admin Panel (`/admin`)**: Excluded from public site navigation. Accessible via direct URL with content management tabs for services, projects, trainer kits, site settings, and security audit logs.
- **Embedded SQLite Database**: Self-contained SQLite database with auto-created tables and parameterized queries preventing SQL injection. No separate database server installation needed!
- **OWASP Security Compliance**: Helmet security headers, HttpOnly SameSite JWT cookies, Bcrypt password hashing (cost factor 12), rate limiting, input sanitization, and immutable audit logs.

---

## 🛠️ Step-by-Step Installation & Setup Manual

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **NPM**: v9.0.0 or higher (v10.x included with Node)

---

### Step 1: Open Project Directory
Navigate to the project root directory:
```bash
cd C:\Users\HP\.gemini\antigravity\scratch\engiverse-showcase
```

---

### Step 2: Set Up Backend Server (`server/`)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Verify environment configuration (`.env` file):
   Create or verify `.env` file in the `server/` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=engiverse_super_secret_jwt_key_9405456978_8010895511_8788705811
   CLIENT_URL=http://localhost:5173
   DATABASE_FILE=./engiverse.sqlite
   ```

4. Build the TypeScript backend:
   ```bash
   npm run build
   ```

---

### Step 3: Create Admin User in Database

Admin user registration via the public website is disabled for security. Create your admin user directly in the database using our CLI tool:

#### Interactive Method:
```bash
npm run create-admin
```
Follow the on-screen prompts for Username, Email, and Password.

#### One-Line Non-Interactive Method:
```bash
npx ts-node src/scripts/createAdmin.ts engiverse_lead chaitanyasoni40@gmail.com Engiverse@2026! "Super Admin"
```

> **Security Password Policy**: Passwords must be at least 12 characters long and contain uppercase, lowercase, numbers, and special characters.

---

### Step 4: Start Backend Server

Run the development backend server:
```bash
npm run dev
```
*(Or run `npm start` for production server).*

The backend API will start on **`http://localhost:5000`** and auto-initialize the SQLite database at `server/engiverse.sqlite`.

---

### Step 5: Set Up Frontend Client (`client/`)

Open a **new terminal window** and run:

1. Navigate to the `client` directory:
   ```bash
   cd C:\Users\HP\.gemini\antigravity\scratch\engiverse-showcase\client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The website will be live at **`http://localhost:5173`**!

---

## 🔑 How to Access & Manage Website Content

### 1. Access Public Website
Open [http://localhost:5173](http://localhost:5173) in your web browser.

### 2. Access Hidden Admin Panel
Navigate directly to **[http://localhost:5173/admin](http://localhost:5173/admin)**.

- Enter your admin credentials created in **Step 3**:
  - **Username**: `engiverse_lead`
  - **Password**: `Engiverse@2026!`

### 3. Modifying Website Details from Admin Panel:
Once logged in, click through the tabs on the left sidebar:
- **Site Config & Details Tab**: Update site headline, hero subtitle, phone numbers (`9405456978`, `8010895511`, `8788705811`), email addresses (`chaitanyasoni40@gmail.com`, `pratikdeore917@gmail.com`), and Instagram link (`@engiverse_59`).
- **Services Tab**: Add new services or modify existing service descriptions & pricing.
- **Diploma & Degree Projects Tab**: Add new engineering showcase projects with images, categories, and tech stack tags.
- **Electronics Trainer Kits Tab**: Manage upcoming hardware trainer kits and pre-order waitlists.
- **Client Inquiries Tab**: View lead inquiries submitted by visitors from the website contact forms.
- **Audit Logs Tab**: Inspect security audit events, IP addresses, and user activity timestamps.

---

## 🗄️ Database Architecture (`engiverse.sqlite`)

The database uses SQLite, which requires zero separate server installation. The file is saved at `server/engiverse.sqlite`.

### Table Schemas:
1. `users`: Stores admin accounts with Bcrypt hashed passwords, roles (`Super Admin`, `Admin`, `Editor`), and last login timestamps.
2. `services`: Website development & web management service packages.
3. `projects`: Engineering & diploma project showcase portfolio.
4. `trainer_kits`: Electronics trainer hardware kits & waitlists.
5. `inquiries`: Client contact form submissions.
6. `site_config`: Global site settings (phones, emails, Instagram, hero banner text, theme colors).
7. `audit_logs`: Immutable security audit trail recording IP address, user agent, timestamp, action, and severity level.
8. `refresh_tokens`: Session refresh tokens.

---

## 🔒 Security Checklist & OWASP Best Practices

- [x] **No Default Credentials**: Initial admin created via direct database CLI script only.
- [x] **Password Hashing**: Bcrypt cost factor 12.
- [x] **Parameterized SQL Queries**: SQLite prepared statements prevent SQL Injection.
- [x] **Helmet Security Headers**: Strict CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`.
- [x] **Rate Limiting**: Limits failed login attempts (5 per 15 min window) and API requests.
- [x] **Input Sanitization**: `sanitize-html` removes XSS script tags from forms.
- [x] **JWT Security**: HttpOnly, SameSite=Strict cookies prevent token theft.

---

## 🚀 Production Deployment Guide

To deploy this application to a production server (VPS / Linux / AWS / Cloud):

1. **Build Client**:
   ```bash
   cd client
   npm run build
   ```
   *(Produces optimized static assets in `client/dist/`)*.

2. **Build Server**:
   ```bash
   cd server
   npm run build
   ```

3. **Run with PM2 / Process Manager**:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name "engiverse-backend"
   ```

4. **Nginx Reverse Proxy**:
   Point Nginx to serve `client/dist/` for static assets and proxy `/api/` requests to `http://localhost:5000`.
