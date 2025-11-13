import { Avatar } from '@/components/atoms/avatar';

const sampleUsers = [
  { name: '김철수', role: 'LEADER' },
  { name: '이영희', role: 'MEMBER' },
  { name: '박민수', role: 'MEMBER' },
  { name: '정수진', role: 'MEMBER' },
];

const sampleDepartments = [
  { id: 1, name: '개발팀', members: 12, tasks: 45 },
  { id: 2, name: '디자인팀', members: 8, tasks: 32 },
  { id: 3, name: '마케팅팀', members: 10, tasks: 28 },
];

export default function DepartmentTasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ui-text">부서 업무</h1>
          <p className="text-sm text-ui-textSecondary mt-1">
            부서별 업무를 관리하고 팀원에게 할당하세요
          </p>
        </div>
        <button className="px-4 py-2 bg-ui-primary text-white rounded-lg hover:bg-blue-700">
          + 부서 업무 추가
        </button>
      </div>

      {/* Department Selection */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-ui-border">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-ui-text">부서 선택:</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-ui-primary text-white rounded-lg">
              전체
            </button>
            {sampleDepartments.map((dept) => (
              <button
                key={dept.id}
                className="px-4 py-2 text-sm border border-ui-border rounded-lg hover:bg-gray-50"
              >
                {dept.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Department Statistics */}
      <div className="grid grid-cols-3 gap-6">
        {sampleDepartments.map((dept) => (
          <div
            key={dept.id}
            className="bg-white rounded-lg p-6 shadow-sm border border-ui-border"
          >
            <h3 className="text-lg font-bold text-ui-text mb-4">{dept.name}</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-ui-textSecondary">팀원</span>
                <span className="text-lg font-semibold text-ui-text">{dept.members}명</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-ui-textSecondary">진행중 업무</span>
                <span className="text-lg font-semibold text-ui-primary">{dept.tasks}개</span>
              </div>
              <button className="w-full mt-4 px-4 py-2 text-sm border border-ui-border rounded-lg hover:bg-gray-50">
                상세보기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <div>
        <h2 className="text-lg font-bold text-ui-text mb-4">팀원 목록</h2>
        <div className="bg-white rounded-lg shadow-sm border border-ui-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-ui-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  팀원
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  진행중 업무
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  완료율
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border">
              {sampleUsers.map((user, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <span className="text-sm font-medium text-ui-text">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      user.role === 'LEADER'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'LEADER' ? '팀장' : '팀원'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-text">
                    {Math.floor(Math.random() * 10) + 5}개
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-ui-primary h-2 rounded-full"
                          style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-ui-textSecondary">
                        {Math.floor(Math.random() * 40) + 60}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-sm text-ui-primary hover:underline">
                      업무 할당
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Tasks Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ui-text">부서 업무</h2>
          <div className="flex gap-2">
            <select className="px-3 py-1.5 text-sm border border-ui-border rounded-lg">
              <option>전체 상태</option>
              <option>예정</option>
              <option>진행중</option>
              <option>완료</option>
            </select>
            <select className="px-3 py-1.5 text-sm border border-ui-border rounded-lg">
              <option>전체 우선순위</option>
              <option>긴급</option>
              <option>높음</option>
              <option>중간</option>
              <option>낮음</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg p-4 shadow-sm border border-ui-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                  진행중
                </span>
                <button className="text-ui-textSecondary hover:text-ui-text">
                  ⋯
                </button>
              </div>
              <h3 className="font-medium text-ui-text mb-3 line-clamp-2">
                부서 업무 {i} - {sampleDepartments[i % 3].name}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {sampleUsers.slice(0, 3).map((user, idx) => (
                    <Avatar key={idx} name={user.name} size="xs" className="ring-2 ring-white" />
                  ))}
                </div>
                <span className="text-xs text-ui-textSecondary">+2</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-ui-textSecondary">
                  <span>진행률</span>
                  <span>{Math.floor(Math.random() * 60) + 20}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-ui-primary h-1.5 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 60) + 20}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
