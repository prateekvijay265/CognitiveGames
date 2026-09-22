import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { GameDifficulty, SupportedLanguage, GameSession } from '@/types';
import { sounds } from './utils/soundEffects';

export interface CourtyardDecoration {
  id: string;
  name: string;
  hindiName: string;
  category: 'paudhe' | 'panchhi' | 'baithak';
  cost: number;
  emoji: string;
  description: string;
  hindiDescription: string;
  slotPosition: 'left-porch' | 'center-courtyard' | 'right-garden' | 'tree-branch' | 'garden-border' | 'verandah-floor' | 'corner-shrine';
}

export const CATALOG_DECORATIONS: CourtyardDecoration[] = [
  // Paudhe (Plants)
  {
    id: 'tulsi-pot',
    name: 'Sacred Tulsi Shrine',
    hindiName: 'पवित्र तुलसी का चौरा',
    category: 'paudhe',
    cost: 30,
    emoji: '🌿',
    description: 'Auspicious Basil planter bringing peace, health, and positive energy to your aangan.',
    hindiDescription: 'सुख, शांति और आरोग्य प्रदान करने वाला सुंदर तुलसी का पौधा।',
    slotPosition: 'corner-shrine',
  },
  {
    id: 'gulab-jhad',
    name: 'Blooming Rose Bush',
    hindiName: 'खिलते लाल गुलाब',
    category: 'paudhe',
    cost: 40,
    emoji: '🌹',
    description: 'Fragrant red and pink roses that fill the courtyard with sweet floral scent.',
    hindiDescription: 'सुगंधित लाल गुलाब जो आंगन को महकाते हैं।',
    slotPosition: 'right-garden',
  },
  {
    id: 'genda-kyari',
    name: 'Golden Marigold Border',
    hindiName: 'गेंदे के फूलों की क्यारी',
    category: 'paudhe',
    cost: 35,
    emoji: '🌼',
    description: 'Bright cheerful yellow and orange marigolds loved for festivals and daily pooja.',
    hindiDescription: 'त्योहारों और पूजा में काम आने वाले ताजे पीले गेंदे के फूल।',
    slotPosition: 'garden-border',
  },
  {
    id: 'champa-ped',
    name: 'Sweet Champa Sapling',
    hindiName: 'सुगंधित चंपा का पौधा',
    category: 'paudhe',
    cost: 50,
    emoji: '🌸',
    description: 'Delicate white-yellow champa blossom adding soothing shade and beauty.',
    hindiDescription: 'सफेद और सुनहरे फूलों वाला खुशबूदार चंपा का पौधा।',
    slotPosition: 'garden-border',
  },

  // Panchhi & Prakriti (Birds & Nature)
  {
    id: 'daana-plate',
    name: 'Clay Bird Feeder Bowl',
    hindiName: 'मिट्टी का दाना कुंडा',
    category: 'panchhi',
    cost: 25,
    emoji: '🥣',
    description: 'Traditional earthen plate filled with bajra and wheat grains for little birds.',
    hindiDescription: 'चिड़ियों के चुगने के लिए बाजरा और अनाज से भरा मिट्टी का सकोरा।',
    slotPosition: 'center-courtyard',
  },
  {
    id: 'chidiya-ghosla',
    name: 'Cozy Bird Nest',
    hindiName: 'चिड़िया का घोंसला',
    category: 'panchhi',
    cost: 35,
    emoji: '🪺',
    description: 'Warm natural straw shelter hanging gently from the Neem and Mango tree.',
    hindiDescription: 'पेड़ की शाखों पर नन्हीं गौरैया और बुलबुल का प्यारा सा बसेरा।',
    slotPosition: 'tree-branch',
  },
  {
    id: 'mitti-matka',
    name: 'Earthen Water Pot',
    hindiName: 'ठंडे पानी का मटका व सुराही',
    category: 'panchhi',
    cost: 20,
    emoji: '🏺',
    description: 'Cool natural clay pot providing soothing fresh water for birds and travelers.',
    hindiDescription: 'शीतल और मीठे पानी से भरा पारम्परिक देसी मटका।',
    slotPosition: 'left-porch',
  },
  {
    id: 'rangoli',
    name: 'Welcoming Rangoli',
    hindiName: 'सुंदर आँगन रंगोली',
    category: 'panchhi',
    cost: 30,
    emoji: '✨',
    description: 'Traditional colored flower petal design welcoming warmth and happiness.',
    hindiDescription: 'रंग-बिरंगे फूलों और चावल से सजी शुभ स्वागत रंगोली।',
    slotPosition: 'verandah-floor',
  },

  // Baithak & Aaram (Courtyard Comfort)
  {
    id: 'aaram-kursi',
    name: 'Vintage Rocking Chair',
    hindiName: 'लकड़ी की आराम कुर्सी',
    category: 'baithak',
    cost: 60,
    emoji: '🪑',
    description: 'Solid Sheesham wood rocking chair for peaceful morning tea and newspaper reading.',
    hindiDescription: 'सुबह की धूप और चाय की चुस्की के लिए आरामदायक लकड़ी की कुर्सी।',
    slotPosition: 'left-porch',
  },
  {
    id: 'jhula',
    name: 'Carved Courtyard Swing',
    hindiName: 'आँगन का लकड़ी का झूला',
    category: 'baithak',
    cost: 80,
    emoji: '🛋️',
    description: 'Traditional verandah swing adorned with brass chains and soft bolsters.',
    hindiDescription: 'पीतल की जंजीरों वाला सुंदर नक्काशीदार लकड़ी का झूला।',
    slotPosition: 'center-courtyard',
  },
  {
    id: 'charpai',
    name: 'Woven Charpai Bed',
    hindiName: 'हाथ से बुनी खाट / चारपाई',
    category: 'baithak',
    cost: 70,
    emoji: '🛏️',
    description: 'Classic cotton-rope charpai perfect for basking in gentle morning sunshine.',
    hindiDescription: 'सर्दियों की मीठी धूप सेंकने के लिए मजबूत देसी चारपाई।',
    slotPosition: 'center-courtyard',
  },
  {
    id: 'brass-diya',
    name: 'Brass Lamp Pillar',
    hindiName: 'पीतल का दिया स्तम्भ',
    category: 'baithak',
    cost: 45,
    emoji: '🪔',
    description: 'Glowing brass oil lamp illuminating the courtyard with warmth and serenity.',
    hindiDescription: 'संध्या बेला में आँगन को रोशन करने वाला जगमगाता पीतल का दीप-स्तम्भ।',
    slotPosition: 'verandah-floor',
  },
];

export type TaskId = 'chai-making' | 'sandook-memory' | 'phool-sorting' | 'chidiya-care';

export interface TaskDefinition {
  id: TaskId;
  title: string;
  hindiTitle: string;
  subtitle: string;
  hindiSubtitle: string;
  category: string;
  rewardPoints: number;
  icon: string;
  color: string;
  estimatedMinutes: number;
}

export const AANGAN_TASKS: TaskDefinition[] = [
  {
    id: 'chai-making',
    title: 'Morning Chai Ceremony',
    hindiTitle: 'सुबह की गरमा-गरम चाय',
    subtitle: 'Arrange tea-making steps in correct sequence',
    hindiSubtitle: 'चाय बनाने के चरणों को सही क्रम में लगाएं',
    category: 'Sequential Logic',
    rewardPoints: 30,
    icon: '☕',
    color: 'from-amber-500 to-orange-600',
    estimatedMinutes: 2,
  },
  {
    id: 'sandook-memory',
    title: 'Treasures of Sandook',
    hindiTitle: 'पुरानी संदूक की यादें',
    subtitle: 'Match pairs of vintage nostalgic treasures',
    hindiSubtitle: 'पुरानी प्रिय वस्तुओं के पत्तों का मिलान करें',
    category: 'Reminiscence & Memory',
    rewardPoints: 35,
    icon: '📦',
    color: 'from-amber-600 to-amber-800',
    estimatedMinutes: 3,
  },
  {
    id: 'phool-sorting',
    title: 'Flower Harvest Sorting',
    hindiTitle: 'पूजा के ताजे फूल चुनना',
    subtitle: 'Sort fresh garden flowers by color and basket',
    hindiSubtitle: 'गुलाब और गेंदे के फूलों को सही टोकरी में रखें',
    category: 'Visual & Color Sorting',
    rewardPoints: 30,
    icon: '🌸',
    color: 'from-rose-500 to-pink-600',
    estimatedMinutes: 2,
  },
  {
    id: 'chidiya-care',
    title: 'Courtyard Birds & Daana',
    hindiTitle: 'चिड़ियों को दाना-पानी',
    subtitle: 'Feed friendly visiting sparrows and peacocks',
    hindiSubtitle: 'प्यारी चिड़ियों को दाना डालें और उनकी चहचहाहट सुनें',
    category: 'Attention & Care',
    rewardPoints: 25,
    icon: '🐦',
    color: 'from-emerald-500 to-teal-600',
    estimatedMinutes: 2,
  },
];

interface LifeSimulatorContextType {
  snehPoints: number;
  completedTasks: TaskId[];
  unlockedDecorations: string[];
  activeTask: TaskId | null;
  isSajawatOpen: boolean;
  isVoiceActive: boolean;
  isMuted: boolean;
  difficulty: GameDifficulty;
  language: SupportedLanguage;
  patientId: string;
  totalScore: number;
  tasksCompletedTodayCount: number;
  addPoints: (amount: number) => void;
  completeTask: (taskId: TaskId, earnedPoints?: number) => void;
  buyDecoration: (item: CourtyardDecoration) => boolean;
  openTask: (taskId: TaskId) => void;
  closeTask: () => void;
  openSajawat: () => void;
  closeSajawat: () => void;
  toggleMute: () => void;
  speakNarration: (text: string) => void;
  onGameExit: () => void;
}

const LifeSimulatorContext = createContext<LifeSimulatorContextType | null>(null);

export interface LifeSimulatorProviderProps {
  patientId: string;
  difficulty?: GameDifficulty;
  language?: SupportedLanguage;
  onComplete?: (session: GameSession) => void;
  onExit?: () => void;
  children: React.ReactNode;
}

export const LifeSimulatorProvider: React.FC<LifeSimulatorProviderProps> = ({
  patientId,
  difficulty = 'easy',
  language = 'hi',
  onComplete,
  onExit,
  children,
}) => {
  const storageKey = `smriti_aangan_state_${patientId || 'demo'}`;

  // Initial State from LocalStorage
  const [snehPoints, setSnehPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.snehPoints === 'number') return parsed.snehPoints;
      }
    } catch {
      // ignore
    }
    return 60; // Starting welcome gift points
  });

  const [completedTasks, setCompletedTasks] = useState<TaskId[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.completedTasks)) return parsed.completedTasks;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [unlockedDecorations, setUnlockedDecorations] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.unlockedDecorations)) return parsed.unlockedDecorations;
      }
    } catch {
      // ignore
    }
    return ['tulsi-pot']; // Default starter decoration
  });

  const [activeTask, setActiveTask] = useState<TaskId | null>(null);
  const [isSajawatOpen, setIsSajawatOpen] = useState<boolean>(false);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [sessionStartTime] = useState<number>(() => Date.now());

  // Persist whenever state changes
  useEffect(() => {
    try {
      const stateToSave = {
        snehPoints,
        completedTasks,
        unlockedDecorations,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    } catch (err) {
      console.warn('Could not save Aangan state to localStorage', err);
    }
  }, [snehPoints, completedTasks, unlockedDecorations, storageKey]);

  // Voice narration helper
  const speakNarration = useCallback(
    (textToSpeak: string) => {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();

      if (isVoiceActive) {
        setIsVoiceActive(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.85; // Calming pace for dementia patients
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (language === 'hi' || /[\u0900-\u097F]/.test(textToSpeak)) {
        const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
        if (hiVoice) utterance.voice = hiVoice;
      } else {
        const enVoice = voices.find((v) => v.lang.startsWith('en-IN') || v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }

      utterance.onstart = () => setIsVoiceActive(true);
      utterance.onend = () => setIsVoiceActive(false);
      utterance.onerror = () => setIsVoiceActive(false);

      window.speechSynthesis.speak(utterance);
    },
    [isVoiceActive, language]
  );

  const addPoints = useCallback((amount: number) => {
    setSnehPoints((prev) => prev + amount);
    sounds.playChime('success');
  }, []);

  const openTask = useCallback((taskId: TaskId) => {
    sounds.playChime('click');
    setActiveTask(taskId);
  }, []);

  const closeTask = useCallback(() => {
    setActiveTask(null);
  }, []);

  const openSajawat = useCallback(() => {
    sounds.playChime('click');
    setIsSajawatOpen(true);
  }, []);

  const closeSajawat = useCallback(() => {
    setIsSajawatOpen(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      sounds.isMuted = next;
      return next;
    });
  }, []);

  const completeTask = useCallback(
    (taskId: TaskId, earnedPoints?: number) => {
      const taskDef = AANGAN_TASKS.find((t) => t.id === taskId);
      const pointsToAdd = earnedPoints !== undefined ? earnedPoints : (taskDef?.rewardPoints || 30);

      setCompletedTasks((prev) => {
        if (!prev.includes(taskId)) {
          return [...prev, taskId];
        }
        return prev;
      });

      setSnehPoints((prev) => prev + pointsToAdd);
      sounds.playChime('unlock');

      // Check if all 4 daily tasks are completed, or trigger telemetry
      const updatedCount = completedTasks.includes(taskId) ? completedTasks.length : completedTasks.length + 1;
      if (onComplete) {
        const session: GameSession = {
          id: crypto.randomUUID ? crypto.randomUUID() : `session-aangan-${Date.now()}`,
          gameId: 'daily-life-simulator',
          patientId,
          sessionId: `ses-${Date.now()}`,
          startedAt: new Date(sessionStartTime).toISOString(),
          completedAt: new Date().toISOString(),
          difficulty,
          accuracy: 100,
          responseTimeMs: 3000,
          hintsUsed: 0,
          mistakes: 0,
          score: (snehPoints + pointsToAdd),
          totalQuestions: AANGAN_TASKS.length,
          answeredQuestions: updatedCount,
          completed: updatedCount >= 2,
          abandoned: false,
          cognitiveDomain: 'executive-function',
          language,
          offline: !navigator.onLine,
          syncStatus: 'pending',
          metadata: {
            unlockedDecorationsCount: unlockedDecorations.length,
            completedTasksList: [...completedTasks, taskId],
          },
        };
        onComplete(session);
      }
    },
    [completedTasks, snehPoints, onComplete, patientId, sessionStartTime, difficulty, language, unlockedDecorations]
  );

  const buyDecoration = useCallback(
    (item: CourtyardDecoration): boolean => {
      if (snehPoints < item.cost) {
        sounds.playChime('gentle');
        return false;
      }
      if (unlockedDecorations.includes(item.id)) {
        return true;
      }

      setSnehPoints((prev) => prev - item.cost);
      setUnlockedDecorations((prev) => [...prev, item.id]);
      sounds.playChime('unlock');
      return true;
    },
    [snehPoints, unlockedDecorations]
  );

  const onGameExit = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (onExit) {
      onExit();
    }
  }, [onExit]);

  const value = useMemo(
    () => ({
      snehPoints,
      completedTasks,
      unlockedDecorations,
      activeTask,
      isSajawatOpen,
      isVoiceActive,
      isMuted,
      difficulty,
      language,
      patientId,
      totalScore: snehPoints,
      tasksCompletedTodayCount: completedTasks.length,
      addPoints,
      completeTask,
      buyDecoration,
      openTask,
      closeTask,
      openSajawat,
      closeSajawat,
      toggleMute,
      speakNarration,
      onGameExit,
    }),
    [
      snehPoints,
      completedTasks,
      unlockedDecorations,
      activeTask,
      isSajawatOpen,
      isVoiceActive,
      isMuted,
      difficulty,
      language,
      patientId,
      addPoints,
      completeTask,
      buyDecoration,
      openTask,
      closeTask,
      openSajawat,
      closeSajawat,
      toggleMute,
      speakNarration,
      onGameExit,
    ]
  );

  return <LifeSimulatorContext.Provider value={value}>{children}</LifeSimulatorContext.Provider>;
};

export const useLifeSimulator = () => {
  const context = useContext(LifeSimulatorContext);
  if (!context) {
    throw new Error('useLifeSimulator must be used within a LifeSimulatorProvider');
  }
  return context;
};
