import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { SubmissionRow } from "@/components/molecules/submission-row/submission-row";
import type { Submission } from "@/types/submission";
import { Button } from "@/components/atoms/button/button";

type SubmissionSectionProps = {
  submissions: Submission[];
};

export function SubmissionSection({ submissions }: SubmissionSectionProps) {
  return (
    <Box className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <Box className="flex items-center justify-between">
        <Text weight="bold" className="text-lg">
          제출 현황
        </Text>
        <Button variant="ghost">내보내기</Button>
      </Box>
      <Box className="space-y-2">
        {submissions.map((submission) => (
          <SubmissionRow key={submission.id} submission={submission} />
        ))}
      </Box>
      <Button variant="ghost" className="self-center text-neutral-700">
        더 보기
      </Button>
    </Box>
  );
}
