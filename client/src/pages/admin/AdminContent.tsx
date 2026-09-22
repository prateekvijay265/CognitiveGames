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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-6 max-w-7xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div className="smallcaps text-sand mb-1">Administrator • Content</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Content Manager
          </h1>
          <p className="font-mono text-sand/70 text-sm mt-1">
            Manage cognitive games catalogue, regional language translation keys, and cultural content assets.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-ink/20 space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'games', label: 'Cognitive Games', icon: Gamepad2 },
          { id: 'translations', label: 'Translations', icon: Languages },
          { id: 'reminders', label: 'Routine Templates', icon: Bell },
          { id: 'cultural', label: 'Cultural Assets', icon: Sparkles },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`px-6 py-2 font-bold uppercase text-sm flex items-center gap-6 border-2 transition-all ${
              activeTab === id
                ? 'bg-vermilion border-ink text-kraft shadow-[2px_2px_0px_#1a1512]'
                : 'bg-kraft2 border-transparent text-ink hover:border-ink hover:shadow-[2px_2px_0px_#1a1512]'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab 1: Games Catalogue */}
      {activeTab === 'games' && (
        <div className="arcade-card overflow-hidden">
          <div className="p-6 border-b-2 border-ink bg-kraft2 flex items-center justify-between">
            <h3 className="font-bold text-ink uppercase tracking-wider">Active Modules</h3>
            <span className="badge badge-ochre">
              10 of 10 Games Active
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="arcade-table w-full">
              <thead>
                <tr>
                  <th>Game Module</th>
                  <th>Domain</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ALL_COGNITIVE_GAMES.map((game) => {
                  const isActive = gameActiveStatus[game.id] ?? true;

                  return (
                    <tr key={game.id}>
                      <td className="font-bold text-ink">
                        <div>{game.name}</div>
                        <div className="font-mono text-xs text-sand font-normal line-clamp-1 mt-0.5">
                          {game.description}
                        </div>
                      </td>

                      <td className="capitalize font-mono text-xs text-ink font-bold">
                        {game.cognitiveDomain.replace('-', ' ')}
                      </td>

                      <td className="font-mono text-xs text-sand">{game.estimatedMinutes} mins</td>

                      <td>
                        <button
                          onClick={() => toggleGameActive(game.id)}
                          className={`badge cursor-pointer ${
                            isActive
                              ? 'badge-green'
                              : 'bg-kraft3 text-sand border-ink'
                          }`}
                        >
                          {isActive ? 'PUBLISHED' : 'DISABLED'}
                        </button>
                      </td>

                      <td className="text-right">
                        <button
                          onClick={() => toast.success(`Configuring ${game.name}`)}
                          className="btn btn-sm btn-ghost inline-flex items-center gap-1"
                        >
                          <Sliders className="w-3.5 h-3.5" /> Params
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Translations */}
      {activeTab === 'translations' && (
        <div className="arcade-card p-6 space-y-8">
          <div className="flex items-center justify-between border-b-2 border-ink pb-3">
            <div>
              <h3 className="font-bold text-ink uppercase tracking-widest text-lg">Regional Language Keys</h3>
              <p className="font-mono text-xs text-sand mt-1">
                In-app strings for local languages
              </p>
            </div>

            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="arcade-select"
            >
              <option value="as">Assamese</option>
              <option value="hi">Hindi</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="divide-y-2 divide-ink/10 border-2 border-ink bg-kraft2">
            {Object.entries(translations[selectedLang] || translations.en).map(([k, v]) => (
              <div key={k} className="p-3 flex items-center justify-between">
                <span className="font-mono text-ink font-bold text-sm">{k}</span>
                <span className="font-bold text-ink text-base">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reminders Templates */}
      {activeTab === 'reminders' && (
        <div className="arcade-card p-6 space-y-8">
          <div className="border-b-2 border-ink pb-3">
            <h3 className="font-bold text-ink uppercase tracking-widest text-lg">Standard Routine Prompts</h3>
            <p className="font-mono text-xs text-sand mt-1">
              Default schedule seeded into new patient accounts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { time: '08:00', title: 'Morning Medicine & Red Tea', type: 'Medicine' },
              { time: '10:00', title: 'Hydration (Fresh Water)', type: 'Hydration' },
              { time: '13:00', title: 'Midday Meal & Rest', type: 'Meal' },
              { time: '17:00', title: 'Courtyard Walk', type: 'Exercise' },
              { time: '18:30', title: 'Light Diya & Evening Medicine', type: 'Medicine' },
            ].map((tmpl) => (
              <div key={tmpl.time} className="p-6 bg-kraft2 border-2 border-ink flex flex-col justify-between">
                <div className="flex justify-between items-start mb-2">
                  <span className="badge badge-ochre">
                    {tmpl.type}
                  </span>
                  <span className="font-mono text-xs font-bold text-ink">{tmpl.time}</span>
                </div>
                <h4 className="font-bold text-ink text-lg">{tmpl.title}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Cultural Content */}
      {activeTab === 'cultural' && (
        <div className="arcade-card p-6 space-y-8">
          <div className="border-b-2 border-ink pb-3">
            <h3 className="font-bold text-ink uppercase tracking-widest text-lg">North-Eastern Cultural Asset Pool</h3>
            <p className="font-mono text-xs text-sand mt-1">
              Familiar cultural iconography used across cards and games.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
            {MEMORY_CARDS.map((c) => (
              <div key={c.id} className="p-3 bg-kraft2 border-2 border-ink flex flex-col items-center text-center hover-lift">
                <span className="text-4xl mb-2">{c.image}</span>
                <span className="font-bold text-ink text-sm">{c.name}</span>
                <span className="font-mono text-xs text-sand mt-1">{c.assameseName}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default AdminContent;
