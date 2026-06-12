import express from 'express';
import path from 'path';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Utilities & config
import logger from './utils/logger.js';
import { validateEnv } from './config/validateEnv.js';
import errorHandler from './middleware/errorHandler.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import admissionRoutes from './routes/admissionRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js';
import announcementRoutes from './routes/announcementRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

// Load env vars & validate
dotenv.config();
validateEnv();
connectDB();

const app = express();
const isDev = process.env.NODE_ENV !== 'production';

// --- Middleware ---

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// CORS — dynamic origins from env, fallback to localhost in dev
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Security headers — production-safe Helmet config
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: isDev ? false : undefined,
}));

// Request logging — only in development
if (isDev) {
  app.use(morgan('dev'));
}

// Global rate limiter
app.use('/api/', apiLimiter);

// --- Health Check ---
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// --- Routes ---
app.get('/', (req, res) => {
  res.send('SHRRADHA HIGH SCHOOL API is running...');
});

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/chat', chatbotRoutes);

// Serve uploads folder for local storage fallback
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// --- Centralized Error Handler (must be last) ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Only listen when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
}

export default app;
