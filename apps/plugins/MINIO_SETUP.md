# MinIO Setup for Plugin Server

This document outlines the required configuration for MinIO integration with the plugin server.

## Environment Variables

Add the following to your `.env` file:

```
# Server Configuration
PLUGIN_SERVER_URL=http://localhost:4000

# Storage Configuration (MinIO)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=minioadmin     # Default MinIO access key
AWS_SECRET_ACCESS_KEY=minioadmin # Default MinIO secret key
S3_ENDPOINT=http://localhost:9000  # MinIO server URL
S3_PORT=9000
S3_USE_SSL=false
PLUGIN_ASSETS_BUCKET=plugin-bundles  # Bucket name for plugin assets
```

## MinIO Setup

### 1. Start MinIO Server

```bash
# Using Docker
docker run -p 9000:9000 -p 9001:9001 --name minio \
  -v ~/minio/data:/data \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  minio/minio server /data --console-address ":9001"
```

### 2. Create Plugin Bundles Bucket

Access the MinIO Console at http://localhost:9001 and create a bucket named `plugin-bundles`.

Alternatively, use the MinIO client (mc):

```bash
# Install MinIO client if you don't have it
# See: https://min.io/docs/minio/linux/reference/minio-mc.html

# Configure MinIO client
mc alias set myminio http://localhost:9000 minioadmin minioadmin

# Create bucket
mc mb myminio/plugin-bundles

# Set proper CORS policy for the bucket
mc admin policy set download myminio/plugin-bundles
```

### 3. Configure CORS for the Bucket

Create a `cors.json` file:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET"],
      "AllowedHeaders": ["*"],
      "ExposeHeaders": ["ETag", "Content-Length"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

Apply the CORS policy:

```bash
mc admin config set myminio/plugin-bundles cors.json
```

## Testing

To test that the MinIO integration is working:

1. Start the plugin server
2. Use the API to upload a plugin
3. Verify that the bundle is stored in the MinIO bucket
4. Check that the bundle URL is accessible
