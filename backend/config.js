import dotenv from 'dotenv';
dotenv.config();

// Log all environment variables (without sensitive values)
// console.log('Environment Variables Check:');
// console.log('NODE_ENV:', process.env.NODE_ENV);
// console.log('PORT:', process.env.PORT);
// console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
// console.log('MONGO_URI:', process.env.MONGO_URI ? 'configured' : 'not configured');
// console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'configured' : 'not configured');
// console.log('SMTP_USER:', process.env.SMTP_USER ? 'configured' : 'not configured');
// console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'configured' : 'not configured');
// console.log('SMTP_FROM:', process.env.SMTP_FROM);

// Validate required environment variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

const config = {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
  frontendUrl: process.env.FRONTEND_URL || 'https://cert-chain-seven.vercel.app',
  nodeEnv: process.env.NODE_ENV || 'production',
  smtp: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM
  }
};

// console.log('Final Config:', {
//   ...config,
//   mongoUri: config.mongoUri ? 'configured' : 'not configured',
//   jwtSecret: config.jwtSecret ? 'configured' : 'not configured',
//   smtp: {
//     user: config.smtp.user ? 'configured' : 'not configured',
//     pass: config.smtp.pass ? 'configured' : 'not configured',
//     from: config.smtp.from
//   }
// });

export default config;
