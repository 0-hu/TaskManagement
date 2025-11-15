import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId?: string) {
    const where = userId ? { assignments: { some: { userId } } } : {};

    const [totalTasks, todoTasks, inProgressTasks, completedTasks, onHoldTasks] =
      await Promise.all([
        this.prisma.task.count({ where }),
        this.prisma.task.count({ where: { ...where, status: 'TODO' } }),
        this.prisma.task.count({ where: { ...where, status: 'IN_PROGRESS' } }),
        this.prisma.task.count({ where: { ...where, status: 'COMPLETED' } }),
        this.prisma.task.count({ where: { ...where, status: 'ON_HOLD' } }),
      ]);

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
    const [
      statusDistribution,
      priorityDistribution,
      typeDistribution,
      averageProgress,
    ] = await Promise.all([
      this.prisma.task.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      this.prisma.task.groupBy({
        by: ['priority'],
        _count: { priority: true },
      }),
      this.prisma.task.groupBy({
        by: ['type'],
        _count: { type: true },
      }),
      this.prisma.task.aggregate({
        _avg: { progress: true },
      }),
    ]);

    return {
      byStatus: statusDistribution.map((item: any) => ({
        status: item.status,
        count: item._count.status,
      })),
      byPriority: priorityDistribution.map((item: any) => ({
        priority: item.priority,
        count: item._count.priority,
      })),
      byType: typeDistribution.map((item: any) => ({
        type: item.type,
        count: item._count.type,
      })),
      averageProgress: Math.round(averageProgress._avg.progress || 0),
    };
  }

  async getSubmissionStats() {
    const [
      totalSubmissions,
      pendingSubmissions,
      submittedSubmissions,
      approvedSubmissions,
      rejectedSubmissions,
    ] = await Promise.all([
      this.prisma.taskSubmission.count(),
      this.prisma.taskSubmission.count({ where: { status: 'PENDING' } }),
      this.prisma.taskSubmission.count({ where: { status: 'SUBMITTED' } }),
      this.prisma.taskSubmission.count({ where: { status: 'APPROVED' } }),
      this.prisma.taskSubmission.count({ where: { status: 'REJECTED' } }),
    ]);

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
    const [assignedTasks, createdTasks, submissions, completedTasks] =
      await Promise.all([
        this.prisma.taskAssignment.count({ where: { userId } }),
        this.prisma.task.count({ where: { createdById: userId } }),
        this.prisma.taskSubmission.count({ where: { submittedBy: userId } }),
        this.prisma.task.count({
          where: {
            assignments: { some: { userId } },
            status: 'COMPLETED',
          },
        }),
      ]);

    const completionRate =
      assignedTasks > 0
        ? Math.round((completedTasks / assignedTasks) * 100)
        : 0;

    return {
      assignedTasks,
      createdTasks,
      submissions,
      completedTasks,
      completionRate,
    };
  }

  async getDepartmentStats(departmentId: string) {
    const [totalTasks, completedTasks, members, avgProgress] =
      await Promise.all([
        this.prisma.task.count({ where: { departmentId } }),
        this.prisma.task.count({
          where: { departmentId, status: 'COMPLETED' },
        }),
        this.prisma.departmentMember.count({ where: { departmentId } }),
        this.prisma.task.aggregate({
          where: { departmentId },
          _avg: { progress: true },
        }),
      ]);

    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      members,
      completionRate,
      averageProgress: Math.round(avgProgress._avg.progress || 0),
    };
  }

  async getMonthlyTrend() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const tasks = await this.prisma.task.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
    });

    // Group by month
    type MonthlyStats = Record<string, { total: number; completed: number; inProgress: number; todo: number }>;
    const monthlyData = tasks.reduce((acc: MonthlyStats, task: any) => {
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
      .map(([month, data]: [string, any]) => ({
        month,
        ...data,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  async getDepartmentComparison() {
    const departments = await this.prisma.department.findMany({
      include: {
        _count: {
          select: { tasks: true, members: true },
        },
      },
    });

    const departmentStats = await Promise.all(
      departments.map(async (dept: any) => {
        const completedTasks = await this.prisma.task.count({
          where: {
            departmentId: dept.id,
            status: 'COMPLETED',
          },
        });

        const completionRate =
          dept._count.tasks > 0
            ? Math.round((completedTasks / dept._count.tasks) * 100)
            : 0;

        return {
          id: dept.id,
          name: dept.name,
          totalTasks: dept._count.tasks,
          completedTasks,
          members: dept._count.members,
          completionRate,
        };
      }),
    );

    return departmentStats;
  }
}
