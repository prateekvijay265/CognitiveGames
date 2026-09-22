// Cultural and cognitive game content for Neuro Mind
// Grounded in North-Eastern Indian cultural context (Assam, Meghalaya, Manipur, Mizoram, etc.)

export interface MemoryCardData {
  id: string;
  emoji: string;
  name: string;
  assameseName?: string;
  category: 'nature' | 'food' | 'culture' | 'daily';
}

export const MEMORY_CARDS: MemoryCardData[] = [
  { id: 'tea-cup', emoji: '🍵', name: 'Tea Cup', assameseName: 'চাহ কাপ', category: 'daily' },
  { id: 'bamboo', emoji: '🎋', name: 'Bamboo', assameseName: 'বাঁহ', category: 'nature' },
  { id: 'orange', emoji: '🍊', name: 'Orange', assameseName: 'কমলা', category: 'food' },
  { id: 'rice', emoji: '🍚', name: 'Rice', assameseName: 'ভাত', category: 'food' },
  { id: 'flower', emoji: '🌸', name: 'Flower', assameseName: 'ফুল', category: 'nature' },
  { id: 'home', emoji: '🏡', name: 'Home', assameseName: 'ঘৰ', category: 'daily' },
  { id: 'rain', emoji: '🌧', name: 'Rain', assameseName: 'বৰষুণ', category: 'nature' },
  { id: 'elephant', emoji: '🐘', name: 'Elephant', assameseName: 'হাতী', category: 'nature' },
  { id: 'peacock', emoji: '🦚', name: 'Peacock', assameseName: 'ম’ৰা', category: 'nature' },
  { id: 'leaf', emoji: '🌿', name: 'Tea Leaf', assameseName: 'চাহ পাত', category: 'nature' },
  { id: 'lemon', emoji: '🍋', name: 'Kaji Nemu (Lemon)', assameseName: 'কাজী নেমু', category: 'food' },
  { id: 'teapot', emoji: '🫖', name: 'Teapot', assameseName: 'চাহদানি', category: 'daily' },
  { id: 'paddy', emoji: '🌾', name: 'Paddy Field', assameseName: 'ধাননি পথাৰ', category: 'nature' },
  { id: 'banyan', emoji: '🌳', name: 'Banyan Tree', assameseName: 'বট গছ', category: 'nature' },
  { id: 'fish', emoji: '🐟', name: 'Rohu Fish', assameseName: 'ৰৌ মাছ', category: 'food' },
  { id: 'diya', emoji: '🪔', name: 'Diya Lamp', assameseName: 'চাকি', category: 'culture' },
  { id: 'hibiscus', emoji: '🌺', name: 'Jaba (Hibiscus)', assameseName: 'জবা ফুল', category: 'nature' },
  { id: 'coconut', emoji: '🥥', name: 'Coconut', assameseName: 'নাৰিকল', category: 'food' },
  { id: 'corn', emoji: '🌽', name: 'Maize', assameseName: 'মাকৈ', category: 'food' },
  { id: 'music', emoji: '🎵', name: 'Bihu Dhol & Pepa', assameseName: 'ঢোল-পেঁপা', category: 'culture' },
];

export interface RememberObjectItem {
  id: string;
  emoji: string;
  name: string;
  category: string;
}

export const REMEMBER_OBJECT_POOL: RememberObjectItem[] = [
  { id: 'umbrella', emoji: '☂️', name: 'Umbrella', category: 'daily' },
  { id: 'bell', emoji: '🔔', name: 'Temple Bell', category: 'culture' },
  { id: 'hat', emoji: '👒', name: 'Jaapi (Hat)', category: 'culture' },
  { id: 'lantern', emoji: '🏮', name: 'Lantern', category: 'daily' },
  { id: 'boat', emoji: '🛶', name: 'River Boat', category: 'daily' },
  { id: 'pot', emoji: '🏺', name: 'Clay Pot', category: 'culture' },
  { id: 'mango', emoji: '🥭', name: 'Ripe Mango', category: 'food' },
  { id: 'banana', emoji: '🍌', name: 'Malbhog Banana', category: 'food' },
  { id: 'deer', emoji: '🦌', name: 'Swamp Deer', category: 'nature' },
  { id: 'fan', emoji: '🪭', name: 'Hand Fan', category: 'daily' },
  { id: 'bird', emoji: '🐦', name: 'Myna Bird', category: 'nature' },
  { id: 'butterfly', emoji: '🦋', name: 'Butterfly', category: 'nature' },
  { id: 'guitar', emoji: '🎸', name: 'Ektara / Dhol', category: 'culture' },
  { id: 'apple', emoji: '🍎', name: 'Red Apple', category: 'food' },
  { id: 'sun', emoji: '☀️', name: 'Morning Sun', category: 'nature' },
  { id: 'clock', emoji: '⏰', name: 'Alarm Clock', category: 'daily' },
];

export interface SequenceData {
  id: string;
  title: string;
  description: string;
  items: { id: string; emoji: string; name: string; step: number }[];
}

export const SEQUENCE_SETS: Record<'easy' | 'medium' | 'hard', SequenceData[]> = {
  easy: [
    {
      id: 'seq-tea-3',
      title: 'Making Morning Assam Tea',
      description: 'Remember the 3 steps to brew morning tea',
      items: [
        { id: 'boil', emoji: '🫖', name: 'Boil Water', step: 1 },
        { id: 'leaves', emoji: '🌿', name: 'Add Tea Leaves', step: 2 },
        { id: 'cup', emoji: '🍵', name: 'Pour into Cup', step: 3 },
      ],
    },
    {
      id: 'seq-plant-3',
      title: 'Growing Rice Paddy',
      description: 'The natural cycle of paddy cultivation',
      items: [
        { id: 'seed', emoji: '🌱', name: 'Plant Seedlings', step: 1 },
        { id: 'rain', emoji: '🌧', name: 'Monsoon Rain', step: 2 },
        { id: 'harvest', emoji: '🌾', name: 'Golden Paddy', step: 3 },
      ],
    },
    {
      id: 'seq-morning-3',
      title: 'Waking Up Routine',
      description: 'First steps of a peaceful morning',
      items: [
        { id: 'sun', emoji: '☀️', name: 'Sunrise', step: 1 },
        { id: 'wash', emoji: '🚿', name: 'Wash Face', step: 2 },
        { id: 'prayer', emoji: '🪔', name: 'Morning Diya', step: 3 },
      ],
    },
  ],
  medium: [
    {
      id: 'seq-market-5',
      title: 'Going to the Village Haat (Market)',
      description: 'Step-by-step village market trip',
      items: [
        { id: 'basket', emoji: '🧺', name: 'Take Bamboo Basket', step: 1 },
        { id: 'walk', emoji: '🚶', name: 'Walk to Market', step: 2 },
        { id: 'fish', emoji: '🐟', name: 'Choose Fresh Fish', step: 3 },
        { id: 'vegetables', emoji: '🥬', name: 'Buy Green Leaves', step: 4 },
        { id: 'home', emoji: '🏡', name: 'Return Home', step: 5 },
      ],
    },
    {
      id: 'seq-bihu-5',
      title: 'Preparing for Rongali Bihu',
      description: 'Traditional steps to celebrate Rongali Bihu',
      items: [
        { id: 'clean', emoji: '🧹', name: 'Sweep Courtyard', step: 1 },
        { id: 'pitha', emoji: '🥟', name: 'Make Rice Pitha', step: 2 },
        { id: 'gamosa', emoji: '🧣', name: 'Wear New Gamosa', step: 3 },
        { id: 'dhol', emoji: '🥁', name: 'Play Dhol Beats', step: 4 },
        { id: 'bless', emoji: '🙏', name: 'Elders Blessing', step: 5 },
      ],
    },
  ],
  hard: [
    {
      id: 'seq-day-7',
      title: 'Full Day in the Assam Countryside',
      description: 'From dawn to peaceful nightfall',
      items: [
        { id: 'dawn', emoji: '🌅', name: 'Rooster Crow at Dawn', step: 1 },
        { id: 'tea', emoji: '🍵', name: 'First Cup of Red Tea', step: 2 },
        { id: 'garden', emoji: '🌿', name: 'Tend the Home Garden', step: 3 },
        { id: 'lunch', emoji: '🍚', name: 'Warm Rice & Dhekia Xaak', step: 4 },
        { id: 'rest', emoji: '🪑', name: 'Veranda Rest & Chat', step: 5 },
        { id: 'dusk', emoji: '🪔', name: 'Light Tulsi Diya', step: 6 },
        { id: 'night', emoji: '🌙', name: 'Sweet Restful Sleep', step: 7 },
      ],
    },
  ],
};

export interface DailyActivityItem {
  id: string;
  title: string;
  timeLabel: string;
  emoji: string;
  order: number;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
}

export const SORT_MY_DAY_SETS: { id: string; name: string; activities: DailyActivityItem[] }[] = [
  {
    id: 'standard-day',
    name: 'A Peaceful Daily Routine',
    activities: [
      { id: 'act-1', title: 'Wake up with Morning Sun', timeLabel: '6:30 AM', emoji: '☀️', order: 1, period: 'morning' },
      { id: 'act-2', title: 'Enjoy Warm Lal Saah (Red Tea)', timeLabel: '7:30 AM', emoji: '🍵', order: 2, period: 'morning' },
      { id: 'act-3', title: 'Gentle Walk in Courtyard', timeLabel: '9:00 AM', emoji: '🚶', order: 3, period: 'morning' },
      { id: 'act-4', title: 'Wholesome Lunch with Family', timeLabel: '1:00 PM', emoji: '🍚', order: 4, period: 'afternoon' },
      { id: 'act-5', title: 'Quiet Afternoon Nap', timeLabel: '2:30 PM', emoji: '🛏️', order: 5, period: 'afternoon' },
      { id: 'act-6', title: 'Evening Diya & Prayer', timeLabel: '6:00 PM', emoji: '🪔', order: 6, period: 'evening' },
      { id: 'act-7', title: 'Light Dinner & Medicines', timeLabel: '8:00 PM', emoji: '🍲', order: 7, period: 'night' },
      { id: 'act-8', title: 'Relaxing Good Night Sleep', timeLabel: '9:30 PM', emoji: '🌙', order: 8, period: 'night' },
    ],
  },
];

export interface DifferenceScene {
  id: string;
  title: string;
  gridRows: number;
  gridCols: number;
  sceneLeft: string[][];
  sceneRight: string[][];
  differences: { row: number; col: number; left: string; right: string; hint: string }[];
}

export const FIND_DIFFERENCE_SCENES: Record<'easy' | 'medium' | 'hard', DifferenceScene[]> = {
  easy: [
    {
      id: 'diff-easy-1',
      title: 'Tea Garden & River Bank',
      gridRows: 3,
      gridCols: 3,
      sceneLeft: [
        ['🌿', '🍵', '🌿'],
        ['🏡', '🦚', '🌳'],
        ['🌾', '🌧', '🍚'],
      ],
      sceneRight: [
        ['🌿', '🫖', '🌿'], // diff (0,1): 🍵 vs 🫖
        ['🏡', '🦚', '🎋'], // diff (1,2): 🌳 vs 🎋
        ['🌾', '☀️', '🍚'], // diff (2,1): 🌧 vs ☀️
      ],
      differences: [
        { row: 0, col: 1, left: '🍵', right: '🫖', hint: 'Look at the tea item in the top row' },
        { row: 1, col: 2, left: '🌳', right: '🎋', hint: 'Look at the plant on the right side' },
        { row: 2, col: 1, left: '🌧', right: '☀️', hint: 'Notice the weather in the bottom row' },
      ],
    },
    {
      id: 'diff-easy-2',
      title: 'Village Courtyard',
      gridRows: 3,
      gridCols: 3,
      sceneLeft: [
        ['🌸', '🌺', '🌸'],
        ['🐘', '🏡', '🦚'],
        ['🍊', '🥥', '🍋'],
      ],
      sceneRight: [
        ['🌸', '🌼', '🌸'], // diff (0,1): 🌺 vs 🌼
        ['🦏', '🏡', '🦚'], // diff (1,0): 🐘 vs 🦏
        ['🍊', '🥥', '🍉'], // diff (2,2): 🍋 vs 🍉
      ],
      differences: [
        { row: 0, col: 1, left: '🌺', right: '🌼', hint: 'Look at the flower in the middle of top row' },
        { row: 1, col: 0, left: '🐘', right: '🦏', hint: 'Check the gentle animal on the left' },
        { row: 2, col: 2, left: '🍋', right: '🍉', hint: 'Spot the fruit in the bottom right corner' },
      ],
    },
  ],
  medium: [
    {
      id: 'diff-med-1',
      title: 'Harvest Festival Grounds',
      gridRows: 3,
      gridCols: 4,
      sceneLeft: [
        ['🌾', '🪔', '🌾', '🎵'],
        ['🍚', '🐟', '🍵', '🏡'],
        ['🎋', '🍋', '🐘', '🦚'],
      ],
      sceneRight: [
        ['🌾', '🕯️', '🌾', '🎵'], // diff (0,1)
        ['🍚', '🐟', '🫖', '🏡'], // diff (1,2)
        ['🎋', '🍊', '🐘', '🦜'], // diff (2,1), diff (2,3)
        // plus 1 more:
      ],
      differences: [
        { row: 0, col: 1, left: '🪔', right: '🕯️', hint: 'Look closely at the ceremonial light' },
        { row: 1, col: 2, left: '🍵', right: '🫖', hint: 'Notice the vessel in the center' },
        { row: 2, col: 1, left: '🍋', right: '🍊', hint: 'Check the citrus fruit' },
        { row: 2, col: 3, left: '🦚', right: '🦜', hint: 'Look at the bird on the bottom right' },
        { row: 0, col: 3, left: '🎵', right: '🎶', hint: 'Notice the musical symbol' },
      ],
    },
  ],
  hard: [
    {
      id: 'diff-hard-1',
      title: 'Brahmaputra Nature Sanctuary',
      gridRows: 4,
      gridCols: 4,
      sceneLeft: [
        ['🌧', '🌿', '🐘', '🌳'],
        ['🛶', '🐟', '🌾', '🏡'],
        ['🌸', '🌺', '🦚', '🍋'],
        ['🪔', '🍵', '🎋', '🥥'],
      ],
      sceneRight: [
        ['☀️', '🌿', '🐘', '🌲'], // (0,0), (0,3)
        ['🛶', '🐠', '🌾', '🏡'], // (1,1)
        ['🌸', '🌼', '🦚', '🍊'], // (2,1), (2,3)
        ['🪔', '🫖', '🎋', '🍍'], // (3,1), (3,3)
      ],
      differences: [
        { row: 0, col: 0, left: '🌧', right: '☀️', hint: 'Sky weather in top left' },
        { row: 0, col: 3, left: '🌳', right: '🌲', hint: 'Tree in top right' },
        { row: 1, col: 1, left: '🐟', right: '🐠', hint: 'Water fish in row 2' },
        { row: 2, col: 1, left: '🌺', right: '🌼', hint: 'Bright flower in row 3' },
        { row: 2, col: 3, left: '🍋', right: '🍊', hint: 'Fruit in row 3' },
        { row: 3, col: 1, left: '🍵', right: '🫖', hint: 'Warm beverage utensil in bottom row' },
        { row: 3, col: 3, left: '🥥', right: '🍍', hint: 'Tropical fruit at the bottom corner' },
      ],
    },
  ],
};

// Fix the right grid for medium 1 to match exactly 5 diffs
FIND_DIFFERENCE_SCENES.medium[0].sceneRight = [
  ['🌾', '🕯️', '🌾', '🎶'], // diff (0,1), diff (0,3)
  ['🍚', '🐟', '🫖', '🏡'], // diff (1,2)
  ['🎋', '🍊', '🐘', '🦜'], // diff (2,1), diff (2,3)
];

export interface ObjectRecognitionItem {
  id: string;
  emoji: string;
  correctName: string;
  options: string[];
  hint: string;
  culturalFact: string;
}

export const OBJECT_RECOGNITION_ITEMS: ObjectRecognitionItem[] = [
  {
    id: 'rec-1',
    emoji: '🍵',
    correctName: 'Assam Tea Cup',
    options: ['Assam Tea Cup', 'Fruit Bowl', 'Water Jug', 'Clay Lamp'],
    hint: 'A comforting hot drink enjoyed every morning across Assam.',
    culturalFact: 'Assam produces some of the finest malt tea in the entire world.',
  },
  {
    id: 'rec-2',
    emoji: '🐘',
    correctName: 'Wild Elephant',
    options: ['Horse', 'Wild Elephant', 'Buffalo', 'Rhino'],
    hint: 'A majestic gentle giant found in Kaziranga National Park.',
    culturalFact: 'Elephants are revered and protected across the Brahmaputra valley.',
  },
  {
    id: 'rec-3',
    emoji: '🌾',
    correctName: 'Paddy / Rice Field',
    options: ['Wheat Grass', 'Bamboo Grove', 'Paddy / Rice Field', 'Sugarcane'],
    hint: 'Golden crops harvested during Magh Bihu.',
    culturalFact: 'Rice is the heart and staple of traditional North-Eastern meals.',
  },
  {
    id: 'rec-4',
    emoji: '🪔',
    correctName: 'Earthen Diya (Chaki)',
    options: ['Incense Holder', 'Earthen Diya (Chaki)', 'Flower Vase', 'Teacup'],
    hint: 'Lit every evening with mustard oil beside the sacred Tulsi plant.',
    culturalFact: 'Lighting the chaki at dusk is a peaceful evening tradition in every Assamese home.',
  },
  {
    id: 'rec-5',
    emoji: '🎋',
    correctName: 'Bamboo (Baah)',
    options: ['Bamboo (Baah)', 'Sugar Cane', 'Palm Frond', 'Oak Twig'],
    hint: 'Used to build sturdy stilt houses, fishing nets, and delicate baskets.',
    culturalFact: 'Bamboo craft has sustained indigenous communities for thousands of years.',
  },
  {
    id: 'rec-6',
    emoji: '🦚',
    correctName: 'Peacock (Mora)',
    options: ['Kingfisher', 'Parrot', 'Peacock (Mora)', 'Duck'],
    hint: 'A colourful bird that dances during the coming of sweet monsoon rains.',
    culturalFact: 'The peacock’s vibrant feathers are an emblem of beauty and joy.',
  },
  {
    id: 'rec-7',
    emoji: '🛶',
    correctName: 'River Naao (Boat)',
    options: ['Bridge', 'River Naao (Boat)', 'Fishing Net', 'Water Wheel'],
    hint: 'Gently ferries people and goods across the mighty Brahmaputra river.',
    culturalFact: 'Boats link the river island of Majuli with Jorhat on the mainland.',
  },
  {
    id: 'rec-8',
    emoji: '🍋',
    correctName: 'Kaji Nemu (Assam Lemon)',
    options: ['Orange', 'Kaji Nemu (Assam Lemon)', 'Green Guava', 'Amala'],
    hint: 'An oblong, highly fragrant citrus that brightens any fish curry.',
    culturalFact: 'Kaji Nemu has a Geographical Indication (GI) tag unique to Assam.',
  },
  {
    id: 'rec-9',
    emoji: '🐟',
    correctName: 'Fresh River Fish',
    options: ['River Fish', 'River Turtle', 'Fresh Crab', 'Prawn'],
    hint: 'Caught fresh in local rivers and cooked with tender bamboo shoots.',
    culturalFact: 'Fish curry cooked with sour bamboo shoot is a cherished heritage dish.',
  },
  {
    id: 'rec-10',
    emoji: '🌺',
    correctName: 'Jaba (Red Hibiscus)',
    options: ['Marigold', 'Rose', 'Lotus', 'Jaba (Red Hibiscus)'],
    hint: 'Bright crimson flower offered in morning prayers.',
    culturalFact: 'Hibiscus blooms year-round in courtyards throughout the region.',
  },
];

export interface PatternQuestion {
  id: string;
  sequence: string[];
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const PATTERN_QUESTIONS: Record<'easy' | 'medium' | 'hard', PatternQuestion[]> = {
  easy: [
    {
      id: 'pat-e-1',
      sequence: ['🔴', '🔵', '🔴', '🔵', '?'],
      options: ['🔴', '🔵', '🟡', '🟢'],
      correctAnswer: '🔴',
      explanation: 'Red and blue alternate one after the other.',
    },
    {
      id: 'pat-e-2',
      sequence: ['🌸', '🌿', '🌸', '🌿', '?'],
      options: ['🌸', '🌾', '🌿', '🍊'],
      correctAnswer: '🌸',
      explanation: 'Flower and leaf alternate: Flower, Leaf, Flower, Leaf, then Flower!',
    },
    {
      id: 'pat-e-3',
      sequence: ['🍵', '🫖', '🍵', '🫖', '?'],
      options: ['🍚', '🍵', '🫖', '🍋'],
      correctAnswer: '🍵',
      explanation: 'Tea cup follows teapot every time.',
    },
    {
      id: 'pat-e-4',
      sequence: ['☀️', '🌧', '☀️', '🌧', '?'],
      options: ['🌧', '☀️', '⚡', '🌙'],
      correctAnswer: '☀️',
      explanation: 'Sun follows rain in this pleasant weather pattern.',
    },
    {
      id: 'pat-e-5',
      sequence: ['🐘', '🦚', '🐘', '🦚', '?'],
      options: ['🐘', '🦚', '🐟', '🦌'],
      correctAnswer: '🐘',
      explanation: 'Elephant alternates with Peacock.',
    },
    {
      id: 'pat-e-6',
      sequence: ['🟡', '🟢', '🟡', '🟢', '?'],
      options: ['🟢', '🟡', '🔴', '🔵'],
      correctAnswer: '🟡',
      explanation: 'Yellow comes next after green.',
    },
    {
      id: 'pat-e-7',
      sequence: ['🪔', '🕯️', '🪔', '🕯️', '?'],
      options: ['🪔', '🕯️', '✨', '☀️'],
      correctAnswer: '🪔',
      explanation: 'Diya comes back after candle.',
    },
    {
      id: 'pat-e-8',
      sequence: ['🍊', '🍋', '🍊', '🍋', '?'],
      options: ['🍋', '🍊', '🥥', '🍌'],
      correctAnswer: '🍊',
      explanation: 'Orange follows lemon.',
    },
    {
      id: 'pat-e-9',
      sequence: ['🏡', '🌳', '🏡', '🌳', '?'],
      options: ['🏡', '🌳', '🎋', '🌾'],
      correctAnswer: '🏡',
      explanation: 'Home comes after tree.',
    },
    {
      id: 'pat-e-10',
      sequence: ['🍚', '🐟', '🍚', '🐟', '?'],
      options: ['🍚', '🐟', '🍵', '🌿'],
      correctAnswer: '🍚',
      explanation: 'Rice comes after fish in our lunch rhythm.',
    },
  ],
  medium: [
    {
      id: 'pat-m-1',
      sequence: ['🔴', '🔵', '🟢', '🔴', '🔵', '?'],
      options: ['🔴', '🔵', '🟢', '🟡'],
      correctAnswer: '🟢',
      explanation: 'Three color cycle: Red, Blue, Green repeated.',
    },
    {
      id: 'pat-m-2',
      sequence: ['🌱', '🌿', '🌳', '🌱', '🌿', '?'],
      options: ['🌱', '🌳', '🌾', '🍂'],
      correctAnswer: '🌳',
      explanation: 'Sprout, Leaves, then Tree.',
    },
    {
      id: 'pat-m-3',
      sequence: ['🍵', '🍵', '🫖', '🍵', '🍵', '?'],
      options: ['🍵', '🫖', '🍋', '🍶'],
      correctAnswer: '🫖',
      explanation: 'Two cups, then one teapot: Cup, Cup, Teapot.',
    },
    {
      id: 'pat-m-4',
      sequence: ['☀️', '☀️', '🌧', '☀️', '☀️', '?'],
      options: ['🌧', '☀️', '🌈', '🌙'],
      correctAnswer: '🌧',
      explanation: 'Two suns followed by rain.',
    },
    {
      id: 'pat-m-5',
      sequence: ['🌸', '🌺', '🌼', '🌸', '🌺', '?'],
      options: ['🌸', '🌺', '🌼', '🌿'],
      correctAnswer: '🌼',
      explanation: 'Three flowers repeat: Cherry, Hibiscus, Daisy.',
    },
    {
      id: 'pat-m-6',
      sequence: ['🐘', '🐘', '🦚', '🐘', '🐘', '?'],
      options: ['🐘', '🦚', '🦌', '🦜'],
      correctAnswer: '🦚',
      explanation: 'Two elephants then one peacock.',
    },
    {
      id: 'pat-m-7',
      sequence: ['🌾', '🍚', '🍲', '🌾', '🍚', '?'],
      options: ['🍲', '🌾', '🍚', '🥣'],
      correctAnswer: '🍲',
      explanation: 'Paddy becomes rice, rice becomes warm food.',
    },
    {
      id: 'pat-m-8',
      sequence: ['🔺', '🔷', '🔶', '🔺', '🔷', '?'],
      options: ['🔺', '🔷', '🔶', '⭐'],
      correctAnswer: '🔶',
      explanation: 'Triangle, Blue Diamond, Orange Diamond.',
    },
    {
      id: 'pat-m-9',
      sequence: ['🍊', '🍋', '🥥', '🍊', '🍋', '?'],
      options: ['🥥', '🍊', '🍋', '🍉'],
      correctAnswer: '🥥',
      explanation: 'Orange, Lemon, then Coconut completes the fruit triad.',
    },
    {
      id: 'pat-m-10',
      sequence: ['🎋', '🎋', '🌿', '🎋', '🎋', '?'],
      options: ['🎋', '🌿', '🌳', '🌾'],
      correctAnswer: '🌿',
      explanation: 'Two bamboos then one leaf.',
    },
  ],
  hard: [
    {
      id: 'pat-h-1',
      sequence: ['🔴', '🔺', '🔵', '🔷', '🟢', '?'],
      options: ['🟢', '🟩', '🔴', '🟡'],
      correctAnswer: '🟩',
      explanation: 'Color circle is paired with its shape match: Red circle/triangle, Blue circle/diamond, Green circle/green square.',
    },
    {
      id: 'pat-h-2',
      sequence: ['1️⃣', '2️⃣', '3️⃣', '1️⃣', '2️⃣', '?'],
      options: ['1️⃣', '3️⃣', '4️⃣', '2️⃣'],
      correctAnswer: '3️⃣',
      explanation: 'Numbers 1, 2, 3 cycle continually.',
    },
    {
      id: 'pat-h-3',
      sequence: ['🌅', '☀️', '🌇', '🌙', '🌅', '☀️', '?'],
      options: ['🌇', '🌙', '☀️', '⭐'],
      correctAnswer: '🌇',
      explanation: 'Cycle of the day: Dawn, Midday, Sunset, Night.',
    },
    {
      id: 'pat-h-4',
      sequence: ['🌱', '🌿', '🌸', '🍊', '🌱', '🌿', '🌸', '?'],
      options: ['🍊', '🌱', '🌿', '🌳'],
      correctAnswer: '🍊',
      explanation: 'Plant growth cycle: Sprout, Leaf, Flower, Fruit.',
    },
    {
      id: 'pat-h-5',
      sequence: ['⭐', '⭐⭐', '⭐', '⭐⭐', '⭐', '?'],
      options: ['⭐', '⭐⭐', '✨', '⭐⭐⭐'],
      correctAnswer: '⭐⭐',
      explanation: 'One star, then two stars, alternating.',
    },
    {
      id: 'pat-h-6',
      sequence: ['🪔', '🪔', '✨', '🪔', '🪔', '✨', '🪔', '?'],
      options: ['🪔', '✨', '🕯️', '☀️'],
      correctAnswer: '🪔',
      explanation: 'Two diyas followed by sparkles.',
    },
    {
      id: 'pat-h-7',
      sequence: ['🍵', '☕', '🍵', '☕', '🍵', '?'],
      options: ['☕', '🍵', '🥛', '🫖'],
      correctAnswer: '☕',
      explanation: 'Green cup and brown cup alternate.',
    },
    {
      id: 'pat-h-8',
      sequence: ['🐟', '🐟', '🌊', '🐟', '🐟', '?'],
      options: ['🌊', '🐟', '🛶', '🐚'],
      correctAnswer: '🌊',
      explanation: 'Two fish swimming, then one river wave.',
    },
    {
      id: 'pat-h-9',
      sequence: ['🌾', '🌾', '🌾', '🍚', '🌾', '🌾', '🌾', '?'],
      options: ['🍚', '🌾', '🥣', '🌾'],
      correctAnswer: '🍚',
      explanation: 'Three stalks of paddy yield one bowl of rice.',
    },
    {
      id: 'pat-h-10',
      sequence: ['🌧', '🌧', '🌈', '🌧', '🌧', '?'],
      options: ['🌈', '🌧', '☀️', '⚡'],
      correctAnswer: '🌈',
      explanation: 'Two rain clouds are followed by a rainbow.',
    },
  ],
};

export interface AttentionTapRound {
  id: string;
  instruction: string;
  targetCategory: string;
  ruleDescription: string;
  gridItems: { id: string; emoji: string; name: string; isTarget: boolean }[];
}

export const ATTENTION_TAP_ROUNDS: Record<'easy' | 'medium' | 'hard', AttentionTapRound[]> = {
  easy: [
    {
      id: 'att-e-1',
      instruction: 'Tap all the Fruits 🍊 🍋 🥥',
      targetCategory: 'fruits',
      ruleDescription: 'Find every tasty fresh fruit',
      gridItems: [
        { id: '1', emoji: '🍊', name: 'Orange', isTarget: true },
        { id: '2', emoji: '🏡', name: 'Home', isTarget: false },
        { id: '3', emoji: '🍋', name: 'Lemon', isTarget: true },
        { id: '4', emoji: '🍵', name: 'Tea Cup', isTarget: false },
        { id: '5', emoji: '🥥', name: 'Coconut', isTarget: true },
        { id: '6', emoji: '🌾', name: 'Paddy', isTarget: false },
        { id: '7', emoji: '🍌', name: 'Banana', isTarget: true },
        { id: '8', emoji: '🐘', name: 'Elephant', isTarget: false },
        { id: '9', emoji: '🍎', name: 'Apple', isTarget: true },
      ],
    },
    {
      id: 'att-e-2',
      instruction: 'Tap all the Flowers 🌸 🌺',
      targetCategory: 'flowers',
      ruleDescription: 'Find all blooming flowers',
      gridItems: [
        { id: '1', emoji: '🌸', name: 'Pink Flower', isTarget: true },
        { id: '2', emoji: '🐟', name: 'Fish', isTarget: false },
        { id: '3', emoji: '🌺', name: 'Hibiscus', isTarget: true },
        { id: '4', emoji: '🎋', name: 'Bamboo', isTarget: false },
        { id: '5', emoji: '🌼', name: 'Daisy', isTarget: true },
        { id: '6', emoji: '🍚', name: 'Rice', isTarget: false },
        { id: '7', emoji: '🌻', name: 'Sunflower', isTarget: true },
        { id: '8', emoji: '🪔', name: 'Diya', isTarget: false },
        { id: '9', emoji: '🌷', name: 'Tulip', isTarget: true },
      ],
    },
  ],
  medium: [
    {
      id: 'att-m-1',
      instruction: 'Tap only the Animals 🐘 🦚 🦌 🐟',
      targetCategory: 'animals',
      ruleDescription: 'Tap living creatures of nature',
      gridItems: [
        { id: '1', emoji: '🐘', name: 'Elephant', isTarget: true },
        { id: '2', emoji: '🌿', name: 'Tea Leaf', isTarget: false },
        { id: '3', emoji: '🦚', name: 'Peacock', isTarget: true },
        { id: '4', emoji: '🫖', name: 'Teapot', isTarget: false },
        { id: '5', emoji: '🦌', name: 'Deer', isTarget: true },
        { id: '6', emoji: '🍊', name: 'Orange', isTarget: false },
        { id: '7', emoji: '🐟', name: 'Fish', isTarget: true },
        { id: '8', emoji: '🏡', name: 'House', isTarget: false },
        { id: '9', emoji: '🐦', name: 'Bird', isTarget: true },
        { id: '10', emoji: '🍚', name: 'Rice', isTarget: false },
        { id: '11', emoji: '🦋', name: 'Butterfly', isTarget: true },
        { id: '12', emoji: '🌧', name: 'Rain', isTarget: false },
      ],
    },
  ],
  hard: [
    {
      id: 'att-h-1',
      instruction: 'Tap items you find inside the Kitchen 🍵 🍚 🍋 🫖',
      targetCategory: 'kitchen',
      ruleDescription: 'Identify foods, drinks, and utensils',
      gridItems: [
        { id: '1', emoji: '🍵', name: 'Tea Cup', isTarget: true },
        { id: '2', emoji: '🐘', name: 'Elephant', isTarget: false },
        { id: '3', emoji: '🍚', name: 'Rice', isTarget: true },
        { id: '4', emoji: '🦚', name: 'Peacock', isTarget: false },
        { id: '5', emoji: '🫖', name: 'Teapot', isTarget: true },
        { id: '6', emoji: '🌳', name: 'Tree', isTarget: false },
        { id: '7', emoji: '🍋', name: 'Lemon', isTarget: true },
        { id: '8', emoji: '🌧', name: 'Cloud', isTarget: false },
        { id: '9', emoji: '🐟', name: 'Fish', isTarget: true },
        { id: '10', emoji: '🛶', name: 'Boat', isTarget: false },
        { id: '11', emoji: '🥥', name: 'Coconut', isTarget: true },
        { id: '12', emoji: '🎋', name: 'Bamboo', isTarget: false },
        { id: '13', emoji: '🍲', name: 'Stew Pot', isTarget: true },
        { id: '14', emoji: '🏡', name: 'Cottage', isTarget: false },
        { id: '15', emoji: '🍊', name: 'Orange', isTarget: true },
        { id: '16', emoji: '🪔', name: 'Diya', isTarget: false },
      ],
    },
  ],
};

export interface SoundQuestion {
  id: string;
  soundLabel: string;
  soundDescription: string;
  toneFrequency: number;
  toneType: OscillatorType;
  options: { id: string; emoji: string; label: string; isCorrect: boolean }[];
  hint: string;
}

export const SOUND_QUESTIONS: SoundQuestion[] = [
  {
    id: 'snd-1',
    soundLabel: 'Monsoon Rain Falling',
    soundDescription: 'Soft patter of refreshing raindrops on a tin roof (ঝিপঝিপ বৰষুণ)',
    toneFrequency: 220,
    toneType: 'triangle',
    options: [
      { id: 'rain', emoji: '🌧', label: 'Rain Shower', isCorrect: true },
      { id: 'sun', emoji: '☀️', label: 'Bright Sunshine', isCorrect: false },
      { id: 'fire', emoji: '🔥', label: 'Campfire', isCorrect: false },
    ],
    hint: 'Think of cool drops falling from grey sky.',
  },
  {
    id: 'snd-2',
    soundLabel: 'Sacred Temple Bell',
    soundDescription: 'Clear, resonant ringing of a bronze temple bell (ঘণ্টাৰ শব্দ)',
    toneFrequency: 880,
    toneType: 'sine',
    options: [
      { id: 'drum', emoji: '🥁', label: 'Bihu Dhol', isCorrect: false },
      { id: 'bell', emoji: '🔔', label: 'Temple Bell', isCorrect: true },
      { id: 'whistle', emoji: '🚂', label: 'Train Whistle', isCorrect: false },
    ],
    hint: 'Heard at morning prayer near the Namghar or temple.',
  },
  {
    id: 'snd-3',
    soundLabel: 'Morning Bird Song',
    soundDescription: 'Melodic chirping of early morning mynas and sparrows (চৰাইৰ মাত)',
    toneFrequency: 1200,
    toneType: 'sine',
    options: [
      { id: 'bird', emoji: '🐦', label: 'Singing Bird', isCorrect: true },
      { id: 'frog', emoji: '🐸', label: 'Croaking Frog', isCorrect: false },
      { id: 'cow', emoji: '🐄', label: 'Cow Mooing', isCorrect: false },
    ],
    hint: 'Feathered friend greeting the sunrise from a branch.',
  },
  {
    id: 'snd-4',
    soundLabel: 'Bamboo Flute Melody',
    soundDescription: 'Sweet, gentle notes played on a bamboo flute (বাঁহীৰ সুৰ)',
    toneFrequency: 587.33,
    toneType: 'sine',
    options: [
      { id: 'car', emoji: '🚗', label: 'Car Horn', isCorrect: false },
      { id: 'thunder', emoji: '⚡', label: 'Thunder Clap', isCorrect: false },
      { id: 'flute', emoji: '🪈', label: 'Bamboo Flute', isCorrect: true },
    ],
    hint: 'Crafted from tender bamboo, producing a tranquil melody.',
  },
  {
    id: 'snd-5',
    soundLabel: 'Flowing River Water',
    soundDescription: 'Gentle bubbling and murmuring of river Brahmaputra waves (নদীৰ কলকলনি)',
    toneFrequency: 300,
    toneType: 'triangle',
    options: [
      { id: 'river', emoji: '🌊', label: 'River Waves', isCorrect: true },
      { id: 'clock', emoji: '⏰', label: 'Clock Ticking', isCorrect: false },
      { id: 'fan', emoji: '🪭', label: 'Paper Fan', isCorrect: false },
    ],
    hint: 'Water flowing steadily towards the sea.',
  },
];

export interface StoryQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface StoryData {
  id: string;
  title: string;
  subtitle: string;
  readingDurationSec: Record<'easy' | 'medium' | 'hard', number>;
  storyText: string;
  questions: StoryQuestion[];
}

export const STORIES: StoryData[] = [
  {
    id: 'story-tea-garden',
    title: 'A Morning in the Tea Garden',
    subtitle: 'A quiet morning walk with Grandma Phukan',
    readingDurationSec: { easy: 35, medium: 25, hard: 18 },
    storyText:
      'Early in the morning, Grandma Phukan walked into the lush green tea garden. The mist was gently lifting above the dark green tea bushes. She met her neighbor Bina, who was carrying a woven bamboo basket on her back. Together, they plucked two tender leaves and a bud from the fresh sprigs. Afterwards, Bina invited Grandma to sit on her veranda to sip warm lal saah (red tea) sweetened with a touch of fresh ginger.',
    questions: [
      {
        id: 'q1',
        question: 'Who walked into the tea garden early in the morning?',
        options: ['Grandma Phukan', 'Uncle Barua', 'Teacher Sharma', 'Little Rahul'],
        correctAnswer: 'Grandma Phukan',
        explanation: 'Grandma Phukan took her early morning walk among the tea bushes.',
      },
      {
        id: 'q2',
        question: 'What kind of basket was Bina carrying on her back?',
        options: ['Woven Bamboo Basket', 'Steel Bucket', 'Leather Bag', 'Plastic Crate'],
        correctAnswer: 'Woven Bamboo Basket',
        explanation: 'Traditional tea pluckers carry beautiful woven bamboo baskets.',
      },
      {
        id: 'q3',
        question: 'What was added to sweeten the warm red tea?',
        options: ['Fresh Ginger', 'Lemon slice', 'Honey dew', 'Black pepper'],
        correctAnswer: 'Fresh Ginger',
        explanation: 'The tea was flavored with a warm touch of fresh ginger.',
      },
    ],
  },
  {
    id: 'story-majuli-potter',
    title: 'The Majuli Island Potter',
    subtitle: 'The ancient art of hand-crafted clay pots',
    readingDurationSec: { easy: 40, medium: 28, hard: 20 },
    storyText:
      'On the peaceful river island of Majuli, an artisan named Deben makes clay pots entirely by hand without a wheel, just as his ancestors did. In the afternoon, he gathered smooth grey clay from the bank of the Brahmaputra River. His granddaughter Minu helped him shape small earthen diyas for the upcoming festival. When the sun began to set behind the banyan tree, they gently placed 20 fresh diyas out under the sun to dry.',
    questions: [
      {
        id: 'q1',
        question: 'Where does the artisan Deben live and work?',
        options: ['Majuli Island', 'Guwahati City', 'Kaziranga Forest', 'Shillong Hills'],
        correctAnswer: 'Majuli Island',
        explanation: 'Deben lives on the holy river island of Majuli.',
      },
      {
        id: 'q2',
        question: 'From where did Deben collect the smooth grey clay?',
        options: ['Brahmaputra River Bank', 'Rice Field Mud', 'Mountain Hilltop', 'Pond Garden'],
        correctAnswer: 'Brahmaputra River Bank',
        explanation: 'He gathered smooth clay directly from the Brahmaputra riverbank.',
      },
      {
        id: 'q3',
        question: 'How many earthen diyas did they place out to dry?',
        options: ['20 diyas', '5 diyas', '50 diyas', '100 diyas'],
        correctAnswer: '20 diyas',
        explanation: 'They carefully set 20 fresh diyas to dry before sunset.',
      },
    ],
  },
];

