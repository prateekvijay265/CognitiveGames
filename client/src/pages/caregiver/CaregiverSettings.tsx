import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  SlidersHorizontal,
  Volume2,
  Eye,
  Type,
  Languages,
  Check,
  Bell,
  Save,
  User,
} from 'lucide-react';
import type { GameDifficulty, SupportedLanguage } from '../../types';


export function CaregiverSettings() {
  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS, notes: DEMO_NOTES, metrics: DEMO_COGNITIVE_METRICS } = useAppDataStore();

  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0].id);
  const patient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0];

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large'>(
    patient.accessibilitySettings.fontSize || 'large'
  );
  const [highContrast, setHighContrast] = useState(patient.accessibilitySettings.highContrast);
  const [voiceEnabled, setVoiceEnabled] = useState(patient.accessibilitySettings.voiceEnabled);
  const [soundEnabled, setSoundEnabled] = useState(patient.accessibilitySettings.soundEnabled);
  const [language, setLanguage] = useState<SupportedLanguage>(patient.language);

  // Per-game difficulty profile
  const [gameDifficulties, setGameDifficulties] = useState<Record<string, GameDifficulty>>({
    memoryMatch: patient.difficultyProfile.memoryMatch || 'easy',
    rememberObjects: patient.difficultyProfile.rememberObjects || 'easy',
    sequenceMemory: patient.difficultyProfile.sequenceMemory || 'easy',
    findDifference: patient.difficultyProfile.findDifference || 'medium',
    sortMyDay: patient.difficultyProfile.sortMyDay || 'easy',
    objectRecognition: patient.difficultyProfile.objectRecognition || 'medium',
    patternBuilder: patient.difficultyProfile.patternBuilder || 'easy',
    attentionTap: patient.difficultyProfile.attentionTap || 'medium',
    soundMemory: patient.difficultyProfile.soundMemory || 'easy',
    storyMemory: patient.difficultyProfile.storyMemory || 'easy',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleDifficultyChange = (gameKey: string, diff: GameDifficulty) => {
    setGameDifficulties((prev) => ({ ...prev, [gameKey]: diff }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const gameList = [
    { key: 'memoryMatch', name: 'Memory Match' },
    { key: 'rememberObjects', name: 'Remember Objects' },
    { key: 'sequenceMemory', name: 'Sequence Memory' },
    { key: 'findDifference', name: 'Find Difference' },
    { key: 'sortMyDay', name: 'Sort My Day' },
    { key: 'objectRecognition', name: 'Object Recognition' },
    { key: 'patternBuilder', name: 'Pattern Builder' },
    { key: 'attentionTap', name: 'Attention Tap' },
    { key: 'soundMemory', name: 'Sound Memory' },
    { key: 'storyMemory', name: 'Story Memory' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Patient Settings & Preferences
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Personalize accessibility options, language dialect, and per-game difficulty profiles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-stone-400" />
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-stone-200 rounded-xl text-stone-800 shadow-xs focus:outline-hidden"
          >
            {DEMO_PATIENTS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Accessibility Panel */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-600" /> Accessibility & Interface
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Font Size Selection */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">
                Patient Text Size
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'large', 'x-large'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFontSize(size)}
                    className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize transition-all ${
                      fontSize === size
                        ? 'bg-teal-50 border-teal-500 text-teal-800 shadow-2xs'
                        : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Dialect */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-2">
                Primary Audio & UI Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                className="w-full p-2.5 text-xs font-semibold rounded-xl border border-stone-200 bg-stone-50 focus:outline-hidden"
              >
                <option value="en">English (India)</option>
                <option value="as">Assamese (অসমীয়া)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="mni">Manipuri (মৈতৈলোন্)</option>
                <option value="lus">Mizo (Mizo ṭawng)</option>
                <option value="kha">Khasi (Ka Ktien Khasi)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-stone-100">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
                className="rounded text-teal-600"
              />
              High Contrast Palette
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="rounded text-teal-600"
              />
              Read Instructions Aloud
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-700">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="rounded text-teal-600"
              />
              Gentle Audio Chimes
            </label>
          </div>
        </div>

        {/* Per-Game Difficulty Profile Panel */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-teal-600" /> Per-Activity Challenge Levels
          </h2>
          <p className="text-xs text-stone-500">
            Activities automatically scale with our adaptive engine, but you can pin baseline
            levels here anytime.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {gameList.map(({ key, name }) => (
              <div
                key={key}
                className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between"
              >
                <span className="text-xs font-bold text-stone-800">{name}</span>
                <div className="flex gap-1">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => handleDifficultyChange(key, diff)}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border capitalize transition-all ${
                        gameDifficulties[key] === diff
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-100'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Preferences Saved!
            </span>
          )}
          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save All Preferences
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default CaregiverSettings;
