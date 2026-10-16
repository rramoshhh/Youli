# Youli-Next

The repository publishes a live storefront demo through GitHub Pages on every push to `main`. The demo includes the full catalog, product and collection routes, and a browser-saved cart and checkout walkthrough. Open the latest `github-pages` deployment from the repository's **Deployments** section.

Youli-Next is a Next.js storefront intended to work with a Medusa commerce backend and a Strapi CMS. The storefront can run standalone with fallback content when those services are not configured.

## Table of Contents
- [Requirements](#requirements)
- [Quick Start (Development)](#quick-start-development)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
- [Deployment Platforms](#deployment-platforms)
- [Scripts Reference](#scripts-reference)
- [Repository Layout](#repository-layout)

---

## Requirements

- **Node.js 20+** (required for `cms` and `commerce`, recommended for the whole repo)
- **npm 10+**
- **PostgreSQL** (recommended for production Medusa deployment)
- **SQLite** (default for development, included with Strapi and Medusa)

---

## Quick Start (Development)

### 1. Storefront Only (Next.js)
```bash
npm install
cp .env.local.example .env.local  # Create if doesn't exist
npm run dev
```
Open `http://localhost:3000`

### 2. Commerce Backend (Medusa) – Optional
```bash
cd commerce
npm install
# Configure environment variables (see commerce/.env.template)
npm run dev
```
Runs on `http://localhost:9000`

### 3. CMS (Strapi) – Optional
```bash
cd cms
npm install
# Configure environment variables (see cms/.env.example)
npm run develop
```
Runs on `http://localhost:1337`

---

## Environment Variables

### Storefront (`.env.local`)
If these are not set, the storefront uses fallback products and pages.

```env
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Medusa Commerce Backend
MEDUSA_API_URL=http://localhost:9000
MEDUSA_PUBLISHABLE_KEY=your_medusa_publishable_key

# Strapi CMS
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token
```

### Commerce Backend (`commerce/.env`)
```env
# Database (PostgreSQL recommended for production)
DATABASE_URL=postgres://user:password@localhost:5432/medusa_db
# Or SQLite for development
# DATABASE_URL=sqlite://./data/medusa.db

# Redis (required for production)
REDIS_URL=redis://localhost:6379

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your_jwt_secret_here

# Cookie Secret (generate with: openssl rand -base64 32)
COOKIE_SECRET=your_cookie_secret_here

# Admin CORS (adjust for your domain)
ADMIN_CORS=http://localhost:7001,http://localhost:9000

# Store CORS (adjust for your storefront domain)
STORE_CORS=http://localhost:3000

# Backend URL
MEDUSA_BACKEND_URL=http://localhost:9000
```

### CMS (`cms/.env`)
```env
# Server
HOST=0.0.0.0
PORT=1337

# Secrets (generate with: openssl rand -base64 32)
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

# Database (SQLite for development, PostgreSQL for production)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# For PostgreSQL in production:
# DATABASE_CLIENT=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=strapi
# DATABASE_USERNAME=strapi
# DATABASE_PASSWORD=your_password
# DATABASE_SSL=false
```

---

## Production Deployment

### Overview
To deploy Youli-Next to a production server, you need to:
1. Build and deploy the **Next.js storefront**
2. Deploy the **Medusa commerce backend**
3. Deploy the **Strapi CMS**
4. Configure a **reverse proxy** (nginx/Apache)
5. Set up **process management** (PM2/systemd)
6. Configure **databases** (PostgreSQL recommended)

---

### 1. Deploying the Next.js Storefront

#### Build for Production
```bash
# In the root directory
npm install --production=false
npm run build
```

#### Start Production Server
```bash
npm run start
```
The app runs on port 3000 by default.

#### Environment Variables for Production
Update `.env.local` with production URLs:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
MEDUSA_API_URL=https://api.yourdomain.com
MEDUSA_PUBLISHABLE_KEY=pk_production_key
STRAPI_API_URL=https://cms.yourdomain.com
STRAPI_API_TOKEN=production_token
```

---

### 2. Deploying Medusa Commerce Backend

#### Prerequisites
- PostgreSQL database
- Redis server

#### Setup Database
```bash
# Create PostgreSQL database
sudo -u postgres psql
CREATE DATABASE medusa_db;
CREATE USER medusa_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE medusa_db TO medusa_user;
\q
```

#### Build and Start
```bash
cd commerce
npm install --production=false
npm run build

# Run migrations
npx medusa db:migrate

# Seed initial data (optional)
npm run seed

# Start production server
npm run start
```
Runs on port 9000 by default.

#### Create Admin User
```bash
npx medusa user -e admin@yourdomain.com -p your_secure_password
```

---

### 3. Deploying Strapi CMS

#### Setup Database (PostgreSQL for production)
```bash
# Create PostgreSQL database
sudo -u postgres psql
CREATE DATABASE strapi_db;
CREATE USER strapi_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE strapi_db TO strapi_user;
\q
```

#### Build and Start
```bash
cd cms
npm install --production=false

# Update .env with PostgreSQL settings
npm run build

# Start production server
npm run start
```
Runs on port 1337 by default.

---

### 4. Process Management with PM2

Install PM2 globally:
```bash
npm install -g pm2
```

#### Create PM2 Ecosystem File
Create `ecosystem.config.js` in the project root:

```javascript
module.exports = {
  apps: [
    {
      name: 'youli-storefront',
      cwd: '/path/to/Youli-Next',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'medusa-backend',
      cwd: '/path/to/Youli-Next/commerce',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 9000
      }
    },
    {
      name: 'strapi-cms',
      cwd: '/path/to/Youli-Next/cms',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      }
    }
  ]
};
```

#### Start All Services
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions to enable auto-start on boot
```

#### PM2 Commands
```bash
pm2 status              # Check status
pm2 logs                # View logs
pm2 restart all         # Restart all apps
pm2 stop all            # Stop all apps
pm2 delete all          # Remove all apps
```

---

### 5. Nginx Reverse Proxy Configuration

Install nginx:
```bash
sudo apt update
sudo apt install nginx
```

#### Create nginx Configuration
Create `/etc/nginx/sites-available/youli-next`:

```nginx
# Storefront
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Medusa API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Strapi CMS
server {
    listen 80;
    server_name cms.yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Enable Configuration
```bash
sudo ln -s /etc/nginx/sites-available/youli-next /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL with Let's Encrypt (Recommended)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d cms.yourdomain.com
```

---

## Deployment Platforms

### Vercel (Storefront Only)
Best for Next.js storefront deployment:

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Configure environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

**Note:** You'll still need to deploy Medusa and Strapi separately on a VPS or other platform.

### Railway / Render / DigitalOcean
These platforms support all three components:

1. Create separate services for:
   - Next.js storefront
   - Medusa backend
   - Strapi CMS
2. Add PostgreSQL and Redis databases
3. Configure environment variables
4. Connect your GitHub repository for auto-deployment

### Docker Deployment
Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: youli
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: youli_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  medusa:
    build:
      context: ./commerce
      dockerfile: Dockerfile
    depends_on:
      - postgres
      - redis
    environment:
      DATABASE_URL: postgres://youli:secure_password@postgres:5432/youli_db
      REDIS_URL: redis://redis:6379
    ports:
      - "9000:9000"

  strapi:
    build:
      context: ./cms
      dockerfile: Dockerfile
    depends_on:
      - postgres
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: youli_db
      DATABASE_USERNAME: youli
      DATABASE_PASSWORD: secure_password
    ports:
      - "1337:1337"

  storefront:
    build:
      context: .
      dockerfile: Dockerfile
    depends_on:
      - medusa
      - strapi
    environment:
      MEDUSA_API_URL: http://medusa:9000
      STRAPI_API_URL: http://strapi:1337
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

---

## Scripts Reference

### Storefront Scripts
- `npm run dev` – Start development server
- `npm run build` – Create production build
- `npm run start` – Start production server
- `npm run lint` – Run ESLint

### Commerce (Medusa) Scripts
- `npm run dev` – Start development server with auto-reload
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run seed` – Seed database with sample data

### CMS (Strapi) Scripts
- `npm run develop` – Start development server
- `npm run build` – Build admin panel
- `npm run start` – Start production server
- `npm run deploy` – Deploy to Strapi Cloud

---

## Repository Layout

```
Youli-Next/
├── app/                    # Next.js App Router pages and layouts
├── components/             # Reusable UI components
├── lib/                    # Data clients and shared utilities
│   └── clients/           # API integrations (Medusa, Strapi)
├── commerce/              # Medusa backend
│   ├── src/              # Medusa source code
│   └── README.md         # Medusa-specific documentation
├── cms/                   # Strapi CMS
│   ├── src/              # Strapi source code
│   └── README.md         # Strapi-specific documentation
├── public/                # Static assets
├── .env.local            # Storefront environment variables
├── next.config.mjs       # Next.js configuration
├── package.json          # Storefront dependencies
└── guidelines.md         # Project conventions and architecture

```

---

## Notes

- **Storefront integrations** live in `lib/clients/*`
- **Project conventions** and architecture rules are documented in `guidelines.md`
- For **Medusa-specific** documentation, see `commerce/README.md`
- For **Strapi-specific** documentation, see `cms/README.md`
- **Database migrations** should be run before starting production servers
- **Backup your databases** regularly in production
- Use **environment-specific** `.env` files (never commit secrets to git)

---

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Medusa Documentation](https://docs.medusajs.com)
- [Strapi Documentation](https://docs.strapi.io)
- [PM2 Documentation](https://pm2.keymetrics.io)
- [Nginx Documentation](https://nginx.org/en/docs)
