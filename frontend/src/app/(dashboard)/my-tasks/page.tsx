'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/atoms/avatar';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  ChevronDown,
  ClipboardList,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { tasksApi, type CreateTaskDto, type UpdateTaskDto } from '@/lib/api';
import { Task, TaskStatus, Priority, TaskType } from '@/types/task';

export default function MyTasksPage() {
  const { token, user } = useAuthStore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    status?: TaskStatus;
    priority?: Priority;
    search?: string;
  }>({});

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form state
  const [formData, setFormData] = useState<Partial<CreateTaskDto>>({
    title: '',
    description: '',
    priority: Priority.MEDIUM,
    status: TaskStatus.TODO,
    type: TaskType.PERSONAL,
  });

  useEffect(() => {
    if (token) {
      fetchMyTasks();
    }
  }, [token, filter]);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const response = await tasksApi.getMyTasks(filter, token!);
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!token || !formData.title) return;

    try {
      await tasksApi.create(formData as CreateTaskDto, token);
      setCreateModalOpen(false);
      resetForm();
      fetchMyTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateTask = async () => {
    if (!token || !selectedTask) return;

    try {
      await tasksApi.update(selectedTask.id, formData as UpdateTaskDto, token);
      setEditModalOpen(false);
      resetForm();
      setSelectedTask(null);
      fetchMyTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (!token || !selectedTask) return;

    try {
      await tasksApi.delete(selectedTask.id, token);
      setDeleteModalOpen(false);
      setSelectedTask(null);
      fetchMyTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    if (!token) return;

    try {
      await tasksApi.updateStatus(taskId, { status }, token);
      fetchMyTasks();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleProgressChange = async (taskId: string, progress: number) => {
    if (!token) return;

    try {
      await tasksApi.updateProgress(taskId, { progress }, token);
      fetchMyTasks();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      status: TaskStatus.TODO,
      type: TaskType.PERSONAL,
    });
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      type: task.type,
      startDate: task.startDate,
      dueDate: task.dueDate,
    });
    setEditModalOpen(true);
  };

  const openDetailModal = (task: Task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  const openDeleteModal = (task: Task) => {
    setSelectedTask(task);
    setDeleteModalOpen(true);
  };

  const tasksByStatus = {
    TODO: tasks.filter((t) => t.status === TaskStatus.TODO),
    IN_PROGRESS: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS),
    COMPLETED: tasks.filter((t) => t.status === TaskStatus.COMPLETED),
    ON_HOLD: tasks.filter((t) => t.status === TaskStatus.ON_HOLD),
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
          <h1 className="text-2xl font-bold text-ui-text">내 업무</h1>
          <p className="text-sm text-ui-textSecondary mt-1">
            내가 담당한 업무 {tasks.length}개
          </p>
        </div>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">업무 추가</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-ui-border">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-textSecondary" />
            <input
              type="text"
              placeholder="업무 검색..."
              className="w-full pl-10 pr-4 py-2 border border-ui-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, search: e.target.value }))
              }
            />
          </div>
          <select
            className="px-4 py-2 border border-ui-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                status: e.target.value as TaskStatus | undefined,
              }))
            }
          >
            <option value="">모든 상태</option>
            <option value={TaskStatus.TODO}>할일</option>
            <option value={TaskStatus.IN_PROGRESS}>진행중</option>
            <option value={TaskStatus.COMPLETED}>완료</option>
            <option value={TaskStatus.ON_HOLD}>대기</option>
          </select>
          <select
            className="px-4 py-2 border border-ui-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                priority: e.target.value as Priority | undefined,
              }))
            }
          >
            <option value="">모든 우선순위</option>
            <option value={Priority.LOW}>낮음</option>
            <option value={Priority.MEDIUM}>중간</option>
            <option value={Priority.HIGH}>높음</option>
            <option value={Priority.URGENT}>긴급</option>
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                {status === 'TODO' && <Clock className="w-4 h-4 text-gray-500" />}
                {status === 'IN_PROGRESS' && <AlertCircle className="w-4 h-4 text-blue-500" />}
                {status === 'COMPLETED' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                {status === 'ON_HOLD' && <Clock className="w-4 h-4 text-amber-500" />}
                <h3 className="font-semibold text-ui-text">
                  {getStatusLabel(status as TaskStatus)}
                </h3>
                <span className="text-xs font-medium text-ui-textSecondary bg-gray-100 px-2 py-0.5 rounded-full">
                  {statusTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {statusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onView={openDetailModal}
                  onEdit={openEditModal}
                  onDelete={openDeleteModal}
                  onStatusChange={handleStatusChange}
                  onProgressChange={handleProgressChange}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-card border border-ui-border">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
              <ClipboardList className="w-12 h-12 text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-ui-text mb-2">업무가 없습니다</h2>
          <p className="text-ui-textSecondary mb-6">
            새로운 업무를 생성하거나 할당받아 보세요
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-6 py-2 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all"
          >
            + 업무 추가
          </button>
        </div>
      )}

      {/* Create Modal */}
      {createModalOpen && (
        <TaskFormModal
          title="새 업무 추가"
          formData={formData}
          setFormData={setFormData}
          onSave={handleCreateTask}
          onClose={() => {
            setCreateModalOpen(false);
            resetForm();
          }}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && selectedTask && (
        <TaskFormModal
          title="업무 수정"
          formData={formData}
          setFormData={setFormData}
          onSave={handleUpdateTask}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedTask(null);
            resetForm();
          }}
        />
      )}

      {/* Detail Modal */}
      {detailModalOpen && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedTask(null);
          }}
          onEdit={() => {
            setDetailModalOpen(false);
            openEditModal(selectedTask);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedTask && (
        <Modal onClose={() => setDeleteModalOpen(false)}>
          <div className="p-6">
            <h3 className="text-lg font-bold text-ui-text mb-2">업무 삭제</h3>
            <p className="text-ui-textSecondary mb-6">
              &ldquo;{selectedTask.title}&rdquo; 업무를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-ui-border rounded-xl hover:bg-gray-50 transition-all"
              >
                취소
              </button>
              <button
                onClick={handleDeleteTask}
                className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
              >
                삭제
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Task Card Component
function TaskCard({
  task,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onProgressChange,
}: {
  task: Task;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onProgressChange: (id: string, progress: number) => void;
}) {
  const [showActions, setShowActions] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <div
      className="bg-white rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all border border-ui-border cursor-pointer group"
      onClick={() => onView(task)}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg ${getPriorityColor(task.priority)}`}>
          {getPriorityLabel(task.priority)}
        </span>
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="text-ui-textSecondary hover:text-ui-text opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showActions && (
            <div className="absolute right-0 top-6 bg-white rounded-xl shadow-lg border border-ui-border py-1 z-10 min-w-[120px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit2 className="w-3.5 h-3.5" />
                수정
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <h4 className="font-semibold text-ui-text mb-2 line-clamp-2">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-sm text-ui-textSecondary mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="space-y-2 mb-3">
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

      {task.dueDate && (
        <div className="flex items-center gap-2 text-xs text-ui-textSecondary">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(task.dueDate).toLocaleDateString('ko-KR')}
        </div>
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

// Task Form Modal Component
function TaskFormModal({
  title,
  formData,
  setFormData,
  onSave,
  onClose,
}: {
  title: string;
  formData: Partial<CreateTaskDto>;
  setFormData: (data: Partial<CreateTaskDto>) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-ui-text">{title}</h3>
          <button
            onClick={onClose}
            className="text-ui-textSecondary hover:text-ui-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ui-text mb-2">
              제목 *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary"
              placeholder="업무 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ui-text mb-2">
              설명
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary resize-none"
              rows={4}
              placeholder="업무 설명을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ui-text mb-2">
                우선순위
              </label>
              <select
                value={formData.priority || Priority.MEDIUM}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as Priority })
                }
                className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary"
              >
                <option value={Priority.LOW}>낮음</option>
                <option value={Priority.MEDIUM}>중간</option>
                <option value={Priority.HIGH}>높음</option>
                <option value={Priority.URGENT}>긴급</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ui-text mb-2">
                상태
              </label>
              <select
                value={formData.status || TaskStatus.TODO}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as TaskStatus })
                }
                className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary"
              >
                <option value={TaskStatus.TODO}>할일</option>
                <option value={TaskStatus.IN_PROGRESS}>진행중</option>
                <option value={TaskStatus.COMPLETED}>완료</option>
                <option value={TaskStatus.ON_HOLD}>대기</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-ui-text mb-2">
                시작일
              </label>
              <input
                type="date"
                value={formData.startDate || ''}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ui-text mb-2">
                마감일
              </label>
              <input
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ui-text mb-2">
              유형
            </label>
            <select
              value={formData.type || TaskType.PERSONAL}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as TaskType })
              }
              className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary"
            >
              <option value={TaskType.PERSONAL}>개인</option>
              <option value={TaskType.DEPARTMENT}>부서</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-ui-border">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-ui-border rounded-xl hover:bg-gray-50 transition-all font-medium"
          >
            취소
          </button>
          <button
            onClick={onSave}
            disabled={!formData.title}
            className="px-6 py-2.5 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            저장
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Task Detail Modal Component
function TaskDetailModal({
  task,
  onClose,
  onEdit,
}: {
  task: Task;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <Modal onClose={onClose} size="lg">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getStatusColor(task.status)}`}>
                {getStatusLabel(task.status)}
              </span>
              <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getPriorityColor(task.priority)}`}>
                {getPriorityLabel(task.priority)}
              </span>
            </div>
            <h3 className="text-xl font-bold text-ui-text">{task.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-ui-textSecondary hover:text-ui-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {task.description && (
            <div>
              <h4 className="text-sm font-semibold text-ui-text mb-2">설명</h4>
              <p className="text-ui-textSecondary">{task.description}</p>
            </div>
          )}

          <div>
            <h4 className="text-sm font-semibold text-ui-text mb-3">진행률</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-ui-textSecondary">현재 진행률</span>
                <span className="font-medium text-ui-text">{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="bg-ui-primary h-2.5 rounded-full transition-all"
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {task.startDate && (
              <div>
                <h4 className="text-sm font-semibold text-ui-text mb-2">시작일</h4>
                <div className="flex items-center gap-2 text-ui-textSecondary">
                  <Calendar className="w-4 h-4" />
                  {new Date(task.startDate).toLocaleDateString('ko-KR')}
                </div>
              </div>
            )}

            {task.dueDate && (
              <div>
                <h4 className="text-sm font-semibold text-ui-text mb-2">마감일</h4>
                <div className="flex items-center gap-2 text-ui-textSecondary">
                  <Calendar className="w-4 h-4" />
                  {new Date(task.dueDate).toLocaleDateString('ko-KR')}
                </div>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ui-text mb-2">생성 정보</h4>
            <div className="text-sm text-ui-textSecondary">
              {new Date(task.createdAt).toLocaleString('ko-KR')}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-ui-border">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-ui-border rounded-xl hover:bg-gray-50 transition-all font-medium"
          >
            닫기
          </button>
          <button
            onClick={onEdit}
            className="px-6 py-2.5 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all font-medium"
          >
            수정
          </button>
        </div>
      </div>
    </Modal>
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
