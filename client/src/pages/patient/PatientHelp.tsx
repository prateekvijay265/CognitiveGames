import { useAppDataStore } from '@/store/appDataStore';
import { motion } from 'framer-motion';
import { Phone, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { voiceService } from '@/services/voice';

export default function PatientHelp() {
  const { patients: DEMO_PATIENTS } = useAppDataStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const patient = DEMO_PATIENTS[0];
  const contact = patient.emergencyContact || {
    name: 'Priya Sharma',
    relationship: 'Daughter',
    phone: '+91 98765 43210',
  };

  const spokenHelp = `Hello Asha. If you ever need help, tap the large call button to speak directly with your daughter Priya Sharma. Remember, there is never any hurry when playing games. You can take a break anytime.`;

  const faqs = [
    {
      q: 'Do I have to complete all activities every day?',
      a: 'Not at all. You can do as many or as few as you enjoy. Even just a few minutes of play is wonderful for your mind.',
    },
    {
      q: 'What if I make a mistake or get stuck?',
      a: 'Mistakes do not matter at all! The activities automatically adapt to what is most comfortable for you, and hints are always available.',
    },
    {
      q: 'How do I listen to spoken instructions?',
      a: 'Whenever you see a round gold speaker button, simply tap it once and Smriti Care will read the text aloud clearly in your language.',
    },
    {
      q: 'Can my caregiver see how I am doing?',
      a: 'Yes, your caregiver can see your completed games and help make sure your reminders and daily routine are on schedule.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="smallcaps text-sand mb-1">{t('help.title', 'Help & Support')}</div>
          <h1 className="font-display font-bold text-ink text-2xl lg:text-3xl uppercase tracking-widest">
            We are Here For You
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Contact your loved ones or learn how to use the app
          </p>
        </div>
        <button className="btn btn-ochre" onClick={() => voiceService.speak(spokenHelp)}>Listen</button>
      </div>

      {/* EMERGENCY CAREGIVER CARD */}
      <div className="arcade-card p-6 bg-ochre/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-vermilion text-kraft flex items-center justify-center border-2 border-ink shadow-[2px_2px_0px_rgba(26,21,18,1)]">
            <Phone className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-ink uppercase tracking-widest">
              {t('help.call_caregiver', 'Call My Caregiver')}
            </h2>
            <p className="font-mono text-ink font-bold">
              {contact.name} ({contact.relationship})
            </p>
          </div>
        </div>

        <a
          href={`tel:${contact.phone}`}
          className="btn btn-primary w-full text-xl h-16 flex items-center justify-center gap-3 mb-4"
        >
          <Phone className="w-6 h-6" />
          Call {contact.name}
        </a>

        <p className="text-center text-sm font-mono font-bold text-ink/70">
          Phone: {contact.phone}
        </p>
      </div>

      {/* HOW TO PLAY GUIDE */}
      <div className="arcade-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-vermilion" />
          <h2 className="text-2xl font-display font-bold text-ink uppercase tracking-widest">
            {t('help.how_to_play', 'How to Play & Use')}
          </h2>
        </div>

        <div className="space-y-4">
          {[
            { step: '1', title: 'Choose Any Fun Activity', desc: 'Tap "Play & Exercise" on your home screen.' },
            { step: '2', title: 'Go At Your Own Pace', desc: 'There are no time limits or penalties.' },
            { step: '3', title: 'Tap Speaker to Hear', desc: 'Look for the speaker button to hear text.' },
            { step: '4', title: 'Take A Break Anytime', desc: 'You can pause or exit an activity whenever.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 border-b-2 border-ink/10 pb-4 last:border-0 last:pb-0">
              <span className="w-10 h-10 bg-ink text-kraft flex items-center justify-center font-display font-bold text-xl shrink-0">
                {item.step}
              </span>
              <div>
                <h3 className="font-display font-bold text-ink uppercase tracking-widest text-lg">{item.title}</h3>
                <p className="font-mono text-ink/80 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="arcade-card p-6">
        <h2 className="text-2xl font-display font-bold text-ink uppercase tracking-widest mb-6">FAQs</h2>
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i}>
              <h3 className="font-bold text-ink text-lg mb-1">{faq.q}</h3>
              <p className="font-mono text-ink/80">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* APP MANAGEMENT */}
      <div className="arcade-card p-6">
        <h2 className="text-2xl font-display font-bold text-ink uppercase tracking-widest mb-2">Sign Out</h2>
        <p className="font-mono text-ink/80 mb-6">For caregivers or shared devices, you can securely sign out.</p>
        <button
          className="btn btn-danger w-full"
          onClick={() => {
            logout();
            navigate('/login');
          }}
        >
          Sign Out of Smriti Care
        </button>
      </div>
    </motion.div>
  );
}
