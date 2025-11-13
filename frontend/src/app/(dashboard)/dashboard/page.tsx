export default function DashboardPage() {
  const stats = [
    { label: '총 개수', value: 138, color: 'bg-stat-total' },
    { label: '진행중', value: 54, color: 'bg-stat-inProgress' },
    { label: '완료', value: 21, color: 'bg-stat-completed' },
    { label: '예정', value: 63, color: 'bg-stat-scheduled' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ui-text">대시보드</h1>
        <p className="text-sm text-ui-textSecondary mt-1">
          업무 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm border border-ui-border"
          >
            <div className="text-3xl font-bold text-ui-text mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-ui-textSecondary mb-3">
              {stat.label}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`${stat.color} h-2 rounded-full`}
                style={{ width: '65%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-ui-border">
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {['1주', '2주', '1개월', '3개월', '6개월'].map((period) => (
              <button
                key={period}
                className="px-4 py-2 text-sm rounded-lg border border-ui-border hover:bg-gray-50"
              >
                {period}
              </button>
            ))}
            <button className="px-4 py-2 text-sm rounded-lg border border-ui-border hover:bg-gray-50">
              📅 날짜 범위
            </button>
          </div>
          <select className="px-4 py-2 text-sm border border-ui-border rounded-lg">
            <option>전체</option>
            <option>예정</option>
            <option>진행중</option>
            <option>완료</option>
          </select>
          <button className="ml-auto px-6 py-2 text-sm bg-ui-primary text-white rounded-lg hover:bg-blue-700">
            검색
          </button>
        </div>
      </div>

      {/* Task Grid */}
      <div>
        <h2 className="text-lg font-bold text-ui-text mb-4">최근 업무</h2>
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
                샘플 업무 제목 {i}
              </h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-ui-primary rounded-full flex items-center justify-center text-white text-xs">
                  U
                </div>
                <span className="text-sm text-ui-textSecondary">담당자</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-ui-textSecondary">
                  <span>진행률</span>
                  <span>50%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-ui-primary h-1.5 rounded-full"
                    style={{ width: '50%' }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ui-text">업무 목록</h2>
          <button className="text-sm text-ui-primary hover:underline">
            더보기 →
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-ui-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-ui-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase tracking-wider">
                  담당자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase tracking-wider">
                  마감일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase tracking-wider">
                  우선순위
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ui-text">
                    샘플 업무 {i}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-ui-primary rounded-full flex items-center justify-center text-white text-xs">
                        U
                      </div>
                      <span className="text-sm text-ui-text">사용자</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      진행중
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-textSecondary">
                    2025-11-{20 + i}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                      중간
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAB Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-ui-primary text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-2xl">
        +
      </button>
    </div>
  );
}
