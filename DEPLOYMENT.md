# 🚀 Engiverse Deployment Manual (Free & Paid Options)

This manual provides complete step-by-step instructions for deploying **Engiverse Engineering Showcase** using either **100% FREE Cloud Services** or a **PAID Linux VPS Server**.

---

## 🆓 OPTION 1: 100% FREE DEPLOYMENT
*(Netlify + Render.com + GitHub)*

In this setup, your React frontend (`client/`) is hosted on **Netlify** for free, and your Node.js Express backend (`server/`) is hosted on **Render.com** for free.

---

### Step 1: Upload Code to GitHub
1. Create a free account at [GitHub.com](https://github.com).
2. Create a new repository named `engiverse-showcase`.
3. Open terminal in `C:\Users\HP\.gemini\antigravity\scratch\engiverse-showcase` and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial Engiverse Release"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/engiverse-showcase.git
   git push -u origin main
   ```

---

### Step 2: Deploy Backend Server to Render.com (FREE)
1. Go to [Render.com](https://render.com) and sign up with GitHub.
2. Click **New +** -> Select **Web Service**.
3. Connect your `engiverse-showcase` repository.
4. Configure service settings:
   - **Name**: `engiverse-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/index.js`
   - **Instance Type**: `Free`
5. Click **Create Web Service**.
6. Render will build your server and provide a free URL (e.g., `https://engiverse-backend.onrender.com`).

---

### Step 3: Create Admin Account on Render Backend
1. In Render Dashboard, click your `engiverse-backend` service.
2. Click **Shell** (Terminal tab on the left).
3. Run the admin creation script directly in Render shell:
   ```bash
   npx ts-node src/scripts/createAdmin.ts engiverse_lead chaitanyasoni40@gmail.com Engiverse@2026! "Super Admin"
   ```

---

### Step 4: Deploy Frontend Website to Netlify (FREE)
1. Go to [Netlify.com](https://netlify.com) and log in with GitHub.
2. Click **Add new site** -> **Import an existing project**.
3. Select your `engiverse-showcase` repository.
4. Set site build configuration:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/dist`
5. Click **Deploy engiverse-showcase**.

🎉 **Your website is live 24/7 for FREE at `https://your-site.netlify.app`!**

---
---

## 💳 OPTION 2: PAID VPS DEPLOYMENT
*(Hostinger / DigitalOcean VPS + Nginx + PM2 + SSL + Custom Domain)*

In this setup, your entire website, backend server, SQLite database, and custom domain (`engiverse.com` or `engiverse.in`) are hosted on a single high-speed Linux VPS ($3 to $5/month).

---

### Step 1: Buy VPS & Point Domain Name
1. Buy a basic Linux Ubuntu VPS (e.g. Hostinger KVM 1 or DigitalOcean Droplet).
2. Note your VPS IP address (e.g. `123.45.67.89`).
3. Go to your Domain Registrar (Hostinger / GoDaddy / Namecheap) and edit **DNS Records**:
   - **Type A**: `@` -> Point to `123.45.67.89`
   - **Type A**: `www` -> Point to `123.45.67.89`

---

### Step 2: Connect to Server via SSH
Open terminal on your computer and connect to your server:
```bash
ssh root@123.45.67.89
```
*(Enter your server password when prompted)*.

---

### Step 3: Install Node.js, Git, PM2 & Nginx
Run these commands on the server:
```bash
# Update server packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 & Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx certbot python3-certbot-nginx

# Install PM2 Process Manager globally
sudo npm install -g pm2
```

---

### Step 4: Clone Code & Build Applications
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/engiverse-showcase.git /var/www/engiverse
cd /var/www/engiverse

# 1. Build Backend Server
cd server
npm install
npm run build

# Create Admin Account directly in VPS database
npx ts-node src/scripts/createAdmin.ts engiverse_lead chaitanyasoni40@gmail.com Engiverse@2026! "Super Admin"

# 2. Build Frontend Website
cd ../client
npm install
npm run build
```

---

### Step 5: Start 24/7 Auto-Restart Server with PM2
```bash
cd /var/www/engiverse/server

# Start backend server with PM2
pm2 start dist/index.js --name "engiverse-backend"

# Configure 24/7 auto-reboot persistence
pm2 startup
pm2 save
```

---

### Step 6: Configure Nginx & Free SSL Certificate (`https://`)
1. Create Nginx site configuration:
   ```bash
   nano /etc/nginx/sites-available/engiverse
   ```
2. Paste the following configuration (replace `yourdomain.com` with your actual domain):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;

       # Serve Frontend Static Build
       location / {
           root /var/www/engiverse/client/dist;
           index index.html;
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to Node Backend
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
3. Enable configuration and restart Nginx:
   ```bash
   ln -s /etc/nginx/sites-available/engiverse /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```
4. Enable FREE SSL Certificate (`https://` padlock):
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

---

### 🎉 Final Result
- **Public Site**: `https://yourdomain.com`
- **Hidden Admin Panel**: `https://yourdomain.com/admin`
- **Uptime**: **100% Online 24/7/365** with auto-restart on server reboot!
