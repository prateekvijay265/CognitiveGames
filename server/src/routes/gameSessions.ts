import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { authenticate, authorizePatientAccess, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

const sessionSchema = z.object({
  gameId: z.string(),
  patientId: z.string(),
  sessionId: z.string(),
  startedAt: z.string(),
  completedAt: z.string().optional(),
  difficulty: z.string(),
  accuracy: z.number().min(0).max(100),
  responseTimeMs: z.number().min(0),
  hintsUsed: z.number().min(0),
  mistakes: z.number().min(0),
  score: z.number().min(0),
  totalQuestions: z.number().min(0),
  answeredQuestions: z.number().min(0),
  completed: z.boolean(),
  abandoned: z.boolean(),
  cognitiveDomain: z.string(),
  language: z.string(),
  offline: z.boolean(),
});

// POST /api/game-sessions — save game session
router.post('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const body = sessionSchema.safeParse(req.body);
    if (!body.success) return next(createError('Invalid session data.', 400));

    const data = body.data;
    const userId = req.user!.id;
    const role = req.user!.role;

    const hasAccess = await authorizePatientAccess(userId, role, data.patientId);
    if (!hasAccess) return next(createError('Access denied.', 403));

    // Upsert by sessionId (idempotency)
    const session = await prisma.gameSession.upsert({
      where: { sessionId: data.sessionId },
      create: {
        ...data,
        syncStatus: 'synced',
        startedAt: new Date(data.startedAt),
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
      update: {
        ...data,
        syncStatus: 'synced',
        startedAt: new Date(data.startedAt),
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
    });

    // Update patient lastActiveAt
    await prisma.patient.update({
      where: { id: data.patientId },
      data: { lastActiveAt: new Date(), lastSyncAt: new Date() },
    });

    // Check alert conditions
    await checkAlertConditions(data.patientId);

    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
});

// GET /api/game-sessions?patientId=&limit=&gameId=
router.get('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { patientId, limit = '50', gameId, startDate, endDate } = req.query as Record<string, string>;
    if (!patientId) return next(createError('patientId required.', 400));

    const userId = req.user!.id;
    const role = req.user!.role;
    const hasAccess = await authorizePatientAccess(userId, role, patientId);
    if (!hasAccess) return next(createError('Access denied.', 403));

    const sessions = await prisma.gameSession.findMany({
      where: {
        patientId,
        ...(gameId && { gameId }),
        ...(startDate && { startedAt: { gte: new Date(startDate) } }),
        ...(endDate && { startedAt: { lte: new Date(endDate) } }),
      },
      orderBy: { startedAt: 'desc' },
      take: parseInt(limit, 10),
    });

    res.json({ success: true, data: sessions });
  } catch (error) {
    next(error);
  }
});

async function checkAlertConditions(patientId: string) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentSessions = await prisma.gameSession.findMany({
      where: { patientId, startedAt: { gte: sevenDaysAgo } },
    });

    const abandonedCount = recentSessions.filter((s) => s.abandoned).length;
    const completedCount = recentSessions.filter((s) => s.completed).length;

    // Check for low activity (less than 3 completed in 7 days)
    if (completedCount < 3) {
      const existing = await prisma.alert.findFirst({
        where: { patientId, type: 'low-activity', isResolved: false },
      });
      if (!existing) {
        await prisma.alert.create({
          data: {
            patientId,
            type: 'low-activity',
            severity: 'attention',
            title: 'Lower Activity Than Usual',
            message: 'Activity has been lower than usual during the last 7 days.',
          },
        });
      }
    }

    // Check for game abandonment
    if (abandonedCount >= 3) {
      const existing = await prisma.alert.findFirst({
        where: { patientId, type: 'game-abandoned', isResolved: false },
      });
      if (!existing) {
        await prisma.alert.create({
          data: {
            patientId,
            type: 'game-abandoned',
            severity: 'info',
            title: 'Activity Not Completed',
            message: 'Several activities were not completed recently. No concern at this time.',
          },
        });
      }
    }
  } catch {
    // Non-critical - don't fail the request
  }
}

export default router;
