'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/atoms/avatar';
import {
  List,
  Layers,
  Target,
  AlertTriangle,
  Calendar,
  Plus,
  ChevronRight,
  MoreVertical,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { statsApi, tasksApi } from '@/lib/api';
import type { DashboardStats } from '@/lib/api/stats';
import type { Task } from '@/types/task';

export default function DashboardPage() {
  const { token } = useAuthStore();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [stats, tasksResponse] = await Promise.all([
          statsApi.getDashboardStats(token),
          tasksApi.getAll({ page: 1, limit: 9 }, token),
        ]);

        setDashboardStats(stats);
        setRecentTasks(tasksResponse.tasks || []);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ui-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ui-textSecondary">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-ui-text font-medium mb-2">데이터를 불러오는데 실패했습니다</p>
          <p className="text-ui-textSecondary text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: '전체 업무',
      value: dashboardStats?.totalTasks || 0,
      description: `완료율 ${dashboardStats?.completionRate.toFixed(1) || 0}%`,
      color: 'bg-stat-total',
      icon: List,
    },
    {
      label: '진행 중',
      value: dashboardStats?.inProgressTasks || 0,
      description: `평균 진행률 ${dashboardStats?.averageProgress.toFixed(1) || 0}%`,
      color: 'bg-stat-inProgress',
      icon: Layers,
    },
    {
      label: '완료',
      value: dashboardStats?.completedTasks || 0,
      description: `전체 ${dashboardStats?.totalTasks || 0}건 중`,
      color: 'bg-stat-completed',
      icon: Target,
    },
    {
      label: '예정',
      value: dashboardStats?.scheduledTasks || 0,
      description: '곧 시작 예정',
      color: 'bg-stat-scheduled',
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ui-text">대시보드</h1>
        <p className="text-sm text-ui-textSecondary mt-1">
          업무 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all border border-ui-border"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <button className="text-ui-textSecondary hover:text-ui-text">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <div className="text-3xl font-bold text-ui-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-ui-text mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-ui-textSecondary mb-3">
                {stat.description}
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`${stat.color} h-1.5 rounded-full transition-all`}
                  style={{ width: `${(stat.value / 138) * 100}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-ui-border">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {['전체', '개인 업무', '부서 업무', '생성', '우선순위'].map((filter) => (
              <button
                key={filter}
                className="px-4 py-2 text-sm font-medium rounded-xl border border-ui-border hover:bg-gray-50 hover:border-ui-primary transition-all"
              >
                {filter}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-ui-border hover:bg-gray-50 transition-all ml-auto">
            <Calendar className="w-4 h-4" />
            <span>기간 2025.10 - 2025.11</span>
          </button>
          <button className="px-5 py-2 text-sm font-medium bg-ui-primary text-white rounded-xl hover:bg-blue-600 shadow-sm transition-all">
            적용
          </button>
        </div>
      </div>

      {/* Task Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ui-text">최근 업무</h2>
          <button className="flex items-center gap-1 text-sm text-ui-primary hover:underline font-medium">
            <span>더보기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {recentTasks.slice(0, 6).map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all border border-ui-border cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getStatusColor(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
                <button className="text-ui-textSecondary hover:text-ui-text">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-ui-text mb-3 line-clamp-2 leading-snug">
                {task.title}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <Avatar name={task.createdById} size="xs" />
                <span className="text-sm text-ui-textSecondary">{task.createdById.split('-')[0]}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-ui-textSecondary">진행률</span>
                  <span className="font-medium text-ui-text">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-ui-primary h-2 rounded-full transition-all"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ui-text">업무 목록</h2>
          <button className="flex items-center gap-1 text-sm text-ui-primary hover:underline font-medium">
            <span>더보기</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-card border border-ui-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-ui-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                  생성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                  마감일
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                  우선순위
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border">
              {recentTasks.slice(0, 5).map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-ui-text">
                    {task.title}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={task.createdById} size="xs" />
                      <span className="text-sm text-ui-text">{task.createdById.split('-')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ui-textSecondary">
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString('ko-KR') : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAB Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-ui-primary text-white rounded-2xl shadow-lg hover:shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center group">
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
      </button>
    </div>
  );
}

// Helper functions
function getStatusColor(status: string): string {
  switch (status) {
    case 'TODO':
      return 'bg-gray-50 text-gray-700';
    case 'IN_PROGRESS':
      return 'bg-blue-50 text-blue-700';
    case 'COMPLETED':
      return 'bg-green-50 text-green-700';
    case 'ON_HOLD':
      return 'bg-amber-50 text-amber-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'TODO':
      return '할일';
    case 'IN_PROGRESS':
      return '진행중';
    case 'COMPLETED':
      return '완료';
    case 'ON_HOLD':
      return '대기';
    default:
      return status;
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'LOW':
      return 'bg-green-50 text-green-700';
    case 'MEDIUM':
      return 'bg-amber-50 text-amber-700';
    case 'HIGH':
      return 'bg-orange-50 text-orange-700';
    case 'URGENT':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
}

function getPriorityLabel(priority: string): string {
  switch (priority) {
    case 'LOW':
      return '낮음';
    case 'MEDIUM':
      return '중간';
    case 'HIGH':
      return '높음';
    case 'URGENT':
      return '긴급';
    default:
      return priority;
  }
}
