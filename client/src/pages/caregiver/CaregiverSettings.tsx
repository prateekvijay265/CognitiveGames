import { useAppDataStore } from '@/store/appDataStore';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, Eye, Save, User, Check } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import type { GameDifficulty, SupportedLanguage } from '../../types';

export function CaregiverSettings() {
  const { patients: DEMO_PATIENTS } = useAppDataStore();
  const [selectedPatientId, setSelectedPatientId] = useState(DEMO_PATIENTS[0]?.id || '');

  if (DEMO_PATIENTS.length === 0) {
    return (
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto mt-16 lg:mt-0 flex items-center justify-center">
        <EmptyState title="NO PATIENTS" description="Add a patient to configure settings." />
      </div>
    );
  }

  const patient = DEMO_PATIENTS.find((p) => p.id === selectedPatientId) || DEMO_PATIENTS[0];

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large'>(patient.accessibilitySettings.fontSize || 'large');
  const [highContrast, setHighContrast] = useState(patient.accessibilitySettings.highContrast);
  const [voiceEnabled, setVoiceEnabled] = useState(patient.accessibilitySettings.voiceEnabled);
  const [soundEnabled, setSoundEnabled] = useState(patient.accessibilitySettings.soundEnabled);
  const [language, setLanguage] = useState<SupportedLanguage>(patient.language);

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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="smallcaps text-sand mb-1">Caregiver • Preferences</div>
          <h1 className="font-display font-bold text-kraft text-2xl lg:text-3xl uppercase tracking-widest">
            Patient Settings
          </h1>
        </div>
        <div className="arcade-card p-2 bg-kraft2 flex items-center gap-2 self-start sm:self-auto">
          <User size={16} className="text-ink ml-2" />
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="arcade-select py-1 text-sm border-none bg-transparent"
          >
            {DEMO_PATIENTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="arcade-card p-6">
          <h2 className="font-display font-bold uppercase tracking-widest text-ink flex items-center gap-2 mb-6">
            <Eye size={20} className="text-vermilion" /> ACCESSIBILITY
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="smallcaps text-sand block mb-2">TEXT SIZE</label>
              <div className="flex gap-2">
                {(['normal', 'large', 'x-large'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFontSize(size)}
                    className={`flex-1 py-2 font-mono uppercase text-sm border-2 ${
                      fontSize === size ? 'bg-vermilion text-kraft border-ink' : 'bg-kraft2 text-ink border-ink hover:bg-kraft3'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="smallcaps text-sand block mb-2">LANGUAGE</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value as SupportedLanguage)} className="arcade-select w-full">
                <option value="en">ENGLISH (EN)</option>
                <option value="as">ASSAMESE (AS)</option>
                <option value="hi">HINDI (HI)</option>
                <option value="mni">MANIPURI (MNI)</option>
                <option value="lus">MIZO (LUS)</option>
                <option value="kha">KHASI (KHA)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-6 border-t-2 border-ink/20 font-mono text-sm uppercase">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} className="accent-vermilion" />
              HIGH CONTRAST
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={voiceEnabled} onChange={e => setVoiceEnabled(e.target.checked)} className="accent-vermilion" />
              VOICE ASSIST
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={soundEnabled} onChange={e => setSoundEnabled(e.target.checked)} className="accent-vermilion" />
              SFX CHIMES
            </label>
          </div>
        </div>

        <div className="arcade-card p-6">
          <h2 className="font-display font-bold uppercase tracking-widest text-ink flex items-center gap-2 mb-2">
            <SlidersHorizontal size={20} className="text-vermilion" /> GAME DIFFICULTY
          </h2>
          <p className="font-mono text-sand text-sm mb-6">Pin baseline difficulty levels per activity.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameList.map(({ key, name }) => (
              <div key={key} className="p-3 bg-kraft2 border-2 border-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-mono font-bold text-ink uppercase">{name}</span>
                <div className="flex gap-1">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <button
                      key={diff}
                      type="button"
                      onClick={() => handleDifficultyChange(key, diff)}
                      className={`px-3 py-1 font-mono text-xs uppercase border-2 ${
                        gameDifficulties[key] === diff ? 'bg-ink text-kraft border-ink' : 'bg-kraft border-ink text-ink hover:bg-kraft3'
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

        <div className="flex items-center justify-end gap-4">
          {isSaved && <span className="font-mono font-bold text-vermilion flex items-center gap-2"><Check size={16} /> SAVED!</span>}
          <button type="submit" className="btn btn-primary flex items-center gap-2">
            <Save size={16} /> SAVE PREFERENCES
          </button>
        </div>
      </form>
    </motion.div>
  );
}

export default CaregiverSettings;
