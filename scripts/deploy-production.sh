#!/bin/bash

# Production Deployment Script for Ticket System
# This script helps deploy the ticket system to production with Traefik

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to generate secure password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Function to generate JWT secret
generate_jwt_secret() {
    openssl rand -base64 32
}

echo "🚀 Production Deployment Script for Ticket System"
echo "=================================================="
echo

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists docker; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command_exists docker-compose; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Prerequisites check passed"
echo

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    print_warning ".env.production file not found. Creating template..."
    
    # Generate secure passwords
    DB_PASSWORD=$(generate_password)
    MONGO_PASSWORD=$(generate_password)
    MINIO_ACCESS_KEY=$(generate_password | cut -c1-20)
    MINIO_SECRET_KEY=$(generate_password)
    JWT_SECRET=$(generate_jwt_secret)
    JWT_REFRESH_SECRET=$(generate_jwt_secret)
    NEXTAUTH_SECRET=$(generate_jwt_secret)
    BETTER_AUTH_SECRET=$(generate_jwt_secret)
    PLUGIN_ENCRYPTION_KEY=$(generate_jwt_secret)
    PLUGIN_CONFIG_SECRET=$(generate_jwt_secret)
    
    # Create .env.production file
    cat > .env.production << EOF
# =============================================================================
# PRODUCTION ENVIRONMENT VARIABLES
# =============================================================================

# =============================================================================
# TRAEFIK CONFIGURATION
# =============================================================================
ACME_EMAIL=admin@heien.dev
TRAEFIK_DASHBOARD_USERS=admin:\$\$2y\$\$10\$\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DB_USERNAME=postgres
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=ticketbase_prod

# MongoDB Configuration
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=${MONGO_PASSWORD}
MONGO_PLUGINS_DB=plugin-server

# =============================================================================
# STORAGE CONFIGURATION
# =============================================================================
MINIO_ACCESS_KEY=${MINIO_ACCESS_KEY}
MINIO_SECRET_KEY=${MINIO_SECRET_KEY}
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
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=24000
JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
JWT_REFRESH_EXPIRES_IN=7d

NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
BETTER_AUTH_URL=https://heien.dev

PLUGIN_ENCRYPTION_KEY=${PLUGIN_ENCRYPTION_KEY}
PLUGIN_CONFIG_SECRET=${PLUGIN_CONFIG_SECRET}
PLUGINS_JWT_EXPIRES_IN=900

# =============================================================================
# EXTERNAL URLS & ORIGINS
# =============================================================================
FRONTEND_URL=https://heien.dev
NEXT_PUBLIC_API_URL=https://api.heien.dev
PLUGIN_ALLOWED_ORIGINS=https://heien.dev,https://api.heien.dev

# =============================================================================
# AWS/S3 CONFIGURATION
# =============================================================================
AWS_REGION=us-east-1
EOF

    print_success "Created .env.production with secure generated passwords"
    print_warning "Please review and update the .env.production file with your specific values"
    print_warning "Especially update ACME_EMAIL and TRAEFIK_DASHBOARD_USERS"
    echo
fi

# Ask for confirmation
echo "📋 Pre-deployment checklist:"
echo "✅ DNS records configured for heien.dev and all subdomains"
echo "✅ Ports 80 and 443 open on your server"
echo "✅ .env.production file configured with your values"
echo "✅ Docker and Docker Compose installed"
echo

read -p "Are you ready to deploy to production? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled by user"
    exit 0
fi

# Pull latest images
print_status "Pulling latest Docker images..."
docker-compose pull

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down

# Build and start services
print_status "Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check service status
print_status "Checking service status..."
docker-compose ps

# Check logs for any errors
print_status "Checking for any startup errors..."
if docker-compose logs | grep -i error; then
    print_warning "Some errors detected in logs. Please check the logs for more details."
else
    print_success "No startup errors detected"
fi

echo
print_success "🎉 Production deployment completed!"
echo
echo "🌐 Your services should be available at:"
echo "   • Main Application: https://heien.dev"
echo "   • API Server: https://api.heien.dev"
echo "   • Plugin Server: https://plugins.heien.dev"
echo "   • Traefik Dashboard: https://traefik.heien.dev"
echo "   • Database Admin: https://adminer.heien.dev"
echo "   • MinIO Console: https://minio.heien.dev"
echo "   • S3 API: https://s3.heien.dev"
echo
echo "📊 Useful commands:"
echo "   • View logs: docker-compose logs -f"
echo "   • Check status: docker-compose ps"
echo "   • Stop services: docker-compose down"
echo "   • Update services: docker-compose pull && docker-compose up -d"
echo
echo "⚠️  Note: SSL certificates may take a few minutes to be issued by Let's Encrypt"
echo "    If you encounter SSL issues, wait a few minutes and try again."
echo
print_success "Deployment completed successfully! 🚀" 