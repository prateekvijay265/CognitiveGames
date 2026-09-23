import os
import re

games_dir = "client/src/features/games"

def add_translation_hook(content):
    if "useTranslation" not in content:
        content = content.replace("import React, { useState", "import React, { useState")
        content = re.sub(r"(import React.*?from 'react';)", r"\1\nimport { useTranslation } from 'react-i18next';", content)
    
    # Inject const { t } = useTranslation(); inside the component
    # We need to find the main component declaration
    # e.g., export const RememberObjects: React.FC<...> = ({ ... }) => {
    # Let's just find `}) => {\n` and append
    if "const { t } = useTranslation();" not in content:
        content = content.replace("}) => {\n", "}) => {\n  const { t } = useTranslation();\n")
    return content


# 1. RememberObjects
file_path = os.path.join(games_dir, "RememberObjects", "RememberObjects.tsx")
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        c = f.read()
    c = add_translation_hook(c)
    c = c.replace(">Good Recall!</h3>", ">{t('game_ui.good_recall', 'Good Recall!')}</h3>")
    c = c.replace(">Here are the original items from this round:</p>", ">{t('game_ui.original_items', 'Here are the original items from this round:')}</p>")
    c = c.replace("Confirm Choices", "{t('game_ui.confirm_choices', 'Confirm Choices')}")
    c = c.replace("'o\" Remembered'", "t('game_ui.remembered', 'Remembered')")
    c = c.replace("'-< Missed'", "t('game_ui.missed', 'Missed')")
    c = c.replace("? 'Next Round' : 'See Results'", "? t('game_ui.next_round', 'Next Round') : t('game_ui.see_results', 'See Results')")
    c = c.replace("Round {currentRound} of {totalRounds}", "{t('arcade.round', 'Round')} {currentRound} {t('arcade.of', 'of')} {totalRounds}")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(c)


# 2. SequenceMemory
file_path = os.path.join(games_dir, "SequenceMemory", "SequenceMemory.tsx")
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        c = f.read()
    c = add_translation_hook(c)
    c = c.replace("Level {level}", "{t('game_ui.level', 'Level')} {level}")
    c = c.replace("Watch the sequence...", "{t('game_ui.watch_sequence', 'Watch the sequence...')}")
    c = c.replace("Now your turn!", "{t('game_ui.your_turn', 'Now your turn!')}")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(c)


# 3. MemoryMatch
file_path = os.path.join(games_dir, "MemoryMatch", "MemoryMatch.tsx")
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        c = f.read()
    c = add_translation_hook(c)
    c = c.replace(">MOVES<", ">{t('game_ui.moves', 'MOVES')}<")
    c = c.replace(">PAIRS<", ">{t('game_ui.pairs', 'PAIRS')}<")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(c)


# 4. SortMyDay
file_path = os.path.join(games_dir, "SortMyDay", "SortMyDay.tsx")
if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        c = f.read()
    c = add_translation_hook(c)
    c = c.replace(">Morning<", ">{t('game_ui.morning', 'Morning')}<")
    c = c.replace(">Afternoon<", ">{t('game_ui.afternoon', 'Afternoon')}<")
    c = c.replace(">Evening<", ">{t('game_ui.evening', 'Evening')}<")
    c = c.replace(">Night<", ">{t('game_ui.night', 'Night')}<")
    c = c.replace("Confirm Choices", "{t('game_ui.confirm_choices', 'Confirm Choices')}")
    c = c.replace("? 'Next Round' : 'See Results'", "? t('game_ui.next_round', 'Next Round') : t('game_ui.see_results', 'See Results')")
    c = c.replace("Round {currentRound} of {totalRounds}", "{t('arcade.round', 'Round')} {currentRound} {t('arcade.of', 'of')} {totalRounds}")
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(c)

print("Game components patched successfully.")
