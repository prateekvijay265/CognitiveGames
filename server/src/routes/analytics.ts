import { Router, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorizePatientAccess, AuthRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// GET /api/analytics/patient/:id/trends
router.get('/patient/:id/trends', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    const { id: patientId } = req.params;
    const { days = '28' } = req.query as Record<string, string>;
    const userId = req.user!.id;
    const role = req.user!.role;

    const hasAccess = await authorizePatientAccess(userId, role, patientId);
    if (!hasAccess) return next(createError('Access denied.', 403));

    const since = new Date();
    since.setDate(since.getDate() - parseInt(days, 10));

    const sessions = await prisma.gameSession.findMany({
      where: { patientId, startedAt: { gte: since }, completed: true },
      orderBy: { startedAt: 'asc' },
    });

    // Group by date
    const byDate: Record<string, { accuracy: number[]; count: number }> = {};
    sessions.forEach((s) => {
      const date = s.startedAt.toISOString().split('T')[0];
      if (!byDate[date]) byDate[date] = { accuracy: [], count: 0 };
      byDate[date].accuracy.push(s.accuracy);
      byDate[date].count++;
    });

    const trendData = Object.entries(byDate).map(([date, { accuracy, count }]) => ({
      date,
      averageAccuracy: Math.round(accuracy.reduce((a, b) => a + b, 0) / accuracy.length),
      sessionCount: count,
    }));

    // Domain breakdown
    const domainStats = await prisma.gameSession.groupBy({
      by: ['cognitiveDomain'],
      where: { patientId, startedAt: { gte: since }, completed: true },
      _avg: { accuracy: true },
      _count: { id: true },
    });

    // Reminder adherence
    const reminderEvents = await prisma.reminderEvent.findMany({
      where: { patientId, scheduledAt: { gte: since } },
    });
    const doneEvents = reminderEvents.filter((e) => e.status === 'done').length;
    const adherenceRate = reminderEvents.length > 0 ? (doneEvents / reminderEvents.length) * 100 : 0;

    res.json({
      success: true,
      data: {
        trendData,
        domainStats: domainStats.map((d) => ({
          domain: d.cognitiveDomain,
          averageAccuracy: Math.round(d._avg.accuracy ?? 0),
          sessionCount: d._count.id,
        })),
        reminderAdherence: Math.round(adherenceRate),
        totalSessions: sessions.length,
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/analytics/dashboard — admin dashboard stats
router.get('/dashboard', authenticate, async (req: AuthRequest, res: Response, next) => {
  try {
    if (req.user!.role !== 'admin') return next(createError('Access denied.', 403));

    const [userCount, patientCount, sessionCount, alertCount] = await Promise.all([
      prisma.user.count(),
      prisma.patient.count(),
      prisma.gameSession.count(),
      prisma.alert.count({ where: { isResolved: false } }),
    ]);

    res.json({
      success: true,
      data: { userCount, patientCount, sessionCount, alertCount },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
