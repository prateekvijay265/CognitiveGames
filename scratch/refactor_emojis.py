import os
import re

DATA_FILE = r"C:\Users\atiwa\Downloads\CognitiveGames-main\CognitiveGames-main\client\src\data\gameContent.ts"
GAMES_DIR = r"C:\Users\atiwa\Downloads\CognitiveGames-main\CognitiveGames-main\client\src\features\games"

emoji_to_image = {
    '🍵': '/assets/images/tea_cup.jpg',
    '🎋': '/assets/images/bamboo.jpg',
    '🍊': '/assets/images/orange.jpg',
    '🍚': '/assets/images/rice.jpg',
    '🌸': '/assets/images/flower.jpg',
    '🏡': '/assets/images/house.jpg',
    '🌧': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rain',
    '🐘': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Elephant',
    '🦚': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Peacock',
    '🌿': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaf',
    '🍋': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lemon',
    '🫖': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Teapot',
    '🌾': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Paddy',
    '🌳': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tree',
    '🐟': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish',
    '🪔': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Diya',
    '🌺': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hibiscus',
    '🥥': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coconut',
    '🌽': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Maize',
    '🎵': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Music',
    '☂️': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Umbrella',
    '🔔': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bell',
    '👒': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Hat',
    '🏮': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lantern',
    '🛶': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Boat',
    '🏺': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pot',
    '🥭': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Mango',
    '🍌': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Banana',
    '🦌': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Deer',
    '🪭': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fan',
    '🐦': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bird',
    '🦋': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Butterfly',
    '🎸': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Guitar',
    '🍎': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Apple',
    '☀️': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sun',
    '⏰': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Clock',
    '🌱': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Seed',
    '🚿': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Wash',
    '🧺': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Basket',
    '🚶': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Walk',
    '🥬': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Leaves',
    '🧹': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sweep',
    '🥟': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pitha',
    '🧣': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Gamosa',
    '🥁': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Dhol',
    '🙏': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bless',
    '🌅': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Dawn',
    '🪑': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rest',
    '🌙': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Night',
    '🛏️': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Nap',
    '🍲': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Stew',
    '🌼': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Daisy',
    '🦏': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rhino',
    '🍉': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Watermelon',
    '🕯️': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Candle',
    '🦜': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Parrot',
    '🎶': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Music',
    '🌲': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pine',
    '🐠': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fish2',
    '🍍': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Pineapple',
    '🔴': 'https://placehold.co/200x200/da4c31/da4c31.png',
    '🔵': 'https://placehold.co/200x200/446e8c/446e8c.png',
    '🟢': 'https://placehold.co/200x200/386f5c/386f5c.png',
    '🟡': 'https://placehold.co/200x200/e49e37/e49e37.png',
    '🔺': 'https://placehold.co/200x200/da4c31/da4c31.png?text=^',
    '🔷': 'https://placehold.co/200x200/446e8c/446e8c.png?text=<>',
    '🔶': 'https://placehold.co/200x200/e49e37/e49e37.png?text=<>',
    '⭐': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=*',
    '⭐⭐': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=**',
    '⭐⭐⭐': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=***',
    '✨': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sparkle',
    '☕': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Coffee',
    '🥛': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Milk',
    '🌊': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Wave',
    '🐚': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Shell',
    '🥣': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Bowl',
    '🌈': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Rainbow',
    '⚡': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Lightning',
    '🌻': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sunflower',
    '🌷': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Tulip',
    '🚗': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Car',
    '🪈': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Flute',
    '🚂': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Train',
    '🐸': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Frog',
    '🐄': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Cow',
    '🔥': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fire',
    '🌇': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Sunset',
    '🍂': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=Fall',
    '1️⃣': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=1',
    '2️⃣': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=2',
    '3️⃣': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=3',
    '4️⃣': 'https://placehold.co/200x200/e8e3d8/1a1918.png?text=4',
    '🟩': 'https://placehold.co/200x200/386f5c/386f5c.png',
}

def replace_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change emoji: '...' to image: '...' in interfaces
    content = content.replace("emoji: string;", "image: string;")
    
    # Replace the actual values in arrays
    for emoji_char, img_url in emoji_to_image.items():
        content = content.replace(f"'{emoji_char}'", f"'{img_url}'")
        content = content.replace(f'"{emoji_char}"', f"'{img_url}'")

    # Specifically for PatternQuestions sequence and options arrays which are just arrays of strings
    # We replaced the values, so that's covered.

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Update gameContent.ts
replace_in_file(DATA_FILE)

# Now update the components that use .emoji to use .image
# And change <span>{something.emoji}</span> to <img src={something.image} />
import glob

components = glob.glob(os.path.join(GAMES_DIR, '**', '*.tsx'), recursive=True)

for comp in components:
    with open(comp, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Simple replaces for properties
    content = content.replace(".emoji", ".image")
    content = content.replace("emoji:", "image:")
    
    # Replace spans with emojis to images
    # e.g. <span className="text-3xl sm:text-4xl mb-1">{card.emoji}</span> -> <img src={card.image} className="w-12 h-12 object-cover mb-1 border-2 border-ink" />
    content = re.sub(r'<span[^>]*>\{([a-zA-Z0-9_\.]+)\.image\}</span>', r'<img src={\1.image} className="w-12 h-12 object-cover border-2 border-ink mb-2" />', content)
    
    # Some arrays in Pattern builder might just be strings
    content = re.sub(r'<span[^>]*>\{(item|opt|seq)\}</span>', r'<img src={\1} className="w-12 h-12 object-cover border-2 border-ink" />', content)
    
    # Attention tap items
    content = re.sub(r'<span[^>]*>\{item\.image\}</span>', r'<img src={item.image} className="w-16 h-16 object-cover border-2 border-ink" />', content)

    # Some are generic
    content = re.sub(r'<span className="text-[^"]+">\{([a-zA-Z0-9_\.]+)\}</span>', r'<img src={\1} className="w-12 h-12 object-cover border-2 border-ink" />', content)

    # Sequence Memory
    content = re.sub(r'<span className="text-5xl sm:text-7xl drop-shadow-md">\{([a-zA-Z0-9_\.]+)\}</span>', r'<img src={\1} className="w-24 h-24 object-cover border-[3px] border-ink" />', content)
    
    with open(comp, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done replacing emojis with images!")
