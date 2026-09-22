import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Users,
  AlertCircle,
  FileCheck2,
  TrendingUp,
  TrendingDown,
  Info,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { toast } from 'sonner';

export function DoctorDashboard() {
  const { patients: DEMO_PATIENTS, alerts: DEMO_ALERTS } = useAppDataStore();
  const navigate = useNavigate();
  const [selectedPatientForNote, setSelectedPatientForNote] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');

  const totalPatients = DEMO_PATIENTS.length;
  const needingReview = 2;
  const alertsCount = DEMO_ALERTS.filter((a) => !a.isResolved).length;

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    toast.success('Clinical note recorded.');
    setSelectedPatientForNote(null);
    setNoteContent('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="smallcaps text-sand mb-1 flex items-center gap-2">
            <Stethoscope className="w-4 h-4" /> Clinical Portal
          </div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Activity Monitor
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Observational monitoring of platform adherence and cognitive games.
          </p>
        </div>
        <div className="badge bg-[#7c3aed] text-white self-start font-mono uppercase">
          Dr. Ananya Das
        </div>
      </div>

      <div className="bg-[#7c3aed]/10 border-2 border-[#7c3aed] p-3 rounded-none flex items-center gap-3 text-xs text-kraft font-mono">
        <Info className="w-4 h-4 text-[#7c3aed] shrink-0" />
        <span>
          CLINICAL NOTICE: Activity data represents observed platform interaction and engagement patterns. It is an auxiliary support tool and is not a medical diagnosis.
        </span>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card animate-card-in">
          <div className="stat-value">{totalPatients}</div>
          <div className="stat-label flex items-center gap-1"><Users className="w-3 h-3"/> Total Patients</div>
        </div>
        <div className="stat-card animate-card-in animation-delay-200">
          <div className="stat-value text-vermilion">{needingReview}</div>
          <div className="stat-label flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Needing Review</div>
        </div>
        <div className="stat-card animate-card-in animation-delay-400">
          <div className="stat-value text-ochre">{alertsCount}</div>
          <div className="stat-label flex items-center gap-1"><Activity className="w-3 h-3"/> Active Alerts</div>
        </div>
        <div className="stat-card animate-card-in animation-delay-600">
          <div className="stat-value">4</div>
          <div className="stat-label flex items-center gap-1"><FileCheck2 className="w-3 h-3"/> Pending Reports</div>
        </div>
      </div>

      {/* Patient Table as Arcade-Card List */}
      <div className="space-y-4">
        <h2 className="font-display font-bold text-kraft uppercase tracking-widest text-lg">Patient Cohort Overview</h2>
        <div className="grid grid-cols-1 gap-4">
          {DEMO_PATIENTS.map((p, idx) => {
            const isNeedsReview = idx === 1 || idx === 2;
            const adherence = idx === 1 ? '72%' : idx === 2 ? '65%' : '90%';

            return (
              <div key={p.id} className="arcade-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover-lift">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#7c3aed] border-2 border-ink flex items-center justify-center font-display font-bold text-white flex-shrink-0 text-xl shadow-[2px_2px_0px_rgba(26,21,18,1)]">
                    {p.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-ink text-base uppercase font-mono">{p.name}</div>
                    <div className="smallcaps text-sand mt-1">Age: {p.age} • Lang: {p.language} • Last Active: {new Date(p.lastActiveAt || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="smallcaps text-sand">Trend</span>
                    {isNeedsReview ? (
                      <span className="font-mono text-vermilion flex items-center gap-1 text-sm font-bold"><TrendingDown className="w-4 h-4" /> Dip</span>
                    ) : (
                      <span className="font-mono text-green-700 flex items-center gap-1 text-sm font-bold"><TrendingUp className="w-4 h-4" /> Stable</span>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="smallcaps text-sand">Adherence</span>
                    <span className="font-mono font-bold text-ink text-sm">{adherence}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="smallcaps text-sand">Status</span>
                    {isNeedsReview ? (
                      <span className="badge badge-vermilion">Review</span>
                    ) : (
                      <span className="badge bg-[#7c3aed] text-white">Stable</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button
                      onClick={() => setSelectedPatientForNote(p.id)}
                      className="btn btn-sm btn-ghost"
                    >
                      + Note
                    </button>
                    <button
                      onClick={() => navigate(`/doctor/patients/${p.id}`)}
                      className="btn btn-sm"
                      style={{ backgroundColor: '#7c3aed', color: 'white' }}
                    >
                      Profile <ChevronRight className="w-4 h-4 inline" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Observation Modal */}
      {selectedPatientForNote && (
        <div className="fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveObservation}
            className="paper grain border-4 border-ink p-6 max-w-md w-full shadow-[8px_8px_0px_rgba(26,21,18,1)] space-y-4"
          >
            <h3 className="font-display font-bold text-ink text-xl uppercase tracking-widest border-b-2 border-ink pb-2">Record Observation</h3>
            <p className="font-mono text-xs text-sand">
              This note will be timestamped and visible to caregivers and authorized clinicians.
            </p>
            <textarea
              rows={4}
              required
              placeholder="Record observations regarding cognitive stability..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="arcade-input w-full p-3 font-mono text-sm resize-none"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPatientForNote(null)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
                style={{ backgroundColor: '#7c3aed', color: 'white' }}
              >
                Save Note
              </button>
            </div>
          </form>
        </div>
      )}
    </motion.div>
  );
}

export default DoctorDashboard;
