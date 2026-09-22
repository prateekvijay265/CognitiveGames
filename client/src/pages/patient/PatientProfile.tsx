import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Bell, Gamepad2, Globe, HelpCircle, ChevronRight, LogOut, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/patient')}
          className="icon-btn"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-ink text-2xl lg:text-3xl uppercase tracking-widest">
          Profile & Settings
        </h1>
      </div>

      {/* Profile Card */}
      <div className="arcade-card p-6 flex items-center gap-4 bg-ochre/20">
        <div className="w-16 h-16 bg-white border-2 border-ink flex items-center justify-center text-ink shadow-[2px_2px_0px_rgba(26,21,18,1)]">
          <User className="w-8 h-8" />
        </div>
        <div>
          <h2 className="font-display font-bold text-ink text-xl uppercase tracking-widest">{patientName}</h2>
          <p className="font-mono text-ink/70">Brain Training User</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="arcade-card p-2">
        {menuItems.map((item, idx) => (
          <button 
            key={idx}
            onClick={() => toast.info(`${item.label} coming soon!`)}
            className="w-full flex items-center justify-between p-4 hover:bg-kraft2 transition-colors group border-b-2 border-ink/10 last:border-0"
          >
            <div className="flex items-center gap-4 text-ink">
              <div className="text-ink">
                {item.icon}
              </div>
              <span className="font-mono font-bold">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-ink/50 group-hover:text-ink" />
          </button>
        ))}
        
        {/* Logout */}
        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-between p-4 hover:bg-vermilion/20 transition-colors group border-t-2 border-ink mt-2"
        >
          <div className="flex items-center gap-4 text-vermilion">
            <LogOut className="w-5 h-5" />
            <span className="font-mono font-bold">Sign Out</span>
          </div>
        </button>
      </div>

      {/* Footer message */}
      <div className="flex flex-col items-center justify-center opacity-70 mt-8 pb-8">
        <p className="smallcaps text-ink">Healthy mind.</p>
        <p className="smallcaps text-ink">Brighter tomorrow.</p>
      </div>
    </motion.div>
  );
}
