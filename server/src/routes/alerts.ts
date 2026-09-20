import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorizePatientAccess, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { patientId } = req.query as { patientId: string };
    if (!patientId) return next(createError('patientId required.', 400));
    const hasAccess = await authorizePatientAccess(req.user!.id, req.user!.role, patientId);
    if (!hasAccess) return next(createError('Access denied.', 403));
    const alerts = await prisma.alert.findMany({ where: { patientId }, orderBy: { createdAt: 'desc' }, take: 50 });
    res.json({ success: true, data: alerts });
  } catch (e) { next(e); }
});

router.patch('/:id/resolve', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const alert = await prisma.alert.findUnique({ where: { id: req.params.id } });
    if (!alert) return next(createError('Not found.', 404));
    const hasAccess = await authorizePatientAccess(req.user!.id, req.user!.role, alert.patientId);
    if (!hasAccess) return next(createError('Access denied.', 403));
    const updated = await prisma.alert.update({ where: { id: req.params.id }, data: { isResolved: true, isRead: true } });
    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
});

router.patch('/:id/read', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const alert = await prisma.alert.findUnique({ where: { id: req.params.id } });
    if (!alert) return next(createError('Not found.', 404));
    const hasAccess = await authorizePatientAccess(req.user!.id, req.user!.role, alert.patientId);
    if (!hasAccess) return next(createError('Access denied.', 403));
    const updated = await prisma.alert.update({ where: { id: req.params.id }, data: { isRead: true } });
    res.json({ success: true, data: updated });
  } catch (e) { next(e); }
});

export default router;
