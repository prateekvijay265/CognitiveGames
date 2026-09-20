import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LANGUAGE_OPTIONS } from '@/lib/i18n';
import { useUIStore } from '@/store/uiStore';
import { voiceService } from '@/services/voice';
import { Button } from '@/components/ui/Button';

export default function PatientOnboarding() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { fontSize, setFontSize, setOnboardingComplete, setPatientMode } = useUIStore();

  const [step, setStep] = useState(1);

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((s) => s - 1);
    }
  };

  const selectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('smriti_language', code);
    handleNext();
  };

  const selectVoice = (enabled: boolean) => {
    voiceService.setEnabled(enabled);
    if (enabled) {
      voiceService.speak(t('onboarding.voice_yes', 'Voice instructions are now active.'));
    }
    handleNext();
  };

  const selectFontSize = (size: 'normal' | 'large' | 'x-large') => {
    setFontSize(size);
    handleNext();
  };

  const handleFinish = (navigateToGame: boolean = false) => {
    setOnboardingComplete(true);
    setPatientMode(true);
    if (navigateToGame) {
      navigate('/patient/game/memory-match');
    } else {
      navigate('/patient');
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col justify-between items-center p-6 sm:p-10 patient-mode">
      {/* Top Header / Progress Dots */}
      <div className="w-full max-w-xl flex flex-col items-center pt-4">
        <div className="flex items-center justify-center gap-3 mb-4" role="tablist">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-3.5 rounded-full transition-all duration-300 ${
                step === i + 1
                  ? 'w-10 bg-teal-600'
                  : step > i + 1
                  ? 'w-3.5 bg-teal-300'
                  : 'w-3.5 bg-stone-300'
              }`}
              aria-label={`Step ${i + 1} of ${totalSteps}`}
            />
          ))}
        </div>
        <p className="text-sm font-semibold text-stone-500 uppercase tracking-widest">
          Step {step} of {totalSteps}
        </p>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-xl my-auto py-8">
        <AnimatePresence mode="wait">
          {/* SCREEN 1: Welcome */}
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-center space-y-6"
            >
              <div className="w-28 h-28 mx-auto rounded-3xl bg-teal-50 border-2 border-teal-200 flex items-center justify-center shadow-sm">
                <span className="text-6xl" role="img" aria-label="brain">
                  🧠
                </span>
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  {t('onboarding.welcome', 'Welcome to Smriti Care')}
                </h1>
                <p className="text-xl sm:text-2xl text-stone-600 font-medium">
                  {t('onboarding.welcome_subtitle', 'Your daily memory companion')}
                </p>
              </div>
              <div className="pt-8">
                <Button
                  size="xl"
                  variant="primary"
                  onClick={handleNext}
                  className="w-full text-xl shadow-md min-h-[3.5rem]"
                >
                  <span>{t('onboarding.next', 'Next')}</span>
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 2: Choose Language */}
          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {t('onboarding.choose_language', 'Choose Your Language')}
                </h2>
                <p className="text-lg text-stone-600">
                  Select the language you feel most comfortable reading
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {LANGUAGE_OPTIONS.map((lang) => {
                  const isSelected = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => selectLanguage(lang.code)}
                      className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between cursor-pointer min-h-[4rem] shadow-xs active:scale-[0.98] ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/20'
                          : 'border-stone-200 bg-white hover:border-teal-300 hover:bg-stone-50'
                      }`}
                    >
                      <div>
                        <p className="text-xl font-bold text-stone-900 leading-snug">
                          {lang.nativeName}
                        </p>
                        <p className="text-sm font-medium text-stone-500">
                          {lang.name} • {lang.region}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SCREEN 3: Voice Instructions */}
          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-center space-y-6"
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                <Volume2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {t('onboarding.choose_voice', 'Would you like voice instructions?')}
                </h2>
                <p className="text-lg text-stone-600 max-w-md mx-auto">
                  Smriti Care can read reminders and game instructions aloud to you in your preferred language.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <Button
                  size="xl"
                  variant="primary"
                  onClick={() => selectVoice(true)}
                  className="w-full text-xl min-h-[3.75rem] gap-3"
                >
                  <Volume2 className="w-6 h-6" />
                  <span>{t('onboarding.voice_yes', 'Yes, please')}</span>
                </Button>

                <Button
                  size="xl"
                  variant="secondary"
                  onClick={() => selectVoice(false)}
                  className="w-full text-xl min-h-[3.75rem] gap-3"
                >
                  <VolumeX className="w-6 h-6 text-stone-500" />
                  <span>{t('onboarding.voice_no', 'Not now')}</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* SCREEN 4: Text Size */}
          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                  {t('onboarding.choose_text_size', 'How should the text look?')}
                </h2>
                <p className="text-lg text-stone-600">
                  Choose a text size that is easy and comfortable to read
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                {[
                  {
                    id: 'normal' as const,
                    title: t('settings.normal', 'Normal'),
                    fontSizePreview: 'text-2xl',
                    subtitle: 'Clean & standard size',
                  },
                  {
                    id: 'large' as const,
                    title: t('settings.large', 'Large'),
                    fontSizePreview: 'text-3xl',
                    subtitle: 'Recommended for easy reading',
                  },
                  {
                    id: 'x-large' as const,
                    title: t('settings.x_large', 'Extra Large'),
                    fontSizePreview: 'text-4xl',
                    subtitle: 'Maximum comfort and visibility',
                  },
                ].map((item) => {
                  const isSelected = fontSize === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectFontSize(item.id)}
                      className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-150 flex items-center justify-between cursor-pointer shadow-xs active:scale-[0.98] ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/20'
                          : 'border-stone-200 bg-white hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span
                          className={`w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center font-bold text-stone-900 ${item.fontSizePreview}`}
                        >
                          A
                        </span>
                        <div>
                          <p className="text-xl font-bold text-stone-900">{item.title}</p>
                          <p className="text-sm font-medium text-stone-500">{item.subtitle}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* SCREEN 5: Let's Try a Simple Activity */}
          {step === 5 && (
            <motion.div
              key="step5"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="text-center space-y-6"
            >
              <div className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-amber-100 to-teal-100 border-2 border-amber-200 flex items-center justify-center shadow-md">
                <span className="text-6xl" role="img" aria-label="cards">
                  🃏
                </span>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900">
                  {t('onboarding.lets_try', "Let's Try a Simple Activity!")}
                </h2>
                <p className="text-lg sm:text-xl text-stone-600 max-w-md mx-auto leading-relaxed">
                  Start with a calming round of <strong>Memory Match</strong>. Flip cards to find matching familiar pictures at your own gentle pace.
                </p>
              </div>

              <div className="space-y-3 pt-6">
                <Button
                  size="xl"
                  variant="primary"
                  onClick={() => handleFinish(true)}
                  className="w-full text-xl shadow-lg min-h-[3.75rem]"
                >
                  <span>{t('games.start', 'Start Activity')}</span>
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>

                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => handleFinish(false)}
                  className="w-full text-lg text-stone-600 hover:text-stone-900 min-h-[3.25rem]"
                >
                  {t('onboarding.get_started', 'Go to My Home')}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Back Button */}
      <div className="w-full max-w-xl flex justify-start pb-4">
        {step > 1 && (
          <Button
            variant="ghost"
            size="md"
            onClick={handlePrev}
            className="text-stone-600 hover:text-stone-900 font-semibold"
          >
            ← Back
          </Button>
        )}
      </div>
    </div>
  );
}
