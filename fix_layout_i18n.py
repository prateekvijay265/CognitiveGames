import re

with open("client/src/layouts/PatientLayout.tsx", "r", encoding="utf-8") as f:
    content = f.read()

if "useTranslation" not in content:
    content = content.replace("import { NavLink, Outlet, useNavigate } from 'react-router-dom';", "import { NavLink, Outlet, useNavigate } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';")
    content = content.replace("export default function PatientLayout() {", "export default function PatientLayout() {\n  const { t, i18n } = useTranslation();")
    
# Fix the dropdown styling
old_select = """              <select 
                className="appearance-none bg-transparent font-mono font-bold text-xs uppercase tracking-wider text-ink hover:text-accent-red transition-colors focus:outline-none cursor-pointer"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >"""
new_select = """              <select 
                className="bg-paper border-2 border-ink font-mono font-bold text-xs uppercase text-ink px-1 focus:outline-none cursor-pointer hover:bg-[#e3decf]"
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
              >"""
content = content.replace(old_select, new_select)

# Translate Nav Links
content = content.replace("label: 'Home'", "label: t('arcade.home', 'Home')")
content = content.replace("label: 'Games'", "label: t('arcade.games', 'Games')")
content = content.replace("label: 'Routine'", "label: t('arcade.routine', 'Routine')")
content = content.replace("label: 'Memories'", "label: t('arcade.memory_book', 'Memories')")

with open("client/src/layouts/PatientLayout.tsx", "w", encoding="utf-8") as f:
    f.write(content)
