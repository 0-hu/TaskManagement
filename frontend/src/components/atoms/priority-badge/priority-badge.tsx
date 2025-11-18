import { Badge } from "@/components/atoms/badge/badge";
import type { TaskPriority } from "@/lib/mock-data";

interface PriorityBadgeProps {
  priority: TaskPriority;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; tone: "info" | "warning" | "success" | "danger" | "muted" }> = {
  LOW: { label: "낮음", tone: "muted" },
  MEDIUM: { label: "보통", tone: "info" },
  HIGH: { label: "높음", tone: "warning" },
  URGENT: { label: "긴급", tone: "danger" }
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
