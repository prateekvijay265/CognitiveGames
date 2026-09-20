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
    const notes = await prisma.note.findMany({ where: { patientId }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: notes });
  } catch (e) { next(e); }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { patientId, content, isPrivate } = req.body;
    if (!patientId || !content) return next(createError('patientId and content required.', 400));
    const hasAccess = await authorizePatientAccess(req.user!.id, req.user!.role, patientId);
    if (!hasAccess) return next(createError('Access denied.', 403));
    const note = await prisma.note.create({
      data: { patientId, authorId: req.user!.id, authorName: req.user!.name, authorRole: req.user!.role, content, isPrivate: isPrivate ?? false },
    });
    await prisma.auditLog.create({ data: { userId: req.user!.id, action: 'NOTE_ADDED', resource: 'notes', resourceId: note.id } });
    res.status(201).json({ success: true, data: note });
  } catch (e) { next(e); }
});

export default router;
