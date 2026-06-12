import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(cookieParser());

// Database connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shrradha_school';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err.message}`);
    console.warn(`WARNING: Server is running without a database connection. Please provide a valid MONGO_URI.`);
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Basic Route
app.get('/', (req, res) => {
  res.send('SHRRADHA HIGH SCHOOL API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/chat', chatbotRoutes);
// Serve uploads folder for local storage fallback
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Basic Route
app.get('/', (req, res) => {
  res.send('SHRRADHA HIGH SCHOOL API is running...');
});
