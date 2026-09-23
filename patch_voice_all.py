import re

file_path = "client/src/features/games/GameEngine.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

old_voice = """        // Select voice based on language if available
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

new_voice = """        // Select voice based on language if available
        const voices = window.speechSynthesis.getVoices();
        
        // Try to find a voice for the selected language
        const targetLang = language === 'en' ? 'en-IN' : `${language}-IN`;
        utterance.lang = targetLang;
        
        const exactVoice = voices.find((v) => v.lang.startsWith(language));
        if (exactVoice) {
          utterance.voice = exactVoice;
        } else if (language !== 'en') {
          // Fallback to Hindi if regional voice is missing, as many NE Indians understand Hindi 
          // and the phonetics often map better than US English.
          utterance.lang = 'hi-IN';
          const hiVoice = voices.find((v) => v.lang.startsWith('hi'));
          if (hiVoice) utterance.voice = hiVoice;
        } else {
          utterance.lang = 'en-IN';
          const enVoice = voices.find((v) => v.lang.startsWith('en-IN') || v.lang.startsWith('en'));
          if (enVoice) utterance.voice = enVoice;
        }"""

content = content.replace(old_voice, new_voice)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
