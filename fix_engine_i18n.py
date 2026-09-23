import re

with open("client/src/features/games/GameEngine.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "useTranslation" not in content:
    content = content.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport { useTranslation } from 'react-i18next';")
    content = content.replace("  }) => {", "  }) => {\n  const { t } = useTranslation();")
    content = content.replace("Activity Paused", "{t('arcade.activity_paused', 'Activity Paused')}")
    content = content.replace("Resume Activity", "{t('arcade.resume', 'Resume Activity')}")
    content = content.replace("Restart Activity", "{t('arcade.restart', 'Restart Activity')}")
    content = content.replace("Exit Activity", "{t('arcade.exit', 'Exit Activity')}")

with open("client/src/features/games/GameEngine.tsx", "w", encoding="utf-8") as f:
    f.write(content)
