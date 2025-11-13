'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function Header() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-ui-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="검색..."
            className="w-80 px-4 py-2 border border-ui-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ui-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <span className="text-xl">🔔</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-ui-primary rounded-full flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="text-sm">
            <div className="font-medium text-ui-text">{user?.name || 'User'}</div>
            <div className="text-ui-textSecondary text-xs">{user?.role || 'USER'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1.5 text-sm text-ui-textSecondary hover:text-ui-text hover:bg-gray-100 rounded-lg transition-colors"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
