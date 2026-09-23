import re

with open("client/src/pages/patient/PatientGames.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "useTranslation" not in content:
    content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { useTranslation } from 'react-i18next';")
    content = content.replace("const navigate = useNavigate();", "const navigate = useNavigate();\n  const { t } = useTranslation();")

# Replace PLAY and min
content = content.replace("PLAY", "{t('arcade.play', 'PLAY')}")
content = content.replace("min</span>", "{t('arcade.min', 'min')}</span>")

with open("client/src/pages/patient/PatientGames.tsx", "w", encoding="utf-8") as f:
    f.write(content)
