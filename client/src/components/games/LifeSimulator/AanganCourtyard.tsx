import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Volume2, ShoppingBag, Sun, Sunset, Moon } from 'lucide-react';
import { useLifeSimulator, AANGAN_TASKS } from './LifeSimulatorContext';
import { sounds } from './utils/soundEffects';

export const AanganCourtyard: React.FC = () => {
  const {
    completedTasks,
    unlockedDecorations,
    openTask,
    openSajawat,
    language,
    speakNarration,
  } = useLifeSimulator();

  const isHindi = language === 'hi';
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [isJhulaSwinging, setIsJhulaSwinging] = useState<boolean>(false);
  const [isChairRocking, setIsChairRocking] = useState<boolean>(false);

  const isItemUnlocked = (id: string) => unlockedDecorations.includes(id);

  const handleSwingJhula = () => {
    sounds.playChime('gentle');
    setIsJhulaSwinging(true);
    setTimeout(() => setIsJhulaSwinging(false), 2400);
  };

  const handleRockChair = () => {
    sounds.playChime('click');
    setIsChairRocking(true);
    setTimeout(() => setIsChairRocking(false), 2000);
  };

  const getBackgroundGradient = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'from-amber-200 via-orange-100 to-amber-100';
      case 'afternoon':
        return 'from-sky-300 via-amber-100 to-emerald-100';
      case 'evening':
        return 'from-indigo-950 via-purple-900 to-amber-950 text-white';
    }
  };

  const spokenAanganGuide = isHindi
    ? 'यह आपका सुंदर जीवंत आँगन है। यहाँ आप चूल्हे पर चाय बना सकते हैं, पुरानी संदूक में रेडियो और यादें देख सकते हैं, बगीचे में फूल सींच सकते हैं और चिड़ियों को दाना डाल सकते हैं।'
    : 'Welcome to your living courtyard. Here you can brew hot chai on the stove, tune vintage radio melodies from the heirloom chest, water blooming garden flowers, and feed visiting birds.';

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 select-none">
      {/* Visual Courtyard Scene Canvas */}
      <div
        className={`relative w-full rounded-3xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gradient-to-b ${getBackgroundGradient()} aspect-[16/10] sm:aspect-[16/9] min-h-[380px] sm:min-h-[480px] flex flex-col justify-between p-4 sm:p-6 transition-all duration-700`}
      >
        {/* Sky, Sun/Moon & Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {timeOfDay === 'morning' && (
            <>
              <div className="absolute top-4 right-10 w-28 h-28 rounded-full bg-amber-300/50 blur-3xl animate-pulse" />
              <div className="absolute top-6 right-12 text-5xl sm:text-6xl drop-shadow-lg">🌅</div>
            </>
          )}

          {timeOfDay === 'afternoon' && (
            <>
              <div className="absolute top-4 right-10 w-28 h-28 rounded-full bg-yellow-300/40 blur-3xl" />
              <div className="absolute top-6 right-12 text-5xl sm:text-6xl drop-shadow-lg">☀️</div>
            </>
          )}

          {timeOfDay === 'evening' && (
            <>
              <div className="absolute top-6 right-12 text-5xl sm:text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">🌙</div>
              <div className="absolute top-10 left-20 text-xl animate-pulse">✨</div>
              <div className="absolute top-16 left-48 text-lg animate-pulse">✨</div>
              <div className="absolute top-8 right-40 text-xl animate-pulse">✨</div>
            </>
          )}

          {/* Roof Tiles / Eaves (Baraamda) */}
          <div className="absolute top-0 left-0 right-0 h-10 sm:h-12 bg-gradient-to-r from-amber-900 via-orange-950 to-amber-900 shadow-md flex items-end border-b-4 border-amber-950">
            <div className="w-full h-2 bg-amber-700/60" />
          </div>

          {/* Shady Neem Tree on Right */}
          <div className="absolute top-6 right-0 w-48 sm:w-72 h-full pointer-events-none opacity-95 flex flex-col items-end">
            <span className="text-8xl sm:text-9xl -mr-4 -mt-2">🌳</span>
          </div>

          {/* Brick Pathway & Courtyard Ground */}
          <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 bg-gradient-to-t from-amber-300/80 via-amber-200/50 to-transparent border-t border-amber-300/40" />
        </div>

        {/* Top Header Floating Bar inside Scene */}
        <div className="relative z-20 flex items-center justify-between w-full">
          <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-amber-300 shadow-sm flex items-center gap-2.5 text-stone-900">
            <span className="text-2xl">🏡</span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-amber-950">
                {isHindi ? 'हमारा आँगन (Mera Ghar)' : 'Our Living Courtyard'}
              </h2>
              <span className="text-[11px] sm:text-xs text-amber-800 font-bold block">
                {completedTasks.length} / 4 {isHindi ? 'दैनिक कार्य संपन्न' : 'milestones completed'}
              </span>
            </div>
          </div>

          {/* Time of Day Switcher & Actions */}
          <div className="flex items-center gap-2">
            {/* Time toggles */}
            <div className="bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-amber-300 shadow-xs flex items-center gap-1">
              <button
                onClick={() => setTimeOfDay('morning')}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeOfDay === 'morning' ? 'bg-amber-500 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
                }`}
                title="Morning Sunrise"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTimeOfDay('afternoon')}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeOfDay === 'afternoon' ? 'bg-amber-500 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
                }`}
                title="Sunny Afternoon"
              >
                <Sunset className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTimeOfDay('evening')}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeOfDay === 'evening' ? 'bg-indigo-700 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
                }`}
                title="Evening Diyas"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => speakNarration(spokenAanganGuide)}
              className="bg-white/95 hover:bg-white text-amber-900 px-3 py-2 rounded-2xl border border-amber-300 shadow-xs font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">{isHindi ? 'सुनें' : 'Guide'}</span>
            </button>
            <button
              onClick={openSajawat}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-2xl shadow-md font-extrabold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isHindi ? 'सजावट' : 'Decor Shop'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Unlocked Courtyard Decorations Renderings */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Tulsi Shrine (Corner Shrine) */}
          {isItemUnlocked('tulsi-pot') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-20 left-6 sm:left-12 flex flex-col items-center drop-shadow-md pointer-events-auto cursor-pointer"
              onClick={() => sounds.playBell()}
              title="Tulsi Shrine - Click for bell chime"
            >
              <div className="relative">
                <span className="text-4xl sm:text-5xl">🌿</span>
                <span className="absolute -top-1 right-0 text-lg animate-pulse">🪔</span>
              </div>
              <span className="text-[10px] font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 mt-0.5">
                {isHindi ? 'तुलसी चौरा' : 'Tulsi'}
              </span>
            </motion.div>
          )}

          {/* Blooming Rose Trellis (Right Garden) */}
          {isItemUnlocked('gulab-jhad') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-24 right-24 sm:right-32 flex flex-col items-center drop-shadow-md"
            >
              <span className="text-4xl sm:text-5xl">🌹</span>
              <span className="text-[10px] font-bold text-rose-900 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
                {isHindi ? 'खिलते गुलाब' : 'Roses'}
              </span>
            </motion.div>
          )}

          {/* Marigold Border (Garden Border) */}
          {isItemUnlocked('genda-kyari') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-6 right-36 sm:right-48 flex items-center gap-1 drop-shadow-xs"
            >
              <span className="text-2xl sm:text-3xl">🌼</span>
              <span className="text-2xl sm:text-3xl">🌼</span>
              <span className="text-2xl sm:text-3xl">🌼</span>
            </motion.div>
          )}

          {/* Bird Nest (Tree Branch) */}
          {isItemUnlocked('chidiya-ghosla') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-16 right-12 sm:right-24 flex flex-col items-center drop-shadow-md pointer-events-auto cursor-pointer"
              onClick={() => sounds.playChime('chirp')}
              title="Bird Nest - Click to hear chirping"
            >
              <span className="text-3xl sm:text-4xl">🪺</span>
            </motion.div>
          )}

          {/* Bird Feeder Bowl */}
          {isItemUnlocked('daana-plate') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-16 right-4 sm:right-10 flex flex-col items-center drop-shadow-sm"
            >
              <span className="text-3xl sm:text-4xl">🥣</span>
            </motion.div>
          )}

          {/* Earthen Water Matka */}
          {isItemUnlocked('mitti-matka') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-12 left-28 sm:left-40 flex flex-col items-center drop-shadow-md"
            >
              <span className="text-3xl sm:text-4xl">🏺</span>
            </motion.div>
          )}

          {/* Rangoli */}
          {isItemUnlocked('rangoli') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center drop-shadow-sm opacity-90"
            >
              <span className="text-4xl sm:text-5xl">✨</span>
              <span className="text-[10px] font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded-full">
                {isHindi ? 'रंगोली' : 'Rangoli'}
              </span>
            </motion.div>
          )}

          {/* Interactive Rocking Chair */}
          {isItemUnlocked('aaram-kursi') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={isChairRocking ? { rotate: [-10, 10, -8, 8, 0] } : { scale: 1 }}
              transition={{ duration: 1.5 }}
              onClick={handleRockChair}
              className="absolute bottom-24 left-24 sm:left-36 flex flex-col items-center drop-shadow-xl pointer-events-auto cursor-pointer"
              title="Click to rock the chair"
            >
              <span className="text-4xl sm:text-5xl">🪑</span>
            </motion.div>
          )}

          {/* Interactive Courtyard Swing (Jhula) */}
          {isItemUnlocked('jhula') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={isJhulaSwinging ? { x: [-15, 15, -10, 10, 0] } : { scale: 1 }}
              transition={{ duration: 2 }}
              onClick={handleSwingJhula}
              className="absolute bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center drop-shadow-2xl pointer-events-auto cursor-pointer"
              title="Click to swing the Jhula!"
            >
              <span className="text-5xl sm:text-6xl">🛋️</span>
              <span className="text-[10px] font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300 mt-1">
                {isHindi ? 'झूला झूलें' : 'Swing Jhula'}
              </span>
            </motion.div>
          )}

          {/* Brass Diya Lamp Pillar (Glows at evening!) */}
          {isItemUnlocked('brass-diya') && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-16 left-16 sm:left-24 flex flex-col items-center drop-shadow-md"
            >
              <span className="text-3xl sm:text-4xl">🪔</span>
            </motion.div>
          )}
        </div>

        {/* 4 Interactive Hotspot Badges on the Scene */}
        <div className="relative z-20 w-full h-full flex items-end justify-between px-2 sm:px-4 pb-2">
          {/* 1. Chai Hotspot */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => openTask('chai-making')}
            className={`p-3.5 sm:p-4 rounded-3xl border-3 backdrop-blur-md shadow-xl flex items-center gap-3 transition-all cursor-pointer ${
              completedTasks.includes('chai-making')
                ? 'bg-emerald-600 text-white border-emerald-300'
                : 'bg-white text-amber-950 border-amber-400 hover:border-amber-600 animate-bounce'
            }`}
          >
            <span className="text-3xl sm:text-4xl">☕</span>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-black block leading-tight">
                {isHindi ? 'चाय बनाएं' : 'Brew Chai'}
              </span>
              <span className="text-[10px] sm:text-xs opacity-90 font-bold block">
                {completedTasks.includes('chai-making') ? '✓ पूर्ण' : '+35 Pts'}
              </span>
            </div>
          </motion.button>

          {/* 2. Sandook Hotspot */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => openTask('sandook-memory')}
            className={`p-3.5 sm:p-4 rounded-3xl border-3 backdrop-blur-md shadow-xl flex items-center gap-3 transition-all cursor-pointer ${
              completedTasks.includes('sandook-memory')
                ? 'bg-emerald-600 text-white border-emerald-300'
                : 'bg-white text-amber-950 border-amber-400 hover:border-amber-600'
            }`}
          >
            <span className="text-3xl sm:text-4xl">📦</span>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-black block leading-tight">
                {isHindi ? 'पुरानी संदूक' : 'Sandook'}
              </span>
              <span className="text-[10px] sm:text-xs opacity-90 font-bold block">
                {completedTasks.includes('sandook-memory') ? '✓ पूर्ण' : '+40 Pts'}
              </span>
            </div>
          </motion.button>

          {/* 3. Phool Sorting Hotspot */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => openTask('phool-sorting')}
            className={`p-3.5 sm:p-4 rounded-3xl border-3 backdrop-blur-md shadow-xl flex items-center gap-3 transition-all cursor-pointer ${
              completedTasks.includes('phool-sorting')
                ? 'bg-emerald-600 text-white border-emerald-300'
                : 'bg-white text-rose-950 border-rose-400 hover:border-rose-600'
            }`}
          >
            <span className="text-3xl sm:text-4xl">🌸</span>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-black block leading-tight">
                {isHindi ? 'फूल बगीचा' : 'Garden Blooms'}
              </span>
              <span className="text-[10px] sm:text-xs opacity-90 font-bold block">
                {completedTasks.includes('phool-sorting') ? '✓ पूर्ण' : '+35 Pts'}
              </span>
            </div>
          </motion.button>

          {/* 4. Chidiya Hotspot */}
          <motion.button
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => openTask('chidiya-care')}
            className={`p-3.5 sm:p-4 rounded-3xl border-3 backdrop-blur-md shadow-xl flex items-center gap-3 transition-all cursor-pointer ${
              completedTasks.includes('chidiya-care')
                ? 'bg-emerald-600 text-white border-emerald-300'
                : 'bg-white text-emerald-950 border-emerald-400 hover:border-emerald-600'
            }`}
          >
            <span className="text-3xl sm:text-4xl">🐦</span>
            <div className="text-left">
              <span className="text-xs sm:text-sm font-black block leading-tight">
                {isHindi ? 'चिड़िया सेवा' : 'Feed Birds'}
              </span>
              <span className="text-[10px] sm:text-xs opacity-90 font-bold block">
                {completedTasks.includes('chidiya-care') ? '✓ पूर्ण' : '+35 Pts'}
              </span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Accessible Task List Cards Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>{isHindi ? 'आज के आँगन कार्य (Daily Tasks)' : "Today's Courtyard Milestones"}</span>
          </h3>
          <span className="text-xs sm:text-sm font-bold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
            {completedTasks.length} / 4 {isHindi ? 'पूर्ण' : 'Completed'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {AANGAN_TASKS.map((task) => {
            const isCompleted = completedTasks.includes(task.id);

            return (
              <motion.div
                key={task.id}
                whileHover={{ scale: 1.01 }}
                className={`p-5 rounded-3xl border-2 flex items-center justify-between gap-4 transition-all shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-50/90 border-emerald-300'
                    : 'bg-white border-amber-200 hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs border ${
                      isCompleted
                        ? 'bg-emerald-100 border-emerald-300'
                        : 'bg-amber-100 border-amber-200'
                    }`}
                  >
                    {task.icon}
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-stone-900 leading-tight">
                      {isHindi ? task.hindiTitle : task.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-stone-600 mt-0.5 line-clamp-1 font-medium">
                      {isHindi ? task.hindiSubtitle : task.subtitle}
                    </p>
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md mt-1 inline-block">
                      +{task.rewardPoints} {isHindi ? 'स्नेह अंक' : 'Sneh Points'}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => openTask(task.id)}
                    className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 min-h-[48px] ${
                      isCompleted
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    {isCompleted ? (isHindi ? 'फिर खेलें' : 'Play Again') : isHindi ? 'शुरू करें' : 'Play'}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
