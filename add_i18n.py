import os
import json
import re

locales_dir = "client/src/locales"
en_file = os.path.join(locales_dir, "en.json")
hi_file = os.path.join(locales_dir, "hi.json")

with open(en_file, "r", encoding="utf-8") as f:
    en_data = json.load(f)
with open(hi_file, "r", encoding="utf-8") as f:
    hi_data = json.load(f)

new_en = {
    "arcade": {
        "daily_regimen": "COGNITIVE SUITE • DAILY REGIMEN",
        "progress": "PROGRESS",
        "welcome": "WELCOME",
        "intro_desc": "Continue your cognitive exercises, review your memory book, and check your daily routine. Everything you need is right here.",
        "start_activity": "START ACTIVITY",
        "activities_catalog": "ACTIVITIES CATALOG",
        "catalog_desc": "Engage your mind with our collection of cognitive exercises. Choose a category below to get started.",
        "memory_games": "MEMORY GAMES",
        "attention_games": "ATTENTION GAMES",
        "language_games": "LANGUAGE & REASONING",
        "play": "PLAY",
        "min": "min",
        "resume": "RESUME",
        "exit": "EXIT",
        "score": "SCORE",
        "round": "ROUND",
        "of": "OF",
        "instructions": "INSTRUCTIONS",
        "game_over": "GAME OVER",
        "play_again": "PLAY AGAIN",
        "home": "HOME",
        "games": "GAMES",
        "routine": "ROUTINE",
        "memory_book": "MEMORY BOOK",
        "reminders": "REMINDERS"
    },
    "game_instructions": {
        "jigsaw": "Tap two pieces to swap them. Complete the picture!",
        "object_recognition": "Look at the picture and tap the button with its matching name.",
        "memory_match": "Flip the cards and find the matching pairs.",
        "remember_objects": "Memorize the objects shown. After they disappear, select them from the new list.",
        "sequence_memory": "Remember the order of the highlighted items and repeat the sequence.",
        "find_difference": "Find the difference between the two images.",
        "sort_my_day": "Sort the activities in the correct order for your day.",
        "pattern_builder": "Recreate the pattern shown.",
        "attention_tap": "Tap the screen when you see the target object.",
        "sound_memory": "Listen to the sounds and remember the sequence.",
        "story_memory": "Read the story and answer the questions.",
        "chess": "Play chess.",
        "match3": "Swap items to match 3 in a row.",
        "memory_game": "Flip cards to find pairs.",
        "sudoku": "Fill the grid with numbers."
    }
}

new_hi = {
    "arcade": {
        "daily_regimen": "दिमागी कसरत • दैनिक दिनचर्या",
        "progress": "प्रगति",
        "welcome": "स्वागत है",
        "intro_desc": "अपने दिमागी व्यायाम जारी रखें, अपनी मेमोरी बुक देखें, और अपनी दिनचर्या जांचें। आपकी जरूरत की हर चीज यहां है।",
        "start_activity": "गतिविधि शुरू करें",
        "activities_catalog": "गतिविधियों की सूची",
        "catalog_desc": "हमारे दिमागी व्यायाम के साथ अपने दिमाग को व्यस्त रखें। शुरू करने के लिए नीचे एक श्रेणी चुनें।",
        "memory_games": "याददाश्त के खेल",
        "attention_games": "ध्यान के खेल",
        "language_games": "भाषा और तर्क",
        "play": "खेलें",
        "min": "मिनट",
        "resume": "जारी रखें",
        "exit": "बाहर निकलें",
        "score": "स्कोर",
        "round": "राउंड",
        "of": "का",
        "instructions": "निर्देश",
        "game_over": "खेल समाप्त",
        "play_again": "फिर से खेलें",
        "home": "होम",
        "games": "गेम्स",
        "routine": "दिनचर्या",
        "memory_book": "यादें",
        "reminders": "रिमाइंडर"
    },
    "game_instructions": {
        "jigsaw": "अदला-बदली करने के लिए दो टुकड़ों पर टैप करें। तस्वीर को पूरा करें!",
        "object_recognition": "चित्र को देखें और उसके मेल खाने वाले नाम के बटन पर टैप करें।",
        "memory_match": "कार्ड पलटें और एक जैसे जोड़े खोजें।",
        "remember_objects": "दिखाई गई वस्तुओं को याद रखें। उनके गायब होने के बाद, उन्हें नई सूची से चुनें।",
        "sequence_memory": "हाइलाइट किए गए आइटम का क्रम याद रखें और अनुक्रम दोहराएं।",
        "find_difference": "दोनों चित्रों के बीच अंतर खोजें।",
        "sort_my_day": "अपने दिन के लिए गतिविधियों को सही क्रम में व्यवस्थित करें।",
        "pattern_builder": "दिखाए गए पैटर्न को फिर से बनाएं।",
        "attention_tap": "जब आप लक्ष्य वस्तु देखें तो स्क्रीन पर टैप करें।",
        "sound_memory": "आवाज़ों को सुनें और अनुक्रम याद रखें।",
        "story_memory": "कहानी पढ़ें और सवालों के जवाब दें।",
        "chess": "शतरंज खेलें।",
        "match3": "एक कतार में 3 मिलाने के लिए आइटम की अदला-बदली करें।",
        "memory_game": "जोड़े खोजने के लिए कार्ड पलटें।",
        "sudoku": "ग्रिड को नंबरों से भरें।"
    }
}

en_data.update(new_en)
hi_data.update(new_hi)

with open(en_file, "w", encoding="utf-8") as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
with open(hi_file, "w", encoding="utf-8") as f:
    json.dump(hi_data, f, indent=2, ensure_ascii=False)

print("Locales updated.")
