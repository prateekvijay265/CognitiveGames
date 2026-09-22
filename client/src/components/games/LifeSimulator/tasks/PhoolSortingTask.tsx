import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RotateCcw, Volume2, Droplets, Check } from 'lucide-react';
import { useLifeSimulator } from '../LifeSimulatorContext';
import { sounds } from '../utils/soundEffects';

interface BloomingFlower {
  id: string;
  type: 'rose' | 'marigold' | 'jasmine';
  name: string;
  hindiName: string;
  image: string;
  color: string;
  isWatered: boolean;
  isBloomed: boolean;
  isPlucked: boolean;
  isSorted: boolean;
}

const INITIAL_FLOWERS: BloomingFlower[] = [
  { id: 'f-1', type: 'rose', name: 'Red Rose', hindiName: 'लाल गुलाब', image: 'https://loremflickr.com/100/100/rose', color: 'rose', isWatered: false, isBloomed: false, isPlucked: false, isSorted: false },
  { id: 'f-2', type: 'marigold', name: 'Yellow Marigold', hindiName: 'पीला गेंदा', image: 'https://loremflickr.com/100/100/marigold', color: 'amber', isWatered: false, isBloomed: false, isPlucked: false, isSorted: false },
  { id: 'f-3', type: 'jasmine', name: 'White Jasmine', hindiName: 'सफेद मोगरा', image: 'https://loremflickr.com/100/100/jasmine', color: 'stone', isWatered: false, isBloomed: false, isPlucked: false, isSorted: false },
  { id: 'f-4', type: 'rose', name: 'Red Rose', hindiName: 'लाल गुलाब', image: 'https://loremflickr.com/100/100/rose', color: 'rose', isWatered: false, isBloomed: false, isPlucked: false, isSorted: false },
  { id: 'f-5', type: 'marigold', name: 'Yellow Marigold', hindiName: 'पीला गेंदा', image: 'https://loremflickr.com/100/100/marigold', color: 'amber', isWatered: false, isBloomed: false, isPlucked: false, isSorted: false },
  { id: 'f-6', type: 'jasmine', name: 'White Jasmine', hindiName: 'सफेद मोगरा', image: 'https://loremflickr.com/100/100/jasmine', color: 'stone', isWatered: false, isBloomed: false, isPlucked: false, isSorted: false },
];

export const PhoolSortingTask: React.FC = () => {
  const { language, completeTask, closeTask, speakNarration } = useLifeSimulator();
  const isHindi = language === 'hi';

  const [flowers, setFlowers] = useState<BloomingFlower[]>(INITIAL_FLOWERS);
  const [selectedPluckedFlower, setSelectedPluckedFlower] = useState<BloomingFlower | null>(null);
  const [isWateringActive, setIsWateringActive] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [butterflyPos, setButterflyPos] = useState<{ x: number; y: number }>({ x: 40, y: 30 });

  // 1. Water All Plants
  const handleWaterAll = () => {
    sounds.playWaterSprinkle();
    setIsWateringActive(true);

    setTimeout(() => {
      setFlowers((prev) =>
        prev.map((f) => ({ ...f, isWatered: true }))
      );

      // Burst bloom with harmonic chimes!
      setTimeout(() => {
        sounds.playBloom();
        setFlowers((prev) =>
          prev.map((f) => ({ ...f, isBloomed: true }))
        );
        setIsWateringActive(false);
      }, 700);
    }, 600);
  };

  // 2. Pluck a bloomed flower
  const handlePluck = (flower: BloomingFlower) => {
    if (!flower.isBloomed || flower.isPlucked) return;
    sounds.playChime('flower');

    setFlowers((prev) =>
      prev.map((f) => (f.id === flower.id ? { ...f, isPlucked: true } : f))
    );
  };

  // 3. Select plucked flower and place into basket
  const handleSelectPlucked = (flower: BloomingFlower) => {
    if (flower.isSorted) return;
    sounds.playChime('click');
    setSelectedPluckedFlower(flower);
  };

  const handleBasketDrop = (targetType: 'rose' | 'marigold' | 'jasmine') => {
    if (!selectedPluckedFlower) return;

    if (selectedPluckedFlower.type === targetType) {
      sounds.playChime('flower');

      const updated = flowers.map((f) =>
        f.id === selectedPluckedFlower.id ? { ...f, isSorted: true } : f
      );
      setFlowers(updated);
      setSelectedPluckedFlower(null);

      // Check if all sorted
      const allSorted = updated.every((f) => f.isSorted);
      if (allSorted) {
        setTimeout(() => {
          sounds.playChime('unlock');
          setIsDone(true);
        }, 600);
      }
    } else {
      sounds.playChime('gentle');
    }
  };

  const handleButterflyClick = () => {
    sounds.playChime('chirp');
    setButterflyPos({
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 50) + 20,
    });
  };

  const handleReset = () => {
    setFlowers(INITIAL_FLOWERS);
    setSelectedPluckedFlower(null);
    setIsWateringActive(false);
    setIsDone(false);
  };

  const handleFinish = () => {
    completeTask('phool-sorting', 35);
    closeTask();
  };

  const bloomedCount = flowers.filter((f) => f.isBloomed).length;
  const pluckedCount = flowers.filter((f) => f.isPlucked && !f.isSorted).length;
  const sortedCount = flowers.filter((f) => f.isSorted).length;

  return (
    <div className="flex flex-col items-center max-w-2xl w-full mx-auto text-stone-800 select-none">
      {/* Task Header */}
      <div className="w-full text-center mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-bold text-xs sm:text-sm mb-2">
          <span>🌸</span>
          <span>{isHindi ? 'जीवंत फूलों का बगीचा (Living Garden)' : 'Blooming Flower Garden'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950">
          {isHindi ? 'ताजे फूलों की क्यारी व हार्वेस्टिंग' : 'Water & Harvest Garden Blooms'}
        </h2>
        <p className="text-sm sm:text-base font-semibold text-rose-900 bg-rose-100/60 py-2 px-4 rounded-2xl mt-2 border border-rose-200 inline-block">
          {bloomedCount === 0
            ? isHindi
              ? '१. फव्वारे से पानी डालें ताकि कलियां खिल सकें!'
              : '1. Tap Watering Can to water the buds and watch them bloom!'
            : sortedCount < flowers.length
            ? isHindi
              ? '२. खिले हुए फूलों को तोड़ें और सही टोकरी में सजाएं!'
              : '2. Tap blooming flowers to harvest, then place into matching baskets!'
            : isHindi
            ? '✓ सभी फूल टोकरियों में सज गए!'
            : '✓ All flowers sorted into baskets!'}
        </p>
      </div>

      {/* Main Living Garden Stage Canvas */}
      <div className="w-full bg-gradient-to-b from-sky-200 via-emerald-100 to-amber-100 border-3 border-emerald-400 rounded-3xl p-6 sm:p-8 mb-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[340px]">
        {/* Sky & Playful Butterfly */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">☀️</span>
            <span className="text-xs font-bold text-amber-900 bg-white/80 px-3 py-1 rounded-full">
              {isHindi ? 'सुहानी धूप' : 'Warm Sunlight'}
            </span>
          </div>

          {/* Interactive Fluttering Butterfly */}
          <motion.div
            animate={{
              x: [0, 15, -10, 0],
              y: [0, -12, 6, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            onClick={handleButterflyClick}
            className="cursor-pointer text-4xl select-none"
            title="Tap the butterfly!"
          >
            🦋
          </motion.div>
        </div>

        {/* Water Drops Animation */}
        {isWateringActive && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-around">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 200, opacity: [0, 1, 0] }}
                transition={{ duration: 0.6, delay: i * 0.08, repeat: 2 }}
                className="text-2xl text-sky-500"
              >
                💧
              </motion.div>
            ))}
          </div>
        )}

        {/* Garden Plant Bed (Flower Stems) */}
        <div className="my-6 grid grid-cols-6 gap-2 sm:gap-4 items-end justify-items-center min-h-[120px]">
          {flowers.map((flower) => {
            return (
              <div key={flower.id} className="flex flex-col items-center">
                {/* Flower Head */}
                {flower.isPlucked ? (
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-emerald-400/60 flex items-center justify-center text-xs text-emerald-700">
                    🌱
                  </div>
                ) : flower.isBloomed ? (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    onClick={() => handlePluck(flower)}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.85 }}
                    className="text-4xl sm:text-5xl cursor-pointer drop-shadow-md"
                    title={isHindi ? 'तोड़ने के लिए छुएं' : 'Tap to harvest'}
                  >
                    <img src={flower.image} className="w-8 h-8 object-cover mx-auto" />
                  </motion.button>
                ) : (
                  <div className="text-3xl text-emerald-800 animate-pulse">
                    🌱
                  </div>
                )}

                {/* Plant Stem */}
                <div className="w-1.5 h-12 bg-emerald-600 rounded-full mt-1" />
                <div className="w-10 h-2 bg-amber-800/60 rounded-full mt-0.5" />
              </div>
            );
          })}
        </div>

        {/* Garden Water Sprinkler Action */}
        <div className="w-full flex items-center justify-between border-t border-emerald-300/80 pt-3">
          <button
            onClick={handleWaterAll}
            disabled={bloomedCount > 0}
            className={`px-5 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer ${
              bloomedCount === 0
                ? 'bg-sky-500 hover:bg-sky-600 text-white animate-bounce'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            <Droplets className="w-5 h-5 fill-current" />
            <span>{bloomedCount === 0 ? (isHindi ? '🚿 पानी छिड़कें (Water Buds)' : 'Sprinkle Water') : isHindi ? '✓ फूल खिल चुके हैं' : '✓ Garden Bloomed'}</span>
          </button>

          <span className="text-xs font-bold text-emerald-900 bg-white/90 px-3 py-1.5 rounded-full border border-emerald-200">
            {flowers.filter((f) => f.isSorted).length} / {flowers.length} {isHindi ? 'टोकरी में सजे' : 'Sorted'}
          </span>
        </div>
      </div>

      {/* Plucked Flowers Harvest Plate */}
      {flowers.some((f) => f.isPlucked && !f.isSorted) && (
        <div className="w-full bg-white border-2 border-stone-200 rounded-3xl p-4 mb-4 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
            {isHindi ? 'ताजा चुने गए फूल (टोकरी में रखने के लिए चुनें):' : 'Plucked Flowers (Tap to Select):'}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {flowers
              .filter((f) => f.isPlucked && !f.isSorted)
              .map((flower) => {
                const isSelected = selectedPluckedFlower?.id === flower.id;
                return (
                  <motion.button
                    key={flower.id}
                    onClick={() => handleSelectPlucked(flower)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2 font-bold text-sm cursor-pointer ${
                      isSelected
                        ? 'bg-rose-100 border-rose-500 ring-4 ring-rose-300 scale-105 shadow-md'
                        : 'bg-stone-50 border-stone-300 hover:border-rose-300'
                    }`}
                  >
                    <img src={flower.image} className="w-12 h-12 object-cover" />
                    <span>{isHindi ? flower.hindiName : flower.name}</span>
                  </motion.button>
                );
              })}
          </div>
        </div>
      )}

      {/* 3 Color Baskets for Sorting */}
      <div className="w-full grid grid-cols-3 gap-3 mb-6">
        {[
          { type: 'rose', name: isHindi ? 'लाल टोकरी (गुलाब)' : 'Red Basket', image: 'https://loremflickr.com/100/100/basket', color: 'border-rose-400 bg-rose-50 text-rose-900', targetImage: 'https://loremflickr.com/100/100/rose' },
          { type: 'marigold', name: isHindi ? 'पीली टोकरी (गेंदा)' : 'Yellow Basket', image: 'https://loremflickr.com/100/100/basket', color: 'border-amber-400 bg-amber-50 text-amber-900', targetImage: 'https://loremflickr.com/100/100/marigold' },
          { type: 'jasmine', name: isHindi ? 'सफेद टोकरी (मोगरा)' : 'White Basket', image: 'https://loremflickr.com/100/100/basket', color: 'border-stone-300 bg-stone-50 text-stone-900', targetImage: 'https://loremflickr.com/100/100/jasmine' },
        ].map((b) => {
          const inThisBasket = flowers.filter((f) => f.isSorted && f.type === b.type);

          return (
            <button
              key={b.type}
              onClick={() => handleBasketDrop(b.type as any)}
              className={`p-4 rounded-3xl border-3 flex flex-col items-center justify-between text-center min-h-[140px] transition-all cursor-pointer ${
                b.color
              } ${
                selectedPluckedFlower?.type === b.type
                  ? 'ring-4 ring-emerald-400 shadow-lg scale-105 animate-pulse'
                  : 'hover:shadow-md'
              }`}
            >
              <div>
                <img src={b.image} className="w-12 h-12 object-cover block mb-1 mx-auto" />
                <span className="font-extrabold text-xs sm:text-sm block leading-tight">{b.name}</span>
              </div>

              <div className="flex items-center gap-1 mt-2">
                {inThisBasket.length > 0 ? (
                  inThisBasket.map((f, i) => (
                    <span key={i} className="text-xl">
                      <img src={f.image} className="w-8 h-8 object-cover" />
                    </span>
                  ))
                ) : (
                  <span className="text-xs opacity-50 italic">{isHindi ? 'खाली' : 'Empty'}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion Banner */}
      <AnimatePresence>
        {isDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full bg-gradient-to-r from-rose-100 via-amber-100 to-emerald-100 border-3 border-rose-400 p-6 sm:p-8 rounded-3xl text-center shadow-xl mb-4"
          >
            <div className="flex items-center justify-center gap-3 mb-3 text-5xl">
              <span>🌹</span>
              <span>🌼</span>
              <span>🌸</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-rose-950 mb-1">
              {isHindi ? 'अति सुंदर! सभी पूजा की टोकरियां महक उठीं!' : 'Splendid! All Flower Baskets Filled & Fragrant!'}
            </h3>
            <p className="text-stone-700 text-base mb-6 font-medium">
              {isHindi
                ? 'आपने बगीचे के सभी फूलों को सींचा, चुना और सही टोकरियों में सजाया। आपको ३५ स्नेह अंक मिले!'
                : 'You watered the buds, harvested blooming flowers, and sorted them into festive baskets. Earned +35 Sneh Points!'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleFinish}
                className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
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
