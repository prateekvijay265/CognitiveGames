import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRouter from './routes/auth';
import patientsRouter from './routes/patients';
import usersRouter from './routes/users';
import gameSessionsRouter from './routes/gameSessions';
import remindersRouter from './routes/reminders';
import analyticsRouter from './routes/analytics';
import syncRouter from './routes/sync';
import alertsRouter from './routes/alerts';
import notesRouter from './routes/notes';
import auditRouter from './routes/audit';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './lib/prisma';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173').split(',');
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 requests per windowMs
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Auth-specific rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts.' },
});
app.use('/api/auth/', authLimiter);

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/patients', patientsRouter);
app.use('/api/game-sessions', gameSessionsRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/sync', syncRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/audit', auditRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV,
    },
  });
});

// Error handler
app.use(errorHandler);

// Start server
async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');

    app.listen(PORT, () => {
      console.log(`🚀 SMRITI CARE API running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`\n📋 Demo Accounts:`);
      console.log(`   Patient:   patient@demo.smriticare.in / Demo@1234`);
      console.log(`   Caregiver: caregiver@demo.smriticare.in / Demo@1234`);
      console.log(`   Doctor:    doctor@demo.smriticare.in / Demo@1234`);
      console.log(`   Admin:     admin@demo.smriticare.in / Demo@1234`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    process.exit(1);
  }
}

bootstrap();

export default app;
