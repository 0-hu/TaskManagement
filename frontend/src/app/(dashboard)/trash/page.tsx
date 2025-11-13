'use client';

import { useState } from 'react';
import { Avatar } from '@/components/atoms/avatar';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  Search,
  ChevronDown,
} from 'lucide-react';

const deletedTasks = [
  {
    id: 1,
    title: '삭제된 업무 1',
    deletedBy: '김철수',
    deletedAt: '2025-11-10 14:30',
    department: '개발팀',
    originalDueDate: '2025-11-15',
  },
  {
    id: 2,
    title: '삭제된 업무 2',
    deletedBy: '이영희',
    deletedAt: '2025-11-09 10:20',
    department: '디자인팀',
    originalDueDate: '2025-11-12',
  },
  {
    id: 3,
    title: '삭제된 업무 3',
    deletedBy: '박민수',
    deletedAt: '2025-11-08 16:45',
    department: '마케팅팀',
    originalDueDate: '2025-11-18',
  },
  {
    id: 4,
    title: '삭제된 업무 4',
    deletedBy: '정수진',
    deletedAt: '2025-11-07 09:15',
    department: '개발팀',
    originalDueDate: '2025-11-20',
  },
];

export default function TrashPage() {
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);

  const toggleSelection = (id: number) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectedTasks(
      selectedTasks.length === deletedTasks.length
        ? []
        : deletedTasks.map((t) => t.id)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ui-text">휴지통</h1>
          <p className="text-sm text-ui-textSecondary mt-1">
            삭제된 업무는 30일 후 영구 삭제됩니다
          </p>
        </div>
        <div className="flex gap-3">
          <button
            disabled={selectedTasks.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-sm border border-ui-border text-ui-text rounded-xl hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            <span>선택 항목 복원</span>
          </button>
          <button
            disabled={selectedTasks.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            <span>영구 삭제</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-ui-text mb-1">24</div>
              <div className="text-sm text-ui-textSecondary">삭제된 업무</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-1">12</div>
              <div className="text-sm text-ui-textSecondary">7일 이내 삭제 예정</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <div className="text-3xl font-bold text-red-600 mb-1">8</div>
              <div className="text-sm text-ui-textSecondary">30일 후 영구 삭제</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-ui-border">
        <div className="flex items-center gap-4">
          <div className="relative">
            <select className="px-4 py-2 text-sm border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary appearance-none pr-8">
              <option>전체 부서</option>
              <option>개발팀</option>
              <option>디자인팀</option>
              <option>마케팅팀</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-textSecondary pointer-events-none" />
          </div>
          <div className="relative">
            <select className="px-4 py-2 text-sm border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary appearance-none pr-8">
              <option>삭제일 순</option>
              <option>제목 순</option>
              <option>부서 순</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-textSecondary pointer-events-none" />
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-textSecondary" />
            <input
              type="text"
              placeholder="검색..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary"
            />
          </div>
        </div>
      </div>

      {/* Deleted Tasks Table */}
      <div className="bg-white rounded-xl shadow-card border border-ui-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-ui-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedTasks.length === deletedTasks.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                업무 제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                부서
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                삭제자
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                삭제일
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                원래 마감일
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ui-border">
            {deletedTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => toggleSelection(task.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-ui-text line-through">
                    {task.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-ui-textSecondary">
                  {task.department}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={task.deletedBy} size="xs" />
                    <span className="text-sm text-ui-text">{task.deletedBy}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-ui-textSecondary">
                  {task.deletedAt}
                </td>
                <td className="px-6 py-4 text-sm text-ui-textSecondary">
                  {task.originalDueDate}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ui-primary bg-blue-50 hover:bg-blue-100 rounded-xl transition-all">
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>복원</span>
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>영구 삭제</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Warning Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-yellow-800 mb-1">
              자동 삭제 안내
            </h4>
            <p className="text-sm text-yellow-700">
              휴지통의 항목은 30일이 지나면 자동으로 영구 삭제됩니다.
              복원이 필요한 항목은 기한 내에 복원해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
