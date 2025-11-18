"use client";

import { useEffect, useState } from "react";
import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { TaskCard } from "@/components/molecules/task-card/task-card";
import { FilterBar } from "@/components/organisms/filter-bar/filter-bar";
import { MOCK_TASKS, getCurrentUserId } from "@/lib/mock-data";
import { convertMockTasksToUITasks } from "@/lib/adapters";

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<ReturnType<typeof convertMockTasksToUITasks>>([]);

  useEffect(() => {
    const currentUserId = getCurrentUserId();
    const myTasks = MOCK_TASKS.filter(t => t.assignedTo.includes(currentUserId));
    setTasks(convertMockTasksToUITasks(myTasks));
  }, []);

  const todoTasks = tasks.filter(t => t.status === "planned");
  const inProgressTasks = tasks.filter(t => t.status === "in_progress");
  const completedTasks = tasks.filter(t => t.status === "completed");
  const blockedTasks = tasks.filter(t => t.status === "blocked");

  return (
    <Box className="flex flex-col gap-4">
      <Box>
        <Text weight="bold" className="mb-1 text-2xl">
          개인 업무
        </Text>
        <Text size="sm" color="subtle">
          나에게 할당된 업무를 관리합니다
        </Text>
      </Box>

      <FilterBar />

      <Box className="grid grid-cols-4 gap-4">
        <Box>
          <Text weight="semibold" className="mb-3 flex items-center gap-2">
            대기중 <Box className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs">{todoTasks.length}</Box>
          </Text>
          <Box className="space-y-3">
            {todoTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Box>
        </Box>

        <Box>
          <Text weight="semibold" className="mb-3 flex items-center gap-2">
            진행중 <Box className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">{inProgressTasks.length}</Box>
          </Text>
          <Box className="space-y-3">
            {inProgressTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Box>
        </Box>

        <Box>
          <Text weight="semibold" className="mb-3 flex items-center gap-2">
            완료 <Box className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">{completedTasks.length}</Box>
          </Text>
          <Box className="space-y-3">
            {completedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Box>
        </Box>

        <Box>
          <Text weight="semibold" className="mb-3 flex items-center gap-2">
            보류 <Box className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">{blockedTasks.length}</Box>
          </Text>
          <Box className="space-y-3">
            {blockedTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
