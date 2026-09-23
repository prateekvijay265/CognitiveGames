import os

games_dir = "client/src/features/games"

def patch_item_name(filepath):
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            c = f.read()
        if "useTranslation" not in c:
            c = c.replace("import React,", "import React,\nimport { useTranslation } from 'react-i18next';\n")
        # Just safely replace `{item.name}` with `{t('game_items.' + item.id, item.name)}`
        c = c.replace("{item.name}", "{t('game_items.' + item.id, item.name)}")
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(c)

patch_item_name(os.path.join(games_dir, "RememberObjects", "RememberObjects.tsx"))
patch_item_name(os.path.join(games_dir, "ObjectRecognition", "ObjectRecognition.tsx"))

print("Item names patched.")
