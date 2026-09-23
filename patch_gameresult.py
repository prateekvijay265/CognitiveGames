import os

file_path = "client/src/features/games/GameEngine.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add translation hook if GameResult doesn't have it
if "const { t } = useTranslation();" not in content.split("export const GameResult")[1]:
    content = content.replace(
        "export const GameResult: React.FC<GameResultProps> = ({\n  session,\n  adaptiveFeedback,\n  onPlayAgain,\n  onExit,\n}) => {",
        "export const GameResult: React.FC<GameResultProps> = ({\n  session,\n  adaptiveFeedback,\n  onPlayAgain,\n  onExit,\n}) => {\n  const { t } = useTranslation();"
    )

content = content.replace(">Nice try!<", ">{t('arcade.game_over', 'Nice try!')}<")
content = content.replace(">You completed the activity.<", ">{t('arcade.game_over_desc', 'You completed the activity.')}<")
content = content.replace(">Score<", ">{t('arcade.score', 'Score')}<")
content = content.replace(">Time<", ">{t('arcade.time', 'Time')}<")
content = content.replace(">Accuracy<", ">{t('arcade.accuracy', 'Accuracy')}<")
content = content.replace("Play Again", "{t('arcade.play_again', 'Play Again')}")
content = content.replace("Return to Activities", "{t('arcade.home', 'Return to Activities')}")

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
