import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, language: true, isActive: true, isDemo: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: users });
  } catch (e) { next(e); }
});

router.patch('/:id', authenticate, requireRole('admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { isActive, role } = req.body;
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { ...(isActive !== undefined && { isActive }), ...(role && { role }) },
      select: { id: true, email: true, name: true, role: true, isActive: true },
    });
    res.json({ success: true, data: user });
  } catch (e) { next(e); }
});

export default router;
