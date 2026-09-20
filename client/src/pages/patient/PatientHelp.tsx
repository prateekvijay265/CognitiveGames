import { useAppDataStore } from '@/store/appDataStore';
import { motion } from 'framer-motion';
import { Phone, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardBody } from '@/components/ui/Card';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';


export default function PatientHelp() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

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
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto px-4 py-6 sm:py-8 space-y-6 patient-mode"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {t('help.title', 'Help & Support')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight pt-1">
            We are Here For You
          </h1>
          <p className="text-lg text-stone-600 font-medium">
            Contact your loved ones or learn how to use the app
          </p>
        </div>

        <VoiceButton
          size="lg"
          textToSpeak={spokenHelp}
          showLabel
          label={t('help.repeat', 'Listen')}
        />
      </div>

      {/* EMERGENCY CAREGIVER CARD */}
      <Card
        variant="elevated"
        padding="lg"
        className="border-2 border-teal-200 bg-gradient-to-br from-teal-50 via-white to-blue-50/50 shadow-md"
      >
        <CardBody className="pt-0 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {t('help.call_caregiver', 'Call My Caregiver')}
              </h2>
              <p className="text-base text-stone-600 font-medium">
                {contact.name} ({contact.relationship})
              </p>
            </div>
          </div>

          <a
            href={`tel:${contact.phone}`}
            className="w-full inline-flex items-center justify-center gap-3 h-16 rounded-2xl bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-extrabold text-2xl shadow-lg active:scale-[0.98] transition-all cursor-pointer select-none"
          >
            <Phone className="w-7 h-7 fill-current" />
            <span>Call {contact.name}</span>
          </a>

          <p className="text-center text-sm font-semibold text-stone-500">
            Phone: {contact.phone}
          </p>
        </CardBody>
      </Card>

      {/* HOW TO PLAY GUIDE */}
      <Card variant="default" padding="lg">
        <CardBody className="pt-0 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-stone-900">
              {t('help.how_to_play', 'How to Play & Use Smriti Care')}
            </h2>
          </div>

          <div className="space-y-3.5 pt-2">
            {[
              {
                step: '1',
                title: 'Choose Any Fun Activity',
                desc: 'Tap "Play & Exercise" on your home screen to see gentle memory and attention games.',
              },
              {
                step: '2',
                title: 'Go At Your Own Pace',
                desc: 'There are no time limits or penalties. Take as long as you want on each step.',
              },
              {
                step: '3',
                title: 'Tap Speaker to Hear Instructions',
                desc: 'Look for the circular gold speaker button to have instructions read to you out loud.',
              },
              {
                step: '4',
                title: 'Take A Break Anytime',
                desc: 'You can pause or exit an activity whenever you feel like resting.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80"
              >
                <span className="w-10 h-10 rounded-xl bg-teal-600 text-white font-extrabold text-lg flex items-center justify-center shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-stone-900">{item.title}</h3>
                  <p className="text-base text-stone-600 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <Card variant="default" padding="lg">
        <CardBody className="pt-0 space-y-4">
          <h2 className="text-2xl font-bold text-stone-900">Frequently Asked Questions</h2>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border border-stone-200 bg-white space-y-2 shadow-2xs"
              >
                <h3 className="text-xl font-bold text-stone-900">{faq.q}</h3>
                <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* APP MANAGEMENT */}
      <Card variant="default" padding="lg">
        <CardBody className="pt-0 space-y-4">
          <h2 className="text-2xl font-bold text-stone-900">App Management</h2>
          <p className="text-base text-stone-600">For caregivers or shared devices, you can securely sign out.</p>
          <Button
            variant="danger"
            size="lg"
            className="w-full text-lg font-bold min-h-[4rem]"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign Out of Smriti Care
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  );
}
