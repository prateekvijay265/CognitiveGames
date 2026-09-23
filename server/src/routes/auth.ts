import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { createError } from '../middleware/errorHandler';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(100),
  role: z.enum(['patient', 'caregiver', 'doctor', 'admin']),
});

function signToken(user: { id: string; email: string; role: string; name: string }) {
  const secret = process.env.JWT_SECRET!;
  const expiry = process.env.JWT_EXPIRY ?? '7d';
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    secret,
    { expiresIn: expiry } as jwt.SignOptions
  );
}

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response, next) => {
  try {
    const body = loginSchema.safeParse(req.body);
    if (!body.success) {
      return next(createError('Invalid email or password format.', 400));
    }

    const { email, password } = body.data;
    const cleanEmail = email.toLowerCase().trim();
    let user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    // If not found, check demo aliases
    if (!user) {
      const aliasMap: Record<string, string> = {
        'patient@demo.neuromind.in': 'patient-easy@demo.com',
        'patient@demo.com': 'patient-easy@demo.com',
        'caregiver@demo.neuromind.in': 'caregiver@demo.com',
        'doctor@demo.neuromind.in': 'doctor@demo.com',
        'admin@demo.neuromind.in': 'admin@demo.com',
      };
      if (aliasMap[cleanEmail]) {
        user = await prisma.user.findUnique({ where: { email: aliasMap[cleanEmail] } });
      }
    }

    if (!user || !user.isActive) {
      return next(createError('Invalid credentials.', 401));
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return next(createError('Invalid credentials.', 401));
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        resource: 'auth',
        resourceId: user.id,
      },
    });

    const token = signToken(user);

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          language: user.language,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response, next) => {
  try {
    const body = registerSchema.safeParse(req.body);
    if (!body.success) {
      return next(createError('Invalid registration data.', 400));
    }

    const { email, password, name, role } = body.data;

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (existing) {
      return next(createError('An account with this email already exists.', 409));
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name: name.trim(),
        role,
      },
    });

    // Create role-specific record
    if (role === 'patient') {
      await prisma.patient.create({ data: { userId: user.id } });
    } else if (role === 'caregiver') {
      await prisma.caregiver.create({ data: { userId: user.id } });
    } else if (role === 'doctor') {
      await prisma.healthcareWorker.create({ data: { userId: user.id } });
    }

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_REGISTERED',
        resource: 'auth',
        resourceId: user.id,
      },
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          language: user.language,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req: Request, res: Response, next) => {
  try {
    const { email } = req.body;
    if (!email) return next(createError('Email required.', 400));

    // In production, send email. For demo, just return success.
    // Never reveal if email exists (security)
    res.json({
      success: true,
      message: 'If an account exists with this email, a reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', async (req: Request, res: Response, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return next(createError('Not authenticated.', 401));
    }
    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as { id: string };

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return next(createError('User not found.', 404));

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch {
    next(createError('Invalid token.', 401));
  }
});

export default router;
