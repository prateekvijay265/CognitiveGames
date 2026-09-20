import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { limit = '50', userId, action } = req.query as Record<string, string>;
    const logs = await prisma.auditLog.findMany({
      where: {
        ...(userId && { userId }),
        ...(action && { action: { contains: action } }),
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit, 10),
      include: { user: { select: { name: true, email: true, role: true } } },
    });
    res.json({ success: true, data: logs });
  } catch (e) { next(e); }
});

export default router;
