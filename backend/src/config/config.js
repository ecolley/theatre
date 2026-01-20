require('dotenv').config();

module.exports = {
  // Server
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Authentication
  appPassword: process.env.APP_PASSWORD,
  jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret-change-in-production',
  jwtExpiresIn: '7d',

  // External APIs
  ticketmaster: {
    apiKey: process.env.TICKETMASTER_API_KEY,
    baseUrl: 'https://app.ticketmaster.com/discovery/v2',
    rateLimit: {
      requestsPerSecond: 5,
      requestsPerDay: 5000,
    },
  },

  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-5-haiku-20241022',
    maxTokens: 4096,
  },

  // Cache TTLs (in seconds)
  cache: {
    eventSearch: 24 * 60 * 60, // 24 hours
    eventDetail: 7 * 24 * 60 * 60, // 7 days
    recommendations: 60 * 60, // 1 hour
  },
};
