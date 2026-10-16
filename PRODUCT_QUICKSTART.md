# Quick Start: Managing Products

## TL;DR - How to Add/Edit Products

Your app shows **placeholder products** because the Medusa backend isn't running. To manage real products:

### 1. Start Medusa Backend

```bash
# Open a new terminal
cd commerce
npm install        # First time only
npm run dev
```

Wait for: `Server is ready on port: 9000`

### 2. Create Admin User (First Time Only)

```bash
# In the commerce directory
npx medusa user -e admin@yourdomain.com -p your_password
```

### 3. Access Admin Panel

Open in browser: **http://localhost:9000/app**

Login with your admin credentials.

### 4. Add Products

1. Click **"Products"** in sidebar
2. Click **"New Product"**
3. Fill in details (title, description, price)
4. Upload images
5. Click **"Publish Product"**

### 5. Connect Storefront

Update `.env.local`:
```env
MEDUSA_API_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=  # Get from Medusa Admin → Settings → Publishable API Keys
```

Restart your Next.js dev server:
```bash
npm run dev
```

Visit **http://localhost:3000** - you should now see your real products!

---

## Why Am I Seeing Placeholder Products?

The app has a **fallback system**:
- ✅ When Medusa is **running** → Shows real products from database
- ⚠️ When Medusa is **not running** → Shows placeholder products from `/lib/data/products.ts`

This allows the storefront to work standalone for demos.

---

## Full Guide

For detailed instructions, see: **PRODUCT_MANAGEMENT_GUIDE.md**

For deployment: **DEPLOYMENT.md**
