import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Bell, Gamepad2, Globe, HelpCircle, ChevronRight, LogOut, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function PatientProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const patientName = user?.name || 'Abhishek';

  const menuItems = [
    { icon: <User className="w-5 h-5" />, label: 'Personal Information' },
    { icon: <Bell className="w-5 h-5" />, label: 'Notification Settings' },
    { icon: <Gamepad2 className="w-5 h-5" />, label: 'Game Preferences' },
    { icon: <Globe className="w-5 h-5" />, label: 'Language' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help & Support' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-5 pt-6 pb-28 font-sans bg-[#FDFBF7] min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => navigate('/patient')}
          className="w-10 h-10 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-600 active:bg-stone-100 shadow-sm shrink-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[22px] font-bold text-stone-900 leading-tight">Profile & Settings</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 mb-8 border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-full bg-[#4A856E]/10 flex items-center justify-center border-2 border-[#4A856E]/20 text-[#4A856E]">
          <User className="w-7 h-7" />
        </div>
        <div>
          <h2 className="font-bold text-[17px] text-stone-900 mb-0.5">{patientName}</h2>
          <p className="text-[12px] font-medium text-stone-500">Brain Training User</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white rounded-3xl p-3 border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-8">
        {menuItems.map((item, idx) => (
          <button 
            key={idx}
            className="w-full flex items-center justify-between p-4 active:bg-stone-50 transition-colors rounded-2xl group"
          >
            <div className="flex items-center gap-4 text-stone-700 group-hover:text-stone-900">
              <div className="text-stone-400 group-hover:text-[#4A856E] transition-colors">
                {item.icon}
              </div>
              <span className="text-[15px] font-semibold">{item.label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-300" />
          </button>
        ))}
        
        {/* Logout */}
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-between p-4 active:bg-rose-50 transition-colors rounded-2xl group mt-2 border-t border-stone-50"
        >
          <div className="flex items-center gap-4 text-rose-500">
            <div>
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-[15px] font-semibold">Sign Out</span>
          </div>
        </button>
      </div>

      {/* Footer message */}
      <div className="flex flex-col items-center justify-center opacity-60">
        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center mb-2">
           <div className="w-3 h-3 rounded-full bg-rose-400"></div>
        </div>
        <p className="text-[11px] font-bold text-stone-500 tracking-wide">Healthy mind.</p>
        <p className="text-[11px] font-bold text-stone-500 tracking-wide">Brighter tomorrow.</p>
      </div>
    </motion.div>
  );
}
