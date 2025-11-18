"use client";

import { useEffect, useState } from "react";
import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { StatCard } from "@/components/molecules/stat-card/stat-card";
import { TaskCard } from "@/components/molecules/task-card/task-card";
import { FilterBar } from "@/components/organisms/filter-bar/filter-bar";
import { MOCK_TASKS, MOCK_SUBMISSIONS, getCurrentUserId } from "@/lib/mock-data";
import { convertMockTasksToUITasks } from "@/lib/adapters";
import { formatDate } from "@/lib/date-utils";
import { ClipboardList, Clock3, PauseCircle, PlayCircle } from "lucide-react";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<ReturnType<typeof convertMockTasksToUITasks>>([]);

  useEffect(() => {
    const userId = getCurrentUserId();

    // 현재 사용자의 업무만 필터링
    const userTasks = MOCK_TASKS.filter(t => t.assignedTo.includes(userId));
    setTasks(convertMockTasksToUITasks(userTasks));
  }, []);

  // 통계 계산
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const blockedTasks = tasks.filter(t => t.status === "blocked").length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;

  // 상태별로 그룹화
  const todoTasks = tasks.filter(t => t.status === "planned");
  const activeTasks = tasks.filter(t => t.status === "in_progress");
  const doneTasks = tasks.filter(t => t.status === "completed");

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Text weight="bold" className="mb-1 text-2xl">
          대시보드
        </Text>
        <Text size="sm" color="subtle">
          나의 업무 현황을 한눈에 확인하세요
        </Text>
      </Box>

      <Box className="grid grid-cols-4 gap-4">
        <StatCard
          label="전체 업무"
          value={totalTasks}
          sublabel={`내 업무 ${totalTasks}건`}
          tone="info"
          progress={totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}
          icon={<ClipboardList className="h-5 w-5 text-blue-600" />}
        />
        <StatCard
          label="진행 중"
          value={inProgressTasks}
          sublabel="현재 진행 중인 업무"
          tone="warning"
          progress={totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0}
          icon={<PlayCircle className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          label="보류/지연"
          value={blockedTasks}
          sublabel="주의가 필요한 업무"
          tone="danger"
          progress={totalTasks > 0 ? Math.round((blockedTasks / totalTasks) * 100) : 0}
          icon={<PauseCircle className="h-5 w-5 text-rose-500" />}
        />
        <StatCard
          label="완료"
          value={completedTasks}
          sublabel="완료된 업무"
          tone="success"
          progress={totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}
          icon={<Clock3 className="h-5 w-5 text-emerald-600" />}
        />
      </Box>

      <FilterBar />

      <Box className="grid grid-cols-3 gap-4">
        <Box className="flex flex-col gap-3">
          <Box className="flex items-center gap-2">
            <Text weight="semibold">대기중</Text>
            <Box className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs">
              {todoTasks.length}
            </Box>
          </Box>
          <Box className="space-y-3">
            {todoTasks.slice(0, 5).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {todoTasks.length === 0 && (
              <Box className="rounded-lg border-2 border-dashed border-neutral-200 p-6 text-center">
                <Text size="sm" color="subtle">대기중인 업무가 없습니다</Text>
              </Box>
            )}
          </Box>
        </Box>

        <Box className="flex flex-col gap-3">
          <Box className="flex items-center gap-2">
            <Text weight="semibold">진행중</Text>
            <Box className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              {activeTasks.length}
            </Box>
          </Box>
          <Box className="space-y-3">
            {activeTasks.slice(0, 5).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {activeTasks.length === 0 && (
              <Box className="rounded-lg border-2 border-dashed border-neutral-200 p-6 text-center">
                <Text size="sm" color="subtle">진행중인 업무가 없습니다</Text>
              </Box>
            )}
          </Box>
        </Box>

        <Box className="flex flex-col gap-3">
          <Box className="flex items-center gap-2">
            <Text weight="semibold">완료</Text>
            <Box className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
              {doneTasks.length}
            </Box>
          </Box>
          <Box className="space-y-3">
            {doneTasks.slice(0, 5).map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {doneTasks.length === 0 && (
              <Box className="rounded-lg border-2 border-dashed border-neutral-200 p-6 text-center">
                <Text size="sm" color="subtle">완료된 업무가 없습니다</Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Box className="rounded-lg border border-neutral-200 bg-white p-6">
        <Box className="mb-4 flex items-center justify-between">
          <Text weight="bold" className="text-lg">
            최근 제출 현황
          </Text>
          <Text size="sm" color="subtle">
            {MOCK_SUBMISSIONS.length}건의 제출
          </Text>
        </Box>
        <Box className="space-y-3">
          {MOCK_SUBMISSIONS.slice(0, 3).map((submission) => {
            const task = MOCK_TASKS.find(t => t.id === submission.taskId);
            return (
              <Box key={submission.id} className="flex items-center justify-between rounded-lg bg-neutral-50 p-3">
                <Box>
                  <Text weight="medium" size="sm">{task?.title || "Unknown Task"}</Text>
                  <Text size="xs" color="subtle">
                    {formatDate(submission.submittedAt)}
                  </Text>
                </Box>
                <Box className={`rounded-full px-3 py-1 text-xs font-medium ${
                  submission.status === "APPROVED" ? "bg-green-100 text-green-700" :
                  submission.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {submission.status === "APPROVED" ? "승인" :
                   submission.status === "PENDING" ? "검토중" : "반려"}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
