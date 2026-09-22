import os
import re

components = [
    "client/src/features/games/PatternBuilder/PatternBuilder.tsx",
    "client/src/features/games/SequenceMemory/SequenceMemory.tsx",
    "client/src/features/games/SortMyDay/SortMyDay.tsx",
    "client/src/features/games/AttentionTap/AttentionTap.tsx"
]

for filepath in components:
    if not os.path.exists(filepath): continue
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    if "PatternBuilder" in filepath:
        content = re.sub(r'\{isMissingItem && showFeedback \? currentPattern\.correctAnswer : symbol\}', 
                         r'{isMissingItem && showFeedback ? <img src={currentPattern.correctAnswer} className="w-10 h-10 object-cover" /> : symbol === "?" ? "?" : <img src={symbol} className="w-10 h-10 object-cover" />}', content)
        content = re.sub(r'>\s*\{option\}\s*</button>', 
                         r'> {option.startswith("http") || option.startswith("/") ? <img src={option} className="w-12 h-12 object-cover" /> : option} </button>', content)
                         
    elif "SequenceMemory" in filepath:
        # Check if already has img tag
        if '<img' not in content:
            content = re.sub(r'<span className="text-5xl sm:text-7xl drop-shadow-md">\s*\{item\}\s*</span>', 
                             r'<img src={item} className="w-24 h-24 object-cover border-[3px] border-ink" />', content)

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Fixed components")
