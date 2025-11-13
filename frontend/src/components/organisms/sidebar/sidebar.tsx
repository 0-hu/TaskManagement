import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  CheckSquare,
  Users,
  ClipboardList,
  BarChart3,
  Trash2,
  Settings,
  type LucideIcon,
} from 'lucide-react';

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { name: '대시보드', href: '/dashboard', icon: LayoutDashboard },
  { name: '마이페이지', href: '/profile', icon: User },
  { name: '내 업무', href: '/my-tasks', icon: CheckSquare },
  { name: '부서 업무', href: '/department-tasks', icon: Users },
  { name: '제출 현황', href: '/submissions', icon: ClipboardList },
  { name: '통계', href: '/statistics', icon: BarChart3 },
  { name: '휴지통', href: '/trash', icon: Trash2 },
  { name: '설정', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-ui-border h-full flex flex-col">
      <div className="p-6 border-b border-ui-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-ui-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-ui-text">
            업무 관리 시스템
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-ui-primary text-white shadow-sm'
                      : 'text-ui-text hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-ui-border">
        <div className="text-xs text-ui-textSecondary text-center">
          Version 1.0.0
        </div>
      </div>
    </aside>
  );
}
