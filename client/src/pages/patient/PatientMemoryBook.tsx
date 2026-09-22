import { useAppDataStore } from '@/store/appDataStore';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookImage, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { voiceService } from '@/services/voice';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { VoiceButton } from '@/components/ui/VoiceButton';
import { EmptyState } from '@/components/ui/EmptyState';

const EMOJI_MAP: Record<string, string> = {
  Priya: '👩🏽',
  Rahul: '👨🏽',
  Mantu: '👴🏽',
  Asha: '👵🏽',
  Deepa: '👩🏽',
  Default: '👤',
};

export default function PatientMemoryBook() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { memoryBook } = useAppDataStore();
  
  const memories = memoryBook.filter((m) => m.patientId === user?.id);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);

  if (memories.length === 0) {
    return (
      <EmptyState
        icon={<BookImage className="w-12 h-12 text-stone-300" />}
        title={t('memory_book.title', 'My Memories')}
        description={t('memory_book.no_entries', 'Your caregiver will add memories here.')}
      />
    );
  }

  const currentMemory = memories[currentIndex] ?? memories[0];
  const emoji = EMOJI_MAP[currentMemory.personName] || EMOJI_MAP.Default;

  const handleNext = () => {
    setQuizAnswered(null);
    setCurrentIndex((prev) => (prev + 1) % memories.length);
  };

  const handlePrev = () => {
    setQuizAnswered(null);
    setCurrentIndex((prev) => (prev - 1 + memories.length) % memories.length);
  };

  const spokenText = `${currentMemory.personName}. ${currentMemory.relationship}. ${currentMemory.story}`;

  const quizOptions = [
    currentMemory.personName,
    ...memories
      .filter((m) => m.id !== currentMemory.id)
      .map((m) => m.personName)
      .slice(0, 2),
  ].sort();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-6 patient-mode"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            {t('nav.notes', 'Memory Album')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight pt-1">
            {t('memory_book.title', 'My Memories')}
          </h1>
          <p className="text-lg text-stone-600 font-medium">
            Memory {currentIndex + 1} of {memories.length}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={isQuizMode ? 'primary' : 'secondary'}
            size="md"
            onClick={() => {
              setIsQuizMode(!isQuizMode);
              setQuizAnswered(null);
            }}
            className="font-bold text-sm min-h-[3rem]"
          >
            <HelpCircle className="w-5 h-5 mr-1.5" />
            <span>{isQuizMode ? 'Read Mode' : t('memory_book.who_is_this', 'Quiz Mode')}</span>
          </Button>

          <VoiceButton
            size="lg"
            textToSpeak={spokenText}
            showLabel
            label={t('help.repeat', 'Listen')}
          />
        </div>
      </div>

      {/* MEMORY CARD */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMemory.id + (isQuizMode ? '-quiz' : '-card')}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25 }}
        >
          <Card
            variant="elevated"
            padding="xl"
            className="border-2 border-rose-100 shadow-md overflow-hidden bg-gradient-to-b from-white via-white to-rose-50/30"
          >
            <CardBody className="pt-0 flex flex-col items-center text-center space-y-6">
              {/* Photo / Emoji Frame */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl bg-rose-50 border-4 border-rose-200 flex items-center justify-center text-7xl sm:text-8xl shadow-sm select-none">
                {emoji}
              </div>

              {!isQuizMode ? (
                /* READ STORY MODE */
                <div className="space-y-4 max-w-lg">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
                      {currentMemory.personName}
                    </h2>
                    <span className="inline-block mt-1 text-lg sm:text-xl font-bold text-teal-800 bg-teal-50 px-4 py-1 rounded-full border border-teal-200">
                      {currentMemory.relationship}
                    </span>
                  </div>

                  <p className="text-xl sm:text-2xl text-stone-700 leading-relaxed font-normal pt-2">
                    "{currentMemory.story}"
                  </p>
                </div>
              ) : (
                /* QUIZ MODE ("Who is this?") */
                <div className="space-y-6 w-full max-w-md">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                      {t('memory_book.who_is_this', 'Who is this?')}
                    </h2>
                    <p className="text-base text-stone-500 font-medium">
                      Relationship: {currentMemory.relationship}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {quizOptions.map((name) => {
                      const isCorrect = name === currentMemory.personName;
                      const isChosen = quizAnswered === name;

                      let btnStyle = 'border-stone-200 hover:border-teal-400 bg-white text-stone-900';
                      if (quizAnswered) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20';
                        } else if (isChosen) {
                          btnStyle = 'border-red-400 bg-red-50 text-red-900';
                        }
                      }

                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            if (!quizAnswered) {
                              setQuizAnswered(name);
                              if (isCorrect) {
                                voiceService.speak(`Yes! That's ${name}! Well done.`);
                              } else {
                                voiceService.speak(`Good try! That is ${currentMemory.personName}.`);
                              }
                            }
                          }}
                          className={`p-4 sm:p-5 rounded-2xl border-2 text-xl font-bold transition-all shadow-xs cursor-pointer min-h-[3.75rem] flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{name}</span>
                          {quizAnswered && isCorrect && (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 stroke-[2.5]" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizAnswered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900"
                    >
                      <p className="text-lg font-medium leading-relaxed">
                        "{currentMemory.story}"
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* NAVIGATION CONTROLS */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Button
          variant="secondary"
          size="lg"
          onClick={handlePrev}
          className="text-lg min-h-[3.5rem] px-6 flex-1 shadow-sm font-bold"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Previous</span>
        </Button>

        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          className="text-lg min-h-[3.5rem] px-6 flex-1 shadow-md font-bold"
        >
          <span>Next Memory</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  );
}
