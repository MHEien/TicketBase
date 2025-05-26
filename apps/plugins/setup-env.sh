#!/bin/bash

# Setup script for Plugin Server Environment Configuration

echo "Setting up Plugin Server environment configuration..."

# Create .env file with required MinIO configuration
cat > .env << EOF
# MongoDB Configuration
MONGODB_URI="mongodb://root:example@localhost:27017/plugin-server?authSource=admin"

# Server Configuration
PLUGIN_SERVER_URL=http://localhost:4000

# Storage Configuration (MinIO)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
S3_ENDPOINT=http://localhost:9000
S3_PORT=9000
S3_USE_SSL=false
PLUGIN_ASSETS_BUCKET=plugin-bundles

# JWT Configuration (optional - for authentication)
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=15m
EOF

echo "✅ .env file created with MinIO configuration"

# Check if MinIO is running
echo "Checking MinIO server status..."
if curl -s http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    echo "✅ MinIO server is running"
else
    echo "❌ MinIO server is not running"
    echo "To start MinIO with Docker:"
    echo "docker run -p 9000:9000 -p 9001:9001 --name minio \\"
    echo "  -v ~/minio/data:/data \\"
    echo "  -e \"MINIO_ROOT_USER=minioadmin\" \\"
    echo "  -e \"MINIO_ROOT_PASSWORD=minioadmin\" \\"
    echo "  minio/minio server /data --console-address \":9001\""
fi

echo ""
echo "Configuration complete! You can now start the plugin server with:"
echo "npm run dev" 