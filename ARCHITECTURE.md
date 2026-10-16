# Youli-Next Deployment Architecture

## System Architecture Diagram

```
                                    ┌─────────────────────┐
                                    │   Internet/Users    │
                                    └──────────┬──────────┘
                                               │
                                               │ HTTPS (443)
                                               │ HTTP (80)
                                               │
                        ┌──────────────────────▼──────────────────────┐
                        │                                              │
                        │      nginx Reverse Proxy + SSL/TLS          │
                        │      (Let's Encrypt Certificates)           │
                        │                                              │
                        └──┬─────────────────┬─────────────────┬──────┘
                           │                 │                 │
                           │                 │                 │
            ┌──────────────▼──────┐  ┌──────▼──────┐  ┌──────▼──────────┐
            │                     │  │             │  │                 │
            │  Next.js Storefront │  │   Medusa    │  │  Strapi CMS     │
            │    (Port 3000)      │  │  Commerce   │  │  (Port 1337)    │
            │                     │  │ (Port 9000) │  │                 │
            │  - Customer UI      │  │             │  │  - Content Mgmt │
            │  - Product Pages    │  │ - REST API  │  │  - Admin Panel  │
            │  - Shopping Cart    │  │ - Admin UI  │  │  - API          │
            │                     │  │             │  │                 │
            └──────┬──────────────┘  └──────┬──────┘  └────────┬────────┘
                   │                        │                   │
                   │ API Calls              │                   │
                   └────────────────────────┼───────────────────┘
                                            │
                                            │
                        ┌───────────────────┼───────────────────┐
                        │                   │                   │
                        │                   │                   │
                ┌───────▼────────┐  ┌───────▼────────┐         │
                │                │  │                │         │
                │  PostgreSQL    │  │     Redis      │         │
                │   Database     │  │     Cache      │         │
                │                │  │                │         │
                │  - medusa_db   │  │  - Sessions    │         │
                │  - strapi_db   │  │  - Queue       │         │
                │                │  │                │         │
                └────────────────┘  └────────────────┘         │
                                                                │
                                                                │
                                                    ┌───────────▼────────┐
                                                    │                    │
                                                    │   File Storage     │
                                                    │                    │
                                                    │  - Strapi Uploads  │
                                                    │  - Product Images  │
                                                    │                    │
                                                    └────────────────────┘
```

## Component Details

### Frontend Layer

#### Next.js Storefront (Port 3000)
- **Technology:** Next.js 14, React 18, TypeScript
- **Purpose:** Customer-facing e-commerce website
- **Features:**
  - Server-side rendering (SSR)
  - Product catalog
  - Shopping cart
  - Checkout flow
  - CMS content integration
- **Deployment:** PM2 or Docker
- **Domain:** `yourdomain.com`

### Backend Layer

#### Medusa Commerce (Port 9000)
- **Technology:** Medusa.js 2.x, Node.js 20+
- **Purpose:** Headless commerce engine
- **Features:**
  - Product management
  - Order processing
  - Customer management
  - Payment integration
  - Admin dashboard
- **Deployment:** PM2 or Docker
- **Domain:** `api.yourdomain.com`
- **Admin:** `api.yourdomain.com/app`

#### Strapi CMS (Port 1337)
- **Technology:** Strapi 5.x, Node.js 20+
- **Purpose:** Headless content management
- **Features:**
  - Content types
  - Media library
  - API generation
  - Admin panel
  - Role-based access
- **Deployment:** PM2 or Docker
- **Domain:** `cms.yourdomain.com`
- **Admin:** `cms.yourdomain.com/admin`

### Data Layer

#### PostgreSQL Database
- **Version:** 14+
- **Purpose:** Primary data storage
- **Databases:**
  - `medusa_db` - Commerce data
  - `strapi_db` - CMS data
- **Backup:** Daily automated backups

#### Redis Cache
- **Version:** 7+
- **Purpose:** Caching and session storage
- **Used by:** Medusa (required)
- **Features:**
  - Session management
  - Job queue
  - Cache layer

### Infrastructure Layer

#### nginx Reverse Proxy
- **Purpose:** 
  - Route traffic to services
  - SSL/TLS termination
  - Load balancing (if scaled)
  - Static file serving
- **Configuration:**
  - HTTP → HTTPS redirect
  - WebSocket support
  - Gzip compression
  - Security headers

#### SSL/TLS Certificates
- **Provider:** Let's Encrypt (free)
- **Auto-renewal:** Configured via certbot
- **Domains:**
  - `yourdomain.com`
  - `api.yourdomain.com`
  - `cms.yourdomain.com`

## Deployment Options

### Option 1: Traditional Server (PM2)
```
Server (VPS/Dedicated)
├── nginx (Reverse Proxy)
├── PM2 Process Manager
│   ├── youli-storefront
│   ├── medusa-backend
│   └── strapi-cms
├── PostgreSQL (Database)
└── Redis (Cache)
```

**Pros:**
- Full control
- Cost-effective
- Easy to debug
- No vendor lock-in

**Cons:**
- Manual scaling
- More maintenance
- Server management required

### Option 2: Docker Containers
```
Server (VPS/Cloud)
├── nginx (Reverse Proxy)
└── Docker Compose
    ├── youli-storefront (Container)
    ├── medusa-backend (Container)
    ├── strapi-cms (Container)
    ├── postgres (Container)
    └── redis (Container)
```

**Pros:**
- Isolated environments
- Easy scaling
- Consistent deployments
- Simple updates

**Cons:**
- Docker overhead
- More complex setup
- Resource usage

### Option 3: Platform as a Service
```
Vercel (Storefront)
Railway/Render (Medusa + Strapi)
├── Managed PostgreSQL
├── Managed Redis
└── Auto-scaling
```

**Pros:**
- Minimal maintenance
- Auto-scaling
- Built-in CI/CD
- Managed infrastructure

**Cons:**
- Higher cost
- Less control
- Vendor lock-in

## Traffic Flow

### Customer Browsing Products
```
User → nginx → Next.js → Medusa API → PostgreSQL
                      ↓
                   Strapi API → PostgreSQL
```

### Customer Placing Order
```
User → nginx → Next.js → Medusa API → PostgreSQL
                                    ↓
                                  Redis (Session)
```

### Admin Managing Content
```
Admin → nginx → Strapi Admin → PostgreSQL
                            ↓
                      File Storage (Uploads)
```

### Admin Managing Products
```
Admin → nginx → Medusa Admin → PostgreSQL
                            ↓
                          Redis
```

## Scaling Strategy

### Horizontal Scaling
```
                    Load Balancer
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Instance 1       Instance 2       Instance 3
   (Storefront)     (Storefront)     (Storefront)
        │                │                │
        └────────────────┼────────────────┘
                         │
                    Medusa API
                         │
                    PostgreSQL
```

### Vertical Scaling
- Increase server resources (CPU, RAM)
- Upgrade database instance
- Add read replicas for PostgreSQL
- Redis cluster for high availability

## Security Layers

1. **Network Level**
   - Firewall (UFW)
   - Only ports 22, 80, 443 open
   - SSH key authentication

2. **Application Level**
   - HTTPS only (SSL/TLS)
   - CORS configuration
   - JWT authentication
   - Environment variables

3. **Database Level**
   - Strong passwords
   - Localhost-only access
   - Regular backups
   - Encrypted connections

4. **Infrastructure Level**
   - Regular updates
   - Fail2ban (SSH protection)
   - Security headers (nginx)
   - Rate limiting

## Monitoring Points

```
┌─────────────────────────────────────────┐
│         Monitoring Dashboard            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ CPU     │  │ Memory  │  │ Disk    │ │
│  │ Usage   │  │ Usage   │  │ Usage   │ │
│  └─────────┘  └─────────┘  └─────────┘ │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │ Response│  │ Error   │  │ Uptime  │ │
│  │ Time    │  │ Rate    │  │         │ │
│  └─────────┘  └─────────┘  └─────────┘ │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Service Status                   │  │
│  │ ✅ Storefront    ✅ Medusa       │  │
│  │ ✅ Strapi        ✅ PostgreSQL   │  │
│  │ ✅ Redis         ✅ nginx        │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Monitoring Tools:**
- PM2 built-in monitoring
- Docker stats
- PostgreSQL logs
- nginx access/error logs
- Custom health check scripts

## Backup Strategy

```
Daily Backups (2 AM)
├── PostgreSQL Dumps
│   ├── medusa_db.sql
│   └── strapi_db.sql
├── Strapi Uploads
│   └── uploads.tar.gz
└── Configuration Files
    ├── .env files
    └── nginx configs

Retention: 7 days
Storage: /var/backups/youli
```

## Disaster Recovery

1. **Database Restore**
   ```bash
   psql -U youli_user -d medusa_db < backup.sql
   ```

2. **File Restore**
   ```bash
   tar -xzf uploads.tar.gz -C /path/to/cms/public/
   ```

3. **Service Restart**
   ```bash
   pm2 restart all
   # or
   docker compose restart
   ```

---

**Architecture Version:** 1.0.0
**Last Updated:** 2026-02-13
