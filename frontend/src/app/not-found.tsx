import Link from 'next/link';
import { FileQuestion, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center">
            <FileQuestion className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-ui-text mb-4">404</h1>
        <h2 className="text-2xl font-bold text-ui-text mb-2">페이지를 찾을 수 없습니다</h2>
        <p className="text-ui-textSecondary mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-sm font-medium"
        >
          <Home className="w-5 h-5" />
          <span>대시보드로 돌아가기</span>
        </Link>
      </div>
    </div>
  );
}
