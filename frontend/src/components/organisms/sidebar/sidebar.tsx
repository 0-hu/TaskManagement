import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  name: string;
  href: string;
  icon: string;
}

const menuItems: MenuItem[] = [
  { name: '대시보드', href: '/dashboard', icon: '🏠' },
  { name: '마이페이지', href: '/profile', icon: '👤' },
  { name: '내 업무', href: '/my-tasks', icon: '✓' },
  { name: '부서 업무', href: '/department-tasks', icon: '👥' },
  { name: '제출 현황', href: '/submissions', icon: '📄' },
  { name: '통계', href: '/statistics', icon: '📊' },
  { name: '휴지통', href: '/trash', icon: '🗑' },
  { name: '설정', href: '/settings', icon: '⚙' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-white border-r border-ui-border h-full flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold text-ui-primary">
          업무일감 관리
        </h1>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-ui-primary text-white'
                      : 'text-ui-text hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
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
