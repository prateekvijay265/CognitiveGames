import re

with open("client/src/index.css", "r", encoding="utf-8") as f:
    css = f.read()

# 1. Add missing colors to @theme block
missing_colors = """  --color-felt: #14342b;
  --color-feltink: #0d241e;
  --color-kraft: #e7dcc6;
  --color-kraft2: #d8caae;
  --color-vermilion: #e0451f;
  --color-ochre: #d99a2b;
  --color-sand: #675b4c;"""

if "--color-felt" not in css:
    css = re.sub(r"(@theme\s*\{)", r"\1\n" + missing_colors, css)

# 2. Append the game specific css blocks
with open("games_index.css", "r", encoding="utf-16") as f:
    old_css = f.read()

# Extract from /* ---------- typography helpers ---------- */ to the end
idx = old_css.find("/* ---------- typography helpers ---------- */")
if idx != -1:
    game_css = old_css[idx:]
    if "/* ---------- pieces ---------- */" not in css:
        css += "\n\n" + game_css

with open("client/src/index.css", "w", encoding="utf-8") as f:
    f.write(css)

print("Patched index.css")
