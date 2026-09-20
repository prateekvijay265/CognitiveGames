import glob
import re

for filepath in glob.glob('client/src/pages/**/*.tsx', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if '@/data/demoData' not in content:
        continue
        
    print(f"Modifying {filepath}")
        
    # Replace import
    content = re.sub(r"import \{[^}]+\} from '@/data/demoData';\n", "import { useAppDataStore } from '@/store/appDataStore';\n", content)
    
    # Define replacer
    def repl(m):
        return m.group(1) + "\n  const { patients: DEMO_PATIENTS, gameSessions: DEMO_GAME_SESSIONS, reminders: DEMO_REMINDERS, alerts: DEMO_ALERTS, routines: DEMO_ROUTINE, memoryBook: DEMO_MEMORY_BOOK, users: DEMO_USERS } = useAppDataStore();\n"
        
    # Match export default function X() {
    content, c = re.subn(r'(export default function [a-zA-Z0-9_]+\([^)]*\)\s*\{)', repl, content, count=1)
    if c == 0:
        content, c = re.subn(r'(export function [a-zA-Z0-9_]+\([^)]*\)\s*\{)', repl, content, count=1)
    if c == 0:
        # Match const ComponentName = () => {  (assuming PascalCase component name)
        content, c = re.subn(r'(const [A-Z][a-zA-Z0-9_]* = \([^)]*\)\s*=>\s*\{)', repl, content, count=1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
