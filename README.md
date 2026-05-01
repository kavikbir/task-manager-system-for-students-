# 🚀 Team Task Tracker SCM (AI-Powered)

A modern, high-performance team collaboration and task management system built with **React**, **TypeScript**, and **Vite**. It features a robust **Google Sheets backend** via **Google Apps Script** and integrates **Gemini AI** for intelligent nudges and performance feedback.

!

## ✨ Key Features

-   **📊 Real-time Task Tracking**: Seamlessly sync tasks with Google Sheets.
-   **🤖 AI Insights**: Gemini AI generates personalized motivational nudges and weekly performance feedback.
-   **🏆 Gamified Scoring**: Automatic weekly scoring based on task completion and deadlines.
-   **🛡️ Role-based Views**: Specialized interfaces for Team Members and Administrators.
-   **⚡ High Performance**: Built with Vite and TypeScript for a snappy developer experience and smooth UI.
-   **🎨 Premium UI**: Modern, responsive design with interactive elements and smooth transitions.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript, Vite
-   **Backend**: Google Apps Script (GAS)
-   **Database**: Google Sheets
-   **AI Engine**: Google Gemini 1.5 Flash
-   **Styling**: Modern CSS with interactive components

## 🚀 Quick Start

### 1. Prerequisites
-   [Node.js](https://nodejs.org/) (v16 or higher)
-   A Google account (for Google Sheets and Apps Script)
-   

### 2. Frontend Setup
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory (use `.env.example` as a template):
    ```env
    VITE_GAS_WEB_APP_URL=your_google_apps_script_url
    VITE_GEMINI_API_KEY=your_gemini_api_key
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```

### 3. Backend (Google Sheets) Setup
Full instructions for setting up the Google Sheets backend are available in [BACKEND_SETUP.md](BACKEND_SETUP.md).
-   Create a Sheet with `Tasks` and `Members` tabs.
-   Deploy the provided Apps Script code as a Web App.
-   Paste the Deployment URL into your `.env` file.

## 📁 Project Structure

```text
├── src/
│   ├── services/       # API services (GAS, Gemini)
│   ├── components/     # UI Components
│   ├── App.tsx         # Main application logic
│   ├── main.tsx        # Entry point
│   └── types.ts        # TypeScript definitions
├── BACKEND_SETUP.md    # Guide for Google Sheets integration
├── RUN_GUIDE.md        # Detailed running instructions
└── package.json        # Project dependencies
```

## 📝 Functioning Overview

The system operates on a **Sync-and-Score** model:
1.  **Tasks** are fetched from Google Sheets upon login.
2.  **Gemini AI** analyzes pending tasks to provide "Motivational Nudges."
3.  When a task is marked **Done**, the backend calculates if it was on time or late.
4.  **Points** are awarded to the member's profile in the `Members` sheet.
5.  **Admins** can view a summary of all team performance and reset scores for a new week.

---

Developed with ❤️ by kritagya 
