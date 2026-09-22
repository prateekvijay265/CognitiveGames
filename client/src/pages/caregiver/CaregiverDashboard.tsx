import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Clock, Brain, Eye, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDataStore } from '@/store/appDataStore';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  Tooltip,
} from 'recharts';

export function CaregiverDashboard() {
  const [activeTab, setActiveTab] = useState('This Week');
  const patients = useAppDataStore((state) => state.patients);
  const navigate = useNavigate();

  // Dynamic chart data matching the mockup trend but varying by tab
  const getChartData = () => {
    if (activeTab === 'This Month') {
      return [
        { day: 'Week 1', value: 30 },
        { day: 'Week 2', value: 45 },
        { day: 'Week 3', value: 65 },
        { day: 'Week 4', value: 85 },
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-6 pb-28 font-sans bg-[#FDFBF7] min-h-screen"
    >
      {/* Header & Illustration */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-[26px] font-bold text-stone-900 leading-tight mb-1">
            Caregiver Insights
          </h1>
          <p className="text-stone-500 text-sm font-medium">Track progress and stay connected.</p>
        </div>
        {/* Simple SVG Abstraction of Caregiver & Patient */}
        <div className="w-16 h-16 shrink-0 relative flex items-end">
           <div className="w-10 h-10 bg-[#E8C5B3] rounded-full absolute bottom-0 right-0 z-10 shadow-sm border-2 border-white"></div>
           <div className="w-12 h-12 bg-[#D1D5DB] rounded-full absolute bottom-2 left-0 shadow-sm border-2 border-white"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white rounded-full border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.03)] mb-8">
        {['This Week', 'This Month', 'All Time'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-[13px] font-bold py-2 rounded-full transition-all ${
              activeTab === tab 
                ? 'bg-stone-200 text-stone-900 shadow-sm' 
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {/* Stat 1 */}
        <button onClick={() => navigate('/caregiver/reports')} className="text-left bg-white p-4 rounded-3xl border border-stone-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] active:scale-95 transition-transform">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                <Gamepad2 className="w-4 h-4" />
             </div>
             <span className="text-[11px] font-bold text-stone-500">Games completed</span>
          </div>
          <div className="flex items-end justify-between">
             <span className="text-2xl font-bold text-stone-900 leading-none">18</span>
             <span className="text-[11px] font-bold text-teal-500 bg-teal-50 px-1.5 py-0.5 rounded flex items-center">↑ 12%</span>
          </div>
        </button>

        {/* Stat 2 */}
        <button onClick={() => navigate('/caregiver/reports')} className="text-left bg-white p-4 rounded-3xl border border-stone-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] active:scale-95 transition-transform">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-7 h-7 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                <Clock className="w-4 h-4" />
             </div>
             <span className="text-[11px] font-bold text-stone-500">Average session</span>
          </div>
          <div className="flex items-end justify-between">
             <span className="text-2xl font-bold text-stone-900 leading-none">7 min</span>
             <span className="text-[11px] font-bold text-teal-500 bg-teal-50 px-1.5 py-0.5 rounded flex items-center">↑ 8%</span>
          </div>
        </button>

        {/* Stat 3 */}
        <button onClick={() => navigate('/caregiver/reports')} className="text-left bg-white p-4 rounded-3xl border border-stone-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] active:scale-95 transition-transform">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-500">
                <Brain className="w-4 h-4" />
             </div>
             <span className="text-[11px] font-bold text-stone-500 leading-tight">Memory activities</span>
          </div>
          <div className="flex items-end justify-between">
             <span className="text-2xl font-bold text-stone-900 leading-none">6</span>
             <span className="text-[11px] font-bold text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded flex items-center">↑ 15%</span>
          </div>
        </button>

        {/* Stat 4 */}
        <button onClick={() => navigate('/caregiver/reports')} className="text-left bg-white p-4 rounded-3xl border border-stone-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] active:scale-95 transition-transform">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Eye className="w-4 h-4" />
             </div>
             <span className="text-[11px] font-bold text-stone-500 leading-tight">Attention activities</span>
          </div>
          <div className="flex items-end justify-between">
             <span className="text-2xl font-bold text-stone-900 leading-none">5</span>
             <span className="text-[11px] font-bold text-teal-500 bg-teal-50 px-1.5 py-0.5 rounded flex items-center">↑ 10%</span>
          </div>
        </button>
      </div>

      {/* Progress Trend Chart */}
      <div className="mb-10">
        <h3 className="font-bold text-[15px] text-stone-900 mb-4 px-1">Progress Trend</h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#A8A29E', fontSize: 11, fontWeight: 600 }}
                dy={10}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                cursor={{ stroke: '#4A856E', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#4A856E" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#4A856E', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#4A856E', stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* My Patients Section */}
      <div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-bold text-[15px] text-stone-900">My Patients</h3>
          <Link
            to="/caregiver/patients"
            className="text-[11px] font-bold text-[#4A856E] flex items-center gap-0.5 active:opacity-70"
          >
            View All <ArrowRight size={14} className="stroke-[2.5]" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {patients.map((patient) => {
            const initials = patient.name
              .split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <Link
                key={patient.id}
                to={`/caregiver/patient/${patient.id}`}
                className="bg-white p-4 rounded-3xl border border-stone-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)] flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-12 h-12 rounded-full bg-[#E8C5B3]/30 flex items-center justify-center text-[#A67C65] font-bold shrink-0 border-2 border-white shadow-sm">
                  {initials}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[15px] text-stone-900 leading-tight">{patient.name}</h4>
                  <p className="text-[12px] font-medium text-stone-500 mt-0.5">
                    Age {patient.age} • {patient.condition}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-stone-400">
                  <ArrowRight size={16} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default CaregiverDashboard;
