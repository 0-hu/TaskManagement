import { Badge } from "@/components/atoms/badge/badge";
import type { TaskStatus } from "@/lib/mock-data";

interface StatusBadgeProps {
  status: TaskStatus;
}

const STATUS_CONFIG: Record<TaskStatus, { label: string; tone: "info" | "warning" | "success" | "danger" | "muted" }> = {
  TODO: { label: "대기중", tone: "muted" },
  IN_PROGRESS: { label: "진행중", tone: "info" },
  COMPLETED: { label: "완료", tone: "success" },
  ON_HOLD: { label: "보류", tone: "danger" }
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
