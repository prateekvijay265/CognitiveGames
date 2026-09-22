import { useAppDataStore } from '@/store/appDataStore';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, UserPlus, SlidersHorizontal, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function CaregiverPatients() {
  const { patients: DEMO_PATIENTS, alerts: DEMO_ALERTS } = useAppDataStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [alertFilter, setAlertFilter] = useState('all');

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return DEMO_PATIENTS.filter((patient) => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage = languageFilter === 'all' || patient.language === languageFilter;
      const hasAlerts = DEMO_ALERTS.some((a) => a.patientId === patient.id && !a.isResolved);
      const matchesAlert =
        alertFilter === 'all' ||
        (alertFilter === 'alerts' && hasAlerts) ||
        (alertFilter === 'clear' && !hasAlerts);

      return matchesSearch && matchesLanguage && matchesAlert;
    });
  }, [searchTerm, languageFilter, alertFilter, DEMO_PATIENTS, DEMO_ALERTS]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">Caregiver • Directory</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Assigned Patients
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Monitor patient cognitive engagement, reminder adherence, and configuration.
          </p>
        </div>
        <button
          onClick={() => toast.success('New patient invitation sent to family')}
          className="btn btn-primary btn-sm self-start flex items-center gap-6"
        >
          <UserPlus size={16} /> ADD PATIENT
        </button>
      </div>

      {/* Filters */}
      <div className="arcade-card p-6 flex flex-col md:flex-row gap-6 items-stretch md:items-center justify-between bg-kraft2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="SEARCH PATIENTS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="arcade-input pl-9 w-full"
          />
        </div>
        <div className="flex items-center gap-6 flex-wrap">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="arcade-select w-auto min-w-[150px]"
          >
            <option value="all">ALL LANGUAGES</option>
            <option value="en">ENGLISH (EN)</option>
            <option value="as">ASSAMESE (AS)</option>
            <option value="mni">MANIPURI (MNI)</option>
            <option value="lus">MIZO (LUS)</option>
          </select>
          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="arcade-select w-auto min-w-[150px]"
          >
            <option value="all">ALL STATUS</option>
            <option value="alerts">ACTIVE ALERTS</option>
            <option value="clear">NO ALERTS</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient, idx) => {
          const hasAlert = DEMO_ALERTS.some(
            (a) => a.patientId === patient.id && !a.isResolved
          );
          const initials = patient.name
            .split(' ')
            .map((n) => n[0])
            .join('');

          return (
            <div key={patient.id} className="arcade-card p-6 flex flex-col gap-6 animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="flex items-start justify-between gap-6">
                <div className="w-12 h-12 border-2 border-ink flex items-center justify-center font-display font-bold text-kraft text-xl shrink-0" style={{ backgroundColor: '#2563eb' }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink font-mono uppercase truncate">{patient.name}</div>
                  <div className="smallcaps text-sand mt-1">Age {patient.age} • {patient.language?.toUpperCase()}</div>
                </div>
                <button
                  onClick={() => navigate('/caregiver/settings')}
                  className="icon-btn flex-shrink-0"
                  title="Configure Accessibility"
                >
                  <SlidersHorizontal size={14} />
                </button>
              </div>

              <div className="space-y-3 pt-3 border-t-2 border-ink border-dashed">
                <div className="flex justify-between items-center">
                  <span className="smallcaps text-sand">Status</span>
                  {hasAlert ? (
                     <div className="badge badge-vermilion flex items-center gap-1">
                       <AlertTriangle size={10} /> ALERT
                     </div>
                  ) : (
                     <div className="badge badge-green flex items-center gap-1">
                       <CheckCircle2 size={10} /> CLEAR
                     </div>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between text-xs font-mono font-bold mb-1">
                    <span>PROGRESS</span>
                    <span>80%</span>
                  </div>
                  <div className="arcade-progress">
                    <div className="arcade-progress-bar bg-vermilion" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="smallcaps text-sand">LAST ACTIVE: TODAY</span>
                  <button onClick={() => navigate(`/caregiver/patients/${patient.id}`)} className="btn btn-sm btn-ghost">VIEW →</button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredPatients.length === 0 && (
          <div className="col-span-full arcade-card p-8 text-center bg-kraft2">
            <p className="font-mono text-sand">No patients match your search filter criteria.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default CaregiverPatients;
