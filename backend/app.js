import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
const envPath = path.join(__dirname, '.env');
console.log('Loading environment variables from:', envPath);
dotenvConfig({ path: envPath });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js';

// Detailed environment variable logging
console.log('=== Environment Variables Check ===');
console.log('Current working directory:', process.cwd());
console.log('Environment file path:', envPath);
console.log('Environment variables loaded:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS ? 'configured' : 'not configured',
  SMTP_FROM: process.env.SMTP_FROM,
  FRONTEND_URL: process.env.FRONTEND_URL,
  MONGODB_URI: process.env.MONGODB_URI ? 'configured' : 'not configured',
});
console.log('================================');

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import certificateRoutes from './routes/certificates.js';
import templateRoutes from './routes/templates.js';
import transactionRoutes from './routes/transactions.js';
import recipientRoutes from './routes/recipients.js';
import contactRoutes from './routes/contact.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: config.nodeEnv === 'development' ? err.message : undefined
  });
});

app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/contact', contactRoutes);

mongoose.connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

export default app;