import os
import re

files = [
    r"c:\Users\prate\Desktop\Games\client\src\features\games\AttentionTap\AttentionTap.tsx",
    r"c:\Users\prate\Desktop\Games\client\src\features\games\FindDifference\FindDifference.tsx",
    r"c:\Users\prate\Desktop\Games\client\src\features\games\MemoryMatch\MemoryMatch.tsx",
    r"c:\Users\prate\Desktop\Games\client\src\features\games\ObjectRecognition\ObjectRecognition.tsx",
    r"c:\Users\prate\Desktop\Games\client\src\features\games\PatternBuilder\PatternBuilder.tsx",
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Generic replacements
    # Wrappers
    content = re.sub(
        r'className="w-full max-w-[a-z0-9]+ flex flex-col items-center"',
        lambda m: m.group(0).replace('className="', 'className="bg-kraft2 border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)] p-6 '),
        content
    )
    
    # Text headers
    content = re.sub(
        r'text-xl sm:text-2xl font-bold text-amber-950 dark:text-amber-100',
        'text-xl sm:text-2xl font-display font-bold uppercase tracking-widest text-ink',
        content
    )
    
    # Other text (stats)
    content = re.sub(
        r'text-sm sm:text-base font-bold text-amber-950 dark:text-amber-100',
        'text-sm sm:text-base font-mono uppercase tracking-widest text-ink',
        content
    )
    content = re.sub(
        r'text-sm font-semibold text-stone-700 dark:text-stone-300',
        'text-sm font-mono uppercase tracking-widest text-ink',
        content
    )
    content = re.sub(
        r'text-xs font-bold uppercase tracking-wider text-stone-500',
        'text-xs font-mono uppercase tracking-widest text-ink',
        content
    )

    if "AttentionTap" in file:
        content = content.replace(
            "flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-stone-800 px-3 py-1 rounded-full text-sm",
            "flex items-center gap-1.5 font-mono uppercase tracking-widest text-ink bg-ochre border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] px-3 py-1 text-sm"
        )
        content = content.replace(
            "w-full bg-amber-100 dark:bg-stone-800 rounded-full h-2 mb-6 overflow-hidden",
            "w-full bg-kraft border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] h-4 mb-6 overflow-hidden"
        )
        content = content.replace(
            "bg-amber-500 h-full transition-all duration-1000 ease-linear",
            "bg-vermilion h-full transition-all duration-1000 ease-linear border-r-[3px] border-ink"
        )
        # item buttons
        content = content.replace(
            "aspect-square p-3 rounded-2xl border-2 flex flex-col items-center justify-center transition-all relative shadow-xs",
            "aspect-square p-3 border-[3px] border-ink flex flex-col items-center justify-center transition-all relative shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] font-mono font-bold uppercase tracking-widest"
        )
        content = content.replace(
            "bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-900 shadow-md ring-2 ring-emerald-300",
            "bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-stone-200 dark:bg-stone-800 border-stone-300 opacity-60",
            "bg-kraft opacity-60 border-ink shadow-[4px_4px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:bg-amber-50/50",
            "bg-kraft border-ink hover:bg-ochre shadow-[4px_4px_0_var(--color-ink)]"
        )
        content = content.replace(
            "w-full max-w-xs py-3.5 rounded-2xl font-bold text-base shadow-md transition-all",
            "w-full max-w-xs py-3.5 border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] transition-all font-mono font-bold uppercase tracking-widest text-base"
        )
        content = content.replace(
            "bg-amber-600 hover:bg-amber-700 text-white active:scale-[0.98]",
            "bg-vermilion text-kraft"
        )
        content = content.replace(
            "bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed",
            "bg-kraft text-ink opacity-50 cursor-not-allowed"
        )

    elif "FindDifference" in file:
        content = content.replace(
            "bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 rounded-xl text-stone-800 dark:text-stone-200",
            "bg-ochre border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] text-ink font-mono uppercase tracking-widest"
        )
        content = content.replace(
            "bg-white dark:bg-stone-800 rounded-3xl border-2 border-amber-200 dark:border-stone-700 shadow-md",
            "bg-kraft border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)]"
        )
        content = content.replace(
            "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all relative border-2",
            "w-14 h-14 sm:w-16 sm:h-16 border-[3px] border-ink flex items-center justify-center text-3xl sm:text-4xl transition-all relative shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 shadow-sm ring-2 ring-emerald-400",
            "bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-amber-50/40 dark:bg-stone-900/60 border-stone-200 dark:border-stone-700 hover:border-amber-400",
            "bg-kraft border-ink hover:bg-ochre"
        )
        content = content.replace(
            "font-bold text-amber-700 dark:text-amber-300",
            "font-bold text-vermilion"
        )
        
    elif "MemoryMatch" in file:
        content = content.replace(
            "text-base sm:text-lg font-medium text-stone-700 dark:text-stone-300",
            "text-base sm:text-lg font-mono uppercase tracking-widest text-ink font-bold"
        )
        content = content.replace(
            "font-bold text-amber-700 dark:text-amber-300",
            "font-bold text-vermilion"
        )
        content = content.replace(
            "aspect-square min-w-[70px] sm:min-w-[90px] rounded-2xl p-2 sm:p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-md border-2",
            "aspect-square min-w-[70px] sm:min-w-[90px] border-[3px] border-ink p-2 sm:p-3 flex flex-col items-center justify-center transition-all duration-300 shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-100 shadow-emerald-100",
            "bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-white dark:bg-stone-800 border-amber-500 shadow-amber-100",
            "bg-kraft border-ink shadow-[4px_4px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-gradient-to-br from-amber-500 to-amber-600 border-amber-400 text-white hover:from-amber-600 hover:to-amber-700 shadow-amber-200",
            "bg-vermilion border-ink text-kraft shadow-[4px_4px_0_var(--color-ink)] hover:bg-ochre hover:text-ink"
        )

    elif "ObjectRecognition" in file:
        content = content.replace(
            "bg-amber-100/90 dark:bg-amber-950/60 border border-amber-300 rounded-xl text-stone-800 dark:text-stone-200",
            "bg-ochre border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] text-ink font-mono uppercase tracking-widest"
        )
        content = content.replace(
            "rounded-3xl bg-white dark:bg-stone-800 border-2 border-amber-200 dark:border-stone-700 shadow-lg",
            "bg-kraft border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)]"
        )
        content = content.replace(
            "p-4 rounded-2xl border-2 font-bold text-base sm:text-lg transition-all text-center shadow-xs flex items-center justify-center gap-2",
            "p-4 border-[3px] border-ink font-mono font-bold uppercase tracking-widest text-base sm:text-lg transition-all text-center flex items-center justify-center gap-2 shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 hover:border-amber-400 hover:bg-amber-50/50",
            "bg-kraft text-ink border-ink hover:bg-ochre"
        )
        content = content.replace(
            "bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-md ring-2 ring-emerald-400",
            "bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-amber-50 dark:bg-amber-950/40 border-amber-400 text-amber-900 dark:text-amber-200",
            "bg-vermilion text-kraft border-ink"
        )
        content = content.replace(
            "opacity-40 border-stone-200 bg-stone-50",
            "opacity-40 border-ink bg-kraft"
        )

    elif "PatternBuilder" in file:
        content = content.replace(
            "bg-white dark:bg-stone-800 rounded-3xl border-2 border-amber-200 dark:border-stone-700 shadow-md",
            "bg-kraft border-[3px] border-ink shadow-[8px_8px_0_var(--color-ink)]"
        )
        content = content.replace(
            "rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border-2 transition-all",
            "border-[3px] border-ink flex items-center justify-center text-3xl sm:text-4xl transition-all shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-amber-100 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 font-extrabold shadow-inner",
            "bg-ochre border-ink text-ink font-extrabold shadow-[4px_4px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-amber-50/40 dark:bg-stone-900 border-stone-200 dark:border-stone-700",
            "bg-kraft border-ink text-ink"
        )
        content = content.replace(
            "bg-amber-100/90 dark:bg-amber-950/50 border border-amber-300 rounded-2xl text-stone-800 dark:text-stone-200",
            "bg-ochre border-[3px] border-ink shadow-[4px_4px_0_var(--color-ink)] text-ink font-mono uppercase tracking-widest"
        )
        content = content.replace(
            "p-4 rounded-2xl border-2 flex items-center justify-center text-4xl sm:text-5xl transition-all shadow-xs",
            "p-4 border-[3px] border-ink flex items-center justify-center text-4xl sm:text-5xl transition-all shadow-[4px_4px_0_var(--color-ink)] hover:translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--color-ink)] font-mono font-bold uppercase tracking-widest"
        )
        content = content.replace(
            "bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:scale-105 active:scale-95",
            "bg-kraft text-ink border-ink hover:bg-vermilion hover:text-kraft"
        )
        content = content.replace(
            "bg-emerald-100 dark:bg-emerald-950/70 border-emerald-500 shadow-md ring-2 ring-emerald-400",
            "bg-felt text-kraft shadow-[4px_4px_0_var(--color-ink)]"
        )
        content = content.replace(
            "bg-amber-50 dark:bg-amber-950/40 border-amber-400 opacity-60",
            "bg-vermilion text-kraft opacity-60 border-ink"
        )
        content = content.replace(
            "opacity-40 border-stone-200 bg-stone-50",
            "opacity-40 border-ink bg-kraft text-ink"
        )

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)
