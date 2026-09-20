import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo@1234';

async function main() {
  console.log('🌱 Seeding SMRITI CARE database...\n');

  // Hash password once
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  // ============================================================
  // USERS
  // ============================================================
  const [adminUser, caregiverUser, caregiverUser2, doctorUser, patientUser1, patientUser2, patientUser3, patientUser4, patientUser5] = await Promise.all([
    upsertUser({ email: 'admin@demo.smriticare.in', passwordHash, name: 'Rajiv Borah', role: 'admin', language: 'en', isDemo: true }),
    upsertUser({ email: 'caregiver@demo.smriticare.in', passwordHash, name: 'Priya Sharma', role: 'caregiver', language: 'en', isDemo: true }),
    upsertUser({ email: 'caregiver2@demo.smriticare.in', passwordHash, name: 'Sanjay Nath', role: 'caregiver', language: 'en', isDemo: true }),
    upsertUser({ email: 'doctor@demo.smriticare.in', passwordHash, name: 'Dr. Ananya Das', role: 'doctor', language: 'en', isDemo: true }),
    upsertUser({ email: 'patient@demo.smriticare.in', passwordHash, name: 'Asha Devi', role: 'patient', language: 'as', isDemo: true }),
    upsertUser({ email: 'patient2@demo.smriticare.in', passwordHash, name: 'Mohan Basumatary', role: 'patient', language: 'en', isDemo: true }),
    upsertUser({ email: 'patient3@demo.smriticare.in', passwordHash, name: 'Lalhmingmawii Sailo', role: 'patient', language: 'lus', isDemo: true }),
    upsertUser({ email: 'patient4@demo.smriticare.in', passwordHash, name: 'Tombi Singh', role: 'patient', language: 'mni', isDemo: true }),
    upsertUser({ email: 'patient5@demo.smriticare.in', passwordHash, name: 'Biren Khongmei', role: 'patient', language: 'en', isDemo: true }),
  ]);

  console.log('✅ Users created');

  // ============================================================
  // ROLE RECORDS
  // ============================================================
  const caregiver1 = await upsertCaregiver(caregiverUser.id);
  const caregiver2 = await upsertCaregiver(caregiverUser2.id);
  const doctor1 = await upsertDoctor(doctorUser.id);

  console.log('✅ Role records created');

  // ============================================================
  // PATIENTS
  // ============================================================
  const accessibilityLarge = JSON.stringify({ fontSize: 'x-large', highContrast: false, reducedMotion: false, voiceEnabled: true, soundEnabled: true, hapticEnabled: true });
  const difficultyEasy = JSON.stringify({ memoryMatch: 'easy', rememberObjects: 'easy', sequenceMemory: 'easy', findDifference: 'medium', sortMyDay: 'easy', objectRecognition: 'medium', patternBuilder: 'easy', attentionTap: 'medium', soundMemory: 'easy', storyMemory: 'easy' });
  const difficultyMedium = JSON.stringify({ memoryMatch: 'medium', rememberObjects: 'medium', sequenceMemory: 'medium', findDifference: 'medium', sortMyDay: 'easy', objectRecognition: 'medium', patternBuilder: 'medium', attentionTap: 'easy', soundMemory: 'medium', storyMemory: 'medium' });
  const difficultyHard = JSON.stringify({ memoryMatch: 'hard', rememberObjects: 'medium', sequenceMemory: 'hard', findDifference: 'hard', sortMyDay: 'medium', objectRecognition: 'hard', patternBuilder: 'hard', attentionTap: 'medium', soundMemory: 'medium', storyMemory: 'medium' });

  const patients = await Promise.all([
    upsertPatient(patientUser1.id, { dateOfBirth: '1954-03-12', emergencyContactName: 'Priya Sharma', emergencyContactRelationship: 'Daughter', emergencyContactPhone: '+91 98765 43210', accessibilityJson: accessibilityLarge, difficultyJson: difficultyEasy, lastActiveAt: new Date(), isDemo: true }),
    upsertPatient(patientUser2.id, { dateOfBirth: '1958-07-22', emergencyContactName: 'Deepa Basumatary', emergencyContactRelationship: 'Wife', emergencyContactPhone: '+91 87654 32109', accessibilityJson: JSON.stringify({ fontSize: 'large', highContrast: false, reducedMotion: false, voiceEnabled: true, soundEnabled: true, hapticEnabled: false }), difficultyJson: difficultyMedium, lastActiveAt: subDays(1), isDemo: true }),
    upsertPatient(patientUser3.id, { dateOfBirth: '1951-11-05', emergencyContactName: 'Remi Sailo', emergencyContactRelationship: 'Son', emergencyContactPhone: '+91 76543 21098', accessibilityJson: JSON.stringify({ fontSize: 'x-large', highContrast: true, reducedMotion: true, voiceEnabled: true, soundEnabled: false, hapticEnabled: true }), difficultyJson: difficultyEasy, lastActiveAt: subDays(2), isDemo: true }),
    upsertPatient(patientUser4.id, { dateOfBirth: '1956-04-18', emergencyContactName: 'Sangeeta Singh', emergencyContactRelationship: 'Daughter', emergencyContactPhone: '+91 65432 10987', accessibilityJson: JSON.stringify({ fontSize: 'large', highContrast: false, reducedMotion: false, voiceEnabled: false, soundEnabled: true, hapticEnabled: true }), difficultyJson: difficultyMedium, lastActiveAt: new Date(), isDemo: true }),
    upsertPatient(patientUser5.id, { dateOfBirth: '1961-09-30', emergencyContactName: 'Rita Khongmei', emergencyContactRelationship: 'Wife', emergencyContactPhone: '+91 54321 09876', accessibilityJson: JSON.stringify({ fontSize: 'normal', highContrast: false, reducedMotion: false, voiceEnabled: true, soundEnabled: true, hapticEnabled: false }), difficultyJson: difficultyHard, lastActiveAt: new Date(), isDemo: true }),
  ]);

  console.log('✅ Patients created');

  // ============================================================
  // PATIENT-CAREGIVER LINKS
  // ============================================================
  await Promise.all([
    linkPatientCaregiver(patients[0].id, caregiver1.id),
    linkPatientCaregiver(patients[1].id, caregiver1.id),
    linkPatientCaregiver(patients[4].id, caregiver1.id),
    linkPatientCaregiver(patients[2].id, caregiver2.id),
    linkPatientCaregiver(patients[3].id, caregiver2.id),
  ]);

  // PATIENT-DOCTOR LINKS
  await Promise.all(patients.map((p) => linkPatientDoctor(p.id, doctor1.id)));

  console.log('✅ Links created');

  // ============================================================
  // REMINDERS for patient 1
  // ============================================================
  const reminderDefs = [
    { type: 'medicine', title: 'Morning Medicine', description: 'Take prescribed morning medicine with water', scheduledTime: '08:00', voiceEnabled: true, caregiverNotify: true },
    { type: 'hydration', title: 'Drink Water', description: 'Have a glass of water', scheduledTime: '10:00', voiceEnabled: true, caregiverNotify: false },
    { type: 'meal', title: 'Lunch Time', description: 'Time for your midday meal', scheduledTime: '13:00', voiceEnabled: true, caregiverNotify: false },
    { type: 'hydration', title: 'Afternoon Water', description: 'Have a glass of water', scheduledTime: '15:30', voiceEnabled: false, caregiverNotify: false },
    { type: 'medicine', title: 'Evening Medicine', description: 'Take prescribed evening medicine', scheduledTime: '18:00', voiceEnabled: true, caregiverNotify: true },
    { type: 'exercise', title: 'Evening Walk', description: 'Short walk in the garden', scheduledTime: '17:00', voiceEnabled: true, caregiverNotify: false },
    { type: 'meal', title: 'Dinner Time', description: 'Time for your evening meal', scheduledTime: '19:30', voiceEnabled: true, caregiverNotify: false },
  ];

  for (const rem of reminderDefs) {
    await prisma.reminder.upsert({
      where: { id: `rem-${patients[0].id}-${rem.type}-${rem.scheduledTime}` },
      create: {
        id: `rem-${patients[0].id}-${rem.type}-${rem.scheduledTime}`,
        patientId: patients[0].id,
        soundEnabled: true,
        vibrationEnabled: true,
        isActive: true,
        repeatScheduleJson: JSON.stringify({ type: 'daily' }),
        ...rem,
      },
      update: {},
    });
  }

  console.log('✅ Reminders created');

  // ============================================================
  // DAILY ROUTINE for patient 1
  // ============================================================
  const routineItems = [
    { title: 'Wake Up', icon: '☀️', scheduledTime: '07:00', category: 'morning', order: 1 },
    { title: 'Drink Water', icon: '💧', scheduledTime: '07:15', category: 'morning', order: 2 },
    { title: 'Breakfast', icon: '🍽', scheduledTime: '08:00', category: 'morning', order: 3 },
    { title: 'Morning Medicine', icon: '💊', scheduledTime: '08:30', category: 'morning', order: 4 },
    { title: 'Morning Walk', icon: '🚶', scheduledTime: '09:00', category: 'morning', order: 5 },
    { title: 'Brain Activity', icon: '🧠', scheduledTime: '10:00', category: 'morning', order: 6 },
    { title: 'Rest', icon: '☕', scheduledTime: '11:30', category: 'morning', order: 7 },
    { title: 'Lunch', icon: '🍛', scheduledTime: '13:00', category: 'afternoon', order: 8 },
    { title: 'Afternoon Rest', icon: '😴', scheduledTime: '14:00', category: 'afternoon', order: 9 },
    { title: 'Evening Activity', icon: '🌆', scheduledTime: '16:00', category: 'evening', order: 10 },
    { title: 'Evening Walk', icon: '🌳', scheduledTime: '17:00', category: 'evening', order: 11 },
    { title: 'Dinner', icon: '🍽', scheduledTime: '19:00', category: 'evening', order: 12 },
    { title: 'Evening Medicine', icon: '💊', scheduledTime: '19:30', category: 'evening', order: 13 },
    { title: 'Sleep', icon: '🌙', scheduledTime: '21:00', category: 'night', order: 14 },
  ];

  for (const item of routineItems) {
    await prisma.dailyRoutineItem.upsert({
      where: { id: `routine-${patients[0].id}-${item.order}` },
      create: { id: `routine-${patients[0].id}-${item.order}`, patientId: patients[0].id, ...item },
      update: {},
    });
  }

  console.log('✅ Routine items created');

  // ============================================================
  // MEMORY BOOK entries
  // ============================================================
  const memoryEntries = [
    { personName: 'Priya', relationship: 'Daughter', story: 'Priya visits every Sunday. She loves making tea for everyone in the family. She studied in Guwahati and works as a teacher.', date: '2025-12-25' },
    { personName: 'Rohan', relationship: 'Grandson', story: 'Rohan is 8 years old. He loves to play in the garden and fly kites during Bihu. He calls me "Aita".', date: '2026-01-15' },
    { personName: 'The Tea Garden', relationship: 'Childhood Memory', story: 'Our family\'s tea garden near the Brahmaputra hills. We would pick tea leaves every morning before sunrise. The smell of fresh tea still makes me happy.', date: '1975-06-01' },
    { personName: 'Mantu', relationship: 'Husband', story: 'We were married for 45 wonderful years. He used to bring me gamosas from the market every Bihu. I miss his laughter.', date: '1980-04-14' },
  ];

  for (const [i, entry] of memoryEntries.entries()) {
    await prisma.memoryBookEntry.upsert({
      where: { id: `mb-${patients[0].id}-${i}` },
      create: { id: `mb-${patients[0].id}-${i}`, patientId: patients[0].id, ...entry },
      update: {},
    });
  }

  console.log('✅ Memory book entries created');

  // ============================================================
  // GAME SESSIONS (100+)
  // ============================================================
  const gameIds = ['memory-match', 'remember-objects', 'sequence-memory', 'find-difference', 'sort-my-day', 'object-recognition', 'pattern-builder', 'attention-tap', 'sound-memory', 'story-memory'];
  const domains = { 'memory-match': 'memory', 'remember-objects': 'memory', 'sequence-memory': 'memory', 'find-difference': 'attention', 'sort-my-day': 'routine-recall', 'object-recognition': 'recognition', 'pattern-builder': 'pattern-reasoning', 'attention-tap': 'attention', 'sound-memory': 'memory', 'story-memory': 'memory' } as Record<string, string>;

  let sessionCount = 0;
  for (const patient of patients) {
    for (let daysAgo = 28; daysAgo >= 0; daysAgo--) {
      const date = subDays(daysAgo);
      const sessionsPerDay = 2 + Math.floor(Math.random() * 3);
      for (let s = 0; s < sessionsPerDay; s++) {
        const gameId = gameIds[Math.floor(Math.random() * gameIds.length)];
        const hour = 8 + Math.floor(Math.random() * 10);
        date.setHours(hour, Math.floor(Math.random() * 60));
        const baseAcc = patient.id === patients[4].id ? 83 : 68;
        const accuracy = clamp(baseAcc + (Math.random() * 20 - 10), 20, 100);
        const sid = `demo-session-${patient.id}-${daysAgo}-${s}`;
        try {
          await prisma.gameSession.upsert({
            where: { sessionId: sid },
            create: {
              id: sid,
              sessionId: sid,
              gameId,
              patientId: patient.id,
              startedAt: new Date(date),
              completedAt: new Date(date.getTime() + (3 + Math.random() * 7) * 60000),
              difficulty: daysAgo > 14 ? 'easy' : 'medium',
              accuracy: Math.round(accuracy),
              responseTimeMs: Math.round(4000 + Math.random() * 5000),
              hintsUsed: Math.floor(Math.random() * 3),
              mistakes: Math.floor(Math.random() * 4),
              score: Math.round(accuracy * 10),
              totalQuestions: 10,
              answeredQuestions: Math.floor(8 + Math.random() * 3),
              completed: Math.random() > 0.1,
              abandoned: Math.random() < 0.05,
              cognitiveDomain: domains[gameId],
              language: 'en',
              offline: Math.random() < 0.15,
              syncStatus: 'synced',
            },
            update: {},
          });
          sessionCount++;
        } catch { /* skip duplicate */ }
      }
    }
  }

  console.log(`✅ ${sessionCount} game sessions created`);

  // ============================================================
  // NOTES
  // ============================================================
  await prisma.note.upsert({
    where: { id: 'demo-note-1' },
    create: {
      id: 'demo-note-1',
      patientId: patients[0].id,
      authorId: caregiverUser.id,
      authorName: 'Priya Sharma',
      authorRole: 'caregiver',
      content: 'Asha seemed a bit tired today but completed all morning reminders. She enjoyed the Memory Match activity and asked to play it again.',
      isPrivate: false,
    },
    update: {},
  });

  await prisma.note.upsert({
    where: { id: 'demo-note-2' },
    create: {
      id: 'demo-note-2',
      patientId: patients[0].id,
      authorId: doctorUser.id,
      authorName: 'Dr. Ananya Das',
      authorRole: 'doctor',
      content: 'Review of 4-week activity report. Consistent engagement observed. Recommend continuing current cognitive activity routine. Follow up in 4 weeks.',
      isPrivate: false,
    },
    update: {},
  });

  console.log('✅ Notes created');

  // ============================================================
  // ALERTS
  // ============================================================
  await prisma.alert.upsert({
    where: { id: 'demo-alert-1' },
    create: {
      id: 'demo-alert-1',
      patientId: patients[0].id,
      type: 'missed-reminders',
      severity: 'attention',
      title: 'Missed Reminders',
      message: 'Asha missed 2 reminders yesterday. Consider checking in.',
      isRead: false,
      isResolved: false,
    },
    update: {},
  });

  await prisma.alert.upsert({
    where: { id: 'demo-alert-2' },
    create: {
      id: 'demo-alert-2',
      patientId: patients[2].id,
      type: 'low-activity',
      severity: 'attention',
      title: 'Lower Activity Than Usual',
      message: 'Lalhmingmawii\'s activity has been lower than usual during the last 7 days.',
      isRead: false,
      isResolved: false,
    },
    update: {},
  });

  console.log('✅ Alerts created');

  // ============================================================
  // MOOD ENTRIES
  // ============================================================
  const moods = ['great', 'good', 'good', 'okay', 'good', 'great', 'okay'];
  for (let i = 0; i < 14; i++) {
    await prisma.moodEntry.upsert({
      where: { id: `demo-mood-${i}` },
      create: {
        id: `demo-mood-${i}`,
        patientId: patients[0].id,
        mood: moods[i % 7],
        recordedAt: subDays(i),
      },
      update: {},
    });
  }

  console.log('✅ Mood entries created');

  // ============================================================
  // AUDIT LOGS
  // ============================================================
  const auditActions = [
    { userId: caregiverUser.id, action: 'USER_LOGIN', resource: 'auth' },
    { userId: caregiverUser.id, action: 'PATIENT_VIEWED', resource: 'patients', resourceId: patients[0].id },
    { userId: caregiverUser.id, action: 'REMINDER_CREATED', resource: 'reminders' },
    { userId: doctorUser.id, action: 'USER_LOGIN', resource: 'auth' },
    { userId: doctorUser.id, action: 'PATIENT_VIEWED', resource: 'patients', resourceId: patients[0].id },
    { userId: doctorUser.id, action: 'NOTE_ADDED', resource: 'notes', resourceId: 'demo-note-2' },
    { userId: adminUser.id, action: 'USER_LOGIN', resource: 'auth' },
  ];

  for (const [i, log] of auditActions.entries()) {
    await prisma.auditLog.upsert({
      where: { id: `demo-audit-${i}` },
      create: { id: `demo-audit-${i}`, ...log },
      update: {},
    });
  }

  console.log('✅ Audit logs created');

  console.log('\n🎉 Database seeded successfully!\n');
  console.log('📋 Demo Credentials:');
  console.log('   Patient:   patient@demo.smriticare.in / Demo@1234');
  console.log('   Caregiver: caregiver@demo.smriticare.in / Demo@1234');
  console.log('   Doctor:    doctor@demo.smriticare.in / Demo@1234');
  console.log('   Admin:     admin@demo.smriticare.in / Demo@1234\n');
}

// Helpers
async function upsertUser(data: { email: string; passwordHash: string; name: string; role: string; language: string; isDemo: boolean }) {
  return prisma.user.upsert({
    where: { email: data.email },
    create: data,
    update: { name: data.name, passwordHash: data.passwordHash },
  });
}

async function upsertCaregiver(userId: string) {
  return prisma.caregiver.upsert({ where: { userId }, create: { userId }, update: {} });
}

async function upsertDoctor(userId: string) {
  return prisma.healthcareWorker.upsert({ where: { userId }, create: { userId }, update: {} });
}

async function upsertPatient(userId: string, data: Partial<{
  dateOfBirth: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  accessibilityJson: string;
  difficultyJson: string;
  lastActiveAt: Date;
  isDemo: boolean;
}>) {
  return prisma.patient.upsert({ where: { userId }, create: { userId, ...data }, update: data });
}

async function linkPatientCaregiver(patientId: string, caregiverId: string) {
  return prisma.patientCaregiverLink.upsert({
    where: { patientId_caregiverId: { patientId, caregiverId } },
    create: { patientId, caregiverId },
    update: {},
  });
}

async function linkPatientDoctor(patientId: string, healthcareWorkerId: string) {
  return prisma.patientDoctorLink.upsert({
    where: { patientId_healthcareWorkerId: { patientId, healthcareWorkerId } },
    create: { patientId, healthcareWorkerId },
    update: {},
  });
}

function subDays(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
