import { ApiClient } from './client';

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  scheduledTasks: number;
  completionRate: number;
  averageProgress: number;
}

export interface TaskStats {
  byStatus: {
    status: string;
    count: number;
  }[];
  byPriority: {
    priority: string;
    count: number;
  }[];
  byType: {
    type: string;
    count: number;
  }[];
}

export interface MonthlyTrendData {
  month: string;
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}

export interface UserPerformance {
  userId: string;
  userName: string;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  completionRate: number;
  averageProgress: number;
}

export const statsApi = {
  // Get overall dashboard statistics
  getDashboardStats: (token: string): Promise<DashboardStats> => {
    return ApiClient.get('/stats/dashboard', token);
  },

  // Get task statistics (by status, priority, type)
  getTaskStats: (token: string): Promise<TaskStats> => {
    return ApiClient.get('/stats/tasks', token);
  },

  // Get monthly trend data (last 6 months)
  getMonthlyTrend: (token: string): Promise<MonthlyTrendData[]> => {
    return ApiClient.get('/stats/monthly-trend', token);
  },

  // Get user performance statistics
  getUserPerformance: (userId: string, token: string): Promise<UserPerformance> => {
    return ApiClient.get(`/stats/user/${userId}`, token);
  },

  // Get department statistics
  getDepartmentStats: (departmentId: string, token: string): Promise<DashboardStats> => {
    return ApiClient.get(`/stats/department/${departmentId}`, token);
  },
};
