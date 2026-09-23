# SMRITI CARE (Neuro Mind)

Smriti Care is an AI-powered, offline-first cognitive wellness and memory assistance platform designed specifically for older adults, particularly those facing dementia or cognitive decline. Built with a focus on regional accessibility, it bridges the gap in mental healthcare by providing culturally familiar, native-language cognitive stimulation for users in rural and North-Eastern India (supporting Assamese, Manipuri, Khasi, Mizo, Hindi, and English).

## What the Project Does

The platform connects a triad of users:
1. **Patients (The Elderly):** Interacts with a highly accessible, voice-guided Progressive Web App (PWA). They play AI-adaptive cognitive games (like Memory Match, Jigsaw, Sequence Memory) that stimulate brain function, track daily routines, and log their mood.
2. **Caregivers:** A dedicated dashboard to monitor the patient's daily activity, set medication and routine reminders remotely, and receive real-time alerts.
3. **Doctors:** A clinical portal to view data-driven cognitive trajectory graphs, track adherence, and download comprehensive PDF/CSV reports, replacing guesswork with concrete performance metrics.

**Key Features:**
- **Zero-Internet Architecture:** Fully functional offline. Game data and logs are cached locally using IndexedDB and Service Workers, auto-syncing to the cloud when internet is restored.
- **Deep Localization:** The UI, game assets, and Web Speech API Text-to-Speech (TTS) instructions are natively translated.
- **AI-Adaptive Difficulty:** Games automatically scale in difficulty based on the patient's accuracy and speed.

---

## How to Run It

This project is a monorepo containing both the `client` (React frontend) and `server` (Express backend).

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Local Setup Instructions

1. **Clone the repository and install dependencies for both ends:**
   ```bash
   npm run setup
   ```
   *(This command installs dependencies for both `client` and `server`, generates the Prisma client, and seeds the local SQLite database).*

2. **Environment Variables:**
   - The setup uses a local SQLite database by default (`server/prisma/dev.db`).
   - If you wish to use PostgreSQL, update the `DATABASE_URL` in `server/.env` and change the provider in `server/prisma/schema.prisma`.

3. **Start the Development Servers:**
   ```bash
   npm run dev
   ```
   - The **Backend API** will start on `http://localhost:3001`
   - The **Frontend App** will start on `http://localhost:5173`

4. **Demo Accounts:**
   - **Patient:** `patient@demo.smriticare.in` / `Demo@1234`
   - **Caregiver:** `caregiver@demo.smriticare.in` / `Demo@1234`
   - **Doctor:** `doctor@demo.smriticare.in` / `Demo@1234`
   - **Admin:** `admin@demo.smriticare.in` / `Demo@1234`

---

## Which Blockchain You Used

**Not Applicable.** 
This project does *not* utilize blockchain technology. 

Given the target demographic (rural elderly populations with poor internet connectivity) and the project's primary technical constraint (100% offline-first functionality via PWA caching), we opted for a traditional relational database architecture (**PostgreSQL** via Prisma ORM) coupled with **IndexedDB** for local storage. This ensures immediate, zero-latency interactions without the need for constant network consensus or transaction fees, prioritizing high-speed data syncs when intermittent internet connections are detected.

---

## Known Limitations

- **Browser TTS Limitations:** The Text-To-Speech (TTS) feature relies on the native Web Speech API of the user's browser/OS. Voices for some regional languages (like Khasi or Mizo) may fall back to default Hindi or English accents depending on the device's installed language packs.
- **Offline Authentication:** While gameplay and data logging work offline, the initial login and token generation require an active internet connection.
- **Asset Size:** The application contains numerous image and audio assets for the games. Initial load times (caching the PWA) may be slightly longer on 2G/3G networks before offline capabilities kick in.
- **Sync Conflicts:** In edge cases where multiple devices log data for the same patient offline, the last-synced timestamp overwrites previous data rather than merging complex state changes.

---

*Developed for cognitive wellness and accessible mental healthcare.*
