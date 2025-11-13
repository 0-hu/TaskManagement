import { Avatar } from '@/components/atoms/avatar';
import {
  List,
  Layers,
  Target,
  CheckCircle2,
  Calendar,
  Plus,
  ChevronRight,
  MoreVertical,
  AlertTriangle,
} from 'lucide-react';

const sampleUsers = ['김철수', '이영희', '박민수', '정수진', '최민지'];

export default function DashboardPage() {
  const stats = [
    {
      label: '전체 업무',
      value: 138,
      description: '이번 달 생성 24건',
      color: 'bg-stat-total',
      icon: List,
    },
    {
      label: '진행 중',
      value: 54,
      description: '평균 처리 3.2일',
      color: 'bg-stat-inProgress',
      icon: Layers,
    },
    {
      label: '지연',
      value: 8,
      description: '평균 지연 2.4일',
      color: 'bg-stat-completed',
      icon: AlertTriangle,
    },
    {
      label: '이번 달 계획',
      value: 63,
      description: '검토 대기 11건',
      color: 'bg-stat-scheduled',
      icon: Target,
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
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all border border-ui-border cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg">
                  진행중
                </span>
                <button className="text-ui-textSecondary hover:text-ui-text">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-ui-text mb-3 line-clamp-2 leading-snug">
                월간 보고서 작성 및 검토 {i}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <Avatar name={sampleUsers[i % sampleUsers.length]} size="xs" />
                <span className="text-sm text-ui-textSecondary">{sampleUsers[i % sampleUsers.length]}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-ui-textSecondary">진행률</span>
                  <span className="font-medium text-ui-text">{50 + (i * 5)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-ui-primary h-2 rounded-full transition-all"
                    style={{ width: `${50 + (i * 5)}%` }}
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
                  담당자
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
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50 cursor-pointer transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-ui-text">
                    월간 보고서 작성 및 검토 {i}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={sampleUsers[i % sampleUsers.length]} size="xs" />
                      <span className="text-sm text-ui-text">{sampleUsers[i % sampleUsers.length]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg">
                      진행중
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-ui-textSecondary">
                    2025.11.{20 + i}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-lg">
                      중간
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
