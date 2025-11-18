export type TaskStatus = "planned" | "in_progress" | "blocked" | "completed";

export type Priority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  progress: number;
  dueDate: string;
  assignees: Array<{ name: string; avatarUrl?: string }>;
  tags?: string[];
  category: "personal" | "department" | "all";
};

export type Summary = {
  total: number;
  inProgress: number;
  blocked: number;
  planned: number;
};
