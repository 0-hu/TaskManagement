import { Injectable } from '@nestjs/common';
import { InMemoryDatabase } from '../database/in-memory.database';

@Injectable()
export class StatsService {
  constructor(private db: InMemoryDatabase) {}

  async getDashboardStats(userId?: string) {
    let tasks = this.db.findAllTasks();

    if (userId) {
      // Filter tasks where user is assigned
      const userAssignments = this.db
        .findAllTasks()
        .map((task) => ({
          taskId: task.id,
          assignments: this.db.findTaskAssignments(task.id),
        }))
        .filter((item) => item.assignments.some((a) => a.userId === userId))
        .map((item) => item.taskId);

      tasks = tasks.filter((t) => userAssignments.includes(t.id));
    }

    const totalTasks = tasks.length;
    const todoTasks = tasks.filter((t) => t.status === 'TODO').length;
    const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS')
      .length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const onHoldTasks = tasks.filter((t) => t.status === 'ON_HOLD').length;

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      total: totalTasks,
      todo: todoTasks,
      inProgress: inProgressTasks,
      completed: completedTasks,
      onHold: onHoldTasks,
      completionRate,
    };
  }

  async getTaskStats() {
    const tasks = this.db.findAllTasks();

    // Group by status
    const statusMap: Record<string, number> = {};
    const priorityMap: Record<string, number> = {};
    const typeMap: Record<string, number> = {};
    let totalProgress = 0;

    tasks.forEach((task) => {
      statusMap[task.status] = (statusMap[task.status] || 0) + 1;
      priorityMap[task.priority] = (priorityMap[task.priority] || 0) + 1;
      typeMap[task.type] = (typeMap[task.type] || 0) + 1;
      totalProgress += task.progress;
    });

    const averageProgress =
      tasks.length > 0 ? Math.round(totalProgress / tasks.length) : 0;

    return {
      byStatus: Object.entries(statusMap).map(([status, count]) => ({
        status,
        count,
      })),
      byPriority: Object.entries(priorityMap).map(([priority, count]) => ({
        priority,
        count,
      })),
      byType: Object.entries(typeMap).map(([type, count]) => ({
        type,
        count,
      })),
      averageProgress,
    };
  }

  async getSubmissionStats() {
    const submissions = this.db.findAllTaskSubmissions();

    const totalSubmissions = submissions.length;
    const pendingSubmissions = submissions.filter(
      (s) => s.status === 'PENDING',
    ).length;
    const submittedSubmissions = submissions.filter(
      (s) => s.status === 'SUBMITTED',
    ).length;
    const approvedSubmissions = submissions.filter(
      (s) => s.status === 'APPROVED',
    ).length;
    const rejectedSubmissions = submissions.filter(
      (s) => s.status === 'REJECTED',
    ).length;

    const approvalRate =
      totalSubmissions > 0
        ? Math.round((approvedSubmissions / totalSubmissions) * 100)
        : 0;

    return {
      total: totalSubmissions,
      pending: pendingSubmissions,
      submitted: submittedSubmissions,
      approved: approvedSubmissions,
      rejected: rejectedSubmissions,
      approvalRate,
    };
  }

  async getUserStats(userId: string) {
    const tasks = this.db.findAllTasks();
    const submissions = this.db.findAllTaskSubmissions();

    // Count assigned tasks
    const assignedTaskIds = tasks
      .map((task) => ({
        taskId: task.id,
        assignments: this.db.findTaskAssignments(task.id),
      }))
      .filter((item) => item.assignments.some((a) => a.userId === userId))
      .map((item) => item.taskId);

    const assignedTasks = assignedTaskIds.length;

    // Count created tasks
    const createdTasks = tasks.filter((t) => t.createdById === userId).length;

    // Count submissions
    const userSubmissions = submissions.filter(
      (s) => s.submittedBy === userId,
    ).length;

    // Count completed tasks
    const completedTasks = tasks.filter(
      (t) => assignedTaskIds.includes(t.id) && t.status === 'COMPLETED',
    ).length;

    const completionRate =
      assignedTasks > 0
        ? Math.round((completedTasks / assignedTasks) * 100)
        : 0;

    return {
      assignedTasks,
      createdTasks,
      submissions: userSubmissions,
      completedTasks,
      completionRate,
    };
  }

  async getDepartmentStats(departmentId: string) {
    const tasks = this.db.findTasksByDepartmentId(departmentId);
    const members = this.db.findDepartmentMembers(departmentId);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'COMPLETED').length;
    const totalProgress = tasks.reduce((sum, t) => sum + t.progress, 0);
    const averageProgress =
      tasks.length > 0 ? Math.round(totalProgress / tasks.length) : 0;

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      members: members.length,
      completionRate,
      averageProgress,
    };
  }

  async getMonthlyTrend() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const tasks = this.db
      .findAllTasks()
      .filter((t) => t.createdAt >= sixMonthsAgo);

    // Group by month
    type MonthlyStats = Record<
      string,
      { total: number; completed: number; inProgress: number; todo: number }
    >;
    const monthlyData = tasks.reduce((acc: MonthlyStats, task) => {
      const month = task.createdAt.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { total: 0, completed: 0, inProgress: 0, todo: 0 };
      }
      acc[month].total++;
      if (task.status === 'COMPLETED') acc[month].completed++;
      if (task.status === 'IN_PROGRESS') acc[month].inProgress++;
      if (task.status === 'TODO') acc[month].todo++;
      return acc;
    }, {} as MonthlyStats);

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        ...data,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  async getDepartmentComparison() {
    const departments = this.db.findAllDepartments();

    const departmentStats = departments.map((dept) => {
      const tasks = this.db.findTasksByDepartmentId(dept.id);
      const members = this.db.findDepartmentMembers(dept.id);
      const completedTasks = tasks.filter((t) => t.status === 'COMPLETED')
        .length;
      const totalTasks = tasks.length;

      const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: dept.id,
        name: dept.name,
        totalTasks,
        completedTasks,
        members: members.length,
        completionRate,
      };
    });

    return departmentStats;
  }
}
