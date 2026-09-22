// Cultural and cognitive game content for Neuro Mind
// Grounded in North-Eastern Indian cultural context (Assam, Meghalaya, Manipur, Mizoram, etc.)

export interface MemoryCardData {
  id: string;
  image: string;
  name: string;
  assameseName?: string;
  category: 'nature' | 'food' | 'culture' | 'daily';
}

export const MEMORY_CARDS: MemoryCardData[] = [
  { id: 'tea-cup', image: '/assets/images/tea_cup.jpg', name: 'Tea Cup', assameseName: 'চাহ কাপ', category: 'daily' },
  { id: 'bamboo', image: '/assets/images/bamboo.jpg', name: 'Bamboo', assameseName: 'বাঁহ', category: 'nature' },
  { id: 'orange', image: '/assets/images/orange.jpg', name: 'Orange', assameseName: 'কমলা', category: 'food' },
  { id: 'rice', image: '/assets/images/rice.jpg', name: 'Rice', assameseName: 'ভাত', category: 'food' },
  { id: 'flower', image: '/assets/images/flower.jpg', name: 'Flower', assameseName: 'ফুল', category: 'nature' },
  { id: 'home', image: '/assets/images/house.jpg', name: 'Home', assameseName: 'ঘৰ', category: 'daily' },
  { id: 'rain', image: 'https://loremflickr.com/200/200/rain', name: 'Rain', assameseName: 'বৰষুণ', category: 'nature' },
  { id: 'elephant', image: 'https://loremflickr.com/200/200/elephant', name: 'Elephant', assameseName: 'হাতী', category: 'nature' },
  { id: 'peacock', image: 'https://loremflickr.com/200/200/peacock', name: 'Peacock', assameseName: 'ম’ৰা', category: 'nature' },
  { id: 'leaf', image: 'https://loremflickr.com/200/200/leaf', name: 'Tea Leaf', assameseName: 'চাহ পাত', category: 'nature' },
  { id: 'lemon', image: 'https://loremflickr.com/200/200/lemon', name: 'Kaji Nemu (Lemon)', assameseName: 'কাজী নেমু', category: 'food' },
  { id: 'teapot', image: 'https://loremflickr.com/200/200/teapot', name: 'Teapot', assameseName: 'চাহদানি', category: 'daily' },
  { id: 'paddy', image: 'https://loremflickr.com/200/200/paddy', name: 'Paddy Field', assameseName: 'ধাননি পথাৰ', category: 'nature' },
  { id: 'banyan', image: 'https://loremflickr.com/200/200/tree', name: 'Banyan Tree', assameseName: 'বট গছ', category: 'nature' },
  { id: 'fish', image: 'https://loremflickr.com/200/200/fish', name: 'Rohu Fish', assameseName: 'ৰৌ মাছ', category: 'food' },
  { id: 'diya', image: 'https://loremflickr.com/200/200/diya', name: 'Diya Lamp', assameseName: 'চাকি', category: 'culture' },
  { id: 'hibiscus', image: 'https://loremflickr.com/200/200/hibiscus', name: 'Jaba (Hibiscus)', assameseName: 'জবা ফুল', category: 'nature' },
  { id: 'coconut', image: 'https://loremflickr.com/200/200/coconut', name: 'Coconut', assameseName: 'নাৰিকল', category: 'food' },
  { id: 'corn', image: 'https://loremflickr.com/200/200/maize', name: 'Maize', assameseName: 'মাকৈ', category: 'food' },
  { id: 'music', image: 'https://loremflickr.com/200/200/music', name: 'Bihu Dhol & Pepa', assameseName: 'ঢোল-পেঁপা', category: 'culture' },
];

export interface RememberObjectItem {
  id: string;
  image: string;
  name: string;
  category: string;
}

export const REMEMBER_OBJECT_POOL: RememberObjectItem[] = [
  { id: 'umbrella', image: 'https://loremflickr.com/200/200/umbrella', name: 'Umbrella', category: 'daily' },
  { id: 'bell', image: 'https://loremflickr.com/200/200/bell', name: 'Temple Bell', category: 'culture' },
  { id: 'hat', image: 'https://loremflickr.com/200/200/hat', name: 'Jaapi (Hat)', category: 'culture' },
  { id: 'lantern', image: 'https://loremflickr.com/200/200/lantern', name: 'Lantern', category: 'daily' },
  { id: 'boat', image: 'https://loremflickr.com/200/200/boat', name: 'River Boat', category: 'daily' },
  { id: 'pot', image: 'https://loremflickr.com/200/200/pot', name: 'Clay Pot', category: 'culture' },
  { id: 'mango', image: 'https://loremflickr.com/200/200/mango', name: 'Ripe Mango', category: 'food' },
  { id: 'banana', image: 'https://loremflickr.com/200/200/banana', name: 'Malbhog Banana', category: 'food' },
  { id: 'deer', image: 'https://loremflickr.com/200/200/deer', name: 'Swamp Deer', category: 'nature' },
  { id: 'fan', image: 'https://loremflickr.com/200/200/fan', name: 'Hand Fan', category: 'daily' },
  { id: 'bird', image: 'https://loremflickr.com/200/200/bird', name: 'Myna Bird', category: 'nature' },
  { id: 'butterfly', image: 'https://loremflickr.com/200/200/butterfly', name: 'Butterfly', category: 'nature' },
  { id: 'guitar', image: 'https://loremflickr.com/200/200/guitar', name: 'Ektara / Dhol', category: 'culture' },
  { id: 'apple', image: 'https://loremflickr.com/200/200/apple', name: 'Red Apple', category: 'food' },
  { id: 'sun', image: 'https://loremflickr.com/200/200/sun', name: 'Morning Sun', category: 'nature' },
  { id: 'clock', image: 'https://loremflickr.com/200/200/clock', name: 'Alarm Clock', category: 'daily' },
];

export interface SequenceData {
  id: string;
  title: string;
  description: string;
  items: { id: string; image: string; name: string; step: number }[];
}

export const SEQUENCE_SETS: Record<'easy' | 'medium' | 'hard', SequenceData[]> = {
  easy: [
    {
      id: 'seq-tea-3',
      title: 'Making Morning Assam Tea',
      description: 'Remember the 3 steps to brew morning tea',
      items: [
        { id: 'boil', image: 'https://loremflickr.com/200/200/teapot', name: 'Boil Water', step: 1 },
        { id: 'leaves', image: 'https://loremflickr.com/200/200/leaf', name: 'Add Tea Leaves', step: 2 },
        { id: 'cup', image: '/assets/images/tea_cup.jpg', name: 'Pour into Cup', step: 3 },
      ],
    },
    {
      id: 'seq-plant-3',
      title: 'Growing Rice Paddy',
      description: 'The natural cycle of paddy cultivation',
      items: [
        { id: 'seed', image: 'https://loremflickr.com/200/200/seed', name: 'Plant Seedlings', step: 1 },
        { id: 'rain', image: 'https://loremflickr.com/200/200/rain', name: 'Monsoon Rain', step: 2 },
        { id: 'harvest', image: 'https://loremflickr.com/200/200/paddy', name: 'Golden Paddy', step: 3 },
      ],
    },
    {
      id: 'seq-morning-3',
      title: 'Waking Up Routine',
      description: 'First steps of a peaceful morning',
      items: [
        { id: 'sun', image: 'https://loremflickr.com/200/200/sun', name: 'Sunrise', step: 1 },
        { id: 'wash', image: 'https://loremflickr.com/200/200/wash', name: 'Wash Face', step: 2 },
        { id: 'prayer', image: 'https://loremflickr.com/200/200/diya', name: 'Morning Diya', step: 3 },
      ],
    },
  ],
  medium: [
    {
      id: 'seq-market-5',
      title: 'Going to the Village Haat (Market)',
      description: 'Step-by-step village market trip',
      items: [
        { id: 'basket', image: 'https://loremflickr.com/200/200/basket', name: 'Take Bamboo Basket', step: 1 },
        { id: 'walk', image: 'https://loremflickr.com/200/200/walk', name: 'Walk to Market', step: 2 },
        { id: 'fish', image: 'https://loremflickr.com/200/200/fish', name: 'Choose Fresh Fish', step: 3 },
        { id: 'vegetables', image: 'https://loremflickr.com/200/200/leaves', name: 'Buy Green Leaves', step: 4 },
        { id: 'home', image: '/assets/images/house.jpg', name: 'Return Home', step: 5 },
      ],
    },
    {
      id: 'seq-bihu-5',
      title: 'Preparing for Rongali Bihu',
      description: 'Traditional steps to celebrate Rongali Bihu',
      items: [
        { id: 'clean', image: 'https://loremflickr.com/200/200/sweep', name: 'Sweep Courtyard', step: 1 },
        { id: 'pitha', image: 'https://loremflickr.com/200/200/pitha', name: 'Make Rice Pitha', step: 2 },
        { id: 'gamosa', image: 'https://loremflickr.com/200/200/gamosa', name: 'Wear New Gamosa', step: 3 },
        { id: 'dhol', image: 'https://loremflickr.com/200/200/dhol', name: 'Play Dhol Beats', step: 4 },
        { id: 'bless', image: 'https://loremflickr.com/200/200/bless', name: 'Elders Blessing', step: 5 },
      ],
    },
  ],
  hard: [
    {
      id: 'seq-day-7',
      title: 'Full Day in the Assam Countryside',
      description: 'From dawn to peaceful nightfall',
      items: [
        { id: 'dawn', image: 'https://loremflickr.com/200/200/dawn', name: 'Rooster Crow at Dawn', step: 1 },
        { id: 'tea', image: '/assets/images/tea_cup.jpg', name: 'First Cup of Red Tea', step: 2 },
        { id: 'garden', image: 'https://loremflickr.com/200/200/leaf', name: 'Tend the Home Garden', step: 3 },
        { id: 'lunch', image: '/assets/images/rice.jpg', name: 'Warm Rice & Dhekia Xaak', step: 4 },
        { id: 'rest', image: 'https://loremflickr.com/200/200/rest', name: 'Veranda Rest & Chat', step: 5 },
        { id: 'dusk', image: 'https://loremflickr.com/200/200/diya', name: 'Light Tulsi Diya', step: 6 },
        { id: 'night', image: 'https://loremflickr.com/200/200/night', name: 'Sweet Restful Sleep', step: 7 },
      ],
    },
  ],
};

export interface DailyActivityItem {
  id: string;
  title: string;
  timeLabel: string;
  image: string;
  order: number;
  period: 'morning' | 'afternoon' | 'evening' | 'night';
}

export const SORT_MY_DAY_SETS: { id: string; name: string; activities: DailyActivityItem[] }[] = [
  {
    id: 'standard-day',
    name: 'A Peaceful Daily Routine',
    activities: [
      { id: 'act-1', title: 'Wake up with Morning Sun', timeLabel: '6:30 AM', image: 'https://loremflickr.com/200/200/sun', order: 1, period: 'morning' },
      { id: 'act-2', title: 'Enjoy Warm Lal Saah (Red Tea)', timeLabel: '7:30 AM', image: '/assets/images/tea_cup.jpg', order: 2, period: 'morning' },
      { id: 'act-3', title: 'Gentle Walk in Courtyard', timeLabel: '9:00 AM', image: 'https://loremflickr.com/200/200/walk', order: 3, period: 'morning' },
      { id: 'act-4', title: 'Wholesome Lunch with Family', timeLabel: '1:00 PM', image: '/assets/images/rice.jpg', order: 4, period: 'afternoon' },
      { id: 'act-5', title: 'Quiet Afternoon Nap', timeLabel: '2:30 PM', image: 'https://loremflickr.com/200/200/nap', order: 5, period: 'afternoon' },
      { id: 'act-6', title: 'Evening Diya & Prayer', timeLabel: '6:00 PM', image: 'https://loremflickr.com/200/200/diya', order: 6, period: 'evening' },
      { id: 'act-7', title: 'Light Dinner & Medicines', timeLabel: '8:00 PM', image: 'https://loremflickr.com/200/200/stew', order: 7, period: 'night' },
      { id: 'act-8', title: 'Relaxing Good Night Sleep', timeLabel: '9:30 PM', image: 'https://loremflickr.com/200/200/night', order: 8, period: 'night' },
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
        ['https://loremflickr.com/200/200/leaf', '/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/leaf'],
        ['/assets/images/house.jpg', 'https://loremflickr.com/200/200/peacock', 'https://loremflickr.com/200/200/tree'],
        ['https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/rain', '/assets/images/rice.jpg'],
      ],
      sceneRight: [
        ['https://loremflickr.com/200/200/leaf', 'https://loremflickr.com/200/200/teapot', 'https://loremflickr.com/200/200/leaf'], // diff (0,1): 🍵 vs 🫖
        ['/assets/images/house.jpg', 'https://loremflickr.com/200/200/peacock', '/assets/images/bamboo.jpg'], // diff (1,2): 🌳 vs 🎋
        ['https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/sun', '/assets/images/rice.jpg'], // diff (2,1): 🌧 vs ☀️
      ],
      differences: [
        { row: 0, col: 1, left: '/assets/images/tea_cup.jpg', right: 'https://loremflickr.com/200/200/teapot', hint: 'Look at the tea item in the top row' },
        { row: 1, col: 2, left: 'https://loremflickr.com/200/200/tree', right: '/assets/images/bamboo.jpg', hint: 'Look at the plant on the right side' },
        { row: 2, col: 1, left: 'https://loremflickr.com/200/200/rain', right: 'https://loremflickr.com/200/200/sun', hint: 'Notice the weather in the bottom row' },
      ],
    },
    {
      id: 'diff-easy-2',
      title: 'Village Courtyard',
      gridRows: 3,
      gridCols: 3,
      sceneLeft: [
        ['/assets/images/flower.jpg', 'https://loremflickr.com/200/200/hibiscus', '/assets/images/flower.jpg'],
        ['https://loremflickr.com/200/200/elephant', '/assets/images/house.jpg', 'https://loremflickr.com/200/200/peacock'],
        ['/assets/images/orange.jpg', 'https://loremflickr.com/200/200/coconut', 'https://loremflickr.com/200/200/lemon'],
      ],
      sceneRight: [
        ['/assets/images/flower.jpg', 'https://loremflickr.com/200/200/daisy', '/assets/images/flower.jpg'], // diff (0,1): 🌺 vs 🌼
        ['https://loremflickr.com/200/200/rhino', '/assets/images/house.jpg', 'https://loremflickr.com/200/200/peacock'], // diff (1,0): 🐘 vs 🦏
        ['/assets/images/orange.jpg', 'https://loremflickr.com/200/200/coconut', 'https://loremflickr.com/200/200/watermelon'], // diff (2,2): 🍋 vs 🍉
      ],
      differences: [
        { row: 0, col: 1, left: 'https://loremflickr.com/200/200/hibiscus', right: 'https://loremflickr.com/200/200/daisy', hint: 'Look at the flower in the middle of top row' },
        { row: 1, col: 0, left: 'https://loremflickr.com/200/200/elephant', right: 'https://loremflickr.com/200/200/rhino', hint: 'Check the gentle animal on the left' },
        { row: 2, col: 2, left: 'https://loremflickr.com/200/200/lemon', right: 'https://loremflickr.com/200/200/watermelon', hint: 'Spot the fruit in the bottom right corner' },
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
        ['https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/music'],
        ['/assets/images/rice.jpg', 'https://loremflickr.com/200/200/fish', '/assets/images/tea_cup.jpg', '/assets/images/house.jpg'],
        ['/assets/images/bamboo.jpg', 'https://loremflickr.com/200/200/lemon', 'https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/peacock'],
      ],
      sceneRight: [
        ['https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/candle', 'https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/music'], // diff (0,1)
        ['/assets/images/rice.jpg', 'https://loremflickr.com/200/200/fish', 'https://loremflickr.com/200/200/teapot', '/assets/images/house.jpg'], // diff (1,2)
        ['/assets/images/bamboo.jpg', '/assets/images/orange.jpg', 'https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/parrot'], // diff (2,1), diff (2,3)
        // plus 1 more:
      ],
      differences: [
        { row: 0, col: 1, left: 'https://loremflickr.com/200/200/diya', right: 'https://loremflickr.com/200/200/candle', hint: 'Look closely at the ceremonial light' },
        { row: 1, col: 2, left: '/assets/images/tea_cup.jpg', right: 'https://loremflickr.com/200/200/teapot', hint: 'Notice the vessel in the center' },
        { row: 2, col: 1, left: 'https://loremflickr.com/200/200/lemon', right: '/assets/images/orange.jpg', hint: 'Check the citrus fruit' },
        { row: 2, col: 3, left: 'https://loremflickr.com/200/200/peacock', right: 'https://loremflickr.com/200/200/parrot', hint: 'Look at the bird on the bottom right' },
        { row: 0, col: 3, left: 'https://loremflickr.com/200/200/music', right: 'https://loremflickr.com/200/200/music', hint: 'Notice the musical symbol' },
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
        ['https://loremflickr.com/200/200/rain', 'https://loremflickr.com/200/200/leaf', 'https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/tree'],
        ['https://loremflickr.com/200/200/boat', 'https://loremflickr.com/200/200/fish', 'https://loremflickr.com/200/200/paddy', '/assets/images/house.jpg'],
        ['/assets/images/flower.jpg', 'https://loremflickr.com/200/200/hibiscus', 'https://loremflickr.com/200/200/peacock', 'https://loremflickr.com/200/200/lemon'],
        ['https://loremflickr.com/200/200/diya', '/assets/images/tea_cup.jpg', '/assets/images/bamboo.jpg', 'https://loremflickr.com/200/200/coconut'],
      ],
      sceneRight: [
        ['https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/leaf', 'https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/pine'], // (0,0), (0,3)
        ['https://loremflickr.com/200/200/boat', 'https://loremflickr.com/200/200/fish2', 'https://loremflickr.com/200/200/paddy', '/assets/images/house.jpg'], // (1,1)
        ['/assets/images/flower.jpg', 'https://loremflickr.com/200/200/daisy', 'https://loremflickr.com/200/200/peacock', '/assets/images/orange.jpg'], // (2,1), (2,3)
        ['https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/teapot', '/assets/images/bamboo.jpg', 'https://loremflickr.com/200/200/pineapple'], // (3,1), (3,3)
      ],
      differences: [
        { row: 0, col: 0, left: 'https://loremflickr.com/200/200/rain', right: 'https://loremflickr.com/200/200/sun', hint: 'Sky weather in top left' },
        { row: 0, col: 3, left: 'https://loremflickr.com/200/200/tree', right: 'https://loremflickr.com/200/200/pine', hint: 'Tree in top right' },
        { row: 1, col: 1, left: 'https://loremflickr.com/200/200/fish', right: 'https://loremflickr.com/200/200/fish2', hint: 'Water fish in row 2' },
        { row: 2, col: 1, left: 'https://loremflickr.com/200/200/hibiscus', right: 'https://loremflickr.com/200/200/daisy', hint: 'Bright flower in row 3' },
        { row: 2, col: 3, left: 'https://loremflickr.com/200/200/lemon', right: '/assets/images/orange.jpg', hint: 'Fruit in row 3' },
        { row: 3, col: 1, left: '/assets/images/tea_cup.jpg', right: 'https://loremflickr.com/200/200/teapot', hint: 'Warm beverage utensil in bottom row' },
        { row: 3, col: 3, left: 'https://loremflickr.com/200/200/coconut', right: 'https://loremflickr.com/200/200/pineapple', hint: 'Tropical fruit at the bottom corner' },
      ],
    },
  ],
};

// Fix the right grid for medium 1 to match exactly 5 diffs
FIND_DIFFERENCE_SCENES.medium[0].sceneRight = [
  ['https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/candle', 'https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/music'], // diff (0,1), diff (0,3)
  ['/assets/images/rice.jpg', 'https://loremflickr.com/200/200/fish', 'https://loremflickr.com/200/200/teapot', '/assets/images/house.jpg'], // diff (1,2)
  ['/assets/images/bamboo.jpg', '/assets/images/orange.jpg', 'https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/parrot'], // diff (2,1), diff (2,3)
];

export interface ObjectRecognitionItem {
  id: string;
  image: string;
  correctName: string;
  options: string[];
  hint: string;
  culturalFact: string;
}

export const OBJECT_RECOGNITION_ITEMS: ObjectRecognitionItem[] = [
  {
    id: 'rec-1',
    image: '/assets/images/tea_cup.jpg',
    correctName: 'Assam Tea Cup',
    options: ['Assam Tea Cup', 'Fruit Bowl', 'Water Jug', 'Clay Lamp'],
    hint: 'A comforting hot drink enjoyed every morning across Assam.',
    culturalFact: 'Assam produces some of the finest malt tea in the entire world.',
  },
  {
    id: 'rec-2',
    image: 'https://loremflickr.com/200/200/elephant',
    correctName: 'Wild Elephant',
    options: ['Horse', 'Wild Elephant', 'Buffalo', 'Rhino'],
    hint: 'A majestic gentle giant found in Kaziranga National Park.',
    culturalFact: 'Elephants are revered and protected across the Brahmaputra valley.',
  },
  {
    id: 'rec-3',
    image: 'https://loremflickr.com/200/200/paddy',
    correctName: 'Paddy / Rice Field',
    options: ['Wheat Grass', 'Bamboo Grove', 'Paddy / Rice Field', 'Sugarcane'],
    hint: 'Golden crops harvested during Magh Bihu.',
    culturalFact: 'Rice is the heart and staple of traditional North-Eastern meals.',
  },
  {
    id: 'rec-4',
    image: 'https://loremflickr.com/200/200/diya',
    correctName: 'Earthen Diya (Chaki)',
    options: ['Incense Holder', 'Earthen Diya (Chaki)', 'Flower Vase', 'Teacup'],
    hint: 'Lit every evening with mustard oil beside the sacred Tulsi plant.',
    culturalFact: 'Lighting the chaki at dusk is a peaceful evening tradition in every Assamese home.',
  },
  {
    id: 'rec-5',
    image: '/assets/images/bamboo.jpg',
    correctName: 'Bamboo (Baah)',
    options: ['Bamboo (Baah)', 'Sugar Cane', 'Palm Frond', 'Oak Twig'],
    hint: 'Used to build sturdy stilt houses, fishing nets, and delicate baskets.',
    culturalFact: 'Bamboo craft has sustained indigenous communities for thousands of years.',
  },
  {
    id: 'rec-6',
    image: 'https://loremflickr.com/200/200/peacock',
    correctName: 'Peacock (Mora)',
    options: ['Kingfisher', 'Parrot', 'Peacock (Mora)', 'Duck'],
    hint: 'A colourful bird that dances during the coming of sweet monsoon rains.',
    culturalFact: 'The peacock’s vibrant feathers are an emblem of beauty and joy.',
  },
  {
    id: 'rec-7',
    image: 'https://loremflickr.com/200/200/boat',
    correctName: 'River Naao (Boat)',
    options: ['Bridge', 'River Naao (Boat)', 'Fishing Net', 'Water Wheel'],
    hint: 'Gently ferries people and goods across the mighty Brahmaputra river.',
    culturalFact: 'Boats link the river island of Majuli with Jorhat on the mainland.',
  },
  {
    id: 'rec-8',
    image: 'https://loremflickr.com/200/200/lemon',
    correctName: 'Kaji Nemu (Assam Lemon)',
    options: ['Orange', 'Kaji Nemu (Assam Lemon)', 'Green Guava', 'Amala'],
    hint: 'An oblong, highly fragrant citrus that brightens any fish curry.',
    culturalFact: 'Kaji Nemu has a Geographical Indication (GI) tag unique to Assam.',
  },
  {
    id: 'rec-9',
    image: 'https://loremflickr.com/200/200/fish',
    correctName: 'Fresh River Fish',
    options: ['River Fish', 'River Turtle', 'Fresh Crab', 'Prawn'],
    hint: 'Caught fresh in local rivers and cooked with tender bamboo shoots.',
    culturalFact: 'Fish curry cooked with sour bamboo shoot is a cherished heritage dish.',
  },
  {
    id: 'rec-10',
    image: 'https://loremflickr.com/200/200/hibiscus',
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
      sequence: ['https://loremflickr.com/200/200/red', 'https://loremflickr.com/200/200/blue', 'https://loremflickr.com/200/200/red', 'https://loremflickr.com/200/200/blue', '?'],
      options: ['https://loremflickr.com/200/200/leaf', '/assets/images/flower.jpg', 'https://loremflickr.com/200/200/leaf', '?'],
      options: ['/assets/images/flower.jpg', 'https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/leaf', '/assets/images/orange.jpg'],
      correctAnswer: '/assets/images/flower.jpg',
      explanation: 'Flower and leaf alternate: Flower, Leaf, Flower, Leaf, then Flower!',
    },
    {
      id: 'pat-e-3',
      sequence: ['/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/teapot', '/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/teapot', '?'],
      options: ['/assets/images/rice.jpg', '/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/teapot', 'https://loremflickr.com/200/200/lemon'],
      correctAnswer: '/assets/images/tea_cup.jpg',
      explanation: 'Tea cup follows teapot every time.',
    },
    {
      id: 'pat-e-4',
      sequence: ['https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/rain', 'https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/rain', '?'],
      options: ['https://loremflickr.com/200/200/rain', 'https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/lightning', 'https://loremflickr.com/200/200/night'],
      correctAnswer: 'https://loremflickr.com/200/200/sun',
      explanation: 'Sun follows rain in this pleasant weather pattern.',
    },
    {
      id: 'pat-e-5',
      sequence: ['https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/peacock', 'https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/peacock', '?'],
      options: ['https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/peacock', 'https://loremflickr.com/200/200/fish', 'https://loremflickr.com/200/200/deer'],
      correctAnswer: 'https://loremflickr.com/200/200/elephant',
      explanation: 'Elephant alternates with Peacock.',
    },
    {
      id: 'pat-e-6',
      sequence: ['https://loremflickr.com/200/200/yellow', 'https://loremflickr.com/200/200/green', 'https://loremflickr.com/200/200/yellow', 'https://loremflickr.com/200/200/green', '?'],
      options: ['https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/candle', 'https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/candle', '?'],
      options: ['https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/candle', 'https://loremflickr.com/200/200/sparkle', 'https://loremflickr.com/200/200/sun'],
      correctAnswer: 'https://loremflickr.com/200/200/diya',
      explanation: 'Diya comes back after candle.',
    },
    {
      id: 'pat-e-8',
      sequence: ['/assets/images/orange.jpg', 'https://loremflickr.com/200/200/lemon', '/assets/images/orange.jpg', 'https://loremflickr.com/200/200/lemon', '?'],
      options: ['https://loremflickr.com/200/200/lemon', '/assets/images/orange.jpg', 'https://loremflickr.com/200/200/coconut', 'https://loremflickr.com/200/200/banana'],
      correctAnswer: '/assets/images/orange.jpg',
      explanation: 'Orange follows lemon.',
    },
    {
      id: 'pat-e-9',
      sequence: ['/assets/images/house.jpg', 'https://loremflickr.com/200/200/tree', '/assets/images/house.jpg', 'https://loremflickr.com/200/200/tree', '?'],
      options: ['/assets/images/house.jpg', 'https://loremflickr.com/200/200/tree', '/assets/images/bamboo.jpg', 'https://loremflickr.com/200/200/paddy'],
      correctAnswer: '/assets/images/house.jpg',
      explanation: 'Home comes after tree.',
    },
    {
      id: 'pat-e-10',
      sequence: ['/assets/images/rice.jpg', 'https://loremflickr.com/200/200/fish', '/assets/images/rice.jpg', 'https://loremflickr.com/200/200/fish', '?'],
      options: ['/assets/images/rice.jpg', 'https://loremflickr.com/200/200/fish', '/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/leaf'],
      correctAnswer: '/assets/images/rice.jpg',
      explanation: 'Rice comes after fish in our lunch rhythm.',
    },
  ],
  medium: [
    {
      id: 'pat-m-1',
      sequence: ['https://loremflickr.com/200/200/red', 'https://loremflickr.com/200/200/blue', 'https://loremflickr.com/200/200/green', 'https://loremflickr.com/200/200/red', 'https://loremflickr.com/200/200/blue', '?'],
      options: ['https://loremflickr.com/200/200/seed', 'https://loremflickr.com/200/200/leaf', 'https://loremflickr.com/200/200/tree', 'https://loremflickr.com/200/200/seed', 'https://loremflickr.com/200/200/leaf', '?'],
      options: ['https://loremflickr.com/200/200/seed', 'https://loremflickr.com/200/200/tree', 'https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/fall'],
      correctAnswer: 'https://loremflickr.com/200/200/tree',
      explanation: 'Sprout, Leaves, then Tree.',
    },
    {
      id: 'pat-m-3',
      sequence: ['/assets/images/tea_cup.jpg', '/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/teapot', '/assets/images/tea_cup.jpg', '/assets/images/tea_cup.jpg', '?'],
      options: ['/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/teapot', 'https://loremflickr.com/200/200/lemon', '🍶'],
      correctAnswer: 'https://loremflickr.com/200/200/teapot',
      explanation: 'Two cups, then one teapot: Cup, Cup, Teapot.',
    },
    {
      id: 'pat-m-4',
      sequence: ['https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/rain', 'https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/sun', '?'],
      options: ['https://loremflickr.com/200/200/rain', 'https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/rainbow', 'https://loremflickr.com/200/200/night'],
      correctAnswer: 'https://loremflickr.com/200/200/rain',
      explanation: 'Two suns followed by rain.',
    },
    {
      id: 'pat-m-5',
      sequence: ['/assets/images/flower.jpg', 'https://loremflickr.com/200/200/hibiscus', 'https://loremflickr.com/200/200/daisy', '/assets/images/flower.jpg', 'https://loremflickr.com/200/200/hibiscus', '?'],
      options: ['/assets/images/flower.jpg', 'https://loremflickr.com/200/200/hibiscus', 'https://loremflickr.com/200/200/daisy', 'https://loremflickr.com/200/200/leaf'],
      correctAnswer: 'https://loremflickr.com/200/200/daisy',
      explanation: 'Three flowers repeat: Cherry, Hibiscus, Daisy.',
    },
    {
      id: 'pat-m-6',
      sequence: ['https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/peacock', 'https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/elephant', '?'],
      options: ['https://loremflickr.com/200/200/elephant', 'https://loremflickr.com/200/200/peacock', 'https://loremflickr.com/200/200/deer', 'https://loremflickr.com/200/200/parrot'],
      correctAnswer: 'https://loremflickr.com/200/200/peacock',
      explanation: 'Two elephants then one peacock.',
    },
    {
      id: 'pat-m-7',
      sequence: ['https://loremflickr.com/200/200/paddy', '/assets/images/rice.jpg', 'https://loremflickr.com/200/200/stew', 'https://loremflickr.com/200/200/paddy', '/assets/images/rice.jpg', '?'],
      options: ['https://loremflickr.com/200/200/stew', 'https://loremflickr.com/200/200/paddy', '/assets/images/rice.jpg', 'https://loremflickr.com/200/200/bowl'],
      correctAnswer: 'https://loremflickr.com/200/200/stew',
      explanation: 'Paddy becomes rice, rice becomes warm food.',
    },
    {
      id: 'pat-m-8',
      sequence: ['https://loremflickr.com/200/200/up', 'https://loremflickr.com/200/200/arrows', 'https://loremflickr.com/200/200/arrows', 'https://loremflickr.com/200/200/up', 'https://loremflickr.com/200/200/arrows', '?'],
      options: ['https://loremflickr.com/200/200/up', 'https://loremflickr.com/200/200/arrows', 'https://loremflickr.com/200/200/arrows', 'https://loremflickr.com/200/200/star'],
      correctAnswer: 'https://loremflickr.com/200/200/arrows',
      explanation: 'Triangle, Blue Diamond, Orange Diamond.',
    },
    {
      id: 'pat-m-9',
      sequence: ['/assets/images/orange.jpg', 'https://loremflickr.com/200/200/lemon', 'https://loremflickr.com/200/200/coconut', '/assets/images/orange.jpg', 'https://loremflickr.com/200/200/lemon', '?'],
      options: ['https://loremflickr.com/200/200/coconut', '/assets/images/orange.jpg', 'https://loremflickr.com/200/200/lemon', 'https://loremflickr.com/200/200/watermelon'],
      correctAnswer: 'https://loremflickr.com/200/200/coconut',
      explanation: 'Orange, Lemon, then Coconut completes the fruit triad.',
    },
    {
      id: 'pat-m-10',
      sequence: ['/assets/images/bamboo.jpg', '/assets/images/bamboo.jpg', 'https://loremflickr.com/200/200/leaf', '/assets/images/bamboo.jpg', '/assets/images/bamboo.jpg', '?'],
      options: ['/assets/images/bamboo.jpg', 'https://loremflickr.com/200/200/leaf', 'https://loremflickr.com/200/200/tree', 'https://loremflickr.com/200/200/paddy'],
      correctAnswer: 'https://loremflickr.com/200/200/leaf',
      explanation: 'Two bamboos then one leaf.',
    },
  ],
  hard: [
    {
      id: 'pat-h-1',
      sequence: ['https://loremflickr.com/200/200/up', 'https://loremflickr.com/200/200/arrows', 'https://loremflickr.com/200/200/green', '?'],
      options: ['https://loremflickr.com/200/200/1', 'https://loremflickr.com/200/200/2', 'https://loremflickr.com/200/200/3', 'https://loremflickr.com/200/200/1', 'https://loremflickr.com/200/200/2', '?'],
      options: ['https://loremflickr.com/200/200/1', 'https://loremflickr.com/200/200/3', 'https://loremflickr.com/200/200/4', 'https://loremflickr.com/200/200/2'],
      correctAnswer: 'https://loremflickr.com/200/200/3',
      explanation: 'Numbers 1, 2, 3 cycle continually.',
    },
    {
      id: 'pat-h-3',
      sequence: ['https://loremflickr.com/200/200/dawn', 'https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/sunset', 'https://loremflickr.com/200/200/night', 'https://loremflickr.com/200/200/dawn', 'https://loremflickr.com/200/200/sun', '?'],
      options: ['https://loremflickr.com/200/200/sunset', 'https://loremflickr.com/200/200/night', 'https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/star'],
      correctAnswer: 'https://loremflickr.com/200/200/sunset',
      explanation: 'Cycle of the day: Dawn, Midday, Sunset, Night.',
    },
    {
      id: 'pat-h-4',
      sequence: ['https://loremflickr.com/200/200/seed', 'https://loremflickr.com/200/200/leaf', '/assets/images/flower.jpg', '/assets/images/orange.jpg', 'https://loremflickr.com/200/200/seed', 'https://loremflickr.com/200/200/leaf', '/assets/images/flower.jpg', '?'],
      options: ['/assets/images/orange.jpg', 'https://loremflickr.com/200/200/seed', 'https://loremflickr.com/200/200/leaf', 'https://loremflickr.com/200/200/tree'],
      correctAnswer: '/assets/images/orange.jpg',
      explanation: 'Plant growth cycle: Sprout, Leaf, Flower, Fruit.',
    },
    {
      id: 'pat-h-5',
      sequence: ['https://loremflickr.com/200/200/star', 'https://loremflickr.com/200/200/stars', 'https://loremflickr.com/200/200/star', 'https://loremflickr.com/200/200/stars', 'https://loremflickr.com/200/200/star', '?'],
      options: ['https://loremflickr.com/200/200/star', 'https://loremflickr.com/200/200/stars', 'https://loremflickr.com/200/200/sparkle', 'https://loremflickr.com/200/200/stars'],
      correctAnswer: 'https://loremflickr.com/200/200/stars',
      explanation: 'One star, then two stars, alternating.',
    },
    {
      id: 'pat-h-6',
      sequence: ['https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/sparkle', 'https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/sparkle', 'https://loremflickr.com/200/200/diya', '?'],
      options: ['https://loremflickr.com/200/200/diya', 'https://loremflickr.com/200/200/sparkle', 'https://loremflickr.com/200/200/candle', 'https://loremflickr.com/200/200/sun'],
      correctAnswer: 'https://loremflickr.com/200/200/diya',
      explanation: 'Two diyas followed by sparkles.',
    },
    {
      id: 'pat-h-7',
      sequence: ['/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/coffee', '/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/coffee', '/assets/images/tea_cup.jpg', '?'],
      options: ['https://loremflickr.com/200/200/coffee', '/assets/images/tea_cup.jpg', 'https://loremflickr.com/200/200/milk', 'https://loremflickr.com/200/200/teapot'],
      correctAnswer: 'https://loremflickr.com/200/200/coffee',
      explanation: 'Green cup and brown cup alternate.',
    },
    {
      id: 'pat-h-8',
      sequence: ['https://loremflickr.com/200/200/fish', 'https://loremflickr.com/200/200/fish', 'https://loremflickr.com/200/200/wave', 'https://loremflickr.com/200/200/fish', 'https://loremflickr.com/200/200/fish', '?'],
      options: ['https://loremflickr.com/200/200/wave', 'https://loremflickr.com/200/200/fish', 'https://loremflickr.com/200/200/boat', 'https://loremflickr.com/200/200/shell'],
      correctAnswer: 'https://loremflickr.com/200/200/wave',
      explanation: 'Two fish swimming, then one river wave.',
    },
    {
      id: 'pat-h-9',
      sequence: ['https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/paddy', '/assets/images/rice.jpg', 'https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/paddy', '?'],
      options: ['/assets/images/rice.jpg', 'https://loremflickr.com/200/200/paddy', 'https://loremflickr.com/200/200/bowl', 'https://loremflickr.com/200/200/paddy'],
      correctAnswer: '/assets/images/rice.jpg',
      explanation: 'Three stalks of paddy yield one bowl of rice.',
    },
    {
      id: 'pat-h-10',
      sequence: ['https://loremflickr.com/200/200/rain', 'https://loremflickr.com/200/200/rain', 'https://loremflickr.com/200/200/rainbow', 'https://loremflickr.com/200/200/rain', 'https://loremflickr.com/200/200/rain', '?'],
      options: ['https://loremflickr.com/200/200/rainbow', 'https://loremflickr.com/200/200/rain', 'https://loremflickr.com/200/200/sun', 'https://loremflickr.com/200/200/lightning'],
      correctAnswer: 'https://loremflickr.com/200/200/rainbow',
      explanation: 'Two rain clouds are followed by a rainbow.',
    },
  ],
};

export interface AttentionTapRound {
  id: string;
  instruction: string;
  targetCategory: string;
  ruleDescription: string;
  gridItems: { id: string; image: string; name: string; isTarget: boolean }[];
}

export const ATTENTION_TAP_ROUNDS: Record<'easy' | 'medium' | 'hard', AttentionTapRound[]> = {
  easy: [
    {
      id: 'att-e-1',
      instruction: 'Tap all the Fruits 🍊 🍋 🥥',
      targetCategory: 'fruits',
      ruleDescription: 'Find every tasty fresh fruit',
      gridItems: [
        { id: '1', image: '/assets/images/orange.jpg', name: 'Orange', isTarget: true },
        { id: '2', image: '/assets/images/house.jpg', name: 'Home', isTarget: false },
        { id: '3', image: 'https://loremflickr.com/200/200/lemon', name: 'Lemon', isTarget: true },
        { id: '4', image: '/assets/images/tea_cup.jpg', name: 'Tea Cup', isTarget: false },
        { id: '5', image: 'https://loremflickr.com/200/200/coconut', name: 'Coconut', isTarget: true },
        { id: '6', image: 'https://loremflickr.com/200/200/paddy', name: 'Paddy', isTarget: false },
        { id: '7', image: 'https://loremflickr.com/200/200/banana', name: 'Banana', isTarget: true },
        { id: '8', image: 'https://loremflickr.com/200/200/elephant', name: 'Elephant', isTarget: false },
        { id: '9', image: 'https://loremflickr.com/200/200/apple', name: 'Apple', isTarget: true },
      ],
    },
    {
      id: 'att-e-2',
      instruction: 'Tap all the Flowers 🌸 🌺',
      targetCategory: 'flowers',
      ruleDescription: 'Find all blooming flowers',
      gridItems: [
        { id: '1', image: '/assets/images/flower.jpg', name: 'Pink Flower', isTarget: true },
        { id: '2', image: 'https://loremflickr.com/200/200/fish', name: 'Fish', isTarget: false },
        { id: '3', image: 'https://loremflickr.com/200/200/hibiscus', name: 'Hibiscus', isTarget: true },
        { id: '4', image: '/assets/images/bamboo.jpg', name: 'Bamboo', isTarget: false },
        { id: '5', image: 'https://loremflickr.com/200/200/daisy', name: 'Daisy', isTarget: true },
        { id: '6', image: '/assets/images/rice.jpg', name: 'Rice', isTarget: false },
        { id: '7', image: 'https://loremflickr.com/200/200/sunflower', name: 'Sunflower', isTarget: true },
        { id: '8', image: 'https://loremflickr.com/200/200/diya', name: 'Diya', isTarget: false },
        { id: '9', image: 'https://loremflickr.com/200/200/tulip', name: 'Tulip', isTarget: true },
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
        { id: '1', image: 'https://loremflickr.com/200/200/elephant', name: 'Elephant', isTarget: true },
        { id: '2', image: 'https://loremflickr.com/200/200/leaf', name: 'Tea Leaf', isTarget: false },
        { id: '3', image: 'https://loremflickr.com/200/200/peacock', name: 'Peacock', isTarget: true },
        { id: '4', image: 'https://loremflickr.com/200/200/teapot', name: 'Teapot', isTarget: false },
        { id: '5', image: 'https://loremflickr.com/200/200/deer', name: 'Deer', isTarget: true },
        { id: '6', image: '/assets/images/orange.jpg', name: 'Orange', isTarget: false },
        { id: '7', image: 'https://loremflickr.com/200/200/fish', name: 'Fish', isTarget: true },
        { id: '8', image: '/assets/images/house.jpg', name: 'House', isTarget: false },
        { id: '9', image: 'https://loremflickr.com/200/200/bird', name: 'Bird', isTarget: true },
        { id: '10', image: '/assets/images/rice.jpg', name: 'Rice', isTarget: false },
        { id: '11', image: 'https://loremflickr.com/200/200/butterfly', name: 'Butterfly', isTarget: true },
        { id: '12', image: 'https://loremflickr.com/200/200/rain', name: 'Rain', isTarget: false },
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
        { id: '1', image: '/assets/images/tea_cup.jpg', name: 'Tea Cup', isTarget: true },
        { id: '2', image: 'https://loremflickr.com/200/200/elephant', name: 'Elephant', isTarget: false },
        { id: '3', image: '/assets/images/rice.jpg', name: 'Rice', isTarget: true },
        { id: '4', image: 'https://loremflickr.com/200/200/peacock', name: 'Peacock', isTarget: false },
        { id: '5', image: 'https://loremflickr.com/200/200/teapot', name: 'Teapot', isTarget: true },
        { id: '6', image: 'https://loremflickr.com/200/200/tree', name: 'Tree', isTarget: false },
        { id: '7', image: 'https://loremflickr.com/200/200/lemon', name: 'Lemon', isTarget: true },
        { id: '8', image: 'https://loremflickr.com/200/200/rain', name: 'Cloud', isTarget: false },
        { id: '9', image: 'https://loremflickr.com/200/200/fish', name: 'Fish', isTarget: true },
        { id: '10', image: 'https://loremflickr.com/200/200/boat', name: 'Boat', isTarget: false },
        { id: '11', image: 'https://loremflickr.com/200/200/coconut', name: 'Coconut', isTarget: true },
        { id: '12', image: '/assets/images/bamboo.jpg', name: 'Bamboo', isTarget: false },
        { id: '13', image: 'https://loremflickr.com/200/200/stew', name: 'Stew Pot', isTarget: true },
        { id: '14', image: '/assets/images/house.jpg', name: 'Cottage', isTarget: false },
        { id: '15', image: '/assets/images/orange.jpg', name: 'Orange', isTarget: true },
        { id: '16', image: 'https://loremflickr.com/200/200/diya', name: 'Diya', isTarget: false },
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
  options: { id: string; image: string; label: string; isCorrect: boolean }[];
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
      { id: 'rain', image: 'https://loremflickr.com/200/200/rain', label: 'Rain Shower', isCorrect: true },
      { id: 'sun', image: 'https://loremflickr.com/200/200/sun', label: 'Bright Sunshine', isCorrect: false },
      { id: 'fire', image: 'https://loremflickr.com/200/200/fire', label: 'Campfire', isCorrect: false },
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
      { id: 'drum', image: 'https://loremflickr.com/200/200/dhol', label: 'Bihu Dhol', isCorrect: false },
      { id: 'bell', image: 'https://loremflickr.com/200/200/bell', label: 'Temple Bell', isCorrect: true },
      { id: 'whistle', image: 'https://loremflickr.com/200/200/train', label: 'Train Whistle', isCorrect: false },
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
      { id: 'bird', image: 'https://loremflickr.com/200/200/bird', label: 'Singing Bird', isCorrect: true },
      { id: 'frog', image: 'https://loremflickr.com/200/200/frog', label: 'Croaking Frog', isCorrect: false },
      { id: 'cow', image: 'https://loremflickr.com/200/200/cow', label: 'Cow Mooing', isCorrect: false },
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
      { id: 'car', image: 'https://loremflickr.com/200/200/car', label: 'Car Horn', isCorrect: false },
      { id: 'thunder', image: 'https://loremflickr.com/200/200/lightning', label: 'Thunder Clap', isCorrect: false },
      { id: 'flute', image: 'https://loremflickr.com/200/200/flute', label: 'Bamboo Flute', isCorrect: true },
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
      { id: 'river', image: 'https://loremflickr.com/200/200/wave', label: 'River Waves', isCorrect: true },
      { id: 'clock', image: 'https://loremflickr.com/200/200/clock', label: 'Clock Ticking', isCorrect: false },
      { id: 'fan', image: 'https://loremflickr.com/200/200/fan', label: 'Paper Fan', isCorrect: false },
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

