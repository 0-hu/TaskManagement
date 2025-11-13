import { ApiClient } from './client';
import { TaskSubmission, SubmissionStatus } from '@/types/task';

export interface CreateSubmissionDto {
  taskId: string;
  comment?: string;
}

export interface QuerySubmissionDto {
  taskId?: string;
  status?: SubmissionStatus;
  submittedBy?: string;
}

export interface ApproveSubmissionDto {
  feedback?: string;
}

export interface RejectSubmissionDto {
  feedback: string;
}

export interface SubmissionWithDetails extends TaskSubmission {
  task: {
    id: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
  };
  submitter: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  reviewer?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

export const submissionsApi = {
  // Create a new submission
  create: (data: CreateSubmissionDto, token: string): Promise<TaskSubmission> => {
    return ApiClient.post('/submissions', data, token);
  },

  // Get all submissions with optional filters
  getAll: (query: QuerySubmissionDto = {}, token: string): Promise<SubmissionWithDetails[]> => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    const endpoint = queryString ? `/submissions?${queryString}` : '/submissions';
    return ApiClient.get(endpoint, token);
  },

  // Get a single submission by ID
  getOne: (id: string, token: string): Promise<SubmissionWithDetails> => {
    return ApiClient.get(`/submissions/${id}`, token);
  },

  // Approve a submission
  approve: (id: string, data: ApproveSubmissionDto, token: string): Promise<TaskSubmission> => {
    return ApiClient.put(`/submissions/${id}/approve`, data, token);
  },

  // Reject a submission
  reject: (id: string, data: RejectSubmissionDto, token: string): Promise<TaskSubmission> => {
    return ApiClient.put(`/submissions/${id}/reject`, data, token);
  },

  // Delete a submission
  delete: (id: string, token: string): Promise<void> => {
    return ApiClient.delete(`/submissions/${id}`, token);
  },
};
