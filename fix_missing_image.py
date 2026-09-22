import re

filepath = "client/src/components/games/LifeSimulator/LifeSimulatorContext.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Add image property right after cost property
content = re.sub(r'(cost:\s*\d+,)', r'\1\n    image: "https://loremflickr.com/100/100/nature",', content)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
