import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import {
 motion } from 'framer-motion';
import {

  FileText,
  Download,
  Printer,
  Calendar,
  User,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';

export function DoctorReports() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0].id);
  const [dateRange, setDateRange] = useState<'30d' | '60d' | '90d'>('30d');
  const [reportType, setReportType] = useState<
    'comprehensive' | 'domain-breakdown' | 'adherence-summary'
  >('comprehensive');
  const [generated, setGenerated] = useState(true);

  const patient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0];

  const handleDownload = () => {
    const reportText = `
SMRITI CARE - CLINICAL OBSERVATION DOSSIER
======================================================
Patient: ${patient.name} | Age: ${patient.age} | Language: ${patient.language}
Report Type: ${reportType.toUpperCase()}
Period: Past ${dateRange}
Date Generated: ${new Date().toLocaleDateString()}
Clinician: Dr. Ananya Das

SUMMARY FINDINGS:
1. Platform engagement has remained stable with regular daily participation.
2. Routine memory and attention exercises show preserved functional recall.
3. Medication adherence prompts achieved 92% successful acknowledgment.
4. No rapid degradation observed across tested parameters.

DISCLAIMER:
This report summarizes platform activity and is not a medical diagnosis.
======================================================
    `.trim();

    const element = document.createElement('a');
    const file = new Blob([reportText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Clinical_Dossier_${patient.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Clinical Report Generation
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Compile structured observational dossiers and export documentation for medical records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white border border-stone-200 text-stone-700 font-semibold text-xs rounded-xl shadow-xs hover:bg-stone-50 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-stone-500" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            Export Dossier
          </button>
        </div>
      </div>

      {/* Report Generator Controls */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Configure Dossier Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full p-2.5 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 focus:outline-hidden"
            >
              {DEMO_PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Age {p.age})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">Observation Period</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="w-full p-2.5 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 focus:outline-hidden"
            >
              <option value="30d">Past 30 Days (Standard)</option>
              <option value="60d">Past 60 Days (Bimonthly)</option>
              <option value="90d">Past 90 Days (Quarterly)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-600 block mb-1">Dossier Focus</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as typeof reportType)}
              className="w-full p-2.5 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 focus:outline-hidden"
            >
              <option value="comprehensive">Comprehensive Clinical Overview</option>
              <option value="domain-breakdown">Cognitive Domain Breakdown</option>
              <option value="adherence-summary">Reminder & Routine Adherence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Report Canvas */}
      {generated && (
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="border-b border-stone-200 pb-4 flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                Clinical Observation Dossier
              </span>
              <h2 className="text-2xl font-bold text-stone-900 mt-2">{patient.name}</h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Age: {patient.age} • Primary Language: {patient.language.toUpperCase()} • Generated:{' '}
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-stone-400 block font-semibold">Attending Physician</span>
              <span className="font-bold text-stone-800">Dr. Ananya Das</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-stone-700 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Clinical Observation Disclaimer:</strong> This summary details platform activity
              and observed interaction trends. It does not constitute a diagnostic medical evaluation.
            </span>
          </div>

          <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1 uppercase tracking-wider">
                1. Activity & Stability Summary
              </h4>
              <p>
                Patient completed 52 sessions during the selected {dateRange} observation window.
                Average observed accuracy across cognitive memory and attention activities was 81%,
                which aligns with historical baseline performance for this patient.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1 uppercase tracking-wider">
                2. Domain Evaluation
              </h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Memory Matching & Sequence Recall: 82% accuracy, normal response latency.</li>
                <li>Visual Attention & Detail Identification: 85% accuracy, steady focus.</li>
                <li>Routine & Daily Sequencing: 90% accuracy, highly preserved routine memory.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-stone-900 text-sm mb-1 uppercase tracking-wider">
                3. Medication & Hydration Adherence
              </h4>
              <p>
                Adherence tracking indicates 92% timely prompt acknowledgments. Missed prompts were
                isolated to weekend afternoons and followed up promptly by caregiver Priya Sharma.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default DoctorReports;
