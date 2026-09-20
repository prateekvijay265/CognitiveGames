import glob
import re

for filepath in glob.glob('client/src/pages/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Clean the bad import and newlines
    content = content.replace("\nimport { useAppDataStore } from '@/store/appDataStore';", "")
    content = content.replace("import { useAppDataStore } from '@/store/appDataStore';\n", "")

    # Clean the injected hook
    bad_inject = "\n  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS } = useAppDataStore();\n"
    content = content.replace(bad_inject, "")
    
    # See what DEMO_ variables are still used
    demo_vars = set(re.findall(r'(DEMO_[A-Z_]+)', content))
    if demo_vars:
        import_str = f"import {{ {', '.join(demo_vars)} }} from '@/data/demoData';\n"
        content = import_str + content
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Repair completed.")
