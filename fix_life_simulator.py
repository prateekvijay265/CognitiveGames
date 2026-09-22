import os
import re

def fix_life_simulator():
    context_path = "client/src/components/games/LifeSimulator/LifeSimulatorContext.tsx"
    with open(context_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Change emoji: string; to image: string;
    content = content.replace("emoji: string;", "image: string;")

    # Find blocks of decorations and replace emoji with image based on name
    def decoration_replacer(match):
        name = match.group(1)
        # get the last word of the name as keyword
        keyword = name.split()[-1].lower()
        if not keyword.isalpha():
            keyword = name.split()[0].lower()
        rest = match.group(2)
        # Replace emoji line inside rest
        rest = re.sub(r"emoji:\s*'[^']+',", f"image: 'https://loremflickr.com/100/100/{keyword}',", rest)
        return f"name: '{name}',{rest}"

    content = re.sub(r"name:\s*'([^']+)',(.*?)emoji:\s*'[^']+',", decoration_replacer, content, flags=re.DOTALL)
    
    # Just a fallback if any emoji is left
    content = re.sub(r"emoji:\s*'[^']+',", "image: 'https://loremflickr.com/100/100/nature',", content)

    with open(context_path, "w", encoding="utf-8") as f:
        f.write(content)

    # Now for SajawatModal.tsx
    modal_path = "client/src/components/games/LifeSimulator/shop/SajawatModal.tsx"
    with open(modal_path, "r", encoding="utf-8") as f:
        modal_content = f.read()
    
    modal_content = modal_content.replace("{item.emoji}", "")
    modal_content = re.sub(r"<span className=\"text-4xl sm:text-5xl\"></span>", r"<img src={item.image} alt={item.name} className=\"w-12 h-12 object-cover border-2 border-amber-900/20 rounded-md\" />", modal_content)
    
    with open(modal_path, "w", encoding="utf-8") as f:
        f.write(modal_content)
    
    # Now for PhoolSortingTask.tsx
    phool_path = "client/src/components/games/LifeSimulator/tasks/PhoolSortingTask.tsx"
    with open(phool_path, "r", encoding="utf-8") as f:
        phool = f.read()
    
    phool = phool.replace("emoji: string;", "image: string;")
    phool = phool.replace("targetEmoji: '🌹'", "targetImage: 'https://loremflickr.com/100/100/rose'")
    phool = phool.replace("targetEmoji: '🌼'", "targetImage: 'https://loremflickr.com/100/100/marigold'")
    phool = phool.replace("targetEmoji: '🌸'", "targetImage: 'https://loremflickr.com/100/100/jasmine'")
    
    # Replace emojis in flower definitions
    phool = phool.replace("emoji: '🌹'", "image: 'https://loremflickr.com/100/100/rose'")
    phool = phool.replace("emoji: '🌼'", "image: 'https://loremflickr.com/100/100/marigold'")
    phool = phool.replace("emoji: '🌸'", "image: 'https://loremflickr.com/100/100/jasmine'")
    phool = phool.replace("emoji: '🧺'", "image: 'https://loremflickr.com/100/100/basket'")
    
    # Replace rendering spans
    phool = re.sub(r"<span className=\"text-3xl\">\{flower\.emoji\}</span>", r"<img src={flower.image} className=\"w-12 h-12 object-cover\" />", phool)
    phool = re.sub(r"<span className=\"text-3xl block mb-1\">\{b\.emoji\}</span>", r"<img src={b.image} className=\"w-12 h-12 object-cover block mb-1 mx-auto\" />", phool)
    phool = phool.replace("{flower.emoji}", "<img src={flower.image} className=\"w-8 h-8 object-cover mx-auto\" />")
    phool = phool.replace("{f.emoji}", "<img src={f.image} className=\"w-8 h-8 object-cover\" />")

    with open(phool_path, "w", encoding="utf-8") as f:
        f.write(phool)

fix_life_simulator()
print("Done fixing LifeSimulator files")
