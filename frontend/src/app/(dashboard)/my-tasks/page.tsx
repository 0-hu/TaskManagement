export default function MyTasksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ui-text">내 업무</h1>
        <p className="text-sm text-ui-textSecondary mt-1">
          내가 담당한 업무를 관리하세요
        </p>
      </div>

      <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-ui-border">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-xl font-bold text-ui-text mb-2">업무가 없습니다</h2>
        <p className="text-ui-textSecondary mb-6">
          새로운 업무를 생성하거나 할당받아 보세요
        </p>
        <button className="px-6 py-2 bg-ui-primary text-white rounded-lg hover:bg-blue-700">
          + 업무 추가
        </button>
      </div>
    </div>
  );
}
