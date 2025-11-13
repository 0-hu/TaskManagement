import { ApiClient } from './client';
import { Task, TaskStatus, Priority, TaskType } from '@/types/task';

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  type?: TaskType;
  startDate?: string;
  dueDate?: string;
  departmentId?: string;
  assignedUserIds?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  type?: TaskType;
  startDate?: string;
  dueDate?: string;
  departmentId?: string;
}

export interface QueryTaskDto {
  status?: TaskStatus;
  priority?: Priority;
  type?: TaskType;
  departmentId?: string;
  assignedUserId?: string;
  createdById?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UpdateTaskStatusDto {
  status: TaskStatus;
}

export interface UpdateTaskProgressDto {
  progress: number;
}

export interface AssignTaskDto {
  userIds: string[];
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

export const tasksApi = {
  // Create a new task
  create: (data: CreateTaskDto, token: string): Promise<Task> => {
    return ApiClient.post('/tasks', data, token);
  },

  // Get all tasks with optional filters
  getAll: (query: QueryTaskDto = {}, token: string): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks?${queryString}` : '/tasks';
    return ApiClient.get(endpoint, token);
  },

  // Get tasks assigned to current user
  getMyTasks: (query: QueryTaskDto = {}, token: string): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks/my?${queryString}` : '/tasks/my';
    return ApiClient.get(endpoint, token);
  },

  // Get tasks created by current user
  getCreatedByMe: (query: QueryTaskDto = {}, token: string): Promise<TasksResponse> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks/created-by-me?${queryString}` : '/tasks/created-by-me';
    return ApiClient.get(endpoint, token);
  },

  // Get a single task by ID
  getOne: (id: string, token: string): Promise<Task> => {
    return ApiClient.get(`/tasks/${id}`, token);
  },

  // Update a task
  update: (id: string, data: UpdateTaskDto, token: string): Promise<Task> => {
    return ApiClient.put(`/tasks/${id}`, data, token);
  },

  // Delete a task
  delete: (id: string, token: string): Promise<void> => {
    return ApiClient.delete(`/tasks/${id}`, token);
  },

  // Update task status
  updateStatus: (id: string, data: UpdateTaskStatusDto, token: string): Promise<Task> => {
    return ApiClient.put(`/tasks/${id}/status`, data, token);
  },

  // Update task progress
  updateProgress: (id: string, data: UpdateTaskProgressDto, token: string): Promise<Task> => {
    return ApiClient.put(`/tasks/${id}/progress`, data, token);
  },

  // Assign users to task
  assignUsers: (id: string, data: AssignTaskDto, token: string): Promise<Task> => {
    return ApiClient.post(`/tasks/${id}/assign`, data, token);
  },

  // Unassign a user from task
  unassignUser: (id: string, userId: string, token: string): Promise<Task> => {
    return ApiClient.delete(`/tasks/${id}/unassign/${userId}`, token);
  },
};
