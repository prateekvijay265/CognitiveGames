import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        
        # Replacements for Name
        new_content = new_content.replace('Smriti Care', 'Neuro Mind')
        new_content = new_content.replace('SMRITI CARE', 'NEURO MIND')
        new_content = new_content.replace('SmritiCare', 'NeuroMind')
        new_content = new_content.replace('smriticare', 'neuromind')
        new_content = new_content.replace('smriti_language', 'neuromind_language')
        
        if filepath.endswith('README.md'):
            # Fix Mermaid syntax
            new_content = new_content.replace('U1((👴 Patient)):::users', 'U1(("👴 Patient")):::users')
            new_content = new_content.replace('U2((🧑‍⚕️ Caregiver)):::users', 'U2(("🧑‍⚕️ Caregiver")):::users')
            new_content = new_content.replace('U3((🩺 Doctor)):::users', 'U3(("🩺 Doctor")):::users')
            new_content = new_content.replace('subgraph Frontend [📱 PWA Client (Offline First)]', 'subgraph Frontend ["📱 PWA Client (Offline First)"]')
            new_content = new_content.replace('subgraph BackendAPI [☁️ Cloud Server]', 'subgraph BackendAPI ["☁️ Cloud Server"]')
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        pass

for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or 'dist' in root or 'scratch' in root or '.antideploy' in root:
        continue
    for file in files:
        if file.endswith(('.tsx', '.ts', '.html', '.json', '.md', '.env', '.example', '.js', '.jsx')):
            replace_in_file(os.path.join(root, file))
