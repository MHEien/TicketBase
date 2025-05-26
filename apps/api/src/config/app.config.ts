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
    secret: process.env.JWT_SECRET || 'secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '900', // 15 minutes in seconds
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '604800', // 7 days in seconds
  },
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET || 'nextauth-secret-key',
  },
  plugins: {
    serverUrl: process.env.PLUGIN_SERVER_URL || 'http://localhost:4001',
    allowedOrigins: (
      process.env.PLUGIN_ALLOWED_ORIGINS ||
      'http://localhost:3001,http://localhost:3000'
    ).split(','),
  },
});
