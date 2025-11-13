import { Avatar } from '@/components/atoms/avatar';

type SubmissionStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

interface Submission {
  id: number;
  taskTitle: string;
  submitter: string;
  department: string;
  status: SubmissionStatus;
  submittedAt: string;
  dueDate: string;
}

const sampleSubmissions: Submission[] = [
  {
    id: 1,
    taskTitle: '월간 보고서 작성',
    submitter: '김철수',
    department: '개발팀',
    status: 'SUBMITTED',
    submittedAt: '2025-11-13',
    dueDate: '2025-11-15',
  },
  {
    id: 2,
    taskTitle: 'UI 디자인 시안',
    submitter: '이영희',
    department: '디자인팀',
    status: 'APPROVED',
    submittedAt: '2025-11-12',
    dueDate: '2025-11-14',
  },
  {
    id: 3,
    taskTitle: '마케팅 전략 수립',
    submitter: '박민수',
    department: '마케팅팀',
    status: 'REJECTED',
    submittedAt: '2025-11-11',
    dueDate: '2025-11-13',
  },
  {
    id: 4,
    taskTitle: 'API 성능 최적화',
    submitter: '정수진',
    department: '개발팀',
    status: 'PENDING',
    submittedAt: '2025-11-10',
    dueDate: '2025-11-12',
  },
  {
    id: 5,
    taskTitle: '고객 만족도 조사',
    submitter: '최민지',
    department: '마케팅팀',
    status: 'SUBMITTED',
    submittedAt: '2025-11-13',
    dueDate: '2025-11-16',
  },
];

const statusConfig: Record<SubmissionStatus, { label: string; color: string }> = {
  PENDING: { label: '제출 대기', color: 'bg-gray-100 text-gray-800' },
  SUBMITTED: { label: '제출됨', color: 'bg-blue-100 text-blue-800' },
  APPROVED: { label: '승인', color: 'bg-green-100 text-green-800' },
  REJECTED: { label: '반려', color: 'bg-red-100 text-red-800' },
};

export default function SubmissionsPage() {
  const stats = [
    { label: '총 제출', value: 138, color: 'text-blue-600' },
    { label: '제출 대기', value: 32, color: 'text-gray-600' },
    { label: '승인', value: 89, color: 'text-green-600' },
    { label: '반려', value: 17, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ui-text">제출 현황</h1>
          <p className="text-sm text-ui-textSecondary mt-1">
            업무 제출 현황을 확인하고 승인/반려 처리하세요
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm border border-ui-border"
          >
            <div className={`text-3xl font-bold ${stat.color} mb-2`}>
              {stat.value}
            </div>
            <div className="text-sm text-ui-textSecondary">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-ui-border">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-ui-text">필터:</span>
          <select className="px-4 py-2 text-sm border border-ui-border rounded-lg">
            <option>전체 상태</option>
            <option>제출 대기</option>
            <option>제출됨</option>
            <option>승인</option>
            <option>반려</option>
          </select>
          <select className="px-4 py-2 text-sm border border-ui-border rounded-lg">
            <option>전체 부서</option>
            <option>개발팀</option>
            <option>디자인팀</option>
            <option>마케팅팀</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 text-sm border border-ui-border rounded-lg"
          />
          <span className="text-sm text-ui-textSecondary">~</span>
          <input
            type="date"
            className="px-4 py-2 text-sm border border-ui-border rounded-lg"
          />
          <button className="ml-auto px-6 py-2 text-sm bg-ui-primary text-white rounded-lg hover:bg-blue-700">
            검색
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div>
        <h2 className="text-lg font-bold text-ui-text mb-4">제출 목록</h2>
        <div className="bg-white rounded-lg shadow-sm border border-ui-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-ui-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  업무 제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  제출자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  부서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  제출일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  마감일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border">
              {sampleSubmissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-ui-text">
                      {submission.taskTitle}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Avatar name={submission.submitter} size="xs" />
                      <span className="text-sm text-ui-text">{submission.submitter}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-textSecondary">
                    {submission.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${statusConfig[submission.status].color}`}>
                      {statusConfig[submission.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-textSecondary">
                    {submission.submittedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-textSecondary">
                    {submission.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {submission.status === 'SUBMITTED' && (
                        <>
                          <button className="px-3 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded">
                            승인
                          </button>
                          <button className="px-3 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded">
                            반려
                          </button>
                        </>
                      )}
                      <button className="text-sm text-ui-primary hover:underline">
                        상세
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Rate Chart */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">부서별 제출율</h3>
          <div className="space-y-4">
            {['개발팀', '디자인팀', '마케팅팀'].map((dept, i) => {
              const rate = [85, 92, 78][i];
              return (
                <div key={dept}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-ui-text">{dept}</span>
                    <span className="font-semibold text-ui-primary">{rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-ui-primary h-2 rounded-full"
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">최근 활동</h3>
          <div className="space-y-4">
            {[
              { user: '김철수', action: '월간 보고서 작성 제출', time: '5분 전' },
              { user: '이영희', action: 'UI 디자인 시안 승인됨', time: '1시간 전' },
              { user: '박민수', action: '마케팅 전략 수립 반려됨', time: '2시간 전' },
              { user: '정수진', action: 'API 성능 최적화 제출 대기', time: '3시간 전' },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar name={activity.user} size="xs" />
                <div className="flex-1">
                  <p className="text-sm text-ui-text">
                    <span className="font-medium">{activity.user}</span>님이{' '}
                    {activity.action}
                  </p>
                  <p className="text-xs text-ui-textSecondary mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
