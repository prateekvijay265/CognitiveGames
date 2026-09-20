import { useAppDataStore } from '@/store/appDataStore';
import React, { useState, useMemo } from 'react';
import {
 useNavigate } from 'react-router-dom';
import {
 motion } from 'framer-motion';
import {

  Search,
  LayoutGrid,
  List,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Info,
  ExternalLink,
} from 'lucide-react';

export function DoctorPatients() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredPatients = useMemo(() => {
    return DEMO_PATIENTS.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLang = languageFilter === 'all' || p.language === languageFilter;
      const isNeedsReview = p.id === 'pat-2' || p.id === 'pat-3';
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'review' && isNeedsReview) ||
        (statusFilter === 'active' && !isNeedsReview);

      return matchSearch && matchLang && matchStatus;
    });
  }, [searchTerm, languageFilter, statusFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Patient Registry
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Clinical registry of patients enrolled in the SMRITI CARE cognitive monitoring program.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'table'
                ? 'bg-white text-stone-800 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <List className="w-4 h-4" /> Table
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-stone-800 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Cards
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active & Stable</option>
            <option value="review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50/80 text-xs font-bold uppercase tracking-wider text-stone-500 border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-6">Patient</th>
                <th className="py-3.5 px-4">Language</th>
                <th className="py-3.5 px-4">Observation Status</th>
                <th className="py-3.5 px-4">Caregiver</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredPatients.map((p, idx) => {
                const isReview = idx === 1 || idx === 2;
                return (
                  <tr key={p.id} className="hover:bg-stone-50/70">
                    <td className="py-4 px-6 font-bold text-stone-900">
                      <div>{p.name}</div>
                      <div className="text-xs text-stone-400 font-normal">Age: {p.age}</div>
                    </td>
                    <td className="py-4 px-4 uppercase text-xs font-semibold text-stone-600">
                      {p.language}
                    </td>
                    <td className="py-4 px-4">
                      {isReview ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                          Needs Review
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Stable
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs font-medium text-stone-600">Priya Sharma</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => navigate(`/doctor/patients/${p.id}`)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        Clinical Profile <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Cards View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPatients.map((p, idx) => {
            const isReview = idx === 1 || idx === 2;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-stone-900 text-base">{p.name}</h3>
                      <span className="text-xs text-stone-500">
                        Age: {p.age} • Language: {p.language.toUpperCase()}
                      </span>
                    </div>
                    {isReview ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Needs Review
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Stable
                      </span>
                    )}
                  </div>
                  <div className="py-3 border-t border-stone-100 space-y-1 text-xs text-stone-600">
                    <div>Caregiver: Priya Sharma</div>
                    <div>Emergency Contact: {p.emergencyContact?.name}</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/doctor/patients/${p.id}`)}
                  className="w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1 mt-3"
                >
                  View Full Profile <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

export default DoctorPatients;
