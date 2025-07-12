export default () => ({
  port: parseInt(process.env.PORT, 10) || 4000,
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ticketing',
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET must be set in production');
      }
      return 'dev-secret-key-change-in-production';
    })(),
    expiresIn: process.env.JWT_EXPIRES_IN || '900', // 15 minutes in seconds
    refreshSecret: process.env.JWT_REFRESH_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_REFRESH_SECRET must be set in production');
      }
      return 'dev-refresh-secret-key-change-in-production';
    })(),
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '604800', // 7 days in seconds
  },
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('NEXTAUTH_SECRET must be set in production');
      }
      return 'dev-nextauth-secret-key-change-in-production';
    })(),
  },
  plugins: {
    serverUrl: process.env.PLUGIN_SERVER_URL || 'http://localhost:5000',
    allowedOrigins: (
      process.env.PLUGIN_ALLOWED_ORIGINS ||
      'http://localhost:4000,http://localhost:3000'
    ).split(','),
  },
  security: {
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // limit each IP to 100 requests per windowMs
    },
    cors: {
      origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4000'],
      credentials: true,
    },
  },
});
