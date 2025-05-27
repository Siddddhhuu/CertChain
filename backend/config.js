import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

export default {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'https://cert-chain-sable.vercel.app',
  nodeEnv: process.env.NODE_ENV || 'production',
  smtp: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM
  }
};
