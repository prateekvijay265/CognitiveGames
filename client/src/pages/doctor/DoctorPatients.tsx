import { useAppDataStore } from '@/store/appDataStore';
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  LayoutGrid,
  List,
  ExternalLink,
  Users
} from 'lucide-react';

export function DoctorPatients() {
  const { patients: DEMO_PATIENTS } = useAppDataStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="smallcaps text-sand mb-1 flex items-center gap-2">
            <Users className="w-4 h-4" /> Patient Management
          </div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Patient Registry
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Clinical registry of patients enrolled in the SMRITI CARE program.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-ink/20 border-2 border-kraft/30 p-1 rounded-none self-start sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 font-mono text-xs uppercase font-bold flex items-center gap-2 ${
              viewMode === 'table'
                ? 'bg-kraft text-ink shadow-[2px_2px_0px_rgba(26,21,18,1)]'
                : 'text-kraft hover:bg-kraft/10'
            }`}
          >
            <List className="w-4 h-4" /> Table
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`p-2 font-mono text-xs uppercase font-bold flex items-center gap-2 ${
              viewMode === 'cards'
                ? 'bg-kraft text-ink shadow-[2px_2px_0px_rgba(26,21,18,1)]'
                : 'text-kraft hover:bg-kraft/10'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Cards
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="arcade-card p-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="arcade-input w-full pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="arcade-select"
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
            className="arcade-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active & Stable</option>
            <option value="review">Needs Review</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' ? (
        <div className="arcade-card overflow-hidden">
          <table className="arcade-table w-full text-left text-sm">
            <thead>
              <tr>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Caregiver</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((p, idx) => {
                const isReview = p.id === 'pat-2' || p.id === 'pat-3';
                return (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-bold font-mono uppercase text-ink">
                      <div>{p.name}</div>
                      <div className="text-xs text-sand font-normal mt-1">Age: {p.age}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs uppercase text-ink">
                      {p.language}
                    </td>
                    <td className="py-3 px-4">
                      {isReview ? (
                        <span className="badge badge-vermilion">Review</span>
                      ) : (
                        <span className="badge bg-[#7c3aed] text-white border-2 border-ink">Stable</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-ink">Priya Sharma</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => navigate(`/doctor/patients/${p.id}`)}
                        className="btn btn-sm"
                        style={{ backgroundColor: '#7c3aed', color: 'white' }}
                      >
                        Profile
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((p) => {
            const isReview = p.id === 'pat-2' || p.id === 'pat-3';
            return (
              <div
                key={p.id}
                className="arcade-card p-5 flex flex-col justify-between hover-lift"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#7c3aed] border-2 border-ink flex items-center justify-center font-display font-bold text-white text-xl shadow-[2px_2px_0px_rgba(26,21,18,1)]">
                        {p.name[0]}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-ink uppercase tracking-wider">{p.name}</h3>
                        <span className="smallcaps text-sand">
                          Age: {p.age} • Lang: {p.language.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    {isReview ? (
                      <span className="badge badge-vermilion inline-flex items-center">Needs Review</span>
                    ) : (
                      <span className="badge bg-[#7c3aed] text-white border-2 border-ink inline-flex items-center">Stable</span>
                    )}
                  </div>
                  
                  <div className="py-3 border-t-2 border-ink border-dashed space-y-2 font-mono text-xs text-ink">
                    <div className="flex justify-between">
                      <span className="text-sand">Caregiver:</span>
                      <span className="font-bold">Priya Sharma</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sand">Emergency:</span>
                      <span className="font-bold">{p.emergencyContact?.name || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/doctor/patients/${p.id}`)}
                  className="btn w-full mt-4 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#7c3aed', color: 'white' }}
                >
                  View Profile <ExternalLink className="w-4 h-4" />
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
