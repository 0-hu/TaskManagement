'use client';

import { useEffect, useState } from 'react';
import { Avatar } from '@/components/atoms/avatar';
import {
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  X,
  AlertCircle,
  Search,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { submissionsApi } from '@/lib/api';
import type { SubmissionWithDetails } from '@/lib/api/submissions';
import { SubmissionStatus } from '@/types/task';

export default function SubmissionsPage() {
  const { token } = useAuthStore();
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{ status?: SubmissionStatus }>({});

  // Modals
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionWithDetails | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (token) {
      fetchSubmissions();
    }
  }, [token, filter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const data = await submissionsApi.getAll(filter, token!);
      setSubmissions(data);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!token || !selectedSubmission) return;

    try {
      await submissionsApi.approve(selectedSubmission.id, { feedback }, token);
      setApproveModalOpen(false);
      setFeedback('');
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to approve submission:', error);
    }
  };

  const handleReject = async () => {
    if (!token || !selectedSubmission || !feedback) return;

    try {
      await submissionsApi.reject(selectedSubmission.id, { feedback }, token);
      setRejectModalOpen(false);
      setFeedback('');
      setSelectedSubmission(null);
      fetchSubmissions();
    } catch (error) {
      console.error('Failed to reject submission:', error);
    }
  };

  const openApproveModal = (submission: SubmissionWithDetails) => {
    setSelectedSubmission(submission);
    setApproveModalOpen(true);
  };

  const openRejectModal = (submission: SubmissionWithDetails) => {
    setSelectedSubmission(submission);
    setRejectModalOpen(true);
  };

  const openDetailModal = (submission: SubmissionWithDetails) => {
    setSelectedSubmission(submission);
    setDetailModalOpen(true);
  };

  const stats = [
    {
      label: '총 제출',
      value: submissions.length,
      color: 'bg-blue-50 text-blue-600',
      icon: FileText,
    },
    {
      label: '제출됨',
      value: submissions.filter((s) => s.status === SubmissionStatus.SUBMITTED).length,
      color: 'bg-amber-50 text-amber-600',
      icon: Clock,
    },
    {
      label: '승인',
      value: submissions.filter((s) => s.status === SubmissionStatus.APPROVED).length,
      color: 'bg-green-50 text-green-600',
      icon: CheckCircle2,
    },
    {
      label: '반려',
      value: submissions.filter((s) => s.status === SubmissionStatus.REJECTED).length,
      color: 'bg-red-50 text-red-600',
      icon: XCircle,
    },
  ];

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
          <h1 className="text-2xl font-bold text-ui-text">제출 현황</h1>
          <p className="text-sm text-ui-textSecondary mt-1">
            업무 제출 현황을 확인하고 승인/반려 처리하세요
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-card border border-ui-border"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-ui-text">{stat.value}</div>
                  <div className="text-sm text-ui-textSecondary">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-ui-border">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-ui-text">필터:</span>
          <select
            className="px-4 py-2 text-sm border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30"
            onChange={(e) =>
              setFilter({
                ...filter,
                status: e.target.value as SubmissionStatus | undefined,
              })
            }
          >
            <option value="">전체 상태</option>
            <option value={SubmissionStatus.PENDING}>제출 대기</option>
            <option value={SubmissionStatus.SUBMITTED}>제출됨</option>
            <option value={SubmissionStatus.APPROVED}>승인</option>
            <option value={SubmissionStatus.REJECTED}>반려</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div>
        <h2 className="text-lg font-bold text-ui-text mb-4">제출 목록</h2>
        {submissions.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-card border border-ui-border">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-ui-text mb-2">제출 내역이 없습니다</h2>
            <p className="text-ui-textSecondary">
              제출된 업무가 없습니다
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card border border-ui-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-ui-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                    업무 제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                    제출자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                    우선순위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                    제출일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-ui-textSecondary">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-border">
                {submissions.map((submission) => (
                  <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-ui-text">
                          {submission.task.title}
                        </div>
                        {submission.task.description && (
                          <div className="text-xs text-ui-textSecondary mt-1 line-clamp-1">
                            {submission.task.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar name={submission.submitter.name} size="xs" />
                        <div>
                          <div className="text-sm text-ui-text">{submission.submitter.name}</div>
                          <div className="text-xs text-ui-textSecondary">
                            {submission.submitter.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {getStatusLabel(submission.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getPriorityColor(
                          submission.task.priority
                        )}`}
                      >
                        {getPriorityLabel(submission.task.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-textSecondary">
                      {new Date(submission.submittedAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        {submission.status === SubmissionStatus.SUBMITTED && (
                          <>
                            <button
                              onClick={() => openApproveModal(submission)}
                              className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => openRejectModal(submission)}
                              className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                            >
                              반려
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openDetailModal(submission)}
                          className="text-sm text-ui-primary hover:underline font-medium"
                        >
                          상세
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailModalOpen && selectedSubmission && (
        <Modal onClose={() => setDetailModalOpen(false)} size="lg">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                      selectedSubmission.status
                    )}`}
                  >
                    {getStatusLabel(selectedSubmission.status)}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg ${getPriorityColor(
                      selectedSubmission.task.priority
                    )}`}
                  >
                    {getPriorityLabel(selectedSubmission.task.priority)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-ui-text">
                  {selectedSubmission.task.title}
                </h3>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-ui-textSecondary hover:text-ui-text"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {selectedSubmission.task.description && (
                <div>
                  <h4 className="text-sm font-semibold text-ui-text mb-2">업무 설명</h4>
                  <p className="text-ui-textSecondary">{selectedSubmission.task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-ui-text mb-2">제출자</h4>
                  <div className="flex items-center gap-3">
                    <Avatar name={selectedSubmission.submitter.name} size="sm" />
                    <div>
                      <div className="text-sm font-medium text-ui-text">
                        {selectedSubmission.submitter.name}
                      </div>
                      <div className="text-xs text-ui-textSecondary">
                        {selectedSubmission.submitter.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-ui-text mb-2">제출일</h4>
                  <div className="text-ui-textSecondary">
                    {new Date(selectedSubmission.submittedAt).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>

              {selectedSubmission.comment && (
                <div>
                  <h4 className="text-sm font-semibold text-ui-text mb-2">제출 코멘트</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-ui-textSecondary">{selectedSubmission.comment}</p>
                  </div>
                </div>
              )}

              {selectedSubmission.feedback && (
                <div>
                  <h4 className="text-sm font-semibold text-ui-text mb-2">피드백</h4>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-ui-textSecondary">{selectedSubmission.feedback}</p>
                  </div>
                  {selectedSubmission.reviewedAt && (
                    <div className="text-xs text-ui-textSecondary mt-2">
                      검토일: {new Date(selectedSubmission.reviewedAt).toLocaleString('ko-KR')}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-ui-border">
              {selectedSubmission.status === SubmissionStatus.SUBMITTED && (
                <>
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      openApproveModal(selectedSubmission);
                    }}
                    className="px-6 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-medium"
                  >
                    승인
                  </button>
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      openRejectModal(selectedSubmission);
                    }}
                    className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-medium"
                  >
                    반려
                  </button>
                </>
              )}
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-6 py-2.5 border border-ui-border rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Approve Modal */}
      {approveModalOpen && selectedSubmission && (
        <Modal onClose={() => setApproveModalOpen(false)}>
          <div className="p-6">
            <h3 className="text-lg font-bold text-ui-text mb-2">제출 승인</h3>
            <p className="text-ui-textSecondary mb-6">
              &ldquo;{selectedSubmission.task.title}&rdquo; 제출을 승인하시겠습니까?
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-ui-text mb-2">
                피드백 (선택사항)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary resize-none"
                rows={4}
                placeholder="승인 피드백을 입력하세요"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setApproveModalOpen(false)}
                className="px-4 py-2 border border-ui-border rounded-xl hover:bg-gray-50 transition-all"
              >
                취소
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all"
              >
                승인
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectModalOpen && selectedSubmission && (
        <Modal onClose={() => setRejectModalOpen(false)}>
          <div className="p-6">
            <h3 className="text-lg font-bold text-ui-text mb-2">제출 반려</h3>
            <p className="text-ui-textSecondary mb-6">
              &ldquo;{selectedSubmission.task.title}&rdquo; 제출을 반려하시겠습니까?
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-ui-text mb-2">
                반려 사유 *
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary resize-none"
                rows={4}
                placeholder="반려 사유를 입력하세요"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 border border-ui-border rounded-xl hover:bg-gray-50 transition-all"
              >
                취소
              </button>
              <button
                onClick={handleReject}
                disabled={!feedback}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                반려
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
    case 'PENDING':
      return 'bg-gray-50 text-gray-700';
    case 'SUBMITTED':
      return 'bg-blue-50 text-blue-700';
    case 'APPROVED':
      return 'bg-green-50 text-green-700';
    case 'REJECTED':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING':
      return '제출 대기';
    case 'SUBMITTED':
      return '제출됨';
    case 'APPROVED':
      return '승인';
    case 'REJECTED':
      return '반려';
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
