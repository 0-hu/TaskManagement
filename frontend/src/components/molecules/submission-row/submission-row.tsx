import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { Badge } from "@/components/atoms/badge/badge";
import type { Submission } from "@/types/submission";
import { FileText, CheckCircle2, Clock3, XCircle } from "lucide-react";

type SubmissionRowProps = {
  submission: Submission;
};

const statusTone: Record<Submission["status"], { label: string; tone: "info" | "warning" | "danger" | "success" }> = {
  submitted: { label: "제출완료", tone: "info" },
  waiting: { label: "검토대기", tone: "warning" },
  rejected: { label: "반려", tone: "danger" },
  approved: { label: "승인", tone: "success" }
};

const statusIcon: Record<Submission["status"], React.ReactNode> = {
  submitted: <FileText className="h-4 w-4" />,
  waiting: <Clock3 className="h-4 w-4" />,
  rejected: <XCircle className="h-4 w-4" />,
  approved: <CheckCircle2 className="h-4 w-4" />
};

export function SubmissionRow({ submission }: SubmissionRowProps) {
  const status = statusTone[submission.status];
  return (
    <Box className="grid grid-cols-7 items-center gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <Box className="col-span-2 flex items-center gap-3">
        <Badge tone="muted">{submission.id}</Badge>
        <Text weight="semibold">{submission.title}</Text>
      </Box>
      <Text size="sm" color="muted">
        {submission.team}
      </Text>
      <Text size="sm" color="muted">
        {submission.owner}
      </Text>
      <Text size="sm" color="muted">
        {submission.dueDate}
      </Text>
      <Box className="col-span-2 flex items-center justify-end">
        <Badge tone={status.tone} className="gap-1">
          {statusIcon[submission.status]}
          {status.label}
        </Badge>
      </Box>
    </Box>
  );
}
