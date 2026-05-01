export type TaskType = 'Daily' | 'Weekly' | 'One-time';
export type TaskStatus = 'Pending' | 'Done';

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  assignedTo: string;
  plannedDate: string;
  actualCompletionDate?: string;
  status: TaskStatus;
}

export interface Member {
  name: string;
  weeklyScore: number;
  feedback?: string;
}

export interface GASResponse {
  success: boolean;
  tasks?: Task[];
  members?: Member[];
  error?: string;
}
