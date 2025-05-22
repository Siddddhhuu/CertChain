import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import config from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import certificateRoutes from './routes/certificates.js';
import templateRoutes from './routes/templates.js';
import transactionRoutes from './routes/transactions.js';
import recipientRoutes from './routes/recipients.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/recipients', recipientRoutes);

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