import re

with open("client/src/features/games/GameEngine.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace voice selection
old_voice = """        // Select voice based on language if available
        const voices = window.speechSynthesis.getVoices();
        if (language === 'hi') {
          const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
          if (hiVoice) utterance.voice = hiVoice;
        } else {
          const enVoice = voices.find((v) => v.lang.startsWith('en-IN') || v.lang.startsWith('en'));
          if (enVoice) utterance.voice = enVoice;
        }"""

new_voice = """        // Select voice based on language if available
        const voices = window.speechSynthesis.getVoices();
        if (language === 'hi') {
          utterance.lang = 'hi-IN';
          const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
          if (hiVoice) utterance.voice = hiVoice;
        } else {
          utterance.lang = 'en-US';
          const enVoice = voices.find((v) => v.lang.startsWith('en-IN') || v.lang.startsWith('en'));
          if (enVoice) utterance.voice = enVoice;
        }"""

content = content.replace(old_voice, new_voice)

with open("client/src/features/games/GameEngine.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("GameEngine voice fixed.")
