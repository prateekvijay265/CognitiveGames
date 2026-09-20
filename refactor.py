import os
import re
import glob

store_import = "import { useAppDataStore } from '@/store/appDataStore';\n"
inject_str = "\n  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS } = useAppDataStore();\n"

def refactor_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'data/demoData' not in content:
        return
        
    print(f"Refactoring {filepath}")
    
    # Remove demoData import
    content = re.sub(r'import\s+\{[^}]+\}\s+from\s+[\'"](?:@/|\.\./\.\./|\.\./)data/demoData[\'"];?\n', '', content)
    
    # Check if useAppDataStore is already imported
    if 'useAppDataStore' not in content:
        imports = re.findall(r'^import .*', content, flags=re.MULTILINE)
        if imports:
            last_import = imports[-1]
            content = content.replace(last_import, last_import + "\n" + store_import)
        else:
            content = store_import + content
            
    # Inject hook
    if 'useAppDataStore()' not in content:
        # Match `export default function ComponentName() {`
        content, count = re.subn(r'(export default function \w+\([^)]*\)\s*\{)', r'\1' + inject_str, content)
        if count == 0:
            # Match `export function ComponentName() {`
            content, count = re.subn(r'(export function \w+\([^)]*\)\s*\{)', r'\1' + inject_str, content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for file in glob.glob('client/src/pages/**/*.tsx', recursive=True):
    refactor_file(file)
