# ⚡ AskSpace AI — High-Capacity Classroom Q&A & AI Synthesizer Platform

[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-f05032.svg?style=for-the-badge)](https://groq.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4.svg?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

AskSpace is a high-performance, real-time classroom Q&A and AI-powered question synthesis platform built to handle high-capacity student interactions (1,000+ concurrent students). It empowers students to submit questions anonymously or with their names, upvote peers' questions, and enables instructors (Hosts) to synthesize raw inquiries into comprehensive study sets using **Groq (Llama 3.3 70B)**, **Google Gemini 1.5 Flash**, or a **Zero-API Key Built-in NLP Clustering Engine**.

---

## 🌟 Key Features

### 🎓 Classroom & Student Experience
- **Instant Room Access**: Join using a short 5-character classroom code without tedious registration.
- **Real-time Question Feed**: Post questions tagged by topic with upvoting, sorting, and filtering.
- **Session-Based Upvoting**: Prevents duplicate voting per device session.
- **Monochrome & Neobrutalist UI**: High-contrast, accessibility-focused light/dark mode design.

### 🛡️ Host & Instructor Dashboard
- **PIN-Protected Host Mode**: Secure access to administrative controls using classroom-specific PINs.
- **Official Host Answers**: Instructors can mark questions as answered and attach model responses.
- **CSV Data Export**: Export classroom Q&A data to `.csv` for archival, grading, or offline review.
- **Room Cleanup**: Reset room feeds cleanly between sessions after exporting data.

### 🤖 AI Synthesizer & Exam Generator
- **Multi-Model Support**: Integrated with **Groq API** (`llama-3.3-70b-versatile`) and **Google Gemini API** (`gemini-1.5-flash`).
- **Offline NLP Engine**: Automatic fallback to a local TF-IDF keyword clustering algorithm when no API key is provided.
- **Exam Question Synthesis**: Converts raw student questions into 3–5 curated, structured study questions with difficulty ratings, explanations, and model answers.
- **Top Confusion Identification**: Automatically extracts the top 3 core student misconceptions per lecture.

### 📊 Analytics & Insights
- **Visual Charts (Recharts)**: Analyze question volume by topic, upvote distributions, and engagement metrics.
- **Top Inquiries**: Automatically surface high-interest topics requiring instructor attention.

---

## 🏗️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Neobrutalist / High-Contrast monochrome aesthetic)
- **Icons & Visualization**: Lucide React, Recharts
- **AI Integrations**: Groq SDK, Google Generative AI (`@google/generative-ai`)
- **State Management & Storage**: LocalStorage with session-based voting guards

```
ask_questions/
├── src/
│   ├── components/
│   │   ├── AiSettingsModal.tsx       # AI Provider (Groq / Gemini) switcher & key setup
│   │   ├── AiSynthesizerModal.tsx    # AI Question Synthesis viewer & launcher
│   │   ├── AnalyticsDashboard.tsx    # Recharts metrics & visualization dashboard
│   │   ├── ClassroomJoin.tsx         # Classroom code entry & room creator
│   │   ├── HostAuthModal.tsx         # Host PIN verification modal
│   │   ├── Navbar.tsx                # Top navigation, mode toggle & room status
│   │   └── QuestionFeed.tsx          # Real-time Q&A stream & upvote system
│   ├── lib/
│   │   ├── ai.ts                     # AI pipeline (Groq, Gemini & Built-in NLP engine)
│   │   └── store.ts                  # Local storage persistence & session manager
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces & domain schemas
│   ├── App.tsx                       # Main application state router
│   ├── main.tsx                      # App entrypoint
│   └── index.css                     # Global styles & Tailwind configuration
├── .env.example                      # Environment variable template
├── index.html                        # HTML entry point
├── package.json                      # Build & dependency metadata
├── vite.config.ts                    # Vite build settings
└── README.md                         # Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/omnox-dev/AskSpace.git
   cd AskSpace
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your environment configuration and Host password:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_HOST_ADMIN_PASSWORD=your_secure_host_password_here
   ```
   > *Note: `VITE_HOST_ADMIN_PASSWORD` sets a master production password for host admin actions. If no API key is provided, AskSpace automatically uses its built-in offline NLP engine!*

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 🛠️ Scripts & Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with HMR. |
| `npm run build` | Runs TypeScript compilation (`tsc`) and builds for production. |
| `npm run preview` | Previews the local production build. |

---

## 🌐 Deploying to Vercel / Netlify

### Vercel Deployment

1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/new) and select **Import Repository**.
3. Choose `AskSpace`. Vercel will automatically detect **Vite**.
4. (Optional) Add your environment variables (`VITE_GROQ_API_KEY` or `VITE_GEMINI_API_KEY`) under **Environment Variables**.
5. Click **Deploy**.

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p center="text-center">
Made with ❤️ for higher education and interactive learning environments.
</p>
