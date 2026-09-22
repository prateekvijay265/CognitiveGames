import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Languages,
  Bell,
  Sparkles,
  CheckCircle2,
  Edit2,
  Plus,
  Sliders,
} from 'lucide-react';
import { ALL_COGNITIVE_GAMES } from '../../features/games';
import { MEMORY_CARDS, OBJECT_RECOGNITION_ITEMS, STORIES } from '../../data/gameContent';
import { toast } from 'sonner';


export function AdminContent() {
  const [activeTab, setActiveTab] = useState<'games' | 'translations' | 'reminders' | 'cultural'>(
    'games'
  );

  // Active status per game
  const [gameActiveStatus, setGameActiveStatus] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    ALL_COGNITIVE_GAMES.forEach((g) => {
      map[g.id] = true;
    });
    return map;
  });

  const [selectedLang, setSelectedLang] = useState('as');

  const toggleGameActive = (id: string) => {
    setGameActiveStatus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Sample translations map for preview
  const translations: Record<string, Record<string, string>> = {
    as: {
      'welcome': 'স্বাগতম',
      'good_morning': 'শুভ প্ৰভাত',
      'tea_time': 'চাহৰ সময়',
      'daily_routine': 'দৈনন্দিন নিয়ম',
      'play_again': 'পুনৰ খেলক',
      'great_job': 'বৰ ভাল কাম!',
    },
    hi: {
      'welcome': 'स्वागत है',
      'good_morning': 'सुप्रभात',
      'tea_time': 'चाय का समय',
      'daily_routine': 'दैनिक दिनचर्या',
      'play_again': 'फिर से खेलें',
      'great_job': 'बहुत बढ़िया!',
    },
    en: {
      'welcome': 'Welcome',
      'good_morning': 'Good Morning',
      'tea_time': 'Tea Time',
      'daily_routine': 'Daily Routine',
      'play_again': 'Play Again',
      'great_job': 'Great Job!',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Platform Content & Localization Manager
          </h1>
          <p className="text-stone-500 text-sm mt-0.5">
            Manage cognitive games catalogue, regional language translation keys, and cultural content assets.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 space-x-6">
        {[
          { id: 'games', label: '10 Cognitive Games', icon: Gamepad2 },
          { id: 'translations', label: 'Translations & Dialects', icon: Languages },
          { id: 'reminders', label: 'Default Routine Templates', icon: Bell },
          { id: 'cultural', label: 'Cultural Asset Library', icon: Sparkles },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === id
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Games Catalogue */}
      {activeTab === 'games' && (
        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">Active Cognitive Modules</h3>
            <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg">
              10 of 10 Games Active
            </span>
          </div>

          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-xs font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200">
              <tr>
                <th className="py-3 px-6">Game Module</th>
                <th className="py-3 px-4">Cognitive Domain</th>
                <th className="py-3 px-4">Est. Duration</th>
                <th className="py-3 px-4">Offline Ready</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {ALL_COGNITIVE_GAMES.map((game) => {
                const isActive = gameActiveStatus[game.id] ?? true;

                return (
                  <tr key={game.id} className="hover:bg-stone-50/70">
                    <td className="py-4 px-6 font-bold text-stone-900">
                      <div>{game.name}</div>
                      <div className="text-xs text-stone-400 font-normal line-clamp-1">
                        {game.description}
                      </div>
                    </td>

                    <td className="py-4 px-4 capitalize text-xs font-semibold text-stone-700">
                      {game.cognitiveDomain.replace('-', ' ')}
                    </td>

                    <td className="py-4 px-4 text-xs">{game.estimatedMinutes} mins</td>

                    <td className="py-4 px-4">
                      <span className="text-xs font-semibold text-emerald-600">✓ IndexedDB</span>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleGameActive(game.id)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border transition-colors ${
                          isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border-stone-200'
                        }`}
                      >
                        {isActive ? 'Published' : 'Disabled'}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => toast.success(`Configuring ${game.name}`)}
                        className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <Sliders className="w-3.5 h-3.5" /> Parameters
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Translations */}
      {activeTab === 'translations' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-base">Regional Language Keys</h3>
              <p className="text-xs text-stone-500">
                In-app strings for Assamese, Manipuri, Mizo, Khasi, Hindi, and English
              </p>
            </div>

            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl"
            >
              <option value="as">Assamese (অসমীয়া)</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl overflow-hidden">
            {Object.entries(translations[selectedLang] || translations.en).map(([k, v]) => (
              <div key={k} className="p-3 bg-white flex items-center justify-between text-xs">
                <span className="font-mono text-stone-500 font-bold">{k}</span>
                <span className="font-semibold text-stone-900 text-sm">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reminders Templates */}
      {activeTab === 'reminders' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base">Standard Routine Prompts</h3>
          <p className="text-xs text-stone-500">
            Default schedule seeded into new patient accounts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { time: '08:00', title: 'Morning Medicine & Red Tea', type: 'Medicine' },
              { time: '10:00', title: 'Hydration (Fresh Water)', type: 'Hydration' },
              { time: '13:00', title: 'Midday Meal & Rest', type: 'Meal' },
              { time: '17:00', title: 'Courtyard Walk', type: 'Exercise' },
              { time: '18:30', title: 'Light Diya & Evening Medicine', type: 'Medicine' },
            ].map((tmpl) => (
              <div key={tmpl.time} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-100/60 px-2 py-0.5 rounded-md">
                    {tmpl.type}
                  </span>
                  <h4 className="font-bold text-stone-900 text-sm mt-1">{tmpl.title}</h4>
                  <span className="text-xs text-stone-400">{tmpl.time} (Daily)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Cultural Content */}
      {activeTab === 'cultural' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h3 className="font-bold text-stone-900 text-base">North-Eastern Cultural Asset Pool</h3>
          <p className="text-xs text-stone-500">
            Familiar cultural iconography used across cards, recognition items, and memory stories.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {MEMORY_CARDS.map((c) => (
              <div key={c.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex flex-col items-center text-center">
                <span className="text-3xl mb-1">{c.emoji}</span>
                <span className="text-xs font-bold text-stone-900">{c.name}</span>
                <span className="text-[10px] text-stone-400">{c.assameseName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default AdminContent;
