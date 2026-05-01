TEAM TASK TRACKER SCM - SYSTEM FUNCTIONING EXPLANATION
=====================================================

1. INTRODUCTION
---------------
The Team Task Tracker SCM is an AI-powered management tool designed to synchronize team efforts through Google Sheets and provide intelligent feedback using Gemini AI.

2. SYSTEM ARCHITECTURE
----------------------
- Frontend: Built with React and Vite for a fast, responsive user interface.
- Backend: Uses Google Apps Script (GAS) to treat Google Sheets as a database.
- AI Integration: Uses Google Gemini 1.5 Flash for processing and generating human-like text.

3. CORE FUNCTIONALITIES
-----------------------

A. TASK MANAGEMENT
- Tasks are stored in a Google Sheet tab named "Tasks".
- Users can view their assigned tasks, mark them as complete, and track their progress.
- Admins can assign new tasks through the dashboard.

B. AI MOTIVATION (NUDGES)
- Upon logging in, the system counts the number of pending tasks.
- It sends this count to Gemini AI, which returns a short, energetic motivational message tailored to the workload.

C. SCORING & GAMIFICATION
- Completion on time: +10 points.
- Late completion: +5 points.
- Scores are automatically updated in the "Members" sheet in real-time.

D. WEEKLY PERFORMANCE FEEDBACK
- The system can generate a weekly summary for each team member.
- Gemini AI reviews the member's score and the list of tasks completed/pending to provide constructive feedback.

E. ADMIN DASHBOARD
- Provides a bird's-eye view of all team members.
- Shows total completed vs pending tasks per member.
- Allows resetting scores at the start of a new week.

4. DATA FLOW
------------
1. User interacts with the UI (e.g., clicks "Mark Done").
2. React app sends a POST request to the Google Apps Script Web App URL.
3. Apps Script updates the Google Sheet and calculates scores.
4. Apps Script returns a success response to the React app.
5. The UI refreshes to show updated data.

5. SETUP SUMMARY
----------------
- Configure .env with your VITE_GAS_WEB_APP_URL and VITE_GEMINI_API_KEY.
- Deploy the script in BACKEND_SETUP.md to your Google Sheet's Apps Script editor.
- Ensure the Sheet has "Tasks" and "Members" tabs with correct headers.

=====================================================
Generated on: 2026-05-01
