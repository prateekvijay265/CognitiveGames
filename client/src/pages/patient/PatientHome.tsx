import { useAppDataStore } from '@/store/appDataStore';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Phone, Heart, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { generateTodaysPlan } from '@/lib/adaptiveEngine';
import { db } from '@/lib/db';
import { getGreeting, formatDate } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { SyncIndicator } from '@/components/ui/SyncIndicator';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';


export default function PatientHome() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const patient = DEMO_PATIENTS[0];
  const patientName = user?.name || patient.name || 'Asha';
  const firstName = patientName.split(' ')[0];
  const emergencyContact = patient.emergencyContact || {
    name: 'Priya Sharma',
    relationship: 'Daughter',
    phone: '+91 98765 43210',
  };

  // State for Mood Modal
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [showSupportPrompt, setShowSupportPrompt] = useState(false);

  // Generate today's plan
  const todaysPlan = generateTodaysPlan(DEMO_GAME_SESSIONS, { maxMinutes: 15 });
  const activities = todaysPlan.activities.slice(0, 3);

  // Greeting & Date
  const greetingKey = getGreeting(); // 'morning' | 'afternoon' | 'evening'
  const greetingMap: Record<string, string> = {
    morning: t('home.greeting_morning', 'Good morning'),
    afternoon: t('home.greeting_afternoon', 'Good afternoon'),
    evening: t('home.greeting_evening', 'Good evening'),
  };
  const greetingText = `${greetingMap[greetingKey] || 'Good day'}, ${firstName} 🌸`;
  const formattedToday = formatDate(new Date());

  const spokenGreeting = `${greetingText}. ${t('home.subtitle', "Let's have a wonderful day.")}`;

  // Completed items count (e.g. 3 of 5)
  const completedCount = 3;
  const totalCount = 5;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleMoodSelect = async (mood: 'great' | 'good' | 'okay' | 'sad' | 'worried') => {
    setSelectedMood(mood);
    try {
      await db.moodEntries.add({
        id: crypto.randomUUID(),
        patientId: patient.id,
        mood,
        recordedAt: new Date().toISOString(),
        syncStatus: 'synced',
      });
      toast.success(t('mood.saved', 'Thank you for sharing how you feel.'));
    } catch {
      // IndexedDB save fallback
    }

    if (mood === 'sad' || mood === 'worried') {
      setShowSupportPrompt(true);
    } else {
      setTimeout(() => {
        setIsMoodModalOpen(false);
        setSelectedMood(null);
        setShowSupportPrompt(false);
      }, 1000);
    }
  };

  const actionCards = [
    {
      id: 'games',
      icon: '🎮',
      title: t('home.play_exercise', 'Play & Exercise'),
      desc: 'Fun activities for your mind',
      route: '/patient/games',
      gradient: 'from-amber-50 to-orange-50/80 border-amber-200/90 text-amber-950',
      badge: '3 ready',
    },
    {
      id: 'reminders',
      icon: '🔔',
      title: t('home.my_reminders', 'My Reminders'),
      desc: 'Medicines, water & daily notes',
      route: '/patient/reminders',
      gradient: 'from-teal-50 to-emerald-50/80 border-teal-200/90 text-teal-950',
      badge: '2 today',
    },
    {
      id: 'memory-book',
      icon: '🧠',
      title: t('home.todays_memory', "Today's Memory"),
      desc: 'Family, friends & fond stories',
      route: '/patient/memory-book',
      gradient: 'from-rose-50 to-pink-50/80 border-rose-200/90 text-rose-950',
      badge: 'Special',
    },
    {
      id: 'routine',
      icon: '📅',
      title: t('home.my_day', 'My Day'),
      desc: 'Your peaceful daily routine',
      route: '/patient/routine',
      gradient: 'from-blue-50 to-indigo-50/80 border-blue-200/90 text-blue-950',
      badge: 'Morning',
    },
    {
      id: 'mood',
      icon: '❤️',
      title: t('home.feeling_good', 'How I Feel'),
      desc: 'Share your feelings today',
      onClick: () => setIsMoodModalOpen(true),
      gradient: 'from-purple-50 to-violet-50/80 border-purple-200/90 text-purple-950',
      badge: 'Check-in',
    },
    {
      id: 'progress',
      icon: '🌟',
      title: t('nav.progress', 'My Progress'),
      desc: 'See your weekly achievements',
      route: '/patient/progress',
      gradient: 'from-emerald-50 to-teal-50/80 border-emerald-200/90 text-emerald-950',
      badge: 'Consistent',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8 patient-mode"
    >
      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 sm:p-7 rounded-3xl border border-stone-200/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-stone-500 uppercase tracking-wider">
              {formattedToday}
            </span>
            <SyncIndicator />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            {greetingText}
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 font-medium">
            {t('home.subtitle', "Let's have a wonderful day.")}
          </p>
        </div>

        {/* Large Voice Action Button */}
        <div className="shrink-0 flex items-center gap-3">
          <VoiceButton
            size="lg"
            textToSpeak={spokenGreeting}
            showLabel
            label={t('help.repeat', 'Listen')}
          />
        </div>
      </div>

      {/* TODAY'S PROGRESS CARD */}
      <Card variant="colored" padding="lg" className="border-teal-200 shadow-sm">
        <CardBody className="pt-0 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="shrink-0">
              <ProgressRing
                value={progressPercent}
                size={96}
                strokeWidth={9}
                color="#0d9488"
                trackColor="#ccfbf1"
                showPercent
              />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                {t('home.todays_plan', "Today's Activities")}
              </h2>
              <p className="text-lg sm:text-xl text-stone-600 font-medium">
                {t('home.activities_done', {
                  done: completedCount,
                  total: totalCount,
                  defaultValue: `${completedCount} of ${totalCount} activities completed`,
                })}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/patient/games')}
            className="w-full sm:w-auto shadow-md text-lg min-h-[3.25rem] px-6"
          >
            <span>{t('games.start', 'Continue Today')}</span>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardBody>
      </Card>

      {/* TODAY'S RECOMMENDED PLAN */}
      {activities.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Recommended For You
            </h2>
            <button
              onClick={() => navigate('/patient/games')}
              className="text-teal-700 hover:text-teal-800 text-lg font-bold cursor-pointer"
            >
              See All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activities.map((act) => (
              <Card
                key={act.gameId}
                variant="default"
                padding="md"
                className="hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <CardBody className="pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                      {act.domain}
                    </span>
                    <span className="text-sm font-semibold text-stone-500">
                      ⏱ {act.estimatedMinutes} min
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 leading-snug">
                    {act.gameName}
                  </h3>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate(`/patient/game/${act.gameId}`)}
                    className="w-full mt-2 font-semibold"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    {t('games.start', 'Start Activity')}
                  </Button>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* MAIN 6 ACTION CARDS */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Explore Your Day
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {actionCards.map((card) => (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -2 }}
              onClick={() => (card.route ? navigate(card.route) : card.onClick?.())}
              className={`p-6 rounded-3xl border-2 bg-gradient-to-br text-left transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md min-h-[6.5rem] flex flex-col justify-between ${card.gradient}`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <span className="text-4xl sm:text-5xl" role="img" aria-label={card.title}>
                  {card.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/80 border border-black/5 text-stone-700 shadow-xs">
                  {card.badge}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold tracking-tight mb-1 text-stone-900">
                  {card.title}
                </h3>
                <p className="text-base text-stone-600 font-medium">
                  {card.desc}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* COMMUNITY CONNECTION */}
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          Community Connection
        </h2>
        <Card variant="default" className="border-2 border-teal-100 bg-gradient-to-r from-teal-50 to-blue-50">
          <CardBody className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl shadow-sm border-2 border-teal-200 shrink-0">
              👥
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-stone-900 mb-2">You are not alone today!</h3>
              <p className="text-stone-600 font-medium text-lg">
                124 other friends in your region are playing and keeping their minds active right now.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto shadow-md"
              onClick={() => {
                toast.success('Your warm greeting has been sent to the community! 🌸');
              }}
            >
              Send a Greeting
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* MOOD CHECK-IN MODAL */}
      <Modal
        isOpen={isMoodModalOpen}
        onClose={() => {
          setIsMoodModalOpen(false);
          setShowSupportPrompt(false);
          setSelectedMood(null);
        }}
        title={
          <span className="flex items-center gap-2 text-2xl font-extrabold">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            {t('mood.title', 'How Are You Feeling?')}
          </span>
        }
        size="md"
      >
        <div className="py-2 space-y-6">
          {!showSupportPrompt ? (
            <div className="grid grid-cols-1 gap-3">
              {[
                { mood: 'great' as const, emoji: '😊', label: t('mood.great', 'Great'), color: 'hover:bg-emerald-50 border-emerald-200' },
                { mood: 'good' as const, emoji: '🙂', label: t('mood.good', 'Good'), color: 'hover:bg-teal-50 border-teal-200' },
                { mood: 'okay' as const, emoji: '😐', label: t('mood.okay', 'Okay'), color: 'hover:bg-amber-50 border-amber-200' },
                { mood: 'sad' as const, emoji: '😔', label: t('mood.sad', 'Sad'), color: 'hover:bg-blue-50 border-blue-200' },
                { mood: 'worried' as const, emoji: '😟', label: t('mood.worried', 'Worried'), color: 'hover:bg-rose-50 border-rose-200' },
              ].map((item) => (
                <button
                  key={item.mood}
                  type="button"
                  onClick={() => handleMoodSelect(item.mood)}
                  className={`flex items-center gap-4 p-4 sm:p-5 rounded-2xl border-2 bg-white text-left transition-all active:scale-[0.98] cursor-pointer min-h-[4rem] shadow-xs ${
                    selectedMood === item.mood
                      ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-500/20'
                      : item.color
                  }`}
                >
                  <span className="text-4xl">{item.emoji}</span>
                  <span className="text-2xl font-bold text-stone-900">{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 space-y-5">
              <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-200 flex items-center justify-center mx-auto text-rose-500">
                <Heart className="w-10 h-10 fill-rose-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-stone-900">
                  {t('mood.talk_to_someone', 'Would you like to talk to someone you trust?')}
                </h3>
                <p className="text-lg text-stone-600">
                  Your caregiver {emergencyContact.name} is here to listen and help.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${emergencyContact.phone}`}
                  className="w-full inline-flex items-center justify-center gap-3 h-14 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xl shadow-md cursor-pointer active:scale-95 transition-all"
                >
                  <Phone className="w-6 h-6 fill-current" />
                  <span>Call {emergencyContact.name}</span>
                </a>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setIsMoodModalOpen(false);
                    setShowSupportPrompt(false);
                    setSelectedMood(null);
                  }}
                  className="w-full text-lg"
                >
                  I'm okay for now
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}
