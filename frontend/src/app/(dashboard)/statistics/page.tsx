'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const taskStatusData = [
  { name: '예정', value: 63, color: '#4CAF50' },
  { name: '진행중', value: 54, color: '#4D7CFF' },
  { name: '완료', value: 89, color: '#EC407A' },
  { name: '보류', value: 12, color: '#9E9E9E' },
];

const monthlyData = [
  { month: '7월', completed: 45, inProgress: 30, todo: 25 },
  { month: '8월', completed: 52, inProgress: 35, todo: 28 },
  { month: '9월', completed: 61, inProgress: 40, todo: 30 },
  { month: '10월', completed: 78, inProgress: 45, todo: 35 },
  { month: '11월', completed: 89, inProgress: 54, todo: 63 },
];

const departmentData = [
  { name: '개발팀', tasks: 85, completion: 78 },
  { name: '디자인팀', tasks: 62, completion: 85 },
  { name: '마케팅팀', tasks: 53, completion: 72 },
  { name: '기획팀', tasks: 48, completion: 90 },
  { name: '운영팀', tasks: 41, completion: 68 },
];

const weeklyTrend = [
  { day: '월', created: 12, completed: 8 },
  { day: '화', created: 15, completed: 11 },
  { day: '수', created: 18, completed: 14 },
  { day: '목', created: 14, completed: 16 },
  { day: '금', created: 20, completed: 18 },
  { day: '토', created: 8, completed: 12 },
  { day: '일', created: 5, completed: 9 },
];

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ui-text">통계</h1>
          <p className="text-sm text-ui-textSecondary mt-1">
            업무 현황과 생산성 지표를 확인하세요
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 text-sm border border-ui-border rounded-lg">
            <option>최근 7일</option>
            <option>최근 30일</option>
            <option>최근 3개월</option>
            <option>최근 6개월</option>
          </select>
          <button className="px-4 py-2 text-sm bg-ui-primary text-white rounded-lg hover:bg-blue-700">
            리포트 다운로드
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: '전체 완료율', value: '78%', change: '+5.2%', up: true },
          { label: '평균 처리 시간', value: '3.2일', change: '-0.5일', up: true },
          { label: '지연 업무', value: '12개', change: '-3개', up: true },
          { label: '월 생산성', value: '142%', change: '+8.3%', up: true },
        ].map((metric, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-6 shadow-sm border border-ui-border"
          >
            <div className="text-sm text-ui-textSecondary mb-2">{metric.label}</div>
            <div className="text-3xl font-bold text-ui-text mb-2">{metric.value}</div>
            <div className={`text-sm font-medium ${metric.up ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change} {metric.up ? '↑' : '↓'}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Task Status Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">업무 상태 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">월별 업무 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#EC407A" name="완료" />
              <Bar dataKey="inProgress" fill="#4D7CFF" name="진행중" />
              <Bar dataKey="todo" fill="#4CAF50" name="예정" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Department Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">부서별 성과</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#4D7CFF" name="업무 수" />
              <Bar dataKey="completion" fill="#4CAF50" name="완료율(%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trend Line Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
          <h3 className="text-lg font-bold text-ui-text mb-4">주간 업무 생성/완료</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="created"
                stroke="#4D7CFF"
                strokeWidth={2}
                name="생성"
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#4CAF50"
                strokeWidth={2}
                name="완료"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-ui-border">
        <h3 className="text-lg font-bold text-ui-text mb-4">개인별 생산성</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-ui-border">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  순위
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  부서
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  완료 업무
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  진행중
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  완료율
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-ui-textSecondary uppercase">
                  평균 시간
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ui-border">
              {[
                { name: '김철수', dept: '개발팀', completed: 45, inProgress: 8, rate: 85, time: '2.3일' },
                { name: '이영희', dept: '디자인팀', completed: 42, inProgress: 6, rate: 88, time: '2.1일' },
                { name: '박민수', dept: '마케팅팀', completed: 38, inProgress: 7, rate: 82, time: '2.8일' },
                { name: '정수진', dept: '개발팀', completed: 36, inProgress: 9, rate: 80, time: '3.2일' },
                { name: '최민지', dept: '기획팀', completed: 34, inProgress: 5, rate: 87, time: '2.5일' },
              ].map((person, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-lg font-bold text-ui-primary">#{i + 1}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-ui-text">
                    {person.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-textSecondary">
                    {person.dept}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-text">
                    {person.completed}개
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-text">
                    {person.inProgress}개
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-ui-primary h-2 rounded-full"
                          style={{ width: `${person.rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-ui-text">{person.rate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ui-textSecondary">
                    {person.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
