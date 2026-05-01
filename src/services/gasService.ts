import { Task, GASResponse, Member } from '../types';

const GAS_URL = (import.meta as any).env.VITE_GAS_WEB_APP_URL || '';

// Mock data for development
const MOCK_TASKS: Task[] = [
  { id: '1', name: 'Update daily logs', type: 'Daily', assignedTo: 'User', plannedDate: new Date().toISOString(), status: 'Pending' },
  { id: '2', name: 'Weekly sync report', type: 'Weekly', assignedTo: 'User', plannedDate: new Date().toISOString(), status: 'Pending' },
  { id: '3', name: 'Bug fix #402', type: 'One-time', assignedTo: 'User', plannedDate: new Date().toISOString(), status: 'Pending' },
];

const MOCK_MEMBERS: Member[] = [
  { name: 'Kriatgya', weeklyScore: 85, feedback: 'Great performance this week!' },
  { name: 'Alex', weeklyScore: 92, feedback: 'Exceeding expectations. Keep it up.' },
  { name: 'Sam', weeklyScore: 78, feedback: 'Good effort, try to stay on top of daily tasks.' },
];

export async function fetchTasks(memberName: string): Promise<Task[]> {
  if (!GAS_URL) {
    console.warn("GAS_URL not set. Using mock data.");
    return MOCK_TASKS;
  }

  try {
    const url = `${GAS_URL}?action=getTasks&member=${encodeURIComponent(memberName)}`;
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: GASResponse = await response.json();
    return data.tasks || [];
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    // Return empty array instead of failing completely to keep UI stable
    return [];
  }
}

export async function updateTaskStatus(taskId: string, status: 'Done'): Promise<boolean> {
  if (!GAS_URL) {
    console.warn("GAS_URL not set. Simulating update.");
    return true;
  }

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors', // Use no-cors for GAS POST requests to avoid preflight issues
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'updateTask', taskId, status, completionDate: new Date().toISOString() }),
    });
    
    // With no-cors, we can't read the response, so we assume success if no error thrown
    return true;
  } catch (error) {
    console.error("Update Task Error:", error);
    return false;
  }
}

export async function fetchMembers(): Promise<Member[]> {
  if (!GAS_URL) {
    return MOCK_MEMBERS;
  }
  try {
    const response = await fetch(`${GAS_URL}?action=getMembers`);
    const data: GASResponse = await response.json();
    return data.members || [];
  } catch (error) {
    return MOCK_MEMBERS;
  }
}

export async function assignTask(task: Partial<Task>): Promise<boolean> {
  if (!GAS_URL) return true;
  try {
    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'assignTask', ...task }),
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function resetScores(): Promise<boolean> {
  if (!GAS_URL) return true;
  try {
    await fetch(GAS_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ action: 'resetScores' }),
    });
    return true;
  } catch (error) {
    return false;
  }
}

export async function fetchAdminSummary(): Promise<any> {
  if (!GAS_URL) return {};
  try {
    const response = await fetch(`${GAS_URL}?action=getAdminSummary`);
    const data = await response.json();
    return data.summary || {};
  } catch (error) {
    return {};
  }
}
