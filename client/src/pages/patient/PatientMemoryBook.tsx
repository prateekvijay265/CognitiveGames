import { useAppDataStore } from '@/store/appDataStore';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookImage, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { voiceService } from '@/services/voice';

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
      <div className="flex flex-col items-center justify-center p-12 text-ink">
        <BookImage className="w-16 h-16 mb-4" />
        <h2 className="text-2xl font-display uppercase tracking-widest">{t('memory_book.title', 'My Memories')}</h2>
        <p className="font-mono mt-2">{t('memory_book.no_entries', 'Your caregiver will add memories here.')}</p>
      </div>
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
      className="max-w-4xl mx-auto p-6 lg:p-6 space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">{t('nav.notes', 'Memory Album')}</div>
          <h1 className="font-display font-bold text-ink text-2xl lg:text-3xl uppercase tracking-widest">
            {t('memory_book.title', 'My Memories')}
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Memory {currentIndex + 1} of {memories.length}
          </p>
        </div>
        <div className="flex gap-6">
          <button 
            className={`btn ${isQuizMode ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => {
              setIsQuizMode(!isQuizMode);
              setQuizAnswered(null);
            }}
          >
            <HelpCircle className="w-5 h-5 mr-1" />
            {isQuizMode ? 'Read Mode' : t('memory_book.who_is_this', 'Quiz Mode')}
          </button>
          <button className="btn btn-ochre" onClick={() => voiceService.speak(spokenText)}>Listen</button>
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
          <div className="arcade-card p-6 md:p-12 flex flex-col items-center text-center">
            {/* Photo / Emoji Frame */}
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white border-4 border-ink flex items-center justify-center text-7xl sm:text-8xl shadow-[4px_4px_0px_rgba(26,21,18,1)] mb-8 select-none">
              {emoji}
            </div>

            {!isQuizMode ? (
              <div className="space-y-8 max-w-lg">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink uppercase tracking-widest">
                    {currentMemory.personName}
                  </h2>
                  <span className="badge badge-vermilion mt-3 inline-block">
                    {currentMemory.relationship}
                  </span>
                </div>
                <p className="text-xl sm:text-2xl text-ink font-mono pt-4 leading-relaxed">
                  "{currentMemory.story}"
                </p>
              </div>
            ) : (
              <div className="space-y-8 w-full max-w-md">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink uppercase tracking-widest">
                    {t('memory_book.who_is_this', 'Who is this?')}
                  </h2>
                  <p className="font-mono text-ink font-bold">
                    Relationship: {currentMemory.relationship}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {quizOptions.map((name) => {
                    const isCorrect = name === currentMemory.personName;
                    const isChosen = quizAnswered === name;
                    let btnClass = 'btn btn-ghost w-full justify-between';
                    
                    if (quizAnswered) {
                      if (isCorrect) btnClass = 'btn btn-primary w-full justify-between';
                      else if (isChosen) btnClass = 'btn btn-danger w-full justify-between';
                    }

                    return (
                      <button
                        key={name}
                        className={btnClass}
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
                      >
                        <span className="text-lg">{name}</span>
                        {quizAnswered && isCorrect && <CheckCircle2 className="w-6 h-6" />}
                      </button>
                    );
                  })}
                </div>

                {quizAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 border-2 border-ink bg-ochre mt-6 shadow-[2px_2px_0px_rgba(26,21,18,1)] text-ink"
                  >
                    <p className="text-lg font-mono font-bold leading-relaxed">
                      "{currentMemory.story}"
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* NAVIGATION CONTROLS */}
      <div className="flex items-center justify-between gap-6 max-w-4xl pt-4">
        <button className="btn btn-ghost flex-1" onClick={handlePrev}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Previous
        </button>
        <button className="btn btn-primary flex-1" onClick={handleNext}>
          Next Memory
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </motion.div>
  );
}
