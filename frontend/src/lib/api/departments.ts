import { ApiClient } from './client';
import { Department, DepartmentMember, DepartmentRole } from '@/types/user';

export interface CreateDepartmentDto {
  name: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
}

export interface AddMemberDto {
  userId: string;
  role?: DepartmentRole;
}

export interface DepartmentWithMembers extends Department {
  members: (DepartmentMember & {
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  })[];
  tasks: {
    id: string;
    title: string;
    status: string;
  }[];
}

export const departmentsApi = {
  // Create a new department
  create: (data: CreateDepartmentDto, token: string): Promise<Department> => {
    return ApiClient.post('/departments', data, token);
  },

  // Get all departments
  getAll: (token: string): Promise<Department[]> => {
    return ApiClient.get('/departments', token);
  },

  // Get a single department by ID with members and tasks
  getOne: (id: string, token: string): Promise<DepartmentWithMembers> => {
    return ApiClient.get(`/departments/${id}`, token);
  },

  // Update a department
  update: (id: string, data: UpdateDepartmentDto, token: string): Promise<Department> => {
    return ApiClient.put(`/departments/${id}`, data, token);
  },

  // Delete a department
  delete: (id: string, token: string): Promise<void> => {
    return ApiClient.delete(`/departments/${id}`, token);
  },

  // Add a member to department
  addMember: (id: string, data: AddMemberDto, token: string): Promise<DepartmentWithMembers> => {
    return ApiClient.post(`/departments/${id}/members`, data, token);
  },

  // Remove a member from department
  removeMember: (id: string, userId: string, token: string): Promise<DepartmentWithMembers> => {
    return ApiClient.delete(`/departments/${id}/members/${userId}`, token);
  },

  // Update member role
  updateMemberRole: (
    id: string,
    userId: string,
    role: DepartmentRole,
    token: string
  ): Promise<DepartmentWithMembers> => {
    return ApiClient.put(`/departments/${id}/members/${userId}`, { role }, token);
  },
};
