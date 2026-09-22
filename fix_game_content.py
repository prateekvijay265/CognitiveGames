import os
import re

def fix_game_content():
    path = "client/src/data/gameContent.ts"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    def replacer(match):
        text = match.group(1).lower().replace(" ", "")
        if text == "^": text = "up"
        if text == "<>": text = "arrows"
        if text == "*": text = "star"
        if text == "**": text = "stars"
        if text == "***": text = "stars"
        if text == "": text = "pattern"
        return f"https://loremflickr.com/200/200/{text}"

    content = re.sub(r"https://placehold\.co/[^?]+\?text=([^'\"]+)", replacer, content)
    content = re.sub(r"https://placehold\.co/200x200/da4c31/da4c31\.png", "https://loremflickr.com/200/200/red", content)
    content = re.sub(r"https://placehold\.co/200x200/446e8c/446e8c\.png", "https://loremflickr.com/200/200/blue", content)
    content = re.sub(r"https://placehold\.co/200x200/386f5c/386f5c\.png", "https://loremflickr.com/200/200/green", content)
    content = re.sub(r"https://placehold\.co/200x200/e49e37/e49e37\.png", "https://loremflickr.com/200/200/yellow", content)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

fix_game_content()
print("Done fixing gameContent.ts")
