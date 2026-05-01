# 🚀 Team Task Tracker Setup Guide

Follow these steps to run your system smoothly.

## 1. Google Sheets (The Database)
1. Create a new [Google Sheet](https://sheets.new).
2. Create two tabs:
   - **Tasks**: Columns `Task ID`, `Task Name`, `Type`, `Assigned To`, `Planned Date`, `Completion Date`, `Status`.
   - **Members**: Columns `Name`, `Weekly Score`, `Feedback`.
3. Add some sample data:
   - In **Members**, add your name (e.g., `Kritagya`) in the first column.
   - In **Tasks**, add a task with `Assigned To` matching your name and `Type` as `Daily` or `One-time`.

## 2. Google Apps Script (The API)
1. In your Google Sheet, go to **Extensions > Apps Script**.
2. Copy the code from [BACKEND_SETUP.md](file:///c:/Users/HP/Downloads/TASK%20TRACKER%20SCM/BACKEND_SETUP.md) and paste it into `Code.gs`.
3. Click **Deploy > New Deployment**.
4. Select **Web App**.
5. Set "Execute as" to **Me** and "Who has access" to **Anyone**.
6. **IMPORTANT**: Copy the **Web App URL**.

## 3. Environment Variables
1. Create a `.env` file in the root of this project.
2. Add the following lines:
   ```env
   VITE_GAS_WEB_APP_URL="PASTE_YOUR_COPIED_URL_HERE"
   VITE_GEMINI_API_KEY="PASTE_YOUR_GEMINI_API_KEY_HERE"
   ```
   *(You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

## 4. Run the App
1. Open your terminal in this directory.
2. Run `npm install` (if not already done).
3. Run `npm run dev`.
4. Open the local URL (usually `http://localhost:3000`) on your desktop or phone (via network IP).

## 🛠️ Admin Dashboard (Password Protected)
I've added a secure Admin Panel so you can manage your team from your phone.
- **How to access**: On the login screen (Landing Page), click the **Lock icon** in the top-right corner.
- **Password**: `8130859152`
- **Capabilities**:
    - **Assign Tasks**: Add new tasks to any team member.
    - **Real-time Stats**: See who is lagging behind (marked with ⚠️).
    - **Reset Scores**: Wipe the leaderboard for a fresh week.

## ✨ AI Features Integrated
- **AI Productivity Coach**: Generates energetic motivational nudges based on your pending tasks.
- **Smart Scoring**: Automatically calculates rewards for on-time tasks and penalties for late ones.
- **AI Feedback**: Generates weekly performance reviews based on your score.

---
**Tip**: To see the mobile view on your desktop, right-click -> Inspect -> Click the "Toggle Device Toolbar" (Mobile/Tablet icon).
