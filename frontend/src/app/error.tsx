'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-ui-text mb-2">문제가 발생했습니다</h1>
        <p className="text-ui-textSecondary mb-2">
          페이지를 로드하는 중 오류가 발생했습니다.
        </p>

        {error.message && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-red-800 font-mono">{error.message}</p>
            {error.digest && (
              <p className="text-xs text-red-600 mt-2">Error ID: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-sm font-medium"
          >
            <RefreshCw className="w-5 h-5" />
            <span>다시 시도</span>
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 border border-ui-border text-ui-text rounded-xl hover:bg-gray-50 transition-all font-medium"
          >
            <Home className="w-5 h-5" />
            <span>대시보드로</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
