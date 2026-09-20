import { useAppDataStore } from '@/store/appDataStore';
import React, { useState, useMemo } from 'react';
import {
 useNavigate } from 'react-router-dom';
import {
 motion } from 'framer-motion';
import {

  Search,
  Filter,
  UserPlus,
  AlertTriangle,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export function CaregiverPatients() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

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
  }, [searchTerm, languageFilter, alertFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Assigned Patients
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Monitor patient cognitive engagement, reminder adherence, and configuration.
          </p>
        </div>

        <button
          onClick={() => alert('New patient invitation sent to family')}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          Add Patient
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Language filter */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Languages</option>
            <option value="en">English (en)</option>
            <option value="as">Assamese (as)</option>
            <option value="mni">Manipuri (mni)</option>
            <option value="lus">Mizo (lus)</option>
          </select>

          {/* Alert status filter */}
          <select
            value={alertFilter}
            onChange={(e) => setAlertFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Alert Status</option>
            <option value="alerts">Has Active Alerts</option>
            <option value="clear">No Alerts</option>
          </select>
        </div>
      </div>

      {/* Patient Table / Card Container */}
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50/80 text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-4 px-6">Patient</th>
                <th className="py-4 px-4">Language</th>
                <th className="py-4 px-4">Today's Progress</th>
                <th className="py-4 px-4">Alerts</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPatients.map((patient) => {
                const hasAlert = DEMO_ALERTS.some(
                  (a) => a.patientId === patient.id && !a.isResolved
                );
                const initials = patient.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('');

                return (
                  <tr key={patient.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{patient.name}</div>
                          <div className="text-xs text-stone-400">Age {patient.age}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-stone-100 text-stone-700 uppercase">
                        {patient.language}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="w-32">
                        <div className="flex justify-between text-xs font-medium mb-1">
                          <span className="text-stone-500">Activity</span>
                          <span className="font-bold text-stone-800">80%</span>
                        </div>
                        <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-teal-500 h-full rounded-full w-4/5" />
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {hasAlert ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Alert
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Clear
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-stone-500">
                      Today, 8:30 AM
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/caregiver/patients/${patient.id}`)}
                          className="px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          View Details <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => navigate('/caregiver/settings')}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Configure Accessibility & Difficulty"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No patients match your search filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

export default CaregiverPatients;
