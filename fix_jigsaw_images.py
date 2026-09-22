import re

with open("client/src/features/games/JigsawGame.tsx", "r", encoding="utf-8") as f:
    content = f.read()

new_images = """const IMAGES = [
  { id: 'train', src: '/images/train.jpg', name: 'Steam Train' },
  { id: 'garden', src: '/images/garden.jpg', name: 'Flower Garden' },
  { id: 'market', src: '/images/market.jpg', name: 'Street Market' },
  { id: 'harbor', src: '/images/harbor.jpg', name: 'Fishing Harbor' },
  { id: 'lighthouse', src: '/images/lighthouse.jpg', name: 'Lighthouse' },
  { id: 'snowcabin', src: '/images/snowcabin.jpg', name: 'Snow Cabin' },
  { id: 'desert', src: '/images/desert.jpg', name: 'Desert Oasis' },
  { id: 'vineyard', src: '/images/vineyard.jpg', name: 'Vineyard' }
];"""

content = re.sub(r"const IMAGES = \[.*?\];", new_images, content, flags=re.DOTALL)

# Change sizing to make it bigger
content = content.replace("max-h-[55vh] max-w-[700px]", "max-h-[72vh] max-w-[950px]")
content = content.replace("max-w-3xl", "max-w-5xl")

# Preload images
preload_code = """
  // Preload images for faster loading
  useEffect(() => {
    IMAGES.forEach(img => {
      const imgEl = new Image();
      imgEl.src = img.src;
    });
  }, []);
"""

content = re.sub(r"(const sessionEngine = useGameSession\(\{.*?\}\);)", r"\1\n" + preload_code, content, flags=re.DOTALL)

# Decrease timeout from 2000 to 1000
content = content.replace("}, 2000);", "}, 1000);")

with open("client/src/features/games/JigsawGame.tsx", "w", encoding="utf-8") as f:
    f.write(content)
