import { GoogleGenAI, Type } from "@google/genai";

const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function getMotivationalNudge(pendingCount: number): Promise<string> {
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return "Ready to crush those tasks? You've got this!";
  }
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(`Generate a short, punchy motivational nudge for a team member who has ${pendingCount} tasks pending for today. Keep it under 15 words. Tone should be energetic and supportive.`);
    return response.response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Every small step counts towards your big goal!";
  }
}

export async function getWeeklyFeedback(memberName: string, score: number, tasks: any[]): Promise<string> {
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return "Great effort this week! Keep it up.";
  }
  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(`Provide a short feedback comment (1-2 sentences) for ${memberName} based on their weekly task performance score of ${score}. Tasks include: ${JSON.stringify(tasks)}. Be constructive and encouraging.`);
    return response.response.text().trim();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Great effort this week! Let's aim for a higher score next time.";
  }
}
