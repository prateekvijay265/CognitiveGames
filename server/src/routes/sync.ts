import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// POST /api/sync/events — receive sync events from client
router.post('/events', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id, type, payload, createdAt, deviceId } = req.body;
    if (!id || !type || !payload) return next(createError('Invalid sync event.', 400));

    // Upsert (idempotency by id)
    await prisma.syncEvent.upsert({
      where: { id },
      create: {
        id,
        type,
        payloadJson: JSON.stringify(payload),
        deviceId: deviceId ?? 'unknown',
        status: 'synced',
        syncedAt: new Date(),
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      },
      update: {
        status: 'synced',
        syncedAt: new Date(),
      },
    });

    res.json({ success: true, message: 'Event synced.' });
  } catch (error) {
    next(error);
  }
});

// GET /api/sync/status — sync status for patient
router.get('/status', authenticate, async (_req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    data: { status: 'online', timestamp: new Date().toISOString() },
  });
});

export default router;
