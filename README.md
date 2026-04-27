# CivicShield 🛡️
### *Empowering Indian Voters through Institutional AI & Real-time Verifiability*

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.5_Flash--Lite-blue?style=flat-square&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![Cloud Run](https://img.shields.io/badge/Google_Cloud_Run-Deployment-4285F4?style=flat-square&logo=google-cloud)](https://cloud.google.com/run)
[![Upstash Redis](https://img.shields.io/badge/Upstash-Redis_Rate_Limiting-00E1C5?style=flat-square&logo=redis)](https://upstash.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 📌 Overview & Problem Statement
Indian elections are the largest democratic exercise on Earth, yet they are increasingly vulnerable to two critical issues:
1.  **Election Literacy Gap:** Complex administrative processes (Form 6, EPIC verification, Observer roles) are often difficult for first-time or rural voters to navigate.
2.  **WhatsApp Misinformation:** Viral rumors about "online voting," EVM hacking, or fake Aadhaar-linking deadlines create confusion and discourage participation.

**CivicShield** solves this by providing a premium, multilingual AI assistant that acts as a direct bridge to official Election Commission of India (ECI) data. It combines deep institutional knowledge with real-time verification to safeguard democratic integrity.

---

## 🚀 Key Features (The "Wow" Factor)

### 🧠 Explain Mode: Visual Timelines
Stunning, step-by-step vertical timelines for complex election processes. Whether it's "How to register for a Voter ID" or "What happens on Counting Day," CivicShield breaks it down into actionable, easy-to-digest stages.

### 🔍 Fact-Check Mode: Grounded Truth
Native integration with **Gemini Google Search Grounding**. CivicShield doesn't just "guess"—it uses live search tools to debunk election-related fake news (like "Mobile Voting" rumors) and provides high-confidence verdicts with direct source citations.

### 🎙️ Multimodal Accessibility (A11y)
Designed for inclusivity across India’s diverse demographics:
*   **Speech-to-Text:** Speak your queries naturally in **English, Hindi, or Marathi**.
*   **Text-to-Speech:** AI audio output with localized Indian accents to assist users with varying literacy levels.
*   **Speaking Indicators:** Visual audio wave feedback when the assistant is talking.

### 📲 Viral Reach & PWA
*   **WhatsApp Shareability:** Instantly share verified fact-checks on WhatsApp with pre-filled, emoji-rich structured messages.
*   **Progressive Web App (PWA):** Installable on Android and iOS as a standalone native-like experience with an optimized mobile viewport and zero browser clutter.

---

## 🏗️ Architecture & Security

### Engineering Rigor
CivicShield follows a high-fidelity, production-grade architecture:
*   **Serverless Orchestration:** Built with Next.js 14 App Router, utilizing **Server Actions** and **Edge-ready** routes for maximum performance.
*   **Security-First Access:** 
    *   **Strict Environment Validation:** All keys are validated at runtime via **Zod schemas**.
    *   **Sanitization:** Every user and AI input is cleaned via **DOMPurify** to prevent XSS.
    *   **Strict CSP:** Headers are configured to prevent unauthorized resource loading.
*   **Rate Limiting:** Global rate limiting powered by **Upstash Redis**, ensuring the service remains resilient against DDoS or API abuse without the overhead of a standard database.
*   **Structured Logging:** Deep integration with **GCP Cloud Logging**, outputting structured JSON for real-time monitoring and debugging.

---

## 🛠️ Local Setup & Installation

Follow these steps to get a local development environment running:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/civicshield.git
    cd civicshield
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env.local` file in the root directory:
    ```env
    # AI SDK - Gemini 2.5 Flash-Lite
    GOOGLE_GEMINI_API_KEY=your_gemini_key

    # Upstash Redis for Rate Limiting
    UPSTASH_REDIS_REST_URL=your_upstash_url
    UPSTASH_REDIS_REST_TOKEN=your_upstash_token

    # Application Settings
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 🚢 Deployment (Google Cloud Run)

The application is containerized using a high-performance **multi-stage Docker build** and deployed globally on Google Cloud Run.

**Deploy to Asia-South1 (Mumbai):**
```bash
gcloud run deploy civicshield \
  --source . \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NEXT_PUBLIC_APP_URL=https://civicshield.aistartup.com
```

---

## 🏆 Hackathon Context

Built for **PromptWars India**, CivicShield demonstrates the power of agentic AI orchestration. By leveraging Gemini's tool-calling capabilities and a secure, serverless backend, we've created a tool that doesn't just answer questions—it protects the truth.

Built with ❤️ by **Vivek Kumar Verma**.
