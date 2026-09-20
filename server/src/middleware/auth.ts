import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'No authentication token provided.' });
    return;
  }

  const token = authHeader.substring(7);
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ success: false, message: 'Server configuration error.' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as {
      id: string;
      email: string;
      role: string;
      name: string;
    };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
      return;
    }
    next();
  };
}

// Check that a caregiver/doctor is authorized to access a patient
export async function authorizePatientAccess(
  userId: string,
  userRole: string,
  patientId: string
): Promise<boolean> {
  if (userRole === 'admin') return true;

  if (userRole === 'caregiver') {
    const caregiver = await prisma.caregiver.findFirst({ where: { userId } });
    if (!caregiver) return false;
    const link = await prisma.patientCaregiverLink.findFirst({
      where: { patientId, caregiverId: caregiver.id },
    });
    return !!link;
  }

  if (userRole === 'doctor') {
    const hw = await prisma.healthcareWorker.findFirst({ where: { userId } });
    if (!hw) return false;
    const link = await prisma.patientDoctorLink.findFirst({
      where: { patientId, healthcareWorkerId: hw.id },
    });
    return !!link;
  }

  if (userRole === 'patient') {
    const patient = await prisma.patient.findFirst({ where: { userId } });
    return patient?.id === patientId;
  }

  return false;
}
