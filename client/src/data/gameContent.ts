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
  { id: 'rain', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', name: 'Rain', assameseName: 'বৰষুণ', category: 'nature' },
  { id: 'elephant', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', name: 'Elephant', assameseName: 'হাতী', category: 'nature' },
  { id: 'peacock', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', name: 'Peacock', assameseName: 'ম’ৰা', category: 'nature' },
  { id: 'leaf', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', name: 'Tea Leaf', assameseName: 'চাহ পাত', category: 'nature' },
  { id: 'lemon', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', name: 'Kaji Nemu (Lemon)', assameseName: 'কাজী নেমু', category: 'food' },
  { id: 'teapot', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', name: 'Teapot', assameseName: 'চাহদানি', category: 'daily' },
  { id: 'paddy', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', name: 'Paddy Field', assameseName: 'ধাননি পথাৰ', category: 'nature' },
  { id: 'banyan', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', name: 'Banyan Tree', assameseName: 'বট গছ', category: 'nature' },
  { id: 'fish', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', name: 'Rohu Fish', assameseName: 'ৰৌ মাছ', category: 'food' },
  { id: 'diya', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', name: 'Diya Lamp', assameseName: 'চাকি', category: 'culture' },
  { id: 'hibiscus', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus', name: 'Jaba (Hibiscus)', assameseName: 'জবা ফুল', category: 'nature' },
  { id: 'coconut', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut', name: 'Coconut', assameseName: 'নাৰিকল', category: 'food' },
  { id: 'corn', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Maize', name: 'Maize', assameseName: 'মাকৈ', category: 'food' },
  { id: 'music', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Music', name: 'Bihu Dhol & Pepa', assameseName: 'ঢোল-পেঁপা', category: 'culture' },
];

export interface RememberObjectItem {
  id: string;
  image: string;
  name: string;
  category: string;
}

export const REMEMBER_OBJECT_POOL: RememberObjectItem[] = [
  { id: 'umbrella', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Umbrella', name: 'Umbrella', category: 'daily' },
  { id: 'bell', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bell', name: 'Temple Bell', category: 'culture' },
  { id: 'hat', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hat', name: 'Jaapi (Hat)', category: 'culture' },
  { id: 'lantern', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lantern', name: 'Lantern', category: 'daily' },
  { id: 'boat', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Boat', name: 'River Boat', category: 'daily' },
  { id: 'pot', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pot', name: 'Clay Pot', category: 'culture' },
  { id: 'mango', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Mango', name: 'Ripe Mango', category: 'food' },
  { id: 'banana', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Banana', name: 'Malbhog Banana', category: 'food' },
  { id: 'deer', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Deer', name: 'Swamp Deer', category: 'nature' },
  { id: 'fan', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fan', name: 'Hand Fan', category: 'daily' },
  { id: 'bird', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bird', name: 'Myna Bird', category: 'nature' },
  { id: 'butterfly', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Butterfly', name: 'Butterfly', category: 'nature' },
  { id: 'guitar', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Guitar', name: 'Ektara / Dhol', category: 'culture' },
  { id: 'apple', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Apple', name: 'Red Apple', category: 'food' },
  { id: 'sun', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', name: 'Morning Sun', category: 'nature' },
  { id: 'clock', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Clock', name: 'Alarm Clock', category: 'daily' },
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
        { id: 'boil', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', name: 'Boil Water', step: 1 },
        { id: 'leaves', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', name: 'Add Tea Leaves', step: 2 },
        { id: 'cup', image: '/assets/images/tea_cup.jpg', name: 'Pour into Cup', step: 3 },
      ],
    },
    {
      id: 'seq-plant-3',
      title: 'Growing Rice Paddy',
      description: 'The natural cycle of paddy cultivation',
      items: [
        { id: 'seed', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Seed', name: 'Plant Seedlings', step: 1 },
        { id: 'rain', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', name: 'Monsoon Rain', step: 2 },
        { id: 'harvest', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', name: 'Golden Paddy', step: 3 },
      ],
    },
    {
      id: 'seq-morning-3',
      title: 'Waking Up Routine',
      description: 'First steps of a peaceful morning',
      items: [
        { id: 'sun', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', name: 'Sunrise', step: 1 },
        { id: 'wash', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Wash', name: 'Wash Face', step: 2 },
        { id: 'prayer', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', name: 'Morning Diya', step: 3 },
      ],
    },
  ],
  medium: [
    {
      id: 'seq-market-5',
      title: 'Going to the Village Haat (Market)',
      description: 'Step-by-step village market trip',
      items: [
        { id: 'basket', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Basket', name: 'Take Bamboo Basket', step: 1 },
        { id: 'walk', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Walk', name: 'Walk to Market', step: 2 },
        { id: 'fish', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', name: 'Choose Fresh Fish', step: 3 },
        { id: 'vegetables', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaves', name: 'Buy Green Leaves', step: 4 },
        { id: 'home', image: '/assets/images/house.jpg', name: 'Return Home', step: 5 },
      ],
    },
    {
      id: 'seq-bihu-5',
      title: 'Preparing for Rongali Bihu',
      description: 'Traditional steps to celebrate Rongali Bihu',
      items: [
        { id: 'clean', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sweep', name: 'Sweep Courtyard', step: 1 },
        { id: 'pitha', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pitha', name: 'Make Rice Pitha', step: 2 },
        { id: 'gamosa', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Gamosa', name: 'Wear New Gamosa', step: 3 },
        { id: 'dhol', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Dhol', name: 'Play Dhol Beats', step: 4 },
        { id: 'bless', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bless', name: 'Elders Blessing', step: 5 },
      ],
    },
  ],
  hard: [
    {
      id: 'seq-day-7',
      title: 'Full Day in the Assam Countryside',
      description: 'From dawn to peaceful nightfall',
      items: [
        { id: 'dawn', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Dawn', name: 'Rooster Crow at Dawn', step: 1 },
        { id: 'tea', image: '/assets/images/tea_cup.jpg', name: 'First Cup of Red Tea', step: 2 },
        { id: 'garden', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', name: 'Tend the Home Garden', step: 3 },
        { id: 'lunch', image: '/assets/images/rice.jpg', name: 'Warm Rice & Dhekia Xaak', step: 4 },
        { id: 'rest', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rest', name: 'Veranda Rest & Chat', step: 5 },
        { id: 'dusk', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', name: 'Light Tulsi Diya', step: 6 },
        { id: 'night', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Night', name: 'Sweet Restful Sleep', step: 7 },
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
      { id: 'act-1', title: 'Wake up with Morning Sun', timeLabel: '6:30 AM', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', order: 1, period: 'morning' },
      { id: 'act-2', title: 'Enjoy Warm Lal Saah (Red Tea)', timeLabel: '7:30 AM', image: '/assets/images/tea_cup.jpg', order: 2, period: 'morning' },
      { id: 'act-3', title: 'Gentle Walk in Courtyard', timeLabel: '9:00 AM', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Walk', order: 3, period: 'morning' },
      { id: 'act-4', title: 'Wholesome Lunch with Family', timeLabel: '1:00 PM', image: '/assets/images/rice.jpg', order: 4, period: 'afternoon' },
      { id: 'act-5', title: 'Quiet Afternoon Nap', timeLabel: '2:30 PM', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Nap', order: 5, period: 'afternoon' },
      { id: 'act-6', title: 'Evening Diya & Prayer', timeLabel: '6:00 PM', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', order: 6, period: 'evening' },
      { id: 'act-7', title: 'Light Dinner & Medicines', timeLabel: '8:00 PM', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Stew', order: 7, period: 'night' },
      { id: 'act-8', title: 'Relaxing Good Night Sleep', timeLabel: '9:30 PM', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Night', order: 8, period: 'night' },
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
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', '/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf'],
        ['/assets/images/house.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree'],
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', '/assets/images/rice.jpg'],
      ],
      sceneRight: [
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf'], // diff (0,1): 🍵 vs 🫖
        ['/assets/images/house.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', '/assets/images/bamboo.jpg'], // diff (1,2): 🌳 vs 🎋
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', '/assets/images/rice.jpg'], // diff (2,1): 🌧 vs ☀️
      ],
      differences: [
        { row: 0, col: 1, left: '/assets/images/tea_cup.jpg', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', hint: 'Look at the tea item in the top row' },
        { row: 1, col: 2, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', right: '/assets/images/bamboo.jpg', hint: 'Look at the plant on the right side' },
        { row: 2, col: 1, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', hint: 'Notice the weather in the bottom row' },
      ],
    },
    {
      id: 'diff-easy-2',
      title: 'Village Courtyard',
      gridRows: 3,
      gridCols: 3,
      sceneLeft: [
        ['/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus', '/assets/images/flower.jpg'],
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', '/assets/images/house.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock'],
        ['/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon'],
      ],
      sceneRight: [
        ['/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Daisy', '/assets/images/flower.jpg'], // diff (0,1): 🌺 vs 🌼
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rhino', '/assets/images/house.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock'], // diff (1,0): 🐘 vs 🦏
        ['/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Watermelon'], // diff (2,2): 🍋 vs 🍉
      ],
      differences: [
        { row: 0, col: 1, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Daisy', hint: 'Look at the flower in the middle of top row' },
        { row: 1, col: 0, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rhino', hint: 'Check the gentle animal on the left' },
        { row: 2, col: 2, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Watermelon', hint: 'Spot the fruit in the bottom right corner' },
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
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Music'],
        ['/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', '/assets/images/tea_cup.jpg', '/assets/images/house.jpg'],
        ['/assets/images/bamboo.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock'],
      ],
      sceneRight: [
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Candle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Music'], // diff (0,1)
        ['/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', '/assets/images/house.jpg'], // diff (1,2)
        ['/assets/images/bamboo.jpg', '/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Parrot'], // diff (2,1), diff (2,3)
        // plus 1 more:
      ],
      differences: [
        { row: 0, col: 1, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Candle', hint: 'Look closely at the ceremonial light' },
        { row: 1, col: 2, left: '/assets/images/tea_cup.jpg', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', hint: 'Notice the vessel in the center' },
        { row: 2, col: 1, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', right: '/assets/images/orange.jpg', hint: 'Check the citrus fruit' },
        { row: 2, col: 3, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Parrot', hint: 'Look at the bird on the bottom right' },
        { row: 0, col: 3, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Music', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Music', hint: 'Notice the musical symbol' },
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
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree'],
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Boat', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', '/assets/images/house.jpg'],
        ['/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon'],
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', '/assets/images/tea_cup.jpg', '/assets/images/bamboo.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut'],
      ],
      sceneRight: [
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pine'], // (0,0), (0,3)
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Boat', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish2', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', '/assets/images/house.jpg'], // (1,1)
        ['/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Daisy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', '/assets/images/orange.jpg'], // (2,1), (2,3)
        ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', '/assets/images/bamboo.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pineapple'], // (3,1), (3,3)
      ],
      differences: [
        { row: 0, col: 0, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', hint: 'Sky weather in top left' },
        { row: 0, col: 3, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pine', hint: 'Tree in top right' },
        { row: 1, col: 1, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish2', hint: 'Water fish in row 2' },
        { row: 2, col: 1, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Daisy', hint: 'Bright flower in row 3' },
        { row: 2, col: 3, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', right: '/assets/images/orange.jpg', hint: 'Fruit in row 3' },
        { row: 3, col: 1, left: '/assets/images/tea_cup.jpg', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', hint: 'Warm beverage utensil in bottom row' },
        { row: 3, col: 3, left: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut', right: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pineapple', hint: 'Tropical fruit at the bottom corner' },
      ],
    },
  ],
};

// Fix the right grid for medium 1 to match exactly 5 diffs
FIND_DIFFERENCE_SCENES.medium[0].sceneRight = [
  ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Candle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Music'], // diff (0,1), diff (0,3)
  ['/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', '/assets/images/house.jpg'], // diff (1,2)
  ['/assets/images/bamboo.jpg', '/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Parrot'], // diff (2,1), diff (2,3)
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
    image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant',
    correctName: 'Wild Elephant',
    options: ['Horse', 'Wild Elephant', 'Buffalo', 'Rhino'],
    hint: 'A majestic gentle giant found in Kaziranga National Park.',
    culturalFact: 'Elephants are revered and protected across the Brahmaputra valley.',
  },
  {
    id: 'rec-3',
    image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy',
    correctName: 'Paddy / Rice Field',
    options: ['Wheat Grass', 'Bamboo Grove', 'Paddy / Rice Field', 'Sugarcane'],
    hint: 'Golden crops harvested during Magh Bihu.',
    culturalFact: 'Rice is the heart and staple of traditional North-Eastern meals.',
  },
  {
    id: 'rec-4',
    image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya',
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
    image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock',
    correctName: 'Peacock (Mora)',
    options: ['Kingfisher', 'Parrot', 'Peacock (Mora)', 'Duck'],
    hint: 'A colourful bird that dances during the coming of sweet monsoon rains.',
    culturalFact: 'The peacock’s vibrant feathers are an emblem of beauty and joy.',
  },
  {
    id: 'rec-7',
    image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Boat',
    correctName: 'River Naao (Boat)',
    options: ['Bridge', 'River Naao (Boat)', 'Fishing Net', 'Water Wheel'],
    hint: 'Gently ferries people and goods across the mighty Brahmaputra river.',
    culturalFact: 'Boats link the river island of Majuli with Jorhat on the mainland.',
  },
  {
    id: 'rec-8',
    image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon',
    correctName: 'Kaji Nemu (Assam Lemon)',
    options: ['Orange', 'Kaji Nemu (Assam Lemon)', 'Green Guava', 'Amala'],
    hint: 'An oblong, highly fragrant citrus that brightens any fish curry.',
    culturalFact: 'Kaji Nemu has a Geographical Indication (GI) tag unique to Assam.',
  },
  {
    id: 'rec-9',
    image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish',
    correctName: 'Fresh River Fish',
    options: ['River Fish', 'River Turtle', 'Fresh Crab', 'Prawn'],
    hint: 'Caught fresh in local rivers and cooked with tender bamboo shoots.',
    culturalFact: 'Fish curry cooked with sour bamboo shoot is a cherished heritage dish.',
  },
  {
    id: 'rec-10',
    image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus',
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
      sequence: ['https://placehold.co/200x200/da4c31/da4c31.png', 'https://placehold.co/200x200/446e8c/446e8c.png', 'https://placehold.co/200x200/da4c31/da4c31.png', 'https://placehold.co/200x200/446e8c/446e8c.png', '?'],
      options: ['https://placehold.co/200x200/da4c31/da4c31.png', 'https://placehold.co/200x200/446e8c/446e8c.png', 'https://placehold.co/200x200/e49e37/e49e37.png', 'https://placehold.co/200x200/386f5c/386f5c.png'],
      correctAnswer: 'https://placehold.co/200x200/da4c31/da4c31.png',
      explanation: 'Red and blue alternate one after the other.',
    },
    {
      id: 'pat-e-2',
      sequence: ['/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', '/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', '?'],
      options: ['/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', '/assets/images/orange.jpg'],
      correctAnswer: '/assets/images/flower.jpg',
      explanation: 'Flower and leaf alternate: Flower, Leaf, Flower, Leaf, then Flower!',
    },
    {
      id: 'pat-e-3',
      sequence: ['/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', '/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', '?'],
      options: ['/assets/images/rice.jpg', '/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon'],
      correctAnswer: '/assets/images/tea_cup.jpg',
      explanation: 'Tea cup follows teapot every time.',
    },
    {
      id: 'pat-e-4',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lightning', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Night'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun',
      explanation: 'Sun follows rain in this pleasant weather pattern.',
    },
    {
      id: 'pat-e-5',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Deer'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant',
      explanation: 'Elephant alternates with Peacock.',
    },
    {
      id: 'pat-e-6',
      sequence: ['https://placehold.co/200x200/e49e37/e49e37.png', 'https://placehold.co/200x200/386f5c/386f5c.png', 'https://placehold.co/200x200/e49e37/e49e37.png', 'https://placehold.co/200x200/386f5c/386f5c.png', '?'],
      options: ['https://placehold.co/200x200/386f5c/386f5c.png', 'https://placehold.co/200x200/e49e37/e49e37.png', 'https://placehold.co/200x200/da4c31/da4c31.png', 'https://placehold.co/200x200/446e8c/446e8c.png'],
      correctAnswer: 'https://placehold.co/200x200/e49e37/e49e37.png',
      explanation: 'Yellow comes next after green.',
    },
    {
      id: 'pat-e-7',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Candle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Candle', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Candle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sparkle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya',
      explanation: 'Diya comes back after candle.',
    },
    {
      id: 'pat-e-8',
      sequence: ['/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', '/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', '/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Banana'],
      correctAnswer: '/assets/images/orange.jpg',
      explanation: 'Orange follows lemon.',
    },
    {
      id: 'pat-e-9',
      sequence: ['/assets/images/house.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', '/assets/images/house.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', '?'],
      options: ['/assets/images/house.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', '/assets/images/bamboo.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy'],
      correctAnswer: '/assets/images/house.jpg',
      explanation: 'Home comes after tree.',
    },
    {
      id: 'pat-e-10',
      sequence: ['/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', '/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', '?'],
      options: ['/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', '/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf'],
      correctAnswer: '/assets/images/rice.jpg',
      explanation: 'Rice comes after fish in our lunch rhythm.',
    },
  ],
  medium: [
    {
      id: 'pat-m-1',
      sequence: ['https://placehold.co/200x200/da4c31/da4c31.png', 'https://placehold.co/200x200/446e8c/446e8c.png', 'https://placehold.co/200x200/386f5c/386f5c.png', 'https://placehold.co/200x200/da4c31/da4c31.png', 'https://placehold.co/200x200/446e8c/446e8c.png', '?'],
      options: ['https://placehold.co/200x200/da4c31/da4c31.png', 'https://placehold.co/200x200/446e8c/446e8c.png', 'https://placehold.co/200x200/386f5c/386f5c.png', 'https://placehold.co/200x200/e49e37/e49e37.png'],
      correctAnswer: 'https://placehold.co/200x200/386f5c/386f5c.png',
      explanation: 'Three color cycle: Red, Blue, Green repeated.',
    },
    {
      id: 'pat-m-2',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Seed', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Seed', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Seed', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fall'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree',
      explanation: 'Sprout, Leaves, then Tree.',
    },
    {
      id: 'pat-m-3',
      sequence: ['/assets/images/tea_cup.jpg', '/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', '/assets/images/tea_cup.jpg', '/assets/images/tea_cup.jpg', '?'],
      options: ['/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', '🍶'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot',
      explanation: 'Two cups, then one teapot: Cup, Cup, Teapot.',
    },
    {
      id: 'pat-m-4',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rainbow', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Night'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain',
      explanation: 'Two suns followed by rain.',
    },
    {
      id: 'pat-m-5',
      sequence: ['/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Daisy', '/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus', '?'],
      options: ['/assets/images/flower.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Daisy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Daisy',
      explanation: 'Three flowers repeat: Cherry, Hibiscus, Daisy.',
    },
    {
      id: 'pat-m-6',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Deer', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Parrot'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock',
      explanation: 'Two elephants then one peacock.',
    },
    {
      id: 'pat-m-7',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', '/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Stew', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', '/assets/images/rice.jpg', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Stew', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', '/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bowl'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Stew',
      explanation: 'Paddy becomes rice, rice becomes warm food.',
    },
    {
      id: 'pat-m-8',
      sequence: ['https://placehold.co/200x200/da4c31/da4c31.png?text=^', 'https://placehold.co/200x200/446e8c/446e8c.png?text=<>', 'https://placehold.co/200x200/e49e37/e49e37.png?text=<>', 'https://placehold.co/200x200/da4c31/da4c31.png?text=^', 'https://placehold.co/200x200/446e8c/446e8c.png?text=<>', '?'],
      options: ['https://placehold.co/200x200/da4c31/da4c31.png?text=^', 'https://placehold.co/200x200/446e8c/446e8c.png?text=<>', 'https://placehold.co/200x200/e49e37/e49e37.png?text=<>', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=*'],
      correctAnswer: 'https://placehold.co/200x200/e49e37/e49e37.png?text=<>',
      explanation: 'Triangle, Blue Diamond, Orange Diamond.',
    },
    {
      id: 'pat-m-9',
      sequence: ['/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut', '/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut', '/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Watermelon'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut',
      explanation: 'Orange, Lemon, then Coconut completes the fruit triad.',
    },
    {
      id: 'pat-m-10',
      sequence: ['/assets/images/bamboo.jpg', '/assets/images/bamboo.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', '/assets/images/bamboo.jpg', '/assets/images/bamboo.jpg', '?'],
      options: ['/assets/images/bamboo.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf',
      explanation: 'Two bamboos then one leaf.',
    },
  ],
  hard: [
    {
      id: 'pat-h-1',
      sequence: ['https://placehold.co/200x200/da4c31/da4c31.png', 'https://placehold.co/200x200/da4c31/da4c31.png?text=^', 'https://placehold.co/200x200/446e8c/446e8c.png', 'https://placehold.co/200x200/446e8c/446e8c.png?text=<>', 'https://placehold.co/200x200/386f5c/386f5c.png', '?'],
      options: ['https://placehold.co/200x200/386f5c/386f5c.png', 'https://placehold.co/200x200/386f5c/386f5c.png', 'https://placehold.co/200x200/da4c31/da4c31.png', 'https://placehold.co/200x200/e49e37/e49e37.png'],
      correctAnswer: 'https://placehold.co/200x200/386f5c/386f5c.png',
      explanation: 'Color circle is paired with its shape match: Red circle/triangle, Blue circle/diamond, Green circle/green square.',
    },
    {
      id: 'pat-h-2',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=1', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=2', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=3', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=1', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=2', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=1', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=3', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=4', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=2'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=3',
      explanation: 'Numbers 1, 2, 3 cycle continually.',
    },
    {
      id: 'pat-h-3',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Dawn', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sunset', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Night', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Dawn', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sunset', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Night', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=*'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sunset',
      explanation: 'Cycle of the day: Dawn, Midday, Sunset, Night.',
    },
    {
      id: 'pat-h-4',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Seed', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', '/assets/images/flower.jpg', '/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Seed', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', '/assets/images/flower.jpg', '?'],
      options: ['/assets/images/orange.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Seed', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree'],
      correctAnswer: '/assets/images/orange.jpg',
      explanation: 'Plant growth cycle: Sprout, Leaf, Flower, Fruit.',
    },
    {
      id: 'pat-h-5',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=*', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=**', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=*', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=**', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=*', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=*', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=**', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sparkle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=***'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=**',
      explanation: 'One star, then two stars, alternating.',
    },
    {
      id: 'pat-h-6',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sparkle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sparkle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sparkle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Candle', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya',
      explanation: 'Two diyas followed by sparkles.',
    },
    {
      id: 'pat-h-7',
      sequence: ['/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coffee', '/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coffee', '/assets/images/tea_cup.jpg', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coffee', '/assets/images/tea_cup.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Milk', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coffee',
      explanation: 'Green cup and brown cup alternate.',
    },
    {
      id: 'pat-h-8',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Wave', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Wave', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Boat', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Shell'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Wave',
      explanation: 'Two fish swimming, then one river wave.',
    },
    {
      id: 'pat-h-9',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', '/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', '?'],
      options: ['/assets/images/rice.jpg', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bowl', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy'],
      correctAnswer: '/assets/images/rice.jpg',
      explanation: 'Three stalks of paddy yield one bowl of rice.',
    },
    {
      id: 'pat-h-10',
      sequence: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rainbow', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', '?'],
      options: ['https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rainbow', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lightning'],
      correctAnswer: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rainbow',
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
        { id: '3', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', name: 'Lemon', isTarget: true },
        { id: '4', image: '/assets/images/tea_cup.jpg', name: 'Tea Cup', isTarget: false },
        { id: '5', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut', name: 'Coconut', isTarget: true },
        { id: '6', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy', name: 'Paddy', isTarget: false },
        { id: '7', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Banana', name: 'Banana', isTarget: true },
        { id: '8', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', name: 'Elephant', isTarget: false },
        { id: '9', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Apple', name: 'Apple', isTarget: true },
      ],
    },
    {
      id: 'att-e-2',
      instruction: 'Tap all the Flowers 🌸 🌺',
      targetCategory: 'flowers',
      ruleDescription: 'Find all blooming flowers',
      gridItems: [
        { id: '1', image: '/assets/images/flower.jpg', name: 'Pink Flower', isTarget: true },
        { id: '2', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', name: 'Fish', isTarget: false },
        { id: '3', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus', name: 'Hibiscus', isTarget: true },
        { id: '4', image: '/assets/images/bamboo.jpg', name: 'Bamboo', isTarget: false },
        { id: '5', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Daisy', name: 'Daisy', isTarget: true },
        { id: '6', image: '/assets/images/rice.jpg', name: 'Rice', isTarget: false },
        { id: '7', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sunflower', name: 'Sunflower', isTarget: true },
        { id: '8', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', name: 'Diya', isTarget: false },
        { id: '9', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tulip', name: 'Tulip', isTarget: true },
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
        { id: '1', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', name: 'Elephant', isTarget: true },
        { id: '2', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf', name: 'Tea Leaf', isTarget: false },
        { id: '3', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', name: 'Peacock', isTarget: true },
        { id: '4', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', name: 'Teapot', isTarget: false },
        { id: '5', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Deer', name: 'Deer', isTarget: true },
        { id: '6', image: '/assets/images/orange.jpg', name: 'Orange', isTarget: false },
        { id: '7', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', name: 'Fish', isTarget: true },
        { id: '8', image: '/assets/images/house.jpg', name: 'House', isTarget: false },
        { id: '9', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bird', name: 'Bird', isTarget: true },
        { id: '10', image: '/assets/images/rice.jpg', name: 'Rice', isTarget: false },
        { id: '11', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Butterfly', name: 'Butterfly', isTarget: true },
        { id: '12', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', name: 'Rain', isTarget: false },
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
        { id: '2', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant', name: 'Elephant', isTarget: false },
        { id: '3', image: '/assets/images/rice.jpg', name: 'Rice', isTarget: true },
        { id: '4', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock', name: 'Peacock', isTarget: false },
        { id: '5', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot', name: 'Teapot', isTarget: true },
        { id: '6', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree', name: 'Tree', isTarget: false },
        { id: '7', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon', name: 'Lemon', isTarget: true },
        { id: '8', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', name: 'Cloud', isTarget: false },
        { id: '9', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish', name: 'Fish', isTarget: true },
        { id: '10', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Boat', name: 'Boat', isTarget: false },
        { id: '11', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut', name: 'Coconut', isTarget: true },
        { id: '12', image: '/assets/images/bamboo.jpg', name: 'Bamboo', isTarget: false },
        { id: '13', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Stew', name: 'Stew Pot', isTarget: true },
        { id: '14', image: '/assets/images/house.jpg', name: 'Cottage', isTarget: false },
        { id: '15', image: '/assets/images/orange.jpg', name: 'Orange', isTarget: true },
        { id: '16', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya', name: 'Diya', isTarget: false },
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
      { id: 'rain', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain', label: 'Rain Shower', isCorrect: true },
      { id: 'sun', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun', label: 'Bright Sunshine', isCorrect: false },
      { id: 'fire', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fire', label: 'Campfire', isCorrect: false },
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
      { id: 'drum', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Dhol', label: 'Bihu Dhol', isCorrect: false },
      { id: 'bell', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bell', label: 'Temple Bell', isCorrect: true },
      { id: 'whistle', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Train', label: 'Train Whistle', isCorrect: false },
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
      { id: 'bird', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bird', label: 'Singing Bird', isCorrect: true },
      { id: 'frog', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Frog', label: 'Croaking Frog', isCorrect: false },
      { id: 'cow', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Cow', label: 'Cow Mooing', isCorrect: false },
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
      { id: 'car', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Car', label: 'Car Horn', isCorrect: false },
      { id: 'thunder', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lightning', label: 'Thunder Clap', isCorrect: false },
      { id: 'flute', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Flute', label: 'Bamboo Flute', isCorrect: true },
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
      { id: 'river', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Wave', label: 'River Waves', isCorrect: true },
      { id: 'clock', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Clock', label: 'Clock Ticking', isCorrect: false },
      { id: 'fan', image: 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fan', label: 'Paper Fan', isCorrect: false },
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

