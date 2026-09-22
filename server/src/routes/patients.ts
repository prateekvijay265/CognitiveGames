import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, requireRole, authorizePatientAccess, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/patients — list patients for caregiver/doctor/admin
router.get('/', authenticate, requireRole('caregiver', 'doctor', 'admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    let patientIds: string[] | undefined;

    if (role === 'caregiver') {
      const caregiver = await prisma.caregiver.findFirst({ where: { userId } });
      if (caregiver) {
        const links = await prisma.patientCaregiverLink.findMany({ where: { caregiverId: caregiver.id } });
        patientIds = links.map((l) => l.patientId);
      }
    } else if (role === 'doctor') {
      const hw = await prisma.healthcareWorker.findFirst({ where: { userId } });
      if (hw) {
        const links = await prisma.patientDoctorLink.findMany({ where: { healthcareWorkerId: hw.id } });
        patientIds = links.map((l) => l.patientId);
      }
    }

    const patients = await prisma.patient.findMany({
      where: patientIds ? { id: { in: patientIds } } : undefined,
      include: {
        user: { select: { name: true, email: true, language: true, isActive: true } },
        _count: {
          select: { gameSessions: true, reminders: true, alerts: true },
        },
      },
      orderBy: { lastActiveAt: 'desc' },
    });

    res.json({
      success: true,
      data: patients.map((p) => ({
        id: p.id,
        userId: p.userId,
        name: p.user.name,
        language: p.user.language,
        dateOfBirth: p.dateOfBirth,
        emergencyContact: p.emergencyContactName
          ? {
              name: p.emergencyContactName,
              relationship: p.emergencyContactRelationship,
              phone: p.emergencyContactPhone,
            }
          : null,
        accessibilitySettings: JSON.parse(p.accessibilityJson || '{}'),
        difficultyProfile: JSON.parse(p.difficultyJson || '{}'),
        lastActiveAt: p.lastActiveAt,
        lastSyncAt: p.lastSyncAt,
        isDemo: p.isDemo,
        sessionCount: p._count.gameSessions,
        reminderCount: p._count.reminders,
        alertCount: p._count.alerts,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/patients/:id — patient detail
router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    let { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    if (id === 'me' && role === 'patient') {
      const patientRecord = await prisma.patient.findFirst({ where: { userId } });
      if (!patientRecord) return next(createError('Patient not found.', 404));
      id = patientRecord.id;
    }

    const hasAccess = await authorizePatientAccess(userId, role, id);
    if (!hasAccess) {
      return next(createError('Access denied.', 403));
    }

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true, language: true } },
        alerts: { where: { isResolved: false }, orderBy: { createdAt: 'desc' }, take: 5 },
        notes: { orderBy: { createdAt: 'desc' }, take: 20 },
        reminders: { where: { isActive: true } },
        routineItems: { orderBy: { order: 'asc' } },
        memoryBookEntries: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!patient) {
      return next(createError('Patient not found.', 404));
    }

    const mappedPatient = {
      ...patient,
      name: patient.user.name,
      email: patient.user.email,
      language: patient.user.language,
      emergencyContact: patient.emergencyContactName ? {
        name: patient.emergencyContactName,
        relationship: patient.emergencyContactRelationship,
        phone: patient.emergencyContactPhone,
      } : null,
      accessibilitySettings: JSON.parse(patient.accessibilityJson || '{}'),
      difficultyProfile: JSON.parse(patient.difficultyJson || '{}'),
    };

    res.json({ success: true, data: mappedPatient });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/patients/:id — update patient
router.patch('/:id', authenticate, requireRole('caregiver', 'admin'), async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const hasAccess = await authorizePatientAccess(userId, role, id);
    if (!hasAccess) return next(createError('Access denied.', 403));

    const { language, accessibilitySettings, difficultyProfile, emergencyContact } = req.body;

    const updateData: Record<string, unknown> = {};
    if (language) {
      await prisma.user.update({
        where: { id: (await prisma.patient.findUnique({ where: { id } }))!.userId },
        data: { language },
      });
    }
    if (accessibilitySettings) updateData.accessibilityJson = JSON.stringify(accessibilitySettings);
    if (difficultyProfile) updateData.difficultyJson = JSON.stringify(difficultyProfile);
    if (emergencyContact) {
      updateData.emergencyContactName = emergencyContact.name;
      updateData.emergencyContactRelationship = emergencyContact.relationship;
      updateData.emergencyContactPhone = emergencyContact.phone;
    }

    const updated = await prisma.patient.update({ where: { id }, data: updateData as never });
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// GET /api/patients/:id/summary — dashboard summary
router.get('/:id/summary', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const role = req.user!.role;

    const hasAccess = await authorizePatientAccess(userId, role, id);
    if (!hasAccess) return next(createError('Access denied.', 403));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const [todaysSessions, latestAlert, pendingAlertsCount] = await Promise.all([
      prisma.gameSession.findMany({
        where: { patientId: id, startedAt: { gte: today, lte: todayEnd } },
        orderBy: { startedAt: 'desc' },
      }),
      prisma.alert.findFirst({
        where: { patientId: id, isResolved: false },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.alert.count({ where: { patientId: id, isResolved: false, isRead: false } }),
    ]);

    const completedSessions = todaysSessions.filter((s) => s.completed).length;
    const avgAccuracy =
      todaysSessions.length > 0
        ? todaysSessions.reduce((sum, s) => sum + s.accuracy, 0) / todaysSessions.length
        : 0;

    res.json({
      success: true,
      data: {
        todaysCompletedSessions: completedSessions,
        todaysTotalSessions: todaysSessions.length,
        avgAccuracy: Math.round(avgAccuracy),
        pendingAlerts: pendingAlertsCount,
        latestAlert,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
