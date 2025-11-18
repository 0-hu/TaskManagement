"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { Badge } from "@/components/atoms/badge/badge";
import { LayoutGrid, UserSquare2, ClipboardList, Send, Settings, BarChart3, Users } from "lucide-react";
import { MOCK_TASKS, MOCK_SUBMISSIONS, MOCK_USERS, getCurrentUserId } from "@/lib/mock-data";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

function getNavItems(currentUserId: string): NavItem[] {
  const myTasks = MOCK_TASKS.filter(t => t.assignedTo.includes(currentUserId));
  const currentUser = MOCK_USERS.find(u => u.id === currentUserId);
  const departmentTasks = currentUser ? MOCK_TASKS.filter(t => t.department === currentUser.department) : [];
  const pendingSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === "PENDING");

  return [
    { label: "대시보드", icon: <LayoutGrid className="h-5 w-5" />, href: "/" },
    { label: "개인 업무", icon: <UserSquare2 className="h-5 w-5" />, href: "/my-tasks", badge: myTasks.length },
    { label: "부서 업무", icon: <Users className="h-5 w-5" />, href: "/department-tasks", badge: departmentTasks.length },
    { label: "전체 업무", icon: <ClipboardList className="h-5 w-5" />, href: "/all-tasks", badge: MOCK_TASKS.length },
    { label: "제출 현황", icon: <Send className="h-5 w-5" />, href: "/submissions", badge: pendingSubmissions.length },
    { label: "통계", icon: <BarChart3 className="h-5 w-5" />, href: "/statistics" },
    { label: "설정", icon: <Settings className="h-5 w-5" />, href: "/settings" }
  ];
}

export function Sidebar() {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>(getNavItems("user-1"));

  useEffect(() => {
    // 클라이언트에서만 실제 사용자 ID로 업데이트
    const userId = getCurrentUserId();
    setNavItems(getNavItems(userId));
  }, []);

  // 현재 월 통계 (샘플 데이터)
  const completedThisMonth = MOCK_TASKS.filter(t => t.status === "COMPLETED").length;
  const onHoldThisMonth = MOCK_TASKS.filter(t => t.status === "ON_HOLD").length;
  const totalThisMonth = MOCK_TASKS.length;
  const progressPercent = Math.round((completedThisMonth / totalThisMonth) * 100);

  return (
    <Box className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white p-5">
      <Box className="mb-8 flex items-center gap-3">
        <Box className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
          <LayoutGrid className="h-5 w-5" />
        </Box>
        <Box>
          <Text weight="bold">업무 관리 시스템</Text>
          <Text size="sm" color="subtle">
            Business Workspace
          </Text>
        </Box>
      </Box>

      <Box className="mb-6">
        <Text size="sm" color="subtle" className="mb-3">
          메뉴
        </Text>
        <Box className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Box
                className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 ${
                  pathname === item.href ? "bg-blue-50 text-blue-700" : "hover:bg-neutral-100"
                }`}
              >
                <Box className="flex items-center gap-2">
                  {item.icon}
                  <Text weight="medium">{item.label}</Text>
                </Box>
                {item.badge !== undefined ? <Badge tone="muted">{item.badge}</Badge> : null}
              </Box>
            </Link>
          ))}
        </Box>
      </Box>

      <Box className="mt-auto space-y-2 rounded-lg border border-neutral-200 p-3">
        <Box className="flex items-center justify-between">
          <Text weight="semibold">이번달</Text>
          <Text size="sm" color="subtle">
            2025.11
          </Text>
        </Box>
        <Box>
          <Box className="mb-1 flex items-center justify-between text-xs text-neutral-600">
            <Text size="xs" color="subtle">
              완료
            </Text>
            <Text size="xs" color="subtle">
              {completedThisMonth}
            </Text>
          </Box>
          <Box className="mb-1 flex items-center justify-between text-xs text-neutral-600">
            <Text size="xs" color="subtle">
              지연
            </Text>
            <Text size="xs" color="subtle">
              {onHoldThisMonth}
            </Text>
          </Box>
          <Box className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <Box className={`h-full rounded-full bg-blue-500`} style={{ width: `${progressPercent}%` }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
