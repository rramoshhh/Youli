# Deployment Checklist

Use this checklist to ensure you've completed all necessary steps for deployment.

## Pre-Deployment

### Server Setup
- [ ] Server provisioned (VPS/Cloud instance)
- [ ] Domain name configured and DNS pointing to server
- [ ] SSH access configured
- [ ] Firewall configured (ports 22, 80, 443)
- [ ] Node.js 20+ installed
- [ ] PostgreSQL installed and running
- [ ] Redis installed and running (for Medusa)
- [ ] nginx installed and running

### Database Setup
- [ ] PostgreSQL databases created (medusa_db, strapi_db)
- [ ] Database users created with proper permissions
- [ ] Database passwords are strong and secure

### Security
- [ ] All default passwords changed
- [ ] Strong secrets generated for:
  - [ ] JWT_SECRET
  - [ ] COOKIE_SECRET
  - [ ] STRAPI_APP_KEYS
  - [ ] STRAPI_API_TOKEN_SALT
  - [ ] STRAPI_ADMIN_JWT_SECRET
  - [ ] STRAPI_TRANSFER_TOKEN_SALT
- [ ] Environment files created and configured
- [ ] Sensitive files added to .gitignore
- [ ] SSL certificates obtained (Let's Encrypt)

## Deployment

### Code Deployment
- [ ] Repository cloned to server
- [ ] Dependencies installed for all components
- [ ] Environment variables configured:
  - [ ] Storefront (.env.local)
  - [ ] Medusa (commerce/.env)
  - [ ] Strapi (cms/.env)

### Build Process
- [ ] Storefront built successfully (`npm run build`)
- [ ] Medusa built successfully (`cd commerce && npm run build`)
- [ ] Strapi built successfully (`cd cms && npm run build`)
- [ ] Medusa migrations run (`npx medusa db:migrate`)

### Process Management
Choose one:
- [ ] PM2 installed and configured
  - [ ] ecosystem.config.js updated with correct paths
  - [ ] All services started with PM2
  - [ ] PM2 saved and configured for auto-start
- [ ] Docker and Docker Compose installed
  - [ ] .env file configured
  - [ ] Images built successfully
  - [ ] Containers running

### Reverse Proxy
- [ ] nginx configuration created
- [ ] nginx configuration tested (`sudo nginx -t`)
- [ ] nginx reloaded/restarted
- [ ] SSL certificates installed
- [ ] HTTPS redirects working

### Application Configuration
- [ ] Medusa admin user created
- [ ] Strapi admin user created
- [ ] Medusa publishable key generated
- [ ] Strapi API token generated
- [ ] Storefront environment updated with keys/tokens
- [ ] CORS settings configured correctly

## Post-Deployment

### Testing
- [ ] Storefront accessible at https://yourdomain.com
- [ ] Medusa API accessible at https://api.yourdomain.com
- [ ] Medusa admin accessible at https://api.yourdomain.com/app
- [ ] Strapi CMS accessible at https://cms.yourdomain.com
- [ ] Strapi admin accessible at https://cms.yourdomain.com/admin
- [ ] All services responding correctly
- [ ] Database connections working
- [ ] Redis connection working (Medusa)

### Content Setup
- [ ] Strapi content types configured
- [ ] Initial content added to Strapi
- [ ] Medusa products added
- [ ] Medusa collections configured
- [ ] Test orders processed successfully

### Monitoring & Maintenance
- [ ] Backup script created and tested
- [ ] Backup cron job configured
- [ ] Log rotation configured
- [ ] Monitoring setup (PM2 or Docker logs)
- [ ] Health check endpoints verified
- [ ] Error logging working

### Documentation
- [ ] Deployment documented
- [ ] Admin credentials stored securely
- [ ] Environment variables documented
- [ ] Backup/restore procedures documented
- [ ] Team members have access to necessary resources

## Ongoing Maintenance

### Weekly
- [ ] Check application logs for errors
- [ ] Verify backups are running
- [ ] Monitor disk space usage
- [ ] Check SSL certificate expiration

### Monthly
- [ ] Update dependencies (security patches)
- [ ] Review and rotate logs
- [ ] Test backup restoration
- [ ] Review performance metrics

### As Needed
- [ ] Update application code
- [ ] Run database migrations
- [ ] Scale resources if needed
- [ ] Update SSL certificates (auto-renewed by certbot)

## Rollback Plan

In case of deployment issues:
- [ ] Previous version tagged in git
- [ ] Database backup available
- [ ] Rollback procedure documented
- [ ] Know how to restore from backup

## Emergency Contacts

- Server Provider: _______________
- Domain Registrar: _______________
- Database Admin: _______________
- DevOps Lead: _______________

## Notes

_Add any deployment-specific notes here:_

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Version/Commit:** _______________
