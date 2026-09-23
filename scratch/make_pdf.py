from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        self.set_font("helvetica", "B", 18)
        self.set_text_color(13, 148, 136) # Teal
        self.cell(0, 10, "SMRITI CARE (Neuro Mind) - Architecture & Workflow Guide", align="C", ln=True)
        self.set_draw_color(13, 148, 136)
        self.line(10, 22, 200, 22)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("helvetica", "I", 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f"Page {self.page_no()}", align="C")

    def chapter_title(self, title):
        self.set_font("helvetica", "B", 14)
        self.set_text_color(17, 94, 89) # Dark Teal
        self.cell(0, 10, title, ln=True)
        self.ln(2)

    def chapter_body(self, text):
        self.set_font("helvetica", "", 11)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 6, text)
        self.ln(5)

pdf = PDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)

pdf.chapter_title("1. App Kya Hai? (Introduction)")
intro_text = (
    "Smriti Care (Neuro Mind) ek AI-powered platform hai jo mainly older adults (buzurgon) ki memory "
    "aur cognitive health (dimaghi sehat) ko improve karne ke liye banaya gaya hai.\n\n"
    "Is app mein memory games (jaise Match 3, Jigsaw, Sudoku, etc.) hain jo brain ki exercise karate hain. "
    "Sath hi isme caregivers (dekhbhal karne wale) aur doctors ke liye bhi features hain jisse wo patient ki "
    "progress track kar sakein. Isme North-Eastern languages (Assamese, Manipuri, Khasi, Mizo) ko bhi "
    "support kiya gaya hai taaki local log apni bhasha mein ise aasani se use kar sakein."
)
pdf.chapter_body(intro_text)

pdf.chapter_title("2. Tech Stack (Kaunsi Technologies Use Hui Hain?)")
tech_text = (
    "FRONTEND (Jo User Ko Dikhta Hai):\n"
    "- React 19 & Vite: App ka UI banane ke liye. Vite development aur build ko super fast banata hai.\n"
    "- TypeScript: JavaScript ka advanced version jo code mein bugs kam karta hai by adding types.\n"
    "- Tailwind CSS: App ki styling (colors, layout) ke liye use hua hai.\n"
    "- Zustand: Global state management (jaise user login session aur UI themes) ke liye.\n"
    "- React Router DOM: Pages ke beech bina reload kiye navigate karne ke liye.\n"
    "- i18next: Multi-language support (i18n) ke liye, jisse poori app 6 bhashaon mein translate hoti hai.\n"
    "- Framer Motion: Smooth animations aur interactive transitions ke liye.\n"
    "- PWA (Progressive Web App): App ko phone me install karne aur offline capabilities dene ke liye.\n\n"
    "BACKEND (Jo Data Handle Karta Hai):\n"
    "- Node.js & Express: Server aur API endpoints (jaise /api/login) banane ke liye.\n"
    "- Prisma ORM: Database se easily baat karne ka tool jisse direct SQL nahi likhni padti.\n"
    "- PostgreSQL / SQLite: Database jahan saara data (users, scores, notes) save hota hai.\n"
    "- JWT (JSON Web Tokens): Security aur secure login sessions maintain karne ke liye."
)
pdf.chapter_body(tech_text)

pdf.chapter_title("3. App Ka Workflow (App Kaam Kaise Karti Hai?)")
workflow_text = (
    "A. USER ROLES (4 Tarah Ke Users Hain):\n"
    "1. Patient: Inka dashboard bahut simple hota hai. Inhe 4-digit PIN se login karvaya jata hai. Inko Games khelne hote hain aur apni daily feelings track karni hoti hai.\n"
    "2. Caregiver: Ye wo log hain jo patient ki dekhbhal karte hain. Ye patients add kar sakte hain, unke liye reminders (davai, khana) set kar sakte hain aur game scores dekh sakte hain.\n"
    "3. Doctor: Doctor patients ki clinical reports, cognitive progress graphs aur history dekhta hai aur notes add karta hai.\n"
    "4. Admin: System ke sabhi users aur games ko manage karta hai.\n\n"
    "B. STEP-BY-STEP APP WORKFLOW:\n"
    "- Step 1 (Authentication): Jab user app kholta hai, wo apna role select karke login karta hai. Backend verify karke JWT token deta hai.\n"
    "- Step 2 (Patient Dashboard): Patient ko badi screen par 'Activities' aur 'Reminders' dikhte hain. 'Games' par click karne se memory games (jaise Memory Match, Sequence) ki list aati hai.\n"
    "- Step 3 (Voice Instructions - Text-To-Speech): App mein 'Speaker' icon hai. Jab user us par click karta hai, browser ki native Web Speech API us text ko selected language (e.g., Hindi) mein bolkar sunati hai.\n"
    "- Step 4 (Data Saving): Game complete hone par frontend API (/api/game-sessions) ko request bhejta hai, aur backend use database mein save kar leta hai.\n"
    "- Step 5 (Reports): Caregiver aur Doctor apne dashboard se reports (PDF/CSV) download kar sakte hain jisse patient ki memory improvements track hoti hain."
)
pdf.chapter_body(workflow_text)

pdf.chapter_title("4. Hosting & Deployment (Cloud Par Kaise Rakha Hai?)")
hosting_text = (
    "Ye project ek Monorepo hai jismein 'client' aur 'server' dono folders ek hi jagah hain.\n\n"
    "- Backend API (neuromind API): Antideploy platform par host kiya gaya hai jo automatically Node.js server aur PostgreSQL database manage karta hai.\n"
    "- Frontend Web (neuromind-web): Ye bhi Antideploy par host hai. Iska API URL dynamically configured hai taaki ye production database se accurately connect ho sake."
)
pdf.chapter_body(hosting_text)

pdf.output("C:/Users/prate/Desktop/Games/scratch/SMRITI_CARE_Tech_Workflow_Guide.pdf")
print("PDF created successfully!")
