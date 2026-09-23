import re

with open("client/src/pages/patient/PatientHome.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "useTranslation" not in content:
    content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { useTranslation } from 'react-i18next';")
    content = content.replace("const { user } = useAuthStore();", "const { user } = useAuthStore();\n  const { t } = useTranslation();")

replacements = [
    ("COGNITIVE SUITE A DAILY REGIMEN", "{t('arcade.daily_regimen', 'COGNITIVE SUITE • DAILY REGIMEN')}"),
    ("NEURO MIND A DAILY REGIMEN", "{t('arcade.daily_regimen', 'NEURO MIND • DAILY REGIMEN')}"),
    ("PROGRESS A 60%", "{t('arcade.progress', 'PROGRESS')} • 60%"),
    ("WELCOME<br />{firstName}", "{t('arcade.welcome', 'WELCOME')}<br />{firstName}"),
    ("Continue your cognitive exercises, review your memory book, \n          and check your daily routine. Everything you need is right here.", "{t('arcade.intro_desc', 'Continue your cognitive exercises, review your memory book, and check your daily routine. Everything you need is right here.')}"),
    ("Start Activity", "{t('arcade.start_activity', 'START ACTIVITY')}"),
    ("ACTIVITIES CATALOG", "{t('arcade.activities_catalog', 'ACTIVITIES CATALOG')}"),
    ("Engage your mind with our collection of cognitive exercises. Choose a category below to get started.", "{t('arcade.catalog_desc', 'Engage your mind with our collection of cognitive exercises. Choose a category below to get started.')}"),
    ("MEMORY GAMES", "{t('arcade.memory_games', 'MEMORY GAMES')}"),
    ("ATTENTION GAMES", "{t('arcade.attention_games', 'ATTENTION GAMES')}"),
    ("LANGUAGE & REASONING", "{t('arcade.language_games', 'LANGUAGE & REASONING')}"),
]

for old, new in replacements:
    content = content.replace(old, new)

# Also fix the A character issues if they exist
content = content.replace("A", "•")

with open("client/src/pages/patient/PatientHome.tsx", "w", encoding="utf-8") as f:
    f.write(content)
