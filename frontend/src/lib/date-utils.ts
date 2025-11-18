/**
 * 날짜 포맷팅 유틸리티
 * 서버/클라이언트 하이드레이션 일관성을 위해 명시적 포맷 사용
 */

/**
 * 날짜를 "YYYY. MM. DD" 형식으로 포맷
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}. ${month}. ${day}.`;
}

/**
 * 날짜를 "YYYY-MM-DD" 형식으로 포맷
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

/**
 * 날짜를 "MM/DD" 형식으로 포맷 (짧은 형식)
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${month}/${day}`;
}
