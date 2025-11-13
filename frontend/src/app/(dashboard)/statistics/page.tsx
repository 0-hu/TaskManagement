'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuthStore } from '@/stores/auth-store';
import { statsApi } from '@/lib/api';
import type { DashboardStats, TaskStats, MonthlyTrendData } from '@/lib/api/stats';
import { Download, TrendingUp } from 'lucide-react';

const COLORS = {
  TODO: '#4CAF50',
  IN_PROGRESS: '#4D7CFF',
  COMPLETED: '#EC407A',
  ON_HOLD: '#9E9E9E',
};

const STATUS_LABELS = {
  TODO: '할일',
  IN_PROGRESS: '진행중',
  COMPLETED: '완료',
  ON_HOLD: '대기',
};

export default function StatisticsPage() {
  const { token } = useAuthStore();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [monthlyTrend, setMonthlyTrend] = useState<MonthlyTrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [dashboard, tasks, trend] = await Promise.all([
        statsApi.getDashboardStats(token!),
        statsApi.getTaskStats(token!),
        statsApi.getMonthlyTrend(token!),
      ]);

      setDashboardStats(dashboard);
      setTaskStats(tasks);
      setMonthlyTrend(trend);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const taskStatusData = taskStats?.byStatus.map((item) => ({
    name: STATUS_LABELS[item.status as keyof typeof STATUS_LABELS] || item.status,
    value: item.count,
    color: COLORS[item.status as keyof typeof COLORS] || '#9E9E9E',
  })) || [];

  const monthlyData = monthlyTrend.map((item) => ({
    month: item.month.substring(5), // YYYY-MM -> MM
    completed: item.completed,
    inProgress: item.inProgress,
    todo: item.todo,
  }));

  const metrics = [
    {
      label: '전체 완료율',
      value: `${dashboardStats?.completionRate.toFixed(1) || 0}%`,
      change: '+5.2%',
      up: true,
    },
    {
      label: '평균 진행률',
      value: `${dashboardStats?.averageProgress.toFixed(1) || 0}%`,
      change: '+3.1%',
      up: true,
    },
    {
      label: '진행중 업무',
      value: `${dashboardStats?.inProgressTasks || 0}개`,
      change: '+2개',
      up: true,
    },
    {
      label: '완료된 업무',
      value: `${dashboardStats?.completedTasks || 0}개`,
      change: '+12개',
      up: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ui-text">통계</h1>
          <p className="text-sm text-ui-textSecondary mt-1">
            업무 현황과 생산성 지표를 확인하세요
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-sm font-medium">
            <Download className="w-4 h-4" />
            <span>리포트 다운로드</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-card border border-ui-border hover:shadow-card-hover transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-ui-textSecondary">{metric.label}</div>
              <TrendingUp className={`w-4 h-4 ${metric.up ? 'text-green-600' : 'text-red-600'}`} />
            </div>
            <div className="text-3xl font-bold text-ui-text mb-2">{metric.value}</div>
            <div className={`text-sm font-medium ${metric.up ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change} {metric.up ? '↑' : '↓'}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Task Status Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">업무 상태 분포</h3>
          {taskStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-ui-textSecondary">
              데이터가 없습니다
            </div>
          )}
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">우선순위 분포</h3>
          {taskStats?.byPriority && taskStats.byPriority.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskStats.byPriority}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#4D7CFF" name="업무 수" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-ui-textSecondary">
              데이터가 없습니다
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">월별 업무 추이</h3>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#EC407A" name="완료" radius={[8, 8, 0, 0]} />
                <Bar dataKey="inProgress" fill="#4D7CFF" name="진행중" radius={[8, 8, 0, 0]} />
                <Bar dataKey="todo" fill="#4CAF50" name="할일" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-ui-textSecondary">
              데이터가 없습니다
            </div>
          )}
        </div>

        {/* Task Type Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">업무 유형 분포</h3>
          {taskStats?.byType && taskStats.byType.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStats.byType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, count }) => `${type}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  <Cell fill="#4D7CFF" />
                  <Cell fill="#EC407A" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-ui-textSecondary">
              데이터가 없습니다
            </div>
          )}
        </div>
      </div>

      {/* Monthly Trend Line Chart */}
      <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
        <h3 className="text-lg font-bold text-ui-text mb-4">월별 트렌드 분석</h3>
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#EC407A"
                strokeWidth={3}
                name="완료"
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="inProgress"
                stroke="#4D7CFF"
                strokeWidth={3}
                name="진행중"
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="todo"
                stroke="#4CAF50"
                strokeWidth={3}
                name="할일"
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-ui-textSecondary">
            데이터가 없습니다
          </div>
        )}
      </div>
    </div>
  );
}
