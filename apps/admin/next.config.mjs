/** @ts-check */

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["localhost", "events-proto.example.com"],
  },

  /**
   * Configure Next.js to support dynamic plugin loading
   */
  experimental: {
    // Allow importing modules from URLs
    urlImports: [
      // Development environment
      "http://localhost:4000", // Plugin server
      "https://minio-m4o4k40o80os0wc84k44skcc.heien.dev", // MinIO storage

      // Add production URLs when ready
      // 'https://plugins.yourdomain.com',
      // 'https://plugin-storage.yourdomain.com',
    ],
  },

  // Define security headers including CSP for remote plugin loading
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:4000 https://minio-m4o4k40o80os0wc84k44skcc.heien.dev;
              connect-src 'self' http://localhost:4000 https://minio-m4o4k40o80os0wc84k44skcc.heien.dev;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: http://localhost:4000 https://minio-m4o4k40o80os0wc84k44skcc.heien.dev;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'none';
              block-all-mixed-content;
              upgrade-insecure-requests;
            `
              .replace(/\s+/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },

  /**
   * Custom webpack configuration
   */
  webpack(config, options) {
    const { isServer } = options;

    // Add support for dynamic imports from external URLs
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["next/babel"],
        },
      },
    });

    // Optimize chunk loading for plugins
    config.optimization.chunkIds = "named";

    return config;
  },
};

export default nextConfig;
