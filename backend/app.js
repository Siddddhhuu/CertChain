import { config as dotenvConfig } from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct path
const envPath = path.join(__dirname, '.env');
console.log('Loading environment variables from:', envPath);
dotenvConfig({ path: envPath });

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import certificateRoutes from './routes/certificates.js';
import templateRoutes from './routes/templates.js';
import transactionRoutes from './routes/transactions.js';
import recipientRoutes from './routes/recipients.js';
import contactRoutes from './routes/contact.js';

const app = express();

// Simplified CORS configuration
app.use(cors({
  origin: 'https://cert-chain-sable.vercel.app',
  credentials: true
}));

// Body parsing middleware
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/recipients', recipientRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
    stack: config.nodeEnv === 'development' ? err.stack : undefined
  });
});

// Connect to MongoDB and start server
mongoose.connect(config.mongoUri, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => {
  console.log('Connected to MongoDB');
  const port = config.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Frontend URL: ${config.frontendUrl}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

export default app;