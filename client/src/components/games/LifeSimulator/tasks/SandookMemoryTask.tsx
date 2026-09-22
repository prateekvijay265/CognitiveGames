import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Volume2, Key, Radio, Bell, Clock, Image as ImageIcon, Check } from 'lucide-react';
import { useLifeSimulator } from '../LifeSimulatorContext';
import { sounds } from '../utils/soundEffects';

export const SandookMemoryTask: React.FC = () => {
  const { language, completeTask, closeTask, speakNarration } = useLifeSimulator();
  const isHindi = language === 'hi';

  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<'radio' | 'bell' | 'photo' | 'clock' | null>(null);

  // Radio station state
  const [radioStation, setRadioStation] = useState<number>(0);
  const [isRadioPlaying, setIsRadioPlaying] = useState<boolean>(false);

  // Photo dust wiped state (0 to 100)
  const [dustWiped, setDustWiped] = useState<number>(0);

  // Clock ticks
  const [clockHour, setClockHour] = useState<number>(4);

  // Bell swing
  const [bellRung, setBellRung] = useState<boolean>(false);

  // Exploration progress tracker
  const [exploredItems, setExploredItems] = useState<string[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);

  const markExplored = (itemKey: string) => {
    if (!exploredItems.includes(itemKey)) {
      const next = [...exploredItems, itemKey];
      setExploredItems(next);
      if (next.length >= 3) {
        setTimeout(() => {
          setIsDone(true);
          sounds.playChime('unlock');
        }, 1200);
      }
    }
  };

  const handleUnlockChest = () => {
    sounds.playChime('unlock');
    setIsUnlocked(true);
    markExplored('chest');
  };

  const handleTuneRadio = () => {
    const nextStation = (radioStation + 1) % 3;
    setRadioStation(nextStation);
    setIsRadioPlaying(true);
    sounds.playRadioTune(nextStation);
    markExplored('radio');
  };

  const handleRingBell = () => {
    sounds.playBell();
    setBellRung(true);
    setTimeout(() => setBellRung(false), 800);
    markExplored('bell');
  };

  const handleWipePhoto = () => {
    sounds.playChime('flower');
    setDustWiped((prev) => Math.min(100, prev + 25));
    if (dustWiped >= 75) {
      sounds.playChime('success');
      markExplored('photo');
    }
  };

  const handleAdvanceClock = () => {
    sounds.playChime('click');
    setClockHour((prev) => (prev % 12) + 1);
    markExplored('clock');
  };

  const handleFinish = () => {
    completeTask('sandook-memory', 40);
    closeTask();
  };

  return (
    <div className="flex flex-col items-center max-w-2xl w-full mx-auto text-stone-800 select-none">
      {/* Task Header */}
      <div className="w-full text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm mb-2">
          <span>📦</span>
          <span>{isHindi ? 'पुरानी संदूक (Vintage Heirloom Chest)' : 'Vintage Nostalgic Treasures'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
          {isHindi ? 'पुरानी यादों का खजाना' : 'Treasures & Melodies of Sandook'}
        </h2>
        <p className="text-sm sm:text-base font-semibold text-amber-900 bg-amber-100/60 py-2 px-4 rounded-2xl mt-2 border border-amber-200 inline-block">
          {isUnlocked
            ? isHindi
              ? 'संदूक की प्रिय वस्तुओं (रेडियो, घंटी, पुरानी फोटो) को छूकर अनुभव करें।'
              : 'Interact with nostalgic items: tune the vintage radio, ring the temple bell, and wipe the dust off old family photos!'
            : isHindi
            ? 'पीतल की चाबी घुमाकर संदूक का ताला खोलें!'
            : 'Turn the antique brass key to unlock the memory chest!'}
        </p>
      </div>

      {/* Main Sandook Showcase Area */}
      {!isUnlocked ? (
        <div className="w-full bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-600 rounded-3xl p-8 mb-6 shadow-2xl flex flex-col items-center justify-center text-center min-h-[320px] text-amber-100">
          <motion.div
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-7xl sm:text-8xl mb-4 drop-shadow-lg"
          >
            📦
          </motion.div>
          <h3 className="text-2xl font-black text-amber-200 mb-2">
            {isHindi ? 'सागवान की नक्काशीदार संदूक' : 'Antique Teakwood Heirloom Chest'}
          </h3>
          <p className="text-amber-300/80 text-sm max-w-md mb-6">
            {isHindi
              ? 'इसके अंदर दादी के जमाने का रेडियो, पीतल की घंटी और पुरानी तस्वीरें रखी हैं।'
              : 'Inside lies the beloved family radio, brass temple bell, and nostalgic black-and-white portraits.'}
          </p>
          <button
            onClick={handleUnlockChest}
            className="px-8 py-4 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-stone-950 font-black text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
          >
            <Key className="w-6 h-6 fill-current" />
            <span>{isHindi ? '🔑 चाबी से ताला खोलें' : 'Unlock with Brass Key'}</span>
          </button>
        </div>
      ) : (
        <div className="w-full space-y-4 mb-6">
          {/* Unlocked Treasure Chest Interactive Stage */}
          <div className="w-full bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900 border-3 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] text-white">
            {activeItem === 'radio' ? (
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <span className="text-7xl">📻</span>
                  {isRadioPlaying && (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="absolute -top-3 -right-3 text-2xl text-amber-400"
                    >
                      🎶
                    </motion.div>
                  )}
                </div>
                <h4 className="text-xl font-bold text-amber-300">
                  {radioStation === 0 ? 'आकाशवाणी (Raag Bhupali)' : radioStation === 1 ? 'विविध भारती (Raag Desh)' : 'मधुर पुरानी धुन (Aakashvani Tone)'}
                </h4>
                <p className="text-xs text-stone-300 mt-1 mb-4">
                  {isHindi ? 'रेडियो का डायल घुमाकर मनपसंद धुन सुनें।' : 'Turn the dial knob to switch nostalgic melodies.'}
                </p>
                <button
                  onClick={handleTuneRadio}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                >
                  <Radio className="w-5 h-5" />
                  <span>{isHindi ? '📻 स्टेशन बदलें (Tune Dial)' : 'Tune Next Station'}</span>
                </button>
              </div>
            ) : activeItem === 'bell' ? (
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={bellRung ? { rotate: [-20, 20, -15, 15, 0] } : {}}
                  transition={{ duration: 0.6 }}
                  className="text-7xl mb-3 cursor-pointer"
                  onClick={handleRingBell}
                >
                  🔔
                </motion.div>
                <h4 className="text-xl font-bold text-amber-300">
                  {isHindi ? 'पूजा की पीतल घंटी' : 'Resonant Temple Bell'}
                </h4>
                <p className="text-xs text-stone-300 mt-1 mb-4">
                  {isHindi ? 'घंटी को छूकर मधुर झंकार सुनें।' : 'Tap the brass bell to ring soothing devotional chime.'}
                </p>
                <button
                  onClick={handleRingBell}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                >
                  <Bell className="w-5 h-5" />
                  <span>{isHindi ? '🔔 घंटी बजाएं (Ring Bell)' : 'Ring Brass Bell'}</span>
                </button>
              </div>
            ) : activeItem === 'photo' ? (
              <div className="flex flex-col items-center text-center">
                <div
                  onClick={handleWipePhoto}
                  className="relative w-44 h-36 rounded-2xl border-4 border-amber-300 shadow-xl overflow-hidden bg-stone-800 flex items-center justify-center cursor-pointer mb-3"
                >
                  <span className="text-5xl">👨‍👩‍👧‍👦</span>
                  {/* Dust Overlay */}
                  <div
                    className="absolute inset-0 bg-stone-700/90 backdrop-blur-xs flex items-center justify-center text-xs font-bold text-amber-200 transition-all duration-300"
                    style={{ opacity: 1 - dustWiped / 100 }}
                  >
                    {dustWiped < 100 ? (isHindi ? '👆 धूल साफ करने के लिए छुएं' : '👆 Tap to wipe dust') : ''}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-amber-300">
                  {isHindi ? 'पारिवारिक श्वेत-श्याम तस्वीर' : 'Vintage Family Portrait'}
                </h4>
                <p className="text-xs text-stone-300 mt-1 mb-4">
                  {dustWiped >= 100
                    ? isHindi
                      ? '✨ पुरानी तस्वीर चमक उठी!'
                      : '✨ Dust cleared! Beautiful family memory revealed.'
                    : isHindi
                    ? `धूल साफ: ${dustWiped}% (तस्वीर को टैप करें)`
                    : `Cleaned: ${dustWiped}% (Tap photo to wipe)`}
                </p>
                <button
                  onClick={handleWipePhoto}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>{isHindi ? '✨ फोटो साफ करें (Wipe Dust)' : 'Wipe Clean'}</span>
                </button>
              </div>
            ) : activeItem === 'clock' ? (
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <span className="text-7xl">⏰</span>
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-2xl mt-1 text-amber-400"
                  >
                    ⚖️
                  </motion.div>
                </div>
                <h4 className="text-xl font-bold text-amber-300">
                  {isHindi ? `दीवार घड़ी का समय: ${clockHour}:00 बजे` : `Antique Clock: ${clockHour}:00 O'Clock`}
                </h4>
                <p className="text-xs text-stone-300 mt-1 mb-4">
                  {isHindi ? 'चाबी भरकर घड़ी की सुइयों को आगे बढ़ाएं।' : 'Advance the clock hands and pendulum.'}
                </p>
                <button
                  onClick={handleAdvanceClock}
                  className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-black text-sm flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                >
                  <Clock className="w-5 h-5" />
                  <span>{isHindi ? '⏰ सुई आगे बढ़ाएं (Tick Clock)' : 'Advance Clock Hands'}</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="text-5xl mb-2 block">✨</span>
                <h4 className="text-xl font-black text-amber-300 mb-1">
                  {isHindi ? 'संदूक खुल गई है!' : 'The Sandook is Open!'}
                </h4>
                <p className="text-sm text-stone-300">
                  {isHindi ? 'नीचे दिए गए बटनों में से किसी भी पुरानी वस्तु को चुनें।' : 'Select any retro treasure below to play with it.'}
                </p>
              </div>
            )}
          </div>

          {/* 4 Treasure Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: 'radio', icon: '📻', label: isHindi ? 'रेडियो' : 'Radio', desc: isHindi ? 'संगीत सुनें' : 'Play Music' },
              { key: 'bell', icon: '🔔', label: isHindi ? 'पीतल घंटी' : 'Temple Bell', desc: isHindi ? 'झंकार बजाएं' : 'Ring Bell' },
              { key: 'photo', icon: '🖼️', label: isHindi ? 'पुरानी फोटो' : 'Old Photo', desc: isHindi ? 'धूल साफ करें' : 'Wipe Dust' },
              { key: 'clock', icon: '⏰', label: isHindi ? 'दीवार घड़ी' : 'Wall Clock', desc: isHindi ? 'समय देखें' : 'Tick Time' },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => {
                  sounds.playChime('click');
                  setActiveItem(btn.key as any);
                  if (btn.key === 'radio') handleTuneRadio();
                  if (btn.key === 'bell') handleRingBell();
                }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all cursor-pointer shadow-xs ${
                  activeItem === btn.key
                    ? 'bg-amber-100 border-amber-500 ring-3 ring-amber-400 text-amber-950 shadow-md scale-105'
                    : 'bg-white border-stone-200 hover:border-amber-300 text-stone-800'
                }`}
              >
                <span className="text-3xl mb-1">{btn.icon}</span>
                <span className="font-bold text-sm">{btn.label}</span>
                <span className="text-[11px] text-stone-500">{btn.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Completion Banner */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-amber-100 via-orange-100 to-emerald-100 border-3 border-amber-400 p-6 sm:p-8 rounded-3xl text-center shadow-xl mb-4"
          >
            <div className="flex items-center justify-center gap-3 mb-3 text-5xl">
              <span>📻</span>
              <span>🔔</span>
              <span>🖼️</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 mb-1">
              {isHindi ? 'अद्भुत! बचपन की सभी सुनहरी यादें ताजा हो गईं!' : 'Wonderful! Cherished Nostalgic Memories Relived!'}
            </h3>
            <p className="text-stone-700 text-base mb-6 font-medium">
              {isHindi
                ? 'आपने संदूक के सभी कीमती खजानों का आनंद लिया। आपको ४० स्नेह अंक मिले!'
                : 'You explored vintage radio melodies, temple bells, and old photographs. Earned +40 Sneh Points!'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleFinish}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isHindi ? 'अंक लें व आँगन लौटें' : 'Claim +40 Sneh Points'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
