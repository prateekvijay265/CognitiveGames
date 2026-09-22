import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Volume2, Coins } from 'lucide-react';
import { useLifeSimulator, CATALOG_DECORATIONS, CourtyardDecoration } from '../LifeSimulatorContext';
import { sounds } from '../utils/soundEffects';

export const SajawatModal: React.FC = () => {
  const {
    snehPoints,
    unlockedDecorations,
    buyDecoration,
    closeSajawat,
    language,
    speakNarration,
  } = useLifeSimulator();

  const isHindi = language === 'hi';
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'paudhe' | 'panchhi' | 'baithak'>('all');

  const filteredItems = CATALOG_DECORATIONS.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleBuy = (item: CourtyardDecoration) => {
    if (unlockedDecorations.includes(item.id)) return;
    const success = buyDecoration(item);
    if (!success) {
      const msg = isHindi
        ? `इस वस्तु के लिए ${item.cost} स्नेह अंक चाहिए। और अंक कमाने के लिए दैनिक कार्य पूरे करें।`
        : `You need ${item.cost} Sneh Points for this item. Complete daily tasks to earn more points.`;
      speakNarration(msg);
    }
  };

  const spokenOverview = isHindi
    ? `सजावट की दुकान। आपके पास कुल ${snehPoints} स्नेह अंक हैं। अपनी पसंद के पौधे, झूले और चिड़ियों के घोंसले चुनकर आँगन को सजाएं।`
    : `Courtyard Decoration Store. You have ${snehPoints} Sneh Points. Choose plants, swings, and bird nests to decorate your peaceful home.`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="bg-[#fcfaf6] rounded-3xl max-w-3xl w-full border-2 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 sm:p-6 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner">
                ✨
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {isHindi ? 'आँगन की सजावट' : 'Courtyard Sajawat'}
                </h2>
                <p className="text-amber-100 text-xs sm:text-sm font-medium">
                  {isHindi
                    ? 'स्नेह अंकों से नए पौधे, झूले व पक्षियों का बसेरा सजाएं'
                    : 'Redeem Sneh Points for plants, swings, and garden decor'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Voice button */}
              <button
                onClick={() => speakNarration(spokenOverview)}
                className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
                title={isHindi ? 'सुनें' : 'Listen'}
              >
                <Volume2 className="w-5 h-5" />
              </button>

              {/* Close button */}
              <button
                onClick={() => {
                  sounds.playChime('click');
                  closeSajawat();
                }}
                className="p-2.5 rounded-xl bg-black/20 hover:bg-black/30 text-white transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Points Bar & Category Tabs */}
          <div className="bg-amber-100/70 border-b border-amber-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Sneh Points Counter */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-amber-300 shadow-xs">
              <Coins className="w-5 h-5 text-amber-600 fill-amber-500" />
              <span className="text-xs sm:text-sm font-bold text-stone-600">
                {isHindi ? 'उपलब्ध स्नेह अंक:' : 'Your Sneh Points:'}
              </span>
              <span className="text-xl font-black text-amber-900">{snehPoints}</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { key: 'all', label: isHindi ? 'सभी (All)' : 'All' },
                { key: 'paudhe', label: isHindi ? '🌿 पौधे' : '🌿 Plants' },
                { key: 'panchhi', label: isHindi ? '🐦 पंछी' : '🐦 Birds' },
                { key: 'baithak', label: isHindi ? '🪑 बैठक' : '🪑 Furniture' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedCategory === tab.key
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white/80 hover:bg-white text-stone-700 border border-amber-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="p-5 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isOwned = unlockedDecorations.includes(item.id);
              const canAfford = snehPoints >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-3xl border-2 flex flex-col justify-between transition-all shadow-xs ${
                    isOwned
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                      : canAfford
                      ? 'bg-white border-amber-300 hover:border-amber-400 hover:shadow-md'
                      : 'bg-stone-50/80 border-stone-200 opacity-80'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <span className="text-4xl sm:text-5xl">{item.emoji}</span>
                      <div className="flex items-center gap-1.5">
                        {isOwned ? (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                            {isHindi ? 'सजा हुआ' : 'In Aangan'}
                          </span>
                        ) : (
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${
                              canAfford
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            <Coins className="w-3.5 h-3.5 text-amber-600" />
                            {item.cost} {isHindi ? 'अंक' : 'Pts'}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-stone-900">
                      {isHindi ? item.hindiName : item.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-2">
                      {isHindi ? item.hindiDescription : item.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-200/80 flex items-center justify-between">
                    <button
                      onClick={() =>
                        speakNarration(isHindi ? item.hindiDescription : item.description)
                      }
                      className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'सुनें' : 'Listen'}</span>
                    </button>

                    {isOwned ? (
                      <span className="text-xs font-bold text-emerald-700">
                        {isHindi ? '✓ आपके आँगन में है' : '✓ Placed in Courtyard'}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={!canAfford}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-md active:scale-95'
                            : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>
                          {canAfford
                            ? isHindi
                              ? `सजाएं (${item.cost} अंक)`
                              : `Place (${item.cost} Pts)`
                            : isHindi
                            ? 'अंक कम हैं'
                            : 'Need More Pts'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="bg-stone-100 border-t border-stone-200 px-6 py-4 flex items-center justify-between shrink-0">
            <span className="text-xs text-stone-600 font-medium">
              {isHindi
                ? '💡 दैनिक कार्य पूरे करके और स्नेह अंक अर्जित करें।'
                : '💡 Complete daily routine milestones to earn more Sneh Points.'}
            </span>
            <button
              onClick={() => {
                sounds.playChime('click');
                closeSajawat();
              }}
              className="px-6 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              {isHindi ? 'आँगन देखें' : 'View Courtyard'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
