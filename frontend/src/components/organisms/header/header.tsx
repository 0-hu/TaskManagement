'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { Avatar } from '@/components/atoms/avatar';
import { Search, Bell, LogOut, Calendar, Filter } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-ui-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ui-textSecondary" />
          <input
            type="text"
            placeholder="업무, 담당자, 태그 검색"
            className="w-80 pl-10 pr-4 py-2 border border-ui-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-ui-text hover:bg-gray-50 rounded-xl transition-all">
          <Calendar className="w-4 h-4" />
          <span>2025.11</span>
        </button>

        <button className="flex items-center gap-2 px-3 py-2 text-sm text-ui-text hover:bg-gray-50 rounded-xl transition-all">
          <Filter className="w-4 h-4" />
          <span>필터</span>
        </button>

        <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-all">
          <Bell className="w-5 h-5 text-ui-text" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 ml-2 pl-3 border-l border-ui-border">
          <Avatar name={user?.name || 'User'} size="sm" />
          <div className="text-sm">
            <div className="font-medium text-ui-text">{user?.name || 'User'}</div>
            <div className="text-ui-textSecondary text-xs">{user?.role || 'USER'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="ml-2 p-2 text-ui-textSecondary hover:text-ui-text hover:bg-gray-50 rounded-xl transition-all"
          title="로그아웃"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
