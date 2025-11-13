'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full text-center p-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-ui-text mb-2">문제가 발생했습니다</h2>
        <p className="text-ui-textSecondary mb-4">
          페이지를 로드하는 중 오류가 발생했습니다.
        </p>

        {error.message && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-red-800 font-mono break-words">{error.message}</p>
          </div>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-sm font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          <span>다시 시도</span>
        </button>
      </div>
    </div>
  );
}
