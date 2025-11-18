import { Badge } from "@/components/atoms/badge/badge";
import type { SubmissionStatus } from "@/lib/mock-data";

interface SubmissionStatusBadgeProps {
  status: SubmissionStatus;
}

const SUBMISSION_STATUS_CONFIG: Record<SubmissionStatus, { label: string; tone: "info" | "warning" | "success" | "danger" | "muted" }> = {
  PENDING: { label: "검토중", tone: "warning" },
  APPROVED: { label: "승인", tone: "success" },
  REJECTED: { label: "반려", tone: "danger" }
};

export function SubmissionStatusBadge({ status }: SubmissionStatusBadgeProps) {
  const config = SUBMISSION_STATUS_CONFIG[status];
  return <Badge tone={config.tone}>{config.label}</Badge>;
}
