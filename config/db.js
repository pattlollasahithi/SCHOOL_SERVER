import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    logger.error('MONGO_URI is not defined in the environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGO_URI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    logger.warn('Server is running without an active database connection. Mongoose will attempt to reconnect.');
  }
};

export default connectDB;
