# Youli-Next Deployment Guide

This guide walks you through deploying the Youli-Next e-commerce platform to a production server.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Server Setup](#server-setup)
3. [Deployment Methods](#deployment-methods)
4. [Post-Deployment](#post-deployment)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Server Requirements
- **OS**: Ubuntu 22.04 LTS or similar Linux distribution
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: Minimum 20GB SSD
- **CPU**: 2+ cores recommended
- **Domain**: Configured DNS pointing to your server

### Software Requirements
- Node.js 20+
- npm 10+
- PostgreSQL 14+ (for production)
- Redis 7+ (for Medusa)
- nginx (for reverse proxy)
- PM2 (for process management) OR Docker & Docker Compose

---

## Server Setup

### 1. Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x
```

### 3. Install PostgreSQL
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 4. Install Redis
```bash
sudo apt install -y redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

### 5. Install nginx
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 6. Configure Firewall
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

---

## Deployment Methods

Choose one of the following deployment methods:

### Method 1: Traditional Deployment (PM2)

#### Step 1: Clone Repository
```bash
cd /var/www
sudo git clone <your-repo-url> youli-next
sudo chown -R $USER:$USER youli-next
cd youli-next
```

#### Step 2: Setup Databases
```bash
# Create PostgreSQL databases
sudo -u postgres psql << EOF
CREATE DATABASE medusa_db;
CREATE DATABASE strapi_db;
CREATE USER youli_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE medusa_db TO youli_user;
GRANT ALL PRIVILEGES ON DATABASE strapi_db TO youli_user;
\q
EOF
```

#### Step 3: Configure Environment Variables

**Storefront (.env.local):**
```bash
cat > .env.local << EOF
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
MEDUSA_API_URL=https://api.yourdomain.com
MEDUSA_PUBLISHABLE_KEY=pk_your_key_here
STRAPI_API_URL=https://cms.yourdomain.com
STRAPI_API_TOKEN=your_token_here
EOF
```

**Medusa (commerce/.env):**
```bash
cat > commerce/.env << EOF
DATABASE_URL=postgres://youli_user:your_secure_password@localhost:5432/medusa_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)
MEDUSA_BACKEND_URL=https://api.yourdomain.com
ADMIN_CORS=https://api.yourdomain.com
STORE_CORS=https://yourdomain.com
EOF
```

**Strapi (cms/.env):**
```bash
cat > cms/.env << EOF
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi_db
DATABASE_USERNAME=youli_user
DATABASE_PASSWORD=your_secure_password
DATABASE_SSL=false
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
EOF
```

#### Step 4: Build Applications
```bash
# Install and build storefront
npm install
npm run build

# Install and build Medusa
cd commerce
npm install
npm run build
npx medusa db:migrate
npm run seed  # Optional: seed with sample data
cd ..

# Install and build Strapi
cd cms
npm install
npm run build
cd ..
```

#### Step 5: Setup PM2
```bash
# Install PM2 globally
sudo npm install -g pm2

# Update ecosystem.config.js with correct paths
sed -i "s|/path/to/Youli-Next|$(pwd)|g" ecosystem.config.js

# Create logs directory
mkdir -p logs

# Start all services
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions from the output
```

#### Step 6: Configure nginx
```bash
sudo tee /etc/nginx/sites-available/youli-next << 'EOF'
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
EOF

# Enable site
sudo ln -s /etc/nginx/sites-available/youli-next /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Step 7: Setup SSL with Let's Encrypt
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com
sudo certbot --nginx -d cms.yourdomain.com

# Auto-renewal is configured automatically
```

---

### Method 2: Docker Deployment

#### Step 1: Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install -y docker-compose-plugin
```

#### Step 2: Clone Repository
```bash
cd /var/www
sudo git clone <your-repo-url> youli-next
sudo chown -R $USER:$USER youli-next
cd youli-next
```

#### Step 3: Configure Environment
```bash
# Copy environment template
cp .env.docker.example .env

# Edit .env with your production values
nano .env
```

Generate secrets:
```bash
echo "POSTGRES_PASSWORD=$(openssl rand -base64 32)"
echo "MEDUSA_JWT_SECRET=$(openssl rand -base64 32)"
echo "MEDUSA_COOKIE_SECRET=$(openssl rand -base64 32)"
echo "STRAPI_API_TOKEN_SALT=$(openssl rand -base64 32)"
echo "STRAPI_ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo "STRAPI_TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
echo "STRAPI_JWT_SECRET=$(openssl rand -base64 32)"
```

#### Step 4: Build and Start Services
```bash
# Build images
docker compose build

# Start services
docker compose up -d

# View logs
docker compose logs -f

# Check status
docker compose ps
```

#### Step 5: Run Migrations
```bash
# Run Medusa migrations
docker compose exec medusa npx medusa db:migrate

# Seed Medusa (optional)
docker compose exec medusa npm run seed

# Create Medusa admin user
docker compose exec medusa npx medusa user -e admin@yourdomain.com -p your_password
```

#### Step 6: Configure nginx (Same as Method 1, Step 6)

---

## Post-Deployment

### 1. Create Medusa Admin User
```bash
# PM2 deployment
cd /var/www/youli-next/commerce
npx medusa user -e admin@yourdomain.com -p secure_password

# Docker deployment
docker compose exec medusa npx medusa user -e admin@yourdomain.com -p secure_password
```

### 2. Access Admin Panels
- **Medusa Admin**: `https://api.yourdomain.com/app`
- **Strapi Admin**: `https://cms.yourdomain.com/admin`
- **Storefront**: `https://yourdomain.com`

### 3. Configure Strapi
1. Visit `https://cms.yourdomain.com/admin`
2. Create your first admin user
3. Configure content types and add content
4. Generate API token in Settings → API Tokens
5. Update storefront `.env.local` with the token

### 4. Configure Medusa
1. Visit `https://api.yourdomain.com/app`
2. Login with admin credentials
3. Add products, collections, and configure store settings
4. Get publishable key from Settings → Publishable API Keys
5. Update storefront `.env.local` with the key

### 5. Setup Backups

**Database Backup Script:**
```bash
sudo tee /usr/local/bin/backup-youli.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/youli"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
pg_dump -U youli_user medusa_db > $BACKUP_DIR/medusa_$DATE.sql
pg_dump -U youli_user strapi_db > $BACKUP_DIR/strapi_$DATE.sql

# Backup Strapi uploads
tar -czf $BACKUP_DIR/strapi_uploads_$DATE.tar.gz /var/www/youli-next/cms/public/uploads

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

sudo chmod +x /usr/local/bin/backup-youli.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-youli.sh") | crontab -
```

---

## Troubleshooting

### Check Service Status

**PM2:**
```bash
pm2 status
pm2 logs
pm2 logs youli-storefront
pm2 logs medusa-backend
pm2 logs strapi-cms
```

**Docker:**
```bash
docker compose ps
docker compose logs
docker compose logs storefront
docker compose logs medusa
docker compose logs strapi
```

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3000
sudo lsof -i :9000
sudo lsof -i :1337

# Kill the process
sudo kill -9 <PID>
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check if database exists
sudo -u postgres psql -l

# Test connection
psql -U youli_user -d medusa_db -h localhost
```

#### Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping
```

#### nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx
```

### Restart Services

**PM2:**
```bash
pm2 restart all
pm2 restart youli-storefront
pm2 restart medusa-backend
pm2 restart strapi-cms
```

**Docker:**
```bash
docker compose restart
docker compose restart storefront
docker compose restart medusa
docker compose restart strapi
```

### Update Deployment

**PM2:**
```bash
cd /var/www/youli-next
git pull
npm install
npm run build
pm2 restart youli-storefront

cd commerce
npm install
npm run build
npx medusa db:migrate
pm2 restart medusa-backend

cd ../cms
npm install
npm run build
pm2 restart strapi-cms
```

**Docker:**
```bash
cd /var/www/youli-next
git pull
docker compose build
docker compose up -d
docker compose exec medusa npx medusa db:migrate
```

---

## Monitoring

### Setup PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Health Checks
Create a simple health check script:
```bash
#!/bin/bash
curl -f http://localhost:3000 || echo "Storefront down"
curl -f http://localhost:9000/health || echo "Medusa down"
curl -f http://localhost:1337/_health || echo "Strapi down"
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong, unique secrets for JWT, cookies, etc.
- [ ] Enable firewall (ufw)
- [ ] Setup SSL certificates
- [ ] Configure CORS properly
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] Setup automated backups
- [ ] Use environment variables (never commit secrets)
- [ ] Restrict database access to localhost
- [ ] Setup fail2ban for SSH protection
- [ ] Regular monitoring and log review

---

## Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Medusa Documentation](https://docs.medusajs.com)
- [Strapi Deployment](https://docs.strapi.io/dev-docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Docker Documentation](https://docs.docker.com/)
- [nginx Documentation](https://nginx.org/en/docs/)
