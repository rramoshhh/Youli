# Youli-Next Deployment Summary

## 📋 Overview

This document provides a quick reference for deploying the Youli-Next e-commerce platform. For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 🏗️ Architecture

The Youli-Next platform consists of three main components:

1. **Next.js Storefront** (Port 3000) - Customer-facing e-commerce website
2. **Medusa Backend** (Port 9000) - Commerce API and admin panel
3. **Strapi CMS** (Port 1337) - Content management system

## 📦 What's Included

### Configuration Files
- ✅ `ecosystem.config.js` - PM2 process manager configuration
- ✅ `docker-compose.yml` - Docker orchestration configuration
- ✅ `.env.docker.example` - Docker environment template
- ✅ `Dockerfile` - Next.js storefront Docker image
- ✅ `commerce/Dockerfile` - Medusa backend Docker image
- ✅ `cms/Dockerfile` - Strapi CMS Docker image
- ✅ `.dockerignore` - Docker build optimization (all components)
- ✅ `.gitignore` - Git ignore rules for sensitive files

### Documentation
- ✅ `README.md` - Updated with deployment overview
- ✅ `DEPLOYMENT.md` - Comprehensive deployment guide
- ✅ `DEPLOYMENT_CHECKLIST.md` - Step-by-step deployment checklist
- ✅ `quick-start.sh` - Interactive setup script for local development

## 🚀 Quick Deployment Options

### Option 1: Traditional Server (PM2)

**Best for:** VPS, dedicated servers, full control

```bash
# 1. Setup server (Ubuntu 22.04)
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql redis-server nginx

# 2. Clone and setup
git clone <your-repo> /var/www/youli-next
cd /var/www/youli-next

# 3. Configure environment files
# Edit .env.local, commerce/.env, cms/.env

# 4. Build and deploy
npm install && npm run build
cd commerce && npm install && npm run build && npx medusa db:migrate
cd ../cms && npm install && npm run build

# 5. Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save && pm2 startup

# 6. Configure nginx and SSL
# See DEPLOYMENT.md for nginx configuration
```

**Time to deploy:** ~30-45 minutes

### Option 2: Docker

**Best for:** Containerized environments, easy scaling

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Clone and setup
git clone <your-repo> /var/www/youli-next
cd /var/www/youli-next

# 3. Configure environment
cp .env.docker.example .env
# Edit .env with your values

# 4. Deploy
docker compose build
docker compose up -d
docker compose exec medusa npx medusa db:migrate

# 5. Configure nginx and SSL
# See DEPLOYMENT.md for nginx configuration
```

**Time to deploy:** ~20-30 minutes

### Option 3: Platform as a Service

**Best for:** Quick deployment, managed infrastructure

#### Vercel (Storefront only)
```bash
npm i -g vercel
vercel
```

#### Railway / Render / DigitalOcean App Platform
1. Connect GitHub repository
2. Create 3 services (Storefront, Medusa, Strapi)
3. Add PostgreSQL and Redis databases
4. Configure environment variables
5. Deploy

**Time to deploy:** ~15-20 minutes

## 🔑 Required Environment Variables

### Storefront
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
MEDUSA_API_URL=https://api.yourdomain.com
MEDUSA_PUBLISHABLE_KEY=pk_xxx
STRAPI_API_URL=https://cms.yourdomain.com
STRAPI_API_TOKEN=xxx
```

### Medusa
```env
DATABASE_URL=postgres://user:pass@host:5432/medusa_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=xxx
COOKIE_SECRET=xxx
MEDUSA_BACKEND_URL=https://api.yourdomain.com
ADMIN_CORS=https://api.yourdomain.com
STORE_CORS=https://yourdomain.com
```

### Strapi
```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=xxx
DATABASE_PASSWORD=xxx
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=xxx
ADMIN_JWT_SECRET=xxx
TRANSFER_TOKEN_SALT=xxx
JWT_SECRET=xxx
```

**Generate secrets:** `openssl rand -base64 32`

## 📊 Resource Requirements

### Minimum (Development/Testing)
- **CPU:** 2 cores
- **RAM:** 4GB
- **Storage:** 20GB SSD
- **Bandwidth:** 1TB/month

### Recommended (Production)
- **CPU:** 4 cores
- **RAM:** 8GB
- **Storage:** 50GB SSD
- **Bandwidth:** 2TB/month

### High Traffic (Enterprise)
- **CPU:** 8+ cores
- **RAM:** 16GB+
- **Storage:** 100GB+ SSD
- **Bandwidth:** 5TB+/month
- **Load Balancer:** Recommended
- **CDN:** Recommended (Cloudflare, AWS CloudFront)

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong secrets (use `openssl rand -base64 32`)
- [ ] Configure firewall (ports 22, 80, 443 only)
- [ ] Setup SSL certificates (Let's Encrypt)
- [ ] Configure CORS properly
- [ ] Use environment variables (never commit secrets)
- [ ] Setup automated backups
- [ ] Enable fail2ban for SSH protection
- [ ] Regular security updates
- [ ] Monitor logs for suspicious activity

## 🛠️ Post-Deployment Tasks

1. **Create Admin Users**
   ```bash
   # Medusa
   npx medusa user -e admin@yourdomain.com -p password
   
   # Strapi - visit https://cms.yourdomain.com/admin
   ```

2. **Configure Services**
   - Access Medusa Admin: `https://api.yourdomain.com/app`
   - Access Strapi Admin: `https://cms.yourdomain.com/admin`
   - Add products, content, and configure settings

3. **Setup Backups**
   ```bash
   # Daily database backups at 2 AM
   0 2 * * * /usr/local/bin/backup-youli.sh
   ```

4. **Monitor Services**
   ```bash
   # PM2
   pm2 status
   pm2 logs
   
   # Docker
   docker compose ps
   docker compose logs -f
   ```

## 🐛 Troubleshooting

### Service Not Starting
```bash
# Check logs
pm2 logs <service-name>
# or
docker compose logs <service-name>

# Check ports
sudo lsof -i :3000
sudo lsof -i :9000
sudo lsof -i :1337
```

### Database Connection Issues
```bash
# Test PostgreSQL
psql -U youli_user -d medusa_db -h localhost

# Check Redis
redis-cli ping
```

### nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
```

## 📚 Additional Resources

- **Detailed Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Deployment Checklist:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Quick Start (Local Dev):** Run `./quick-start.sh`
- **Next.js Docs:** https://nextjs.org/docs/deployment
- **Medusa Docs:** https://docs.medusajs.com
- **Strapi Docs:** https://docs.strapi.io/dev-docs/deployment

## 💡 Tips

1. **Start Small:** Deploy to a staging environment first
2. **Test Thoroughly:** Verify all features work before going live
3. **Monitor:** Set up monitoring and alerts
4. **Backup:** Automate daily backups
5. **Document:** Keep deployment notes for your team
6. **Update:** Keep dependencies up to date for security

## 🆘 Getting Help

If you encounter issues:

1. Check the logs (PM2 or Docker)
2. Review the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
3. Verify environment variables are correct
4. Check database and Redis connections
5. Review nginx configuration
6. Consult official documentation for each component

## 📝 Deployment Workflow

```
┌─────────────────┐
│  Clone Repo     │
└────────┬────────┘
         │
┌────────▼────────┐
│ Setup Server    │
│ (Node, DB, etc) │
└────────┬────────┘
         │
┌────────▼────────┐
│ Configure ENV   │
│ Variables       │
└────────┬────────┘
         │
┌────────▼────────┐
│ Build Apps      │
│ (3 components)  │
└────────┬────────┘
         │
┌────────▼────────┐
│ Run Migrations  │
└────────┬────────┘
         │
┌────────▼────────┐
│ Start Services  │
│ (PM2 or Docker) │
└────────┬────────┘
         │
┌────────▼────────┐
│ Configure nginx │
│ & SSL           │
└────────┬────────┘
         │
┌────────▼────────┐
│ Create Admins   │
│ & Configure     │
└────────┬────────┘
         │
┌────────▼────────┐
│ Setup Backups   │
│ & Monitoring    │
└────────┬────────┘
         │
┌────────▼────────┐
│   Go Live! 🚀   │
└─────────────────┘
```

---

**Last Updated:** 2026-02-13
**Version:** 1.0.0
