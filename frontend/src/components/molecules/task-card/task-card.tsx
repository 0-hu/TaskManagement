import { Surface } from "@/components/atoms/surface/surface";
import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { Badge } from "@/components/atoms/badge/badge";
import { Avatar } from "@/components/atoms/avatar/avatar";
import { ProgressBar } from "@/components/atoms/progress-bar/progress-bar";
import type { Task } from "@/types/task";
import { CalendarDays, MoreHorizontal } from "lucide-react";

type TaskCardProps = {
  task: Task;
};

const statusTone: Record<Task["status"], { label: string; tone: "info" | "warning" | "danger" | "success" }> = {
  planned: { label: "예정", tone: "success" },
  in_progress: { label: "진행중", tone: "info" },
  blocked: { label: "지연", tone: "danger" },
  completed: { label: "완료", tone: "success" }
};

const priorityTone: Record<Task["priority"], "info" | "warning" | "danger" | "muted"> = {
  high: "danger",
  medium: "warning",
  low: "muted"
};

export function TaskCard({ task }: TaskCardProps) {
  const status = statusTone[task.status];
  return (
    <Surface className="relative w-full p-4">
      <Box className="mb-3 flex items-start justify-between">
        <Badge tone={priorityTone[task.priority]}>{task.priority.toUpperCase()}</Badge>
        <MoreHorizontal className="h-5 w-5 text-neutral-400" />
      </Box>
      <Box className="mb-3 flex items-center gap-2">
        <Badge tone={status.tone}>{status.label}</Badge>
        <Text size="sm" color="subtle" className="flex items-center gap-1">
          <CalendarDays className="h-4 w-4" />
          {task.dueDate}
        </Text>
      </Box>
      <Text as="div" weight="semibold" className="mb-4 leading-tight">
        {task.title}
      </Text>
      <Box className="mb-4 flex items-center justify-between">
        <Box className="flex -space-x-2">
          {task.assignees.map((member) => (
            <Avatar key={member.name} name={member.name} imageUrl={member.avatarUrl} size="sm" />
          ))}
        </Box>
        <Text size="sm" color="subtle">
          {task.progress}% 진행률
        </Text>
      </Box>
      <ProgressBar value={task.progress} tone={status.tone} />
    </Surface>
  );
}
