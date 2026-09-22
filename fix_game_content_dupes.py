with open("client/src/data/gameContent.ts", "r", encoding="utf-8") as f:
    lines = f.readlines()
new_lines = []
i = 0
while i < len(lines):
    if "options:" in lines[i] and i+1 < len(lines) and "options:" in lines[i+1]:
        # skip the first one
        pass
    else:
        new_lines.append(lines[i])
    i += 1
with open("client/src/data/gameContent.ts", "w", encoding="utf-8") as f:
    f.writelines(new_lines)
