# Docker Setup Guide

This guide explains how to run the entire TicketsMonorepo platform using Docker.

## Quick Start

1. **Build and start all services:**

   ```bash
   docker-compose up --build
   ```

2. **Start services in the background:**

   ```bash
   docker-compose up -d --build
   ```

3. **Stop all services:**
   ```bash
   docker-compose down
   ```

## Services & Ports

| Service       | Port  | Description                |
| ------------- | ----- | -------------------------- |
| Admin UI      | 3000  | Frontend React application |
| API           | 4000  | Main NestJS API server     |
| Plugins       | 5000  | Plugins NestJS service     |
| PostgreSQL    | 5432  | Main database              |
| MongoDB       | 27017 | Plugins database           |
| MinIO         | 9000  | Object storage API         |
| MinIO Console | 9001  | MinIO web interface        |
| Adminer       | 8080  | Database admin interface   |

## Environment Variables

The docker-compose.yml includes default environment variables. For production, you should:

1. Create a `.env` file in the root directory
2. Override the default values:

```env
# JWT Secrets (CHANGE THESE!)
JWT_SECRET=your_very_secure_jwt_secret_here
JWT_REFRESH_SECRET=your_very_secure_refresh_secret_here

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=tickets_db

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_secure_password

# MinIO
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=your_secure_password
```

## Development vs Production

### Development

- Uses local builds with hot reloading
- Includes development tools (Adminer)
- Uses default credentials

### Production Checklist

- [ ] Change all default passwords
- [ ] Use proper JWT secrets
- [ ] Set up SSL/TLS
- [ ] Configure proper backup strategies
- [ ] Set resource limits
- [ ] Enable monitoring

## Useful Commands

```bash
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs api
docker-compose logs admin
docker-compose logs plugins

# Rebuild specific service
docker-compose build api
docker-compose up api

# Execute commands in running containers
docker-compose exec api npm run migrate
docker-compose exec postgres psql -U postgres

# Clean up (removes containers, networks, and unnamed volumes)
docker-compose down -v
```

## Database Access

### PostgreSQL (via Adminer)

- URL: http://localhost:8080
- System: PostgreSQL
- Server: postgres
- Username: postgres
- Password: postgres

### MongoDB

- Connection String: `mongodb://root:example@localhost:27017/admin`

### MinIO Console

- URL: http://localhost:9001
- Username: minioadmin
- Password: minioadmin

## Troubleshooting

### Common Issues

1. **Port conflicts:**

   ```bash
   # Check what's using a port
   lsof -i :3000
   # Kill process using port
   kill -9 <PID>
   ```

2. **Database connection issues:**

   ```bash
   # Check if database is ready
   docker-compose exec postgres pg_isready -U postgres
   ```

3. **Clean restart:**
   ```bash
   # Remove everything and start fresh
   docker-compose down -v
   docker system prune -a
   docker-compose up --build
   ```

### Health Checks

All services include health checks. You can verify service status:

```bash
docker-compose ps
```

Services should show "healthy" status when ready.

## Architecture Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Admin     │────│     API     │────│ PostgreSQL  │
│  (Port 3000)│    │ (Port 4000) │    │ (Port 5432) │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                   ┌─────────────┐    ┌─────────────┐
                   │   Plugins   │────│   MongoDB   │
                   │ (Port 5000) │    │ (Port 27017)│
                   └─────────────┘    └─────────────┘
                           │
                   ┌─────────────┐
                   │    MinIO    │
                   │ (Port 9000) │
                   └─────────────┘
```

## Next Steps

1. Access the Admin UI at http://localhost:3000
2. Check API documentation at http://localhost:4000/api (if Swagger is enabled)
3. Configure your environment variables for production use
4. Set up CI/CD pipeline for automated deployments
