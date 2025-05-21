import dotenv from 'dotenv';
dotenv.config();

export default {
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT || 5000,
};
