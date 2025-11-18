import { Box } from "@/components/atoms/box/box";
import { Text } from "@/components/atoms/text/text";
import { Surface } from "@/components/atoms/surface/surface";
import { StatCard } from "@/components/molecules/stat-card/stat-card";
import { MOCK_TASKS, MOCK_SUBMISSIONS, DEPARTMENTS } from "@/lib/mock-data";
import { BarChart3, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";

export default function StatisticsPage() {
  // 전체 통계
  const totalTasks = MOCK_TASKS.length;
  const completedTasks = MOCK_TASKS.filter(t => t.status === "COMPLETED").length;
  const inProgressTasks = MOCK_TASKS.filter(t => t.status === "IN_PROGRESS").length;
  const blockedTasks = MOCK_TASKS.filter(t => t.status === "ON_HOLD").length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  // 우선순위별 통계
  const urgentTasks = MOCK_TASKS.filter(t => t.priority === "URGENT").length;
  const highTasks = MOCK_TASKS.filter(t => t.priority === "HIGH").length;
  const mediumTasks = MOCK_TASKS.filter(t => t.priority === "MEDIUM").length;
  const lowTasks = MOCK_TASKS.filter(t => t.priority === "LOW").length;

  // 부서별 통계
  const departmentStats = DEPARTMENTS.map(dept => {
    const deptTasks = MOCK_TASKS.filter(t => t.department === dept);
    const deptCompleted = deptTasks.filter(t => t.status === "COMPLETED").length;
    const deptInProgress = deptTasks.filter(t => t.status === "IN_PROGRESS").length;
    return {
      name: dept,
      total: deptTasks.length,
      completed: deptCompleted,
      inProgress: deptInProgress,
      rate: deptTasks.length > 0 ? Math.round((deptCompleted / deptTasks.length) * 100) : 0
    };
  });

  // 제출 현황 통계
  const totalSubmissions = MOCK_SUBMISSIONS.length;
  const approvedSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === "APPROVED").length;
  const pendingSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === "PENDING").length;
  const rejectedSubmissions = MOCK_SUBMISSIONS.filter(s => s.status === "REJECTED").length;
  const approvalRate = Math.round((approvedSubmissions / totalSubmissions) * 100);

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Text weight="bold" className="mb-1 text-2xl">
          통계 대시보드
        </Text>
        <Text size="sm" color="subtle">
          업무 및 제출 현황 통계를 확인합니다
        </Text>
      </Box>

      {/* 전체 개요 */}
      <Box className="grid grid-cols-4 gap-4">
        <StatCard
          label="전체 업무"
          value={totalTasks}
          sublabel="총 등록된 업무"
          tone="info"
          progress={completionRate}
          icon={<BarChart3 className="h-5 w-5 text-blue-600" />}
        />
        <StatCard
          label="완료율"
          value={completionRate}
          sublabel={`완료 ${completedTasks}건`}
          tone="success"
          progress={completionRate}
          icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
        />
        <StatCard
          label="진행중"
          value={inProgressTasks}
          sublabel="현재 진행중인 업무"
          tone="warning"
          progress={Math.round((inProgressTasks / totalTasks) * 100)}
          icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
        />
        <StatCard
          label="지연/보류"
          value={blockedTasks}
          sublabel="주의가 필요한 업무"
          tone="danger"
          progress={Math.round((blockedTasks / totalTasks) * 100)}
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
        />
      </Box>

      <Box className="grid grid-cols-2 gap-4">
        {/* 우선순위별 통계 */}
        <Surface className="p-6">
          <Text weight="bold" className="mb-4 text-lg">
            우선순위별 분포
          </Text>
          <Box className="space-y-4">
            <Box>
              <Box className="mb-2 flex items-center justify-between">
                <Text size="sm" weight="medium">긴급</Text>
                <Text size="sm" color="subtle">{urgentTasks}건</Text>
              </Box>
              <Box className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <Box
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${(urgentTasks / totalTasks) * 100}%` }}
                />
              </Box>
            </Box>

            <Box>
              <Box className="mb-2 flex items-center justify-between">
                <Text size="sm" weight="medium">높음</Text>
                <Text size="sm" color="subtle">{highTasks}건</Text>
              </Box>
              <Box className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <Box
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: `${(highTasks / totalTasks) * 100}%` }}
                />
              </Box>
            </Box>

            <Box>
              <Box className="mb-2 flex items-center justify-between">
                <Text size="sm" weight="medium">보통</Text>
                <Text size="sm" color="subtle">{mediumTasks}건</Text>
              </Box>
              <Box className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <Box
                  className="h-full rounded-full bg-blue-500"
                  style={{ width: `${(mediumTasks / totalTasks) * 100}%` }}
                />
              </Box>
            </Box>

            <Box>
              <Box className="mb-2 flex items-center justify-between">
                <Text size="sm" weight="medium">낮음</Text>
                <Text size="sm" color="subtle">{lowTasks}건</Text>
              </Box>
              <Box className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
                <Box
                  className="h-full rounded-full bg-neutral-400"
                  style={{ width: `${(lowTasks / totalTasks) * 100}%` }}
                />
              </Box>
            </Box>
          </Box>
        </Surface>

        {/* 제출 현황 통계 */}
        <Surface className="p-6">
          <Text weight="bold" className="mb-4 text-lg">
            제출 현황 통계
          </Text>
          <Box className="mb-4">
            <Text size="sm" color="subtle" className="mb-1">전체 제출</Text>
            <Text weight="bold" className="text-3xl">{totalSubmissions}건</Text>
          </Box>
          <Box className="space-y-3">
            <Box className="flex items-center justify-between rounded-lg bg-green-50 p-3">
              <Text size="sm" weight="medium" className="text-green-700">승인</Text>
              <Text weight="bold" className="text-green-700">{approvedSubmissions}건 ({approvalRate}%)</Text>
            </Box>
            <Box className="flex items-center justify-between rounded-lg bg-amber-50 p-3">
              <Text size="sm" weight="medium" className="text-amber-700">검토중</Text>
              <Text weight="bold" className="text-amber-700">{pendingSubmissions}건</Text>
            </Box>
            <Box className="flex items-center justify-between rounded-lg bg-red-50 p-3">
              <Text size="sm" weight="medium" className="text-red-700">반려</Text>
              <Text weight="bold" className="text-red-700">{rejectedSubmissions}건</Text>
            </Box>
          </Box>
        </Surface>
      </Box>

      {/* 부서별 통계 */}
      <Surface className="p-6">
        <Text weight="bold" className="mb-4 text-lg">
          부서별 업무 현황
        </Text>
        <Box className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="p-3 text-left text-sm font-semibold">부서</th>
                <th className="p-3 text-left text-sm font-semibold">전체</th>
                <th className="p-3 text-left text-sm font-semibold">완료</th>
                <th className="p-3 text-left text-sm font-semibold">진행중</th>
                <th className="p-3 text-left text-sm font-semibold">완료율</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map(dept => (
                <tr key={dept.name} className="border-b border-neutral-100">
                  <td className="p-3">
                    <Text weight="medium">{dept.name}</Text>
                  </td>
                  <td className="p-3">
                    <Text>{dept.total}건</Text>
                  </td>
                  <td className="p-3">
                    <Text className="text-green-600">{dept.completed}건</Text>
                  </td>
                  <td className="p-3">
                    <Text className="text-blue-600">{dept.inProgress}건</Text>
                  </td>
                  <td className="p-3">
                    <Box className="flex items-center gap-2">
                      <Box className="h-2 w-32 overflow-hidden rounded-full bg-neutral-200">
                        <Box
                          className="h-full rounded-full bg-green-500"
                          style={{ width: `${dept.rate}%` }}
                        />
                      </Box>
                      <Text size="sm" weight="medium">{dept.rate}%</Text>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Surface>
    </Box>
  );
}
