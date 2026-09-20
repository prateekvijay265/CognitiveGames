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
    const reminders = await prisma.reminder.findMany({ where: { patientId, isActive: true }, orderBy: { scheduledTime: 'asc' } });
    res.json({ success: true, data: reminders });
  } catch (e) { next(e); }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { patientId, type, title, description, scheduledTime, repeatSchedule, voiceEnabled, soundEnabled, vibrationEnabled, caregiverNotify } = req.body;
    if (!patientId || !type || !title || !scheduledTime) return next(createError('Missing required fields.', 400));
    const hasAccess = await authorizePatientAccess(req.user!.id, req.user!.role, patientId);
    if (!hasAccess) return next(createError('Access denied.', 403));
    const reminder = await prisma.reminder.create({ data: { patientId, type, title, description, scheduledTime, repeatScheduleJson: repeatSchedule ? JSON.stringify(repeatSchedule) : null, voiceEnabled: voiceEnabled ?? true, soundEnabled: soundEnabled ?? true, vibrationEnabled: vibrationEnabled ?? false, caregiverNotify: caregiverNotify ?? false } });
    res.status(201).json({ success: true, data: reminder });
  } catch (e) { next(e); }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const reminder = await prisma.reminder.findUnique({ where: { id: req.params.id } });
    if (!reminder) return next(createError('Not found.', 404));
    const hasAccess = await authorizePatientAccess(req.user!.id, req.user!.role, reminder.patientId);
    if (!hasAccess) return next(createError('Access denied.', 403));
    await prisma.reminder.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true, message: 'Reminder removed.' });
  } catch (e) { next(e); }
});

export default router;
