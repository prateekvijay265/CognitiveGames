import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDataStore } from '@/store/appDataStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
  CartesianGrid,
  YAxis
} from 'recharts';

export function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState('This Week');
  const { patients, alerts } = useAppDataStore();
  const navigate = useNavigate();

  // Dynamic chart data matching the mockup trend but varying by tab
  const getChartData = () => {
    if (activeTab === 'This Month') {
      return [
        { day: 'W1', value: 30 },
        { day: 'W2', value: 45 },
        { day: 'W3', value: 65 },
        { day: 'W4', value: 85 },
      ];
    }
    if (activeTab === 'All Time') {
      return [
        { day: 'Jan', value: 10 },
        { day: 'Feb', value: 25 },
        { day: 'Mar', value: 40 },
        { day: 'Apr', value: 55 },
        { day: 'May', value: 75 },
        { day: 'Jun', value: 90 },
      ];
    }
    return [
      { day: 'Mon', value: 20 },
      { day: 'Tue', value: 25 },
      { day: 'Wed', value: 30 },
      { day: 'Thu', value: 45 },
      { day: 'Fri', value: 55 },
      { day: 'Sat', value: 70 },
      { day: 'Sun', value: 90 },
    ];
  };

  const chartData = getChartData();
  
  const activeAlertsCount = alerts.filter(a => !a.isResolved).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">Caregiver Dashboard</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Caregiver Insights
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">Track progress and stay connected.</p>
        </div>
        <button onClick={() => navigate('/caregiver/patients')} className="btn btn-primary btn-sm self-start">View Patients</button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="stat-card animate-card-in" style={{ backgroundColor: '#2563eb', color: '#e7dcc6' }}>
          <div className="stat-value">{patients.length}</div>
          <div className="stat-label" style={{ color: '#e7dcc6' }}>Total Patients</div>
        </div>
        <div className="stat-card animate-card-in animation-delay-200">
          <div className="stat-value">{activeAlertsCount}</div>
          <div className="stat-label">Active Alerts</div>
        </div>
        <div className="stat-card animate-card-in animation-delay-400">
          <div className="stat-value">85%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="arcade-card p-6 animate-card-in animation-delay-400">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display uppercase tracking-widest font-bold text-ink">Progress Trend</h3>
          <div className="flex gap-6">
            {['This Week', 'This Month', 'All Time'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-mono uppercase px-2 py-1 border-2 border-ink ${
                  activeTab === tab ? 'bg-vermilion text-kraft' : 'bg-transparent text-ink hover:bg-kraft2'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,21,18,0.08)" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#675b4c', fontFamily: 'IBM Plex Mono' }} />
              <YAxis tick={{ fontSize: 10, fill: '#675b4c', fontFamily: 'IBM Plex Mono' }} />
              <Tooltip contentStyle={{ background: '#e7dcc6', border: '2px solid #1a1512', borderRadius: 0, fontFamily: 'IBM Plex Mono', fontSize: 12 }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#e0451f" 
                strokeWidth={3} 
                dot={{ fill: '#e0451f', r: 4, strokeWidth: 0 }} 
                activeDot={{ r: 6, fill: '#e0451f', stroke: '#1a1512', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patient List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display uppercase tracking-widest font-bold text-kraft">My Patients</h3>
          <Link
            to="/caregiver/patients"
            className="smallcaps text-sand hover:text-vermilion transition-colors flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {patients.map((patient, i) => {
            const initials = patient.name
              .split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <div key={patient.id} className={`arcade-card p-6 flex items-center justify-between gap-6 animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 border-2 border-ink flex items-center justify-center font-display font-bold text-kraft flex-shrink-0" style={{ backgroundColor: '#2563eb' }}>
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-ink font-mono uppercase truncate">{patient.name}</div>
                  <div className="smallcaps text-sand mt-1">Age {patient.age} • {patient.language?.toUpperCase() || 'EN'}</div>
                </div>
                <button onClick={() => navigate(`/caregiver/patients/${patient.id}`)} className="btn btn-sm btn-ghost">View →</button>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default CaregiverDashboard;
