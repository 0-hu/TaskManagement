"use client";

import { useState } from "react";
import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { Button } from "@/components/atoms/button/button";
import { Avatar } from "@/components/atoms/avatar/avatar";
import { Surface } from "@/components/atoms/surface/surface";
import { SubmissionStatusBadge } from "@/components/atoms/submission-status-badge/submission-status-badge";
import { MOCK_SUBMISSIONS, getTaskById, getUserById } from "@/lib/mock-data";
import { formatDate } from "@/lib/date-utils";
import { Table, List, LayoutGrid, Check, X } from "lucide-react";

type ViewMode = "table" | "card" | "kanban";

export default function SubmissionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const pendingSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === "PENDING");
  const approvedSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === "APPROVED");
  const rejectedSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === "REJECTED");

  return (
    <Box className="flex flex-col gap-4">
      <Box className="flex items-center justify-between">
        <Box>
          <Text weight="bold" className="mb-1 text-2xl">
            제출 현황
          </Text>
          <Text size="sm" color="subtle">
            업무 제출 현황을 확인하고 승인/반려합니다
          </Text>
        </Box>

        <Box className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "solid" : "ghost"}
            onClick={() => setViewMode("table")}
          >
            <Table className="h-4 w-4" />
            테이블
          </Button>
          <Button
            variant={viewMode === "card" ? "solid" : "ghost"}
            onClick={() => setViewMode("card")}
          >
            <List className="h-4 w-4" />
            카드
          </Button>
          <Button
            variant={viewMode === "kanban" ? "solid" : "ghost"}
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="h-4 w-4" />
            칸반
          </Button>
        </Box>
      </Box>

      {viewMode === "table" && (
        <Surface className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="p-3 text-left text-sm font-semibold">업무</th>
                <th className="p-3 text-left text-sm font-semibold">제출자</th>
                <th className="p-3 text-left text-sm font-semibold">상태</th>
                <th className="p-3 text-left text-sm font-semibold">제출일</th>
                <th className="p-3 text-left text-sm font-semibold">액션</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SUBMISSIONS.map(submission => {
                const task = getTaskById(submission.taskId);
                const user = getUserById(submission.userId);
                return (
                  <tr key={submission.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="p-3">
                      <Text weight="medium">{task?.title || "Unknown Task"}</Text>
                    </td>
                    <td className="p-3">
                      <Box className="flex items-center gap-2">
                        <Avatar name={user?.name || "Unknown"} imageUrl={user?.avatar} size="sm" />
                        <Text size="sm">{user?.name}</Text>
                      </Box>
                    </td>
                    <td className="p-3">
                      <SubmissionStatusBadge status={submission.status} />
                    </td>
                    <td className="p-3">
                      <Text size="sm" color="subtle">
                        {formatDate(submission.submittedAt)}
                      </Text>
                    </td>
                    <td className="p-3">
                      {submission.status === "PENDING" && (
                        <Box className="flex gap-2">
                          <Button size="sm" variant="ghost" className="text-green-600">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <X className="h-4 w-4" />
                          </Button>
                        </Box>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Surface>
      )}

      {viewMode === "card" && (
        <Box className="space-y-3">
          {MOCK_SUBMISSIONS.map(submission => {
            const task = getTaskById(submission.taskId);
            const user = getUserById(submission.userId);
            return (
              <Surface key={submission.id} className="p-4">
                <Box className="flex items-start justify-between">
                  <Box className="flex-1">
                    <Text weight="semibold" className="mb-2">
                      {task?.title}
                    </Text>
                    <Box className="mb-2 flex items-center gap-2">
                      <Avatar name={user?.name || "Unknown"} imageUrl={user?.avatar} size="sm" />
                      <Text size="sm">{user?.name}</Text>
                      <SubmissionStatusBadge status={submission.status} />
                    </Box>
                    <Text size="sm" color="subtle" className="mb-2">
                      {submission.content}
                    </Text>
                    <Text size="xs" color="subtle">
                      제출일: {formatDate(submission.submittedAt)}
                    </Text>
                  </Box>
                  {submission.status === "PENDING" && (
                    <Box className="flex gap-2">
                      <Button size="sm" className="bg-green-600">
                        <Check className="h-4 w-4" />
                        승인
                      </Button>
                      <Button size="sm" className="bg-red-600">
                        <X className="h-4 w-4" />
                        반려
                      </Button>
                    </Box>
                  )}
                </Box>
              </Surface>
            );
          })}
        </Box>
      )}

      {viewMode === "kanban" && (
        <Box className="grid grid-cols-3 gap-4">
          <Box>
            <Text weight="semibold" className="mb-3 flex items-center gap-2">
              검토중 <Box className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{pendingSubmissions.length}</Box>
            </Text>
            <Box className="space-y-3">
              {pendingSubmissions.map(submission => {
                const task = getTaskById(submission.taskId);
                const user = getUserById(submission.userId);
                return (
                  <Surface key={submission.id} className="p-3">
                    <Text weight="semibold" size="sm" className="mb-2">
                      {task?.title}
                    </Text>
                    <Box className="mb-2 flex items-center gap-2">
                      <Avatar name={user?.name || "Unknown"} imageUrl={user?.avatar} size="sm" />
                      <Text size="xs">{user?.name}</Text>
                    </Box>
                    <Box className="mt-3 flex gap-2">
                      <Button size="sm" className="flex-1 bg-green-600 text-xs">
                        승인
                      </Button>
                      <Button size="sm" className="flex-1 bg-red-600 text-xs">
                        반려
                      </Button>
                    </Box>
                  </Surface>
                );
              })}
            </Box>
          </Box>

          <Box>
            <Text weight="semibold" className="mb-3 flex items-center gap-2">
              승인됨 <Box className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">{approvedSubmissions.length}</Box>
            </Text>
            <Box className="space-y-3">
              {approvedSubmissions.map(submission => {
                const task = getTaskById(submission.taskId);
                const user = getUserById(submission.userId);
                return (
                  <Surface key={submission.id} className="p-3">
                    <Text weight="semibold" size="sm" className="mb-2">
                      {task?.title}
                    </Text>
                    <Box className="flex items-center gap-2">
                      <Avatar name={user?.name || "Unknown"} imageUrl={user?.avatar} size="sm" />
                      <Text size="xs">{user?.name}</Text>
                    </Box>
                  </Surface>
                );
              })}
            </Box>
          </Box>

          <Box>
            <Text weight="semibold" className="mb-3 flex items-center gap-2">
              반려됨 <Box className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">{rejectedSubmissions.length}</Box>
            </Text>
            <Box className="space-y-3">
              {rejectedSubmissions.map(submission => {
                const task = getTaskById(submission.taskId);
                const user = getUserById(submission.userId);
                return (
                  <Surface key={submission.id} className="p-3">
                    <Text weight="semibold" size="sm" className="mb-2">
                      {task?.title}
                    </Text>
                    <Box className="mb-2 flex items-center gap-2">
                      <Avatar name={user?.name || "Unknown"} imageUrl={user?.avatar} size="sm" />
                      <Text size="xs">{user?.name}</Text>
                    </Box>
                    {submission.feedback && (
                      <Text size="xs" color="subtle" className="mt-2">
                        {submission.feedback}
                      </Text>
                    )}
                  </Surface>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
