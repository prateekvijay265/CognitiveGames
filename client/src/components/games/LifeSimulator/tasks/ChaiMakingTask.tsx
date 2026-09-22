import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Volume2, Flame, Check } from 'lucide-react';
import { useLifeSimulator } from '../LifeSimulatorContext';
import { sounds } from '../utils/soundEffects';

export const ChaiMakingTask: React.FC = () => {
  const { language, completeTask, closeTask, speakNarration } = useLifeSimulator();
  const isHindi = language === 'hi';

  // Interactive Cooking Stages
  // 1: Turn on gas stove flame
  // 2: Pour Water & Milk
  // 3: Crush Ginger & Elaichi
  // 4: Add Tea Leaves & Simmer
  // 5: Strain into Kulhad Cups!
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isStoveOn, setIsStoveOn] = useState<boolean>(false);
  const [waterPoured, setWaterPoured] = useState<boolean>(false);
  const [milkPoured, setMilkPoured] = useState<boolean>(false);
  const [crushCount, setCrushCount] = useState<number>(0);
  const [pattiAdded, setPattiAdded] = useState<boolean>(false);
  const [isBrewed, setIsBrewed] = useState<boolean>(false);
  const [kulhadFilled, setKulhadFilled] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  const handleToggleStove = () => {
    sounds.playChime('click');
    setIsStoveOn(true);
    if (currentStep === 1) {
      setCurrentStep(2);
      sounds.playChime('boil');
    }
  };

  const handlePourWater = () => {
    if (waterPoured) return;
    sounds.playPour();
    setWaterPoured(true);
    if (milkPoured) {
      setCurrentStep(3);
    }
  };

  const handlePourMilk = () => {
    if (milkPoured) return;
    sounds.playPour();
    setMilkPoured(true);
    if (waterPoured) {
      setCurrentStep(3);
    }
  };

  const handleCrushGinger = () => {
    sounds.playCrush();
    const nextCount = crushCount + 1;
    setCrushCount(nextCount);

    if (nextCount >= 3 && currentStep === 3) {
      sounds.playChime('success');
      setTimeout(() => {
        setCurrentStep(4);
      }, 500);
    }
  };

  const handleAddPatti = () => {
    if (pattiAdded) return;
    sounds.playChime('flower');
    setPattiAdded(true);

    // Watch chai brew & simmer!
    setTimeout(() => {
      sounds.playChime('boil');
      setIsBrewed(true);
      setTimeout(() => {
        setCurrentStep(5);
        sounds.playChime('unlock');
      }, 1000);
    }, 800);
  };

  const handleStrainChai = () => {
    if (kulhadFilled) return;
    sounds.playPour();
    setKulhadFilled(true);

    setTimeout(() => {
      sounds.playChime('success');
      setIsDone(true);
    }, 900);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setIsStoveOn(false);
    setWaterPoured(false);
    setMilkPoured(false);
    setCrushCount(0);
    setPattiAdded(false);
    setIsBrewed(false);
    setKulhadFilled(false);
    setIsDone(false);
  };

  const handleFinish = () => {
    completeTask('chai-making', 35);
    closeTask();
  };

  const getStepInstruction = () => {
    switch (currentStep) {
      case 1:
        return isHindi ? '१. गैस चूल्हा चालू करने के लिए लाल बटन दबाएं।' : '1. Turn on the stove knob to start heating.';
      case 2:
        return isHindi ? '२. बर्तन में पानी और ताजा दूध डालें।' : '2. Tap Water and Milk to pour into the saucepan.';
      case 3:
        return isHindi ? '३. ओखली में अदरक को ३ बार कूटें।' : '3. Tap the mortar 3 times to crush fresh ginger & spices.';
      case 4:
        return isHindi ? '४. खुशबूदार चायपत्ती डालें और उबलने दें।' : '4. Tap Tea Leaves to add and watch the golden brew simmer.';
      case 5:
        return isHindi ? '५. गरमा-गरम चाय को मिट्टी के कुल्हड़ में छानें!' : '5. Tap the Strainer to pour steaming chai into Kulhad!';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center max-w-2xl w-full mx-auto text-stone-800 select-none">
      {/* Task Header */}
      <div className="w-full text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm mb-2">
          <span>☕</span>
          <span>{isHindi ? 'देसी चाय की रसोई (Tea Stall Kitchen)' : 'Interactive Tea Kitchen'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
          {isHindi ? 'स्वादिष्ट कड़क मसाला चाय' : 'Brewing Fresh Desi Chai'}
        </h2>
        <p className="text-sm sm:text-base font-semibold text-amber-900 bg-amber-100/60 py-2 px-4 rounded-2xl mt-2 border border-amber-200 inline-block">
          👉 {getStepInstruction()}
        </p>

        <div className="flex justify-center mt-2">
          <button
            onClick={() => speakNarration(getStepInstruction())}
            className="px-3.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 border border-amber-300 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isHindi ? 'सुनें' : 'Listen'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Cooking Stage */}
      <div className="w-full bg-gradient-to-b from-stone-800 via-stone-900 to-stone-950 border-3 border-amber-500/80 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[360px] text-white">
        {/* Background Kitchen Tiles & Shelf */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-stone-800/80 border-b border-stone-700 flex items-center justify-around px-4">
          <span className="text-2xl opacity-60">🌿</span>
          <span className="text-2xl opacity-60">🍯</span>
          <span className="text-2xl opacity-60">🍶</span>
          <span className="text-2xl opacity-60">🏺</span>
        </div>

        {/* The Saucepan / Pot Centerpiece */}
        <div className="relative mt-12 flex flex-col items-center">
          {/* Steam Particles */}
          {(isBrewed || kulhadFilled) && (
            <div className="absolute -top-14 flex items-center gap-2">
              <motion.span
                animate={{ y: [-5, -25], opacity: [0, 0.9, 0], scale: [0.8, 1.4] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="text-2xl"
              >
                ♨️
              </motion.span>
              <motion.span
                animate={{ y: [-5, -30], opacity: [0, 0.9, 0], scale: [0.8, 1.5] }}
                transition={{ duration: 1.8, delay: 0.3, repeat: Infinity }}
                className="text-3xl"
              >
                ♨️
              </motion.span>
              <motion.span
                animate={{ y: [-5, -22], opacity: [0, 0.8, 0], scale: [0.8, 1.3] }}
                transition={{ duration: 1.5, delay: 0.6, repeat: Infinity }}
                className="text-2xl"
              >
                ♨️
              </motion.span>
            </div>
          )}

          {/* Brass Pan Vessel */}
          <div className="relative w-48 sm:w-56 h-32 rounded-b-3xl border-4 border-amber-400/90 shadow-2xl overflow-hidden flex items-end justify-center bg-gradient-to-b from-stone-700 to-stone-800">
            {/* Liquid inside pan */}
            <motion.div
              initial={false}
              animate={{
                height: isBrewed
                  ? '75%'
                  : pattiAdded
                  ? '70%'
                  : waterPoured && milkPoured
                  ? '60%'
                  : waterPoured || milkPoured
                  ? '35%'
                  : '0%',
                backgroundColor: isBrewed
                  ? '#92400E' // Rich golden chai brown
                  : pattiAdded
                  ? '#D97706' // Brewing amber
                  : milkPoured
                  ? '#FEF3C7' // Creamy milk
                  : waterPoured
                  ? '#93C5FD' // Water
                  : 'transparent',
              }}
              transition={{ duration: 0.7 }}
              className="w-full relative flex items-center justify-center"
            >
              {/* Bubbling bubbles when brewed */}
              {isBrewed && (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="w-4 h-4 rounded-full bg-amber-400/80"
                  />
                  <motion.div
                    animate={{ scale: [1.1, 0.7, 1.1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-amber-200/90"
                  />
                  <motion.div
                    animate={{ scale: [0.7, 1.3, 0.7] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                    className="w-4 h-4 rounded-full bg-amber-300/80"
                  />
                </div>
              )}
            </motion.div>

            {/* Pan Handle */}
            <div className="absolute top-4 -right-10 w-12 h-4 bg-stone-900 border-2 border-stone-600 rounded-r-lg" />
          </div>

          {/* Stove Burner Flame Underneath */}
          <div className="h-10 flex flex-col items-center justify-center mt-1">
            {isStoveOn ? (
              <motion.div
                animate={{ scale: [1, 1.15, 0.95, 1.1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="flex items-center gap-1 text-2xl text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]"
              >
                <span>🔥</span>
                <span>🔥</span>
                <span>🔥</span>
              </motion.div>
            ) : (
              <div className="w-24 h-2 rounded-full bg-stone-700" />
            )}
          </div>
        </div>

        {/* Stove Control Knob */}
        <div className="w-full flex items-center justify-between mt-4 border-t border-stone-800 pt-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleStove}
              className={`px-4 py-2.5 rounded-2xl font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                isStoveOn
                  ? 'bg-amber-500 text-stone-950 ring-4 ring-amber-400/60'
                  : 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              }`}
            >
              <Flame className="w-5 h-5" />
              <span>{isStoveOn ? (isHindi ? '🔥 आंच चालू है' : 'Flame ON') : isHindi ? '🔥 गैस चालू करें' : 'Turn ON Stove'}</span>
            </button>
          </div>

          {/* Status badge */}
          <div className="text-right">
            <span className="text-xs text-amber-300/90 font-bold block">
              {isBrewed ? '✓ चाय उबल चुकी है' : isStoveOn ? 'गरम हो रहा है...' : 'चूल्हा बंद है'}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Ingredient Action Panels */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* 1. Water & Milk Pour */}
        <button
          onClick={handlePourWater}
          disabled={waterPoured || !isStoveOn}
          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer shadow-xs ${
            waterPoured
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
              : isStoveOn
              ? 'bg-white border-sky-300 hover:bg-sky-50 text-stone-900 active:scale-95'
              : 'bg-stone-100 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="text-3xl">🚰</span>
          <span className="font-bold text-xs sm:text-sm">
            {waterPoured ? (isHindi ? '✓ पानी डाला' : '✓ Water Added') : isHindi ? 'पानी डालें' : 'Add Water'}
          </span>
        </button>

        <button
          onClick={handlePourMilk}
          disabled={milkPoured || !isStoveOn}
          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer shadow-xs ${
            milkPoured
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
              : isStoveOn
              ? 'bg-white border-amber-300 hover:bg-amber-50 text-stone-900 active:scale-95'
              : 'bg-stone-100 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="text-3xl">🥛</span>
          <span className="font-bold text-xs sm:text-sm">
            {milkPoured ? (isHindi ? '✓ दूध डाला' : '✓ Milk Added') : isHindi ? 'दूध डालें' : 'Add Milk'}
          </span>
        </button>

        {/* 2. Crush Ginger Mortar */}
        <button
          onClick={handleCrushGinger}
          disabled={crushCount >= 3 || (!waterPoured && !milkPoured)}
          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer shadow-xs ${
            crushCount >= 3
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
              : waterPoured && milkPoured
              ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 animate-bounce shadow-md'
              : 'bg-stone-100 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="text-3xl">🧄</span>
          <span className="font-bold text-xs sm:text-sm">
            {crushCount >= 3
              ? isHindi
                ? '✓ अदरक कुटी'
                : '✓ Spices Crushed'
              : isHindi
              ? `अदरक कूटें (${crushCount}/3)`
              : `Crush Ginger (${crushCount}/3)`}
          </span>
        </button>

        {/* 3. Tea Leaves (Patti) */}
        <button
          onClick={handleAddPatti}
          disabled={pattiAdded || crushCount < 3}
          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer shadow-xs ${
            pattiAdded
              ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
              : crushCount >= 3
              ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700 animate-pulse shadow-md'
              : 'bg-stone-100 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <span className="text-3xl">🌿</span>
          <span className="font-bold text-xs sm:text-sm">
            {pattiAdded ? (isHindi ? '✓ चायपत्ती डाली' : '✓ Tea Brewed') : isHindi ? 'चायपत्ती डालें' : 'Add Tea Leaves'}
          </span>
        </button>
      </div>

      {/* Step 5: Final Strain & Serve Button */}
      {isBrewed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-6 flex flex-col items-center"
        >
          <button
            onClick={handleStrainChai}
            disabled={kulhadFilled}
            className={`w-full py-4 rounded-3xl font-extrabold text-lg flex items-center justify-center gap-3 shadow-xl transition-all cursor-pointer ${
              kulhadFilled
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white hover:brightness-110 active:scale-98 animate-pulse'
            }`}
          >
            <span className="text-3xl">🫖</span>
            <span>{kulhadFilled ? (isHindi ? '✓ कुल्हड़ में छन गई!' : '✓ Chai Poured into Kulhad!') : isHindi ? 'छन्नी से कुल्हड़ में छानें!' : 'Strain into Earthen Kulhad!'}</span>
          </button>
        </motion.div>
      )}

      {/* Completion Banner */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-amber-100 via-orange-100 to-emerald-100 border-3 border-amber-400 p-6 sm:p-8 rounded-3xl text-center shadow-xl mb-4"
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <span className="text-5xl">☕</span>
              <span className="text-5xl">🍪</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-amber-950 mb-1">
              {isHindi ? 'वाह! क्या लाजवाब कड़क मसाला चाय बनी है!' : 'Splendid! Aromatic Kulhad Chai is Ready!'}
            </h3>
            <p className="text-stone-700 text-base mb-6 font-medium">
              {isHindi
                ? 'अदरक और इलायची की खुशबू से पूरा आँगन महक उठा। आपको ३५ स्नेह अंक मिले!'
                : 'The fragrant steam of ginger and cardamom fills the verandah. Earned +35 Sneh Points!'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 font-bold text-base border border-stone-300 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isHindi ? 'फिर से बनाएं' : 'Brew Another Cup'}</span>
              </button>
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
