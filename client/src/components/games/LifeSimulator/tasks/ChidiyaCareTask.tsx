import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Volume2, Heart, Check } from 'lucide-react';
import { useLifeSimulator } from '../LifeSimulatorContext';
import { sounds } from '../utils/soundEffects';

interface GrainsScatter {
  id: number;
  x: number;
  y: number;
}

export const ChidiyaCareTask: React.FC = () => {
  const { language, completeTask, closeTask, speakNarration } = useLifeSimulator();
  const isHindi = language === 'hi';

  const [scatteredGrains, setScatteredGrains] = useState<GrainsScatter[]>([]);
  const [isWaterFilled, setIsWaterFilled] = useState<boolean>(false);
  const [birdsVisiting, setBirdsVisiting] = useState<boolean>(false);
  const [pettingHearts, setPettingHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const [petHappyCount, setPetHappyCount] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Scatter grains wherever clicked on the stone floor
  const handleScatterGrainAt = (e: React.MouseEvent<HTMLDivElement>) => {
    sounds.playChime('click');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newGrain = { id: Date.now() + Math.random(), x, y };
    const nextGrains = [...scatteredGrains, newGrain];
    setScatteredGrains(nextGrains);

    if (nextGrains.length >= 3 && !birdsVisiting) {
      setTimeout(() => {
        sounds.playChime('chirp');
        setBirdsVisiting(true);
      }, 500);
    }

    checkProgress(nextGrains.length, isWaterFilled, petHappyCount);
  };

  const handleFillWater = () => {
    if (isWaterFilled) return;
    sounds.playPour();
    setIsWaterFilled(true);
    checkProgress(scatteredGrains.length, true, petHappyCount);
  };

  const handlePetAnimal = (e: React.MouseEvent) => {
    sounds.playPet();
    const nextCount = petHappyCount + 1;
    setPetHappyCount(nextCount);

    const heart = { id: Date.now(), x: e.clientX, y: e.clientY };
    setPettingHearts((prev) => [...prev, heart]);
    setTimeout(() => {
      setPettingHearts((prev) => prev.filter((h) => h.id !== heart.id));
    }, 1000);

    checkProgress(scatteredGrains.length, isWaterFilled, nextCount);
  };

  const checkProgress = (grainsCount: number, water: boolean, petCount: number) => {
    if (grainsCount >= 3 && water && petCount >= 2 && !isDone) {
      setTimeout(() => {
        sounds.playChime('unlock');
        setIsDone(true);
      }, 1000);
    }
  };

  const handleReset = () => {
    setScatteredGrains([]);
    setIsWaterFilled(false);
    setBirdsVisiting(false);
    setPetHappyCount(0);
    setIsDone(false);
  };

  const handleFinish = () => {
    completeTask('chidiya-care', 35);
    closeTask();
  };

  return (
    <div className="flex flex-col items-center max-w-2xl w-full mx-auto text-stone-800 select-none">
      {/* Task Header */}
      <div className="w-full text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs sm:text-sm mb-2">
          <span>🐦</span>
          <span>{isHindi ? 'पंछी व पालतू मित्र (Courtyard Pets & Birds)' : 'Birds & Courtyard Pets'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
          {isHindi ? 'चिड़ियों को दाना व बिल्ली/पिल्ले को दुलार' : 'Feed Friendly Birds & Pet Courtyard Friends'}
        </h2>
        <p className="text-sm sm:text-base font-semibold text-emerald-900 bg-emerald-100/60 py-2 px-4 rounded-2xl mt-2 border border-emerald-200 inline-block">
          {scatteredGrains.length < 3
            ? isHindi
              ? '१. आंगन के फर्श पर ३ जगह दाना डालने के लिए छुएं।'
              : '1. Tap anywhere on the courtyard floor to scatter grains!'
            : !isWaterFilled
            ? isHindi
              ? '२. मिट्टी के सकोरे में शीतल जल भरें।'
              : '2. Fill fresh water in the earthen birdbath.'
            : petHappyCount < 2
            ? isHindi
              ? '३. प्यारे बिल्ली के बच्चे / पिल्ले को प्यार से सहलाएं!'
              : '3. Tap to pet the friendly kitten/puppy!'
            : isHindi
            ? '✓ सभी पंछी और पालतू मित्र खुश हैं!'
            : '✓ All birds and pets are joyful!'}
        </p>
      </div>

      {/* Main Interactive Courtyard Playground Stage */}
      <div
        onClick={handleScatterGrainAt}
        className="w-full bg-gradient-to-b from-sky-200 via-amber-100 to-amber-200 border-3 border-emerald-400 rounded-3xl p-6 sm:p-8 mb-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[360px] cursor-crosshair"
      >
        {/* Sky, Neem Tree & Visiting Birds */}
        <div className="w-full flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="text-4xl">🌳</span>
            <span className="text-xs font-bold text-emerald-900 bg-white/90 px-3 py-1 rounded-full">
              {isHindi ? 'नीम की छांव' : 'Neem Shade'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-3xl">☀️</span>
            <span className="text-xs font-bold text-amber-900 bg-white/90 px-3 py-1 rounded-full">
              {isHindi ? 'मीठी सुबह' : 'Sunny Courtyard'}
            </span>
          </div>
        </div>

        {/* Scattered Grains Rendered on the Floor */}
        {scatteredGrains.map((g) => (
          <motion.div
            key={g.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute pointer-events-none text-2xl"
            style={{ left: `${g.x - 12}px`, top: `${g.y - 12}px` }}
          >
            🌾
          </motion.div>
        ))}

        {/* Birds Flying Down & Pecking */}
        {birdsVisiting && (
          <div className="w-full flex items-center justify-center gap-12 my-6 pointer-events-none">
            <motion.div
              initial={{ y: -80, opacity: 0 }}
              animate={{ y: [0, -6, 0], opacity: 1 }}
              transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
              className="flex flex-col items-center"
            >
              <span className="text-6xl drop-shadow-md">🐦</span>
              <span className="text-[11px] font-black text-emerald-900 bg-white/90 px-2 py-0.5 rounded-full mt-1 border border-emerald-300">
                {isHindi ? 'नन्हीं गौरैया' : 'Sparrow'}
              </span>
            </motion.div>

            <motion.div
              initial={{ y: -90, opacity: 0 }}
              animate={{ y: [0, -8, 0], opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2, repeat: Infinity, repeatType: 'reverse' }}
              className="flex flex-col items-center"
            >
              <span className="text-6xl drop-shadow-md">🕊️</span>
              <span className="text-[11px] font-black text-emerald-900 bg-white/90 px-2 py-0.5 rounded-full mt-1 border border-emerald-300">
                {isHindi ? 'सफेद कबूतर' : 'Dove'}
              </span>
            </motion.div>
          </div>
        )}

        {/* Bottom Stage: Water Bowl + Pet Animals */}
        <div className="w-full flex items-end justify-between border-t border-emerald-300/80 pt-4 mt-auto">
          {/* Water Birdbath Bowl */}
          <div className="flex flex-col items-center pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleFillWater();
              }}
              className={`p-3.5 rounded-2xl border-2 flex items-center gap-2 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer ${
                isWaterFilled
                  ? 'bg-sky-100 border-sky-400 text-sky-950'
                  : 'bg-white border-sky-300 hover:bg-sky-50 text-sky-900 animate-pulse'
              }`}
            >
              <span className="text-3xl">{isWaterFilled ? '💧' : '🥣'}</span>
              <span>{isWaterFilled ? (isHindi ? '✓ शीतल जल भरा' : '✓ Water Filled') : isHindi ? 'पानी भरें (Fill Water)' : 'Fill Water'}</span>
            </button>
          </div>

          {/* Interactive Petting Kitten/Puppy */}
          <div className="flex flex-col items-center pointer-events-auto">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handlePetAnimal(e);
              }}
              className="p-3 bg-white/90 hover:bg-amber-50 border-2 border-amber-300 rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all"
              title={isHindi ? 'दुलारने के लिए सहलाएं' : 'Tap to pet!'}
            >
              <span className="text-4xl">🐱</span>
              <div className="text-left">
                <span className="font-extrabold text-xs block text-stone-900">
                  {isHindi ? 'प्यारी बिल्ली' : 'Friendly Kitten'}
                </span>
                <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                  <Heart className="w-3 h-3 fill-current text-rose-500" />
                  {petHappyCount >= 2 ? (isHindi ? '✓ बहुत खुश' : '✓ Happy') : isHindi ? 'सहलाएं (Pet me)' : 'Pet me'}
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-emerald-100 via-teal-100 to-amber-100 border-3 border-emerald-400 p-6 sm:p-8 rounded-3xl text-center shadow-xl mb-4"
          >
            <div className="flex items-center justify-center gap-3 mb-3 text-5xl">
              <span>🐦</span>
              <span>🕊️</span>
              <span>🐱</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950 mb-1">
              {isHindi ? 'आनंदमयी! आँगन में सभी पंछी और मित्र चहक उठे!' : 'Heartwarming! Courtyard Filled with Joy & Birdsong!'}
            </h3>
            <p className="text-stone-700 text-base mb-6 font-medium">
              {isHindi
                ? 'दाना-पानी पाकर नन्हीं चिड़ियों ने मधुर गीत गाए और पालतू मित्र खुश हुए। आपको ३५ स्नेह अंक मिले!'
                : 'Visiting sparrows enjoyed fresh grains while your courtyard pet purred with joy. Earned +35 Sneh Points!'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleFinish}
                className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isHindi ? 'अंक लें व आँगन लौटें' : 'Claim +35 Sneh Points'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
