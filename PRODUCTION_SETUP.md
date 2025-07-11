# Production Setup Guide

This guide walks you through deploying your ticket system in production using Docker Compose with Traefik reverse proxy.

## 🏗️ Architecture Overview

The production setup uses:

- **Traefik** as a reverse proxy with automatic SSL certificates
- **Internal Docker networking** for secure service communication
- **Domain-based routing** using your `heien.dev` domain
- **Let's Encrypt** for automatic SSL certificates

## 🌐 Service URLs

After deployment, your services will be available at:

- **Main Application**: `https://heien.dev`
- **API Server**: `https://api.heien.dev`
- **Plugin Server**: `https://plugins.heien.dev`
- **Traefik Dashboard**: `https://traefik.heien.dev`
- **Database Admin**: `https://adminer.heien.dev`
- **MinIO Console**: `https://minio.heien.dev`
- **S3 API**: `https://s3.heien.dev`

## 🔧 Environment Variables

Create a `.env.production` file with the following variables:

```env
# =============================================================================
# TRAEFIK CONFIGURATION
# =============================================================================
# Email for Let's Encrypt SSL certificates
ACME_EMAIL=admin@heien.dev

# Traefik Dashboard Basic Auth (username:password)
# Generate with: htpasswd -nb admin yourpassword
TRAEFIK_DASHBOARD_USERS=admin:$$2y$$10$$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DB_USERNAME=postgres
DB_PASSWORD=your_secure_postgres_password
DB_NAME=ticketbase_prod

# MongoDB Configuration
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=your_secure_mongo_password
MONGO_PLUGINS_DB=plugin-server

# =============================================================================
# STORAGE CONFIGURATION
# =============================================================================
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_secure_minio_secret_key
MINIO_BUCKET=plugin-bundles
PLUGIN_ASSETS_BUCKET=plugin-bundles

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================
NODE_ENV=production
API_PORT=4000
ADMIN_PORT=3000
PLUGINS_PORT=5000

# =============================================================================
# AUTHENTICATION & SECURITY
# =============================================================================
# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_256_bits_minimum
JWT_EXPIRES_IN=24000
JWT_REFRESH_SECRET=your_very_secure_refresh_secret_256_bits_minimum
JWT_REFRESH_EXPIRES_IN=7d

# NextAuth Secret
NEXTAUTH_SECRET=your_very_secure_nextauth_secret_256_bits_minimum

# Better Auth Configuration
BETTER_AUTH_SECRET=your_very_secure_better_auth_secret_256_bits_minimum
BETTER_AUTH_URL=https://heien.dev

# Plugin Security
PLUGIN_ENCRYPTION_KEY=your_very_secure_plugin_encryption_key_256_bits_minimum
PLUGIN_CONFIG_SECRET=your_very_secure_plugin_config_secret_256_bits_minimum
PLUGINS_JWT_EXPIRES_IN=900

# =============================================================================
# EXTERNAL URLS & ORIGINS
# =============================================================================
FRONTEND_URL=https://heien.dev
NEXT_PUBLIC_API_URL=https://api.heien.dev

# Allowed Origins for CORS
PLUGIN_ALLOWED_ORIGINS=https://heien.dev,https://api.heien.dev

# =============================================================================
# AWS/S3 CONFIGURATION (for MinIO)
# =============================================================================
AWS_REGION=us-east-1
```

## 🔐 Security Configuration

### Generate Secure Passwords

Use these commands to generate secure passwords:

```bash
# Generate JWT secrets (256-bit)
openssl rand -base64 32

# Generate Traefik dashboard password
htpasswd -nb admin yourpassword
```

### Required Secrets

Make sure to replace these placeholder values:

- `your_secure_postgres_password`
- `your_secure_mongo_password`
- `your_minio_access_key`
- `your_secure_minio_secret_key`
- All JWT and auth secrets

## 🚀 Deployment Steps

### 1. DNS Configuration

Configure your DNS records to point to your server:

```
A     heien.dev           → YOUR_SERVER_IP
A     www.heien.dev       → YOUR_SERVER_IP
A     api.heien.dev       → YOUR_SERVER_IP
A     plugins.heien.dev   → YOUR_SERVER_IP
A     traefik.heien.dev   → YOUR_SERVER_IP
A     adminer.heien.dev   → YOUR_SERVER_IP
A     minio.heien.dev     → YOUR_SERVER_IP
A     s3.heien.dev        → YOUR_SERVER_IP
```

### 2. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create project directory
mkdir -p /opt/ticketsystem
cd /opt/ticketsystem
```

### 3. Deploy the Application

```bash
# Clone your repository
git clone <your-repo-url> .

# Create production environment file
cp .env.production.example .env.production
nano .env.production  # Edit with your values

# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f
```

## 📊 Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f admin
docker-compose logs -f api
docker-compose logs -f traefik
```

### Check Service Status

```bash
# Service status
docker-compose ps

# Resource usage
docker stats
```

## 🔧 Maintenance

### Update Services

```bash
# Pull latest images
docker-compose pull

# Restart services
docker-compose up -d

# Clean up old images
docker image prune -a
```

### Backup Data

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U postgres ticketbase_prod > backup.sql

# Backup MongoDB
docker-compose exec mongo mongodump --authenticationDatabase admin -u root -p

# Backup MinIO data
docker-compose exec minio mc mirror /data /backup
```

## 🌐 Network Architecture

### Internal Network (`ticketbase`)

- **Type**: Bridge network (internal)
- **Services**: postgres, mongo, minio, api, plugins, admin
- **Purpose**: Secure internal communication

### External Network (`traefik`)

- **Type**: Bridge network (public)
- **Services**: traefik, minio, adminer, api, plugins, admin
- **Purpose**: Services that need external access

## 🔍 Troubleshooting

### Common Issues

1. **SSL Certificate Issues**

   ```bash
   # Check certificate status
   docker-compose logs traefik | grep acme

   # Restart Traefik
   docker-compose restart traefik
   ```

2. **Database Connection Issues**

   ```bash
   # Check database health
   docker-compose exec postgres pg_isready -U postgres

   # Check database logs
   docker-compose logs postgres
   ```

3. **Service Discovery Issues**
   ```bash
   # Check network connectivity
   docker-compose exec api ping postgres
   docker-compose exec admin ping api
   ```

### Health Checks

All services include health checks. Monitor them with:

```bash
# Service health status
docker-compose ps

# Detailed health check logs
docker inspect <container_name> | grep -A 10 Health
```

## 📋 Pre-deployment Checklist

- [ ] DNS records configured
- [ ] Environment variables set
- [ ] Secrets generated and configured
- [ ] Firewall configured (ports 80, 443 open)
- [ ] Docker and Docker Compose installed
- [ ] Application code deployed
- [ ] Database initialized
- [ ] SSL certificates working
- [ ] All services responding
- [ ] Monitoring configured
- [ ] Backup strategy implemented

## 🔒 Security Best Practices

1. **Network Security**

   - Internal network for database access
   - Only necessary services exposed
   - HTTPS enforced for all public services

2. **Authentication**

   - Strong passwords for all services
   - JWT secrets with sufficient entropy
   - Traefik dashboard protected

3. **Data Protection**

   - Regular backups
   - Encrypted storage volumes
   - Secure environment variable handling

4. **Monitoring**
   - Log aggregation
   - Health checks
   - Resource monitoring

## 🆘 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify DNS configuration
3. Ensure all environment variables are set
4. Check firewall settings
5. Verify SSL certificate generation

For additional support, check the application logs and Traefik dashboard for detailed error information.
