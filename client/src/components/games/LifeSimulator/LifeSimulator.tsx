import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Coins,
  HelpCircle,
  LogOut,
  RotateCcw,
} from 'lucide-react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '@/types';
import {
  LifeSimulatorProvider,
  useLifeSimulator,
} from './LifeSimulatorContext';
import { AanganCourtyard } from './AanganCourtyard';
import { ChaiMakingTask } from './tasks/ChaiMakingTask';
import { SandookMemoryTask } from './tasks/SandookMemoryTask';
import { PhoolSortingTask } from './tasks/PhoolSortingTask';
import { ChidiyaCareTask } from './tasks/ChidiyaCareTask';
import { SajawatModal } from './shop/SajawatModal';

export interface LifeSimulatorProps {
  difficulty?: GameDifficulty;
  patientId: string;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
}

const LifeSimulatorInner: React.FC = () => {
  const {
    snehPoints,
    activeTask,
    isSajawatOpen,
    isVoiceActive,
    isMuted,
    language,
    closeTask,
    openSajawat,
    toggleMute,
    speakNarration,
    onGameExit,
  } = useLifeSimulator();

  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  const isHindi = language === 'hi';

  const overviewNarration = isHindi
    ? `नमस्ते! यह आपका प्यारा आँगन है। यहाँ आप अपने दैनिक कार्य करके स्नेह अंक कमा सकते हैं और अपने आँगन को पौधों और झूले से सजा सकते हैं।`
    : `Welcome to Aangan, your peaceful home simulator. Complete gentle daily routine milestones to earn Sneh Points and decorate your lovely courtyard.`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/80 via-orange-50/40 to-stone-100 text-stone-900 flex flex-col select-none">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200 px-4 py-3 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Exit/Back to Aangan or Dashboard */}
          <div className="flex items-center gap-3">
            {activeTask ? (
              <button
                onClick={closeTask}
                className="px-3.5 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-sm flex items-center gap-1.5 border border-amber-300 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{isHindi ? 'आँगन लौटें' : 'Back to Courtyard'}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowExitConfirm(true)}
                className="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-sm flex items-center gap-1.5 border border-rose-200 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{isHindi ? 'घर वापस (Exit)' : 'Exit to Menu'}</span>
              </button>
            )}

            <div>
              <h1 className="text-lg sm:text-2xl font-black text-amber-950 tracking-tight flex items-center gap-2">
                <span>🏡</span>
                <span className="hidden sm:inline">
                  {isHindi ? 'आँगन - मेरा घर' : 'Aangan - Mera Ghar'}
                </span>
                <span className="sm:hidden">{isHindi ? 'आँगन' : 'Aangan'}</span>
              </h1>
            </div>
          </div>

          {/* Right: Currency Points & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sneh Points Counter */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 px-3.5 sm:px-4 py-2 rounded-2xl border border-amber-300 shadow-xs cursor-pointer"
              onClick={openSajawat}
              title="Click to open Sajawat Decor Store"
            >
              <Coins className="w-5 h-5 text-amber-600 fill-amber-500 animate-spin-slow" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider hidden sm:block">
                  {isHindi ? 'स्नेह अंक' : 'Sneh Points'}
                </span>
                <span className="text-base sm:text-lg font-black text-amber-950 leading-none">
                  {snehPoints}
                </span>
              </div>
            </motion.div>

            {/* Decor Button */}
            <button
              onClick={openSajawat}
              className="px-3 py-2 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{isHindi ? 'सजावट' : 'Sajawat'}</span>
            </button>

            {/* Voice Audio Helper */}
            <button
              onClick={() => speakNarration(overviewNarration)}
              className={`p-2 sm:px-3 sm:py-2 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs border cursor-pointer ${
                isVoiceActive
                  ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                  : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
              }`}
              title="Listen to Instructions"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{isHindi ? 'सुनें' : 'Listen'}</span>
            </button>

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleMute}
              className="p-2 sm:p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-all cursor-pointer"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        {activeTask === 'chai-making' && (
          <div className="w-full bg-white/95 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <ChaiMakingTask />
          </div>
        )}

        {activeTask === 'sandook-memory' && (
          <div className="w-full bg-white/95 border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <SandookMemoryTask />
          </div>
        )}

        {activeTask === 'phool-sorting' && (
          <div className="w-full bg-white/95 border-2 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <PhoolSortingTask />
          </div>
        )}

        {activeTask === 'chidiya-care' && (
          <div className="w-full bg-white/95 border-2 border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <ChidiyaCareTask />
          </div>
        )}

        {!activeTask && <AanganCourtyard />}
      </main>

      {/* Sajawat Modal */}
      {isSajawatOpen && <SajawatModal />}

      {/* Exit Confirmation Dialog */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-stone-200 text-center"
            >
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                🏡
              </div>
              <h3 className="text-xl font-bold mb-2 text-stone-900">
                {isHindi ? 'क्या आप आँगन से बाहर जाना चाहते हैं?' : 'Leave Aangan Courtyard?'}
              </h3>
              <p className="text-stone-600 text-sm mb-6">
                {isHindi
                  ? 'आपकी सजावट और कमाए गए स्नेह अंक सुरक्षित रूप से सहेजे गए हैं।'
                  : 'Your customized decorations and Sneh Points are safely saved. You can return anytime!'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm cursor-pointer"
                >
                  {isHindi ? 'यहीं रहें' : 'Stay Here'}
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    onGameExit();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs cursor-pointer"
                >
                  {isHindi ? 'हाँ, बाहर जाएं' : 'Yes, Exit'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const LifeSimulator: React.FC<LifeSimulatorProps> = (props) => {
  return (
    <LifeSimulatorProvider {...props}>
      <LifeSimulatorInner />
    </LifeSimulatorProvider>
  );
};
