import { Avatar } from '@/components/atoms/avatar';

const deletedTasks = [
  {
    id: 1,
    title: '삭제된 업무 1',
    deletedBy: '김철수',
    deletedAt: '2025-11-10 14:30',
    department: '개발팀',
    originalDueDate: '2025-11-15',
  },
  {
    id: 2,
    title: '삭제된 업무 2',
    deletedBy: '이영희',
    deletedAt: '2025-11-09 10:20',
    department: '디자인팀',
    originalDueDate: '2025-11-12',
  },
  {
    id: 3,
    title: '삭제된 업무 3',
    deletedBy: '박민수',
    deletedAt: '2025-11-08 16:45',
    department: '마케팅팀',
    originalDueDate: '2025-11-18',
  },
  {
    id: 4,
    title: '삭제된 업무 4',
    deletedBy: '정수진',
    deletedAt: '2025-11-07 09:15',
    department: '개발팀',
    originalDueDate: '2025-11-20',
  },
];

export default function TrashPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ui-text">휴지통</h1>
          <p className="text-sm text-ui-textSecondary mt-1">
            삭제된 업무는 30일 후 영구 삭제됩니다
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm border border-ui-border text-ui-text rounded-lg hover:bg-gray-50">
            선택 항목 복원
          </button>
          <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
            영구 삭제
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
          <div className="text-3xl font-bold text-ui-text mb-2">24</div>
          <div className="text-sm text-ui-textSecondary">삭제된 업무</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
          <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
          <div className="text-sm text-ui-textSecondary">7일 이내 삭제 예정</div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
          <div className="text-3xl font-bold text-red-600 mb-2">8</div>
          <div className="text-sm text-ui-textSecondary">30일 후 영구 삭제</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-ui-border">
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 text-sm border border-ui-border rounded-lg">
            <option>전체 부서</option>
            <option>개발팀</option>
            <option>디자인팀</option>
            <option>마케팅팀</option>
          </select>
          <select className="px-4 py-2 text-sm border border-ui-border rounded-lg">
            <option>삭제일 순</option>
            <option>제목 순</option>
            <option>부서 순</option>
          </select>
          <input
            type="text"
            placeholder="검색..."
            className="flex-1 px-4 py-2 text-sm border border-ui-border rounded-lg"
          />
          <button className="px-6 py-2 text-sm bg-ui-primary text-white rounded-lg hover:bg-blue-700">
            검색
          </button>
        </div>
      </div>

      {/* Deleted Tasks Table */}
      <div className="bg-white rounded-lg shadow-sm border border-ui-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-ui-border">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                업무 제목
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                부서
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                삭제자
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                삭제일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                원래 마감일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ui-border">
            {deletedTasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input type="checkbox" className="rounded" />
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-ui-text line-through">
                    {task.title}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-ui-textSecondary">
                  {task.department}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={task.deletedBy} size="xs" />
                    <span className="text-sm text-ui-text">{task.deletedBy}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-ui-textSecondary">
                  {task.deletedAt}
                </td>
                <td className="px-6 py-4 text-sm text-ui-textSecondary">
                  {task.originalDueDate}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button className="text-sm text-ui-primary hover:underline">
                      복원
                    </button>
                    <button className="text-sm text-red-600 hover:underline">
                      영구 삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Warning Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-yellow-600 text-xl">⚠️</span>
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-1">
              자동 삭제 안내
            </h4>
            <p className="text-sm text-yellow-700">
              휴지통의 항목은 30일이 지나면 자동으로 영구 삭제됩니다.
              복원이 필요한 항목은 기한 내에 복원해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
