'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/auth-store';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      setAuth(response.user, response.access_token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ui-background">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-ui-text">
            회원가입
          </h2>
          <p className="mt-2 text-center text-sm text-ui-textSecondary">
            새 계정을 만들어 업무를 시작하세요
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ui-text">
                이름
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-ui-border rounded-md shadow-sm focus:outline-none focus:ring-ui-primary focus:border-ui-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ui-text">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-ui-border rounded-md shadow-sm focus:outline-none focus:ring-ui-primary focus:border-ui-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ui-text">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-ui-border rounded-md shadow-sm focus:outline-none focus:ring-ui-primary focus:border-ui-primary"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ui-text">
                비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-ui-border rounded-md shadow-sm focus:outline-none focus:ring-ui-primary focus:border-ui-primary"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ui-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ui-primary disabled:opacity-50"
            >
              {loading ? '가입 중...' : '회원가입'}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-ui-textSecondary">이미 계정이 있으신가요? </span>
            <Link href="/login" className="text-ui-primary hover:underline">
              로그인
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
