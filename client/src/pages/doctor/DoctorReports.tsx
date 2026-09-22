import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Printer,
  Info,
} from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export function DoctorReports() {
  const { patients: DEMO_PATIENTS } = useAppDataStore();
  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0]?.id || '');
  const [dateRange, setDateRange] = useState<'30d' | '60d' | '90d'>('30d');
  const [reportType, setReportType] = useState<
    'comprehensive' | 'domain-breakdown' | 'adherence-summary'
  >('comprehensive');
  const [generated, setGenerated] = useState(true);

  if (DEMO_PATIENTS.length === 0) {
    return (
      <div className="flex-1 p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="arcade-card p-8 max-w-md text-center">
          <h2 className="font-display font-bold text-ink text-xl uppercase mb-2">No Patients Found</h2>
          <p className="font-mono text-sand text-sm">You don't have any patients assigned yet.</p>
        </div>
      </div>
    );
  }

  const patient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0];

  const handleDownload = () => {
    const reportText = `
Neuro Mind - CLINICAL OBSERVATION DOSSIER
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1 flex items-center gap-6">
            <FileText className="w-4 h-4" /> Reports
          </div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Clinical Dossier
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Compile structured observational dossiers and export documentation.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => window.print()}
            className="btn btn-ghost bg-kraft text-ink"
          >
            <Printer className="w-4 h-4 inline mr-2" />
            Print
          </button>
          <button
            onClick={handleDownload}
            className="btn"
            style={{ backgroundColor: '#7c3aed', color: 'white' }}
          >
            <Download className="w-4 h-4 inline mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Report Generator Controls */}
      <div className="arcade-card p-6 space-y-8">
        <h3 className="font-display font-bold text-ink uppercase tracking-widest border-b-2 border-ink/20 pb-2">
          Configure Dossier Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div>
            <label className="smallcaps text-sand block mb-2">Select Patient</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="arcade-select w-full"
            >
              {DEMO_PATIENTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Age {p.age})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="smallcaps text-sand block mb-2">Observation Period</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="arcade-select w-full"
            >
              <option value="30d">Past 30 Days</option>
              <option value="60d">Past 60 Days</option>
              <option value="90d">Past 90 Days</option>
            </select>
          </div>

          <div>
            <label className="smallcaps text-sand block mb-2">Dossier Focus</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as typeof reportType)}
              className="arcade-select w-full"
            >
              <option value="comprehensive">Comprehensive Overview</option>
              <option value="domain-breakdown">Domain Breakdown</option>
              <option value="adherence-summary">Adherence Summary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Report Canvas */}
      {generated && (
        <div className="paper grain border-4 border-ink p-8 shadow-[8px_8px_0px_rgba(26,21,18,1)] space-y-8">
          <div className="border-b-4 border-ink pb-6 flex justify-between items-start">
            <div>
              <span className="badge bg-kraft2 text-ink border-2 border-ink mb-3 block w-max">
                Clinical Observation Dossier
              </span>
              <h2 className="font-display font-bold text-ink text-3xl uppercase tracking-widest">{patient.name}</h2>
              <p className="font-mono text-sm text-sand mt-2">
                Age: {patient.age} • Lang: {patient.language.toUpperCase()} • Date: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="smallcaps text-sand">Attending</span>
              <span className="font-mono font-bold text-ink text-lg uppercase bg-[#7c3aed] text-white px-3 py-1 border-2 border-ink mt-1 shadow-[2px_2px_0px_rgba(26,21,18,1)]">
                Dr. Ananya Das
              </span>
            </div>
          </div>

          <div className="bg-amber-100 border-2 border-amber-400 p-3 flex items-center gap-6 text-xs text-ink font-mono uppercase">
            <Info className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Disclaimer:</strong> This summary details platform activity and observed trends. It does not constitute a diagnostic evaluation.
            </span>
          </div>

          <div className="space-y-8 font-mono text-sm text-ink leading-relaxed">
            <div>
              <h4 className="font-display font-bold text-lg uppercase tracking-widest mb-2 flex items-center gap-6">
                <span className="w-6 h-6 bg-ink text-kraft flex items-center justify-center text-sm">1</span> Activity & Stability
              </h4>
              <p className="pl-8">
                Patient completed 52 sessions during the selected {dateRange} window.
                Average observed accuracy across cognitive memory and attention activities was 81%,
                which aligns with historical baseline performance for this patient.
              </p>
            </div>

            <div>
              <h4 className="font-display font-bold text-lg uppercase tracking-widest mb-2 flex items-center gap-6">
                <span className="w-6 h-6 bg-ink text-kraft flex items-center justify-center text-sm">2</span> Domain Evaluation
              </h4>
              <ul className="list-disc pl-12 space-y-2">
                <li><strong>Memory & Sequence:</strong> 82% accuracy, normal latency.</li>
                <li><strong>Visual Attention:</strong> 85% accuracy, steady focus.</li>
                <li><strong>Routine Sequencing:</strong> 90% accuracy, preserved routine memory.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-lg uppercase tracking-widest mb-2 flex items-center gap-6">
                <span className="w-6 h-6 bg-ink text-kraft flex items-center justify-center text-sm">3</span> Adherence Summary
              </h4>
              <p className="pl-8">
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

