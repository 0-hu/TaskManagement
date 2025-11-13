import { ApiClient } from './client';
import { User } from '@/types/user';

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'USER' | 'MANAGER' | 'ADMIN';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export const authApi = {
  register: (data: RegisterRequest): Promise<AuthResponse> => {
    return ApiClient.post('/auth/register', data);
  },

  login: (data: LoginRequest): Promise<AuthResponse> => {
    return ApiClient.post('/auth/login', data);
  },

  getProfile: (token: string): Promise<User> => {
    return ApiClient.get('/auth/me', token);
  },
};
