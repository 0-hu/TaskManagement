// Adapter functions to convert between different data formats

import type { Task as MockTask } from "@/lib/mock-data";
import type { Task as UITask } from "@/types/task";
import { getUserById } from "@/lib/mock-data";

// Convert mock Task to UI Task format
export function convertMockTaskToUITask(mockTask: MockTask): UITask {
  // Map status
  const statusMap: Record<MockTask["status"], UITask["status"]> = {
    TODO: "planned",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    ON_HOLD: "blocked"
  };

  // Map priority
  const priorityMap: Record<MockTask["priority"], UITask["priority"]> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
    URGENT: "high" // Map URGENT to high
  };

  // Map assignees
  const assignees = mockTask.assignedTo.map(userId => {
    const user = getUserById(userId);
    return {
      name: user?.name || "Unknown",
      avatarUrl: user?.avatar
    };
  });

  // Determine category
  const category: UITask["category"] = mockTask.assignedTo.length === 1 ? "personal" : "department";

  return {
    id: mockTask.id,
    title: mockTask.title,
    description: mockTask.description,
    status: statusMap[mockTask.status],
    priority: priorityMap[mockTask.priority],
    progress: mockTask.progress,
    dueDate: mockTask.dueDate,
    assignees,
    category
  };
}

// Convert array of mock tasks to UI tasks
export function convertMockTasksToUITasks(mockTasks: MockTask[]): UITask[] {
  return mockTasks.map(convertMockTaskToUITask);
}
