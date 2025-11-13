'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/atoms/avatar';
import {
  Plus,
  Users,
  CheckCircle2,
  Clock,
  MoreVertical,
  UserPlus,
  Edit2,
  Trash2,
  X,
  Search,
  Building2,
  ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { departmentsApi, tasksApi } from '@/lib/api';
import type { Department } from '@/types/user';
import type { DepartmentWithMembers } from '@/lib/api/departments';
import { Task, TaskStatus, Priority } from '@/types/task';

export default function DepartmentTasksPage() {
  const { token } = useAuthStore();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [departmentDetails, setDepartmentDetails] = useState<DepartmentWithMembers | null>(null);
  const [departmentTasks, setDepartmentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [createDeptModalOpen, setCreateDeptModalOpen] = useState(false);
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [deptFormData, setDeptFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (token) {
      fetchDepartments();
    }
  }, [token]);

  useEffect(() => {
    if (token && selectedDepartment) {
      fetchDepartmentDetails(selectedDepartment);
      fetchDepartmentTasks(selectedDepartment);
    }
  }, [token, selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentsApi.getAll(token!);
      setDepartments(data);
      if (data.length > 0 && !selectedDepartment) {
        setSelectedDepartment(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartmentDetails = async (deptId: string) => {
    try {
      const data = await departmentsApi.getOne(deptId, token!);
      setDepartmentDetails(data);
    } catch (error) {
      console.error('Failed to fetch department details:', error);
    }
  };

  const fetchDepartmentTasks = async (deptId: string) => {
    try {
      const response = await tasksApi.getAll({ departmentId: deptId }, token!);
      setDepartmentTasks(response.tasks || []);
    } catch (error) {
      console.error('Failed to fetch department tasks:', error);
    }
  };

  const handleCreateDepartment = async () => {
    if (!token || !deptFormData.name) return;

    try {
      await departmentsApi.create(deptFormData, token);
      setCreateDeptModalOpen(false);
      setDeptFormData({ name: '', description: '' });
      fetchDepartments();
    } catch (error) {
      console.error('Failed to create department:', error);
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    if (!token || !confirm('정말로 이 부서를 삭제하시겠습니까?')) return;

    try {
      await departmentsApi.delete(deptId, token);
      if (selectedDepartment === deptId) {
        setSelectedDepartment(null);
      }
      fetchDepartments();
    } catch (error) {
      console.error('Failed to delete department:', error);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ui-text">부서 업무</h1>
          <p className="text-sm text-ui-textSecondary mt-1">
            부서별 업무를 관리하고 팀원에게 할당하세요
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setCreateDeptModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-ui-border rounded-xl hover:bg-gray-50 transition-all font-medium"
          >
            <Users className="w-4 h-4" />
            <span>부서 생성</span>
          </button>
          {selectedDepartment && (
            <button
              onClick={() => setCreateTaskModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-sm font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>업무 추가</span>
            </button>
          )}
        </div>
      </div>

      {/* Department Selection */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-ui-border">
        <div className="flex items-center gap-4 overflow-x-auto">
          <span className="text-sm font-semibold text-ui-text whitespace-nowrap">부서 선택:</span>
          <div className="flex gap-2">
            {departments.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDepartment(dept.id)}
                className={`px-4 py-2 text-sm rounded-xl whitespace-nowrap font-medium transition-all ${
                  selectedDepartment === dept.id
                    ? 'bg-ui-primary text-white shadow-sm'
                    : 'border border-ui-border hover:bg-gray-50'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {departments.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-card border border-ui-border">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-ui-text mb-2">부서가 없습니다</h2>
          <p className="text-ui-textSecondary mb-6">
            새로운 부서를 생성하여 팀 업무를 관리하세요
          </p>
          <button
            onClick={() => setCreateDeptModalOpen(true)}
            className="px-6 py-2 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all"
          >
            + 부서 생성
          </button>
        </div>
      )}

      {selectedDepartment && departmentDetails && (
        <>
          {/* Department Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-ui-text">
                    {departmentDetails.members.length}
                  </div>
                  <div className="text-sm text-ui-textSecondary">팀원</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-ui-text">
                    {departmentTasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length}
                  </div>
                  <div className="text-sm text-ui-textSecondary">진행중 업무</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-card border border-ui-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-ui-text">
                    {departmentTasks.filter((t) => t.status === TaskStatus.COMPLETED).length}
                  </div>
                  <div className="text-sm text-ui-textSecondary">완료 업무</div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ui-text">팀원 목록</h2>
              <button
                onClick={() => setAddMemberModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-ui-border rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
              >
                <UserPlus className="w-4 h-4" />
                <span>팀원 추가</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-card border border-ui-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-ui-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                      팀원
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                      이메일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                      역할
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                      가입일
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                      액션
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ui-border">
                  {departmentDetails.members.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar name={member.user.name} size="sm" />
                          <span className="text-sm font-medium text-ui-text">
                            {member.user.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-textSecondary">
                        {member.user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-lg ${
                            member.role === 'LEADER'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-gray-50 text-gray-700'
                          }`}
                        >
                          {member.role === 'LEADER' ? '팀장' : '팀원'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-textSecondary">
                        {new Date(member.joinedAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            departmentsApi.removeMember(selectedDepartment, member.userId, token!)
                              .then(() => fetchDepartmentDetails(selectedDepartment))
                          }
                          className="text-sm text-red-600 hover:underline"
                        >
                          제거
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-ui-text">부서 업무</h2>
              <div className="flex gap-2">
                <select className="px-3 py-2 text-sm border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30">
                  <option value="">모든 상태</option>
                  <option value={TaskStatus.TODO}>할일</option>
                  <option value={TaskStatus.IN_PROGRESS}>진행중</option>
                  <option value={TaskStatus.COMPLETED}>완료</option>
                  <option value={TaskStatus.ON_HOLD}>대기</option>
                </select>
              </div>
            </div>

            {departmentTasks.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-card border border-ui-border">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <ClipboardList className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-ui-text mb-2">부서 업무가 없습니다</h2>
                <p className="text-ui-textSecondary mb-6">
                  새로운 부서 업무를 생성하세요
                </p>
                <button
                  onClick={() => setCreateTaskModalOpen(true)}
                  className="px-6 py-2 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all"
                >
                  + 업무 추가
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {departmentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all border border-ui-border cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {getStatusLabel(task.status)}
                      </span>
                      <button className="text-ui-textSecondary hover:text-ui-text opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-semibold text-ui-text mb-3 line-clamp-2">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-ui-textSecondary mb-3 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-ui-textSecondary">진행률</span>
                        <span className="font-medium text-ui-text">{task.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-ui-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Department Modal */}
      {createDeptModalOpen && (
        <Modal onClose={() => setCreateDeptModalOpen(false)}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-ui-text">새 부서 생성</h3>
              <button
                onClick={() => setCreateDeptModalOpen(false)}
                className="text-ui-textSecondary hover:text-ui-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ui-text mb-2">
                  부서명 *
                </label>
                <input
                  type="text"
                  value={deptFormData.name}
                  onChange={(e) =>
                    setDeptFormData({ ...deptFormData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary"
                  placeholder="부서명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ui-text mb-2">
                  설명
                </label>
                <textarea
                  value={deptFormData.description}
                  onChange={(e) =>
                    setDeptFormData({ ...deptFormData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary resize-none"
                  rows={3}
                  placeholder="부서 설명을 입력하세요"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-ui-border">
              <button
                onClick={() => setCreateDeptModalOpen(false)}
                className="px-6 py-2.5 border border-ui-border rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                취소
              </button>
              <button
                onClick={handleCreateDepartment}
                disabled={!deptFormData.name}
                className="px-6 py-2.5 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                생성
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Modal Component
function Modal({
  children,
  onClose,
  size = 'md',
}: {
  children: React.ReactNode;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
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
