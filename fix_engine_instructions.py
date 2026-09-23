import re

with open("client/src/features/games/GameEngine.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add useTranslation to useGameSession
old_useGameSession = """export const useGameSession = ({
  gameId,
  patientId,
  difficulty,
  language = 'en',
  cognitiveDomain,
  instructions,
  totalQuestions,
  onComplete,
  onExit,
}: GameEngineConfig) => {"""

new_useGameSession = """export const useGameSession = ({
  gameId,
  patientId,
  difficulty,
  language = 'en',
  cognitiveDomain,
  instructions,
  totalQuestions,
  onComplete,
  onExit,
}: GameEngineConfig) => {
  const { t } = useTranslation();
  const translatedInstructions = gameId ? t(`game_instructions.${gameId.replace('-', '_')}`, instructions) : instructions;"""

content = content.replace(old_useGameSession, new_useGameSession)

# Update speakInstructions
old_speakInstructions = """  const speakInstructions = useCallback(() => {
    speakText(instructions);
  }, [speakText, instructions]);"""

new_speakInstructions = """  const speakInstructions = useCallback(() => {
    speakText(translatedInstructions);
  }, [speakText, translatedInstructions]);"""

content = content.replace(old_speakInstructions, new_speakInstructions)

# Update GameLayout instructions
old_layout_render = """  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[#FDFBF7] z-[-2]"></div>"""

new_layout_render = """  const translatedInstructions = gameId ? t(`game_instructions.${gameId.replace('-', '_')}`, instructions) : instructions;

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[#FDFBF7] z-[-2]"></div>"""

content = content.replace(old_layout_render, new_layout_render)

# Replace instances of `instructions` with `translatedInstructions` in GameLayout's JSX
old_layout_inst = """<p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base mb-6 leading-relaxed">
              {instructions}
            </p>"""
new_layout_inst = """<p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base mb-6 leading-relaxed">
              {translatedInstructions}
            </p>"""
content = content.replace(old_layout_inst, new_layout_inst)

with open("client/src/features/games/GameEngine.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("GameEngine instructions translation added.")
