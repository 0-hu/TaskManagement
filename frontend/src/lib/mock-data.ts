// Mock data for demo purposes

export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  department: string;
  assignedTo: string[];
  createdBy: string;
  dueDate: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  userId: string;
  status: SubmissionStatus;
  content: string;
  feedback?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// 가짜 사용자 프로필 6개
export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "김도현",
    email: "dohyun.kim@company.com",
    department: "개발",
    position: "프론트엔드 개발자",
    avatar: "/avatars/1.png"
  },
  {
    id: "user-2",
    name: "이서연",
    email: "seoyeon.lee@company.com",
    department: "영업",
    position: "영업 팀장",
    avatar: "/avatars/2.jpg"
  },
  {
    id: "user-3",
    name: "박민준",
    email: "minjun.park@company.com",
    department: "보안",
    position: "보안 전문가",
    avatar: "/avatars/3.jpg"
  },
  {
    id: "user-4",
    name: "최지우",
    email: "jiwoo.choi@company.com",
    department: "회계",
    position: "회계 담당자",
    avatar: "/avatars/4.jpg"
  },
  {
    id: "user-5",
    name: "정하윤",
    email: "hayoon.jung@company.com",
    department: "경영지원",
    position: "인사 담당자",
    avatar: "/avatars/5.jpg"
  },
  {
    id: "user-6",
    name: "강민서",
    email: "minseo.kang@company.com",
    department: "개발",
    position: "백엔드 개발자",
    avatar: "/avatars/6.jpg"
  }
];

// 샘플 업무 데이터
export const MOCK_TASKS: Task[] = [
  // 개발 부서 업무
  {
    id: "task-1",
    title: "사용자 인증 API 개발",
    description: "JWT 기반 사용자 인증 시스템 구축",
    status: "IN_PROGRESS",
    priority: "HIGH",
    progress: 65,
    department: "개발",
    assignedTo: ["user-1", "user-6"],
    createdBy: "user-1",
    dueDate: "2025-11-25",
    createdAt: "2025-11-10"
  },
  {
    id: "task-2",
    title: "대시보드 UI 개선",
    description: "메인 대시보드 반응형 레이아웃 적용",
    status: "COMPLETED",
    priority: "MEDIUM",
    progress: 100,
    department: "개발",
    assignedTo: ["user-1"],
    createdBy: "user-6",
    dueDate: "2025-11-20",
    createdAt: "2025-11-08"
  },
  {
    id: "task-3",
    title: "데이터베이스 최적화",
    description: "쿼리 성능 개선 및 인덱스 추가",
    status: "TODO",
    priority: "URGENT",
    progress: 0,
    department: "개발",
    assignedTo: ["user-6"],
    createdBy: "user-1",
    dueDate: "2025-11-22",
    createdAt: "2025-11-15"
  },
  {
    id: "task-4",
    title: "모바일 앱 버그 수정",
    description: "iOS 앱 크래시 이슈 해결",
    status: "ON_HOLD",
    priority: "HIGH",
    progress: 30,
    department: "개발",
    assignedTo: ["user-1"],
    createdBy: "user-6",
    dueDate: "2025-11-28",
    createdAt: "2025-11-12"
  },

  // 영업 부서 업무
  {
    id: "task-5",
    title: "신규 고객사 미팅",
    description: "A사 제안서 발표 및 계약 협상",
    status: "IN_PROGRESS",
    priority: "URGENT",
    progress: 80,
    department: "영업",
    assignedTo: ["user-2"],
    createdBy: "user-2",
    dueDate: "2025-11-21",
    createdAt: "2025-11-14"
  },
  {
    id: "task-6",
    title: "월간 영업 실적 보고서 작성",
    description: "11월 영업 실적 분석 및 보고서 작성",
    status: "TODO",
    priority: "MEDIUM",
    progress: 0,
    department: "영업",
    assignedTo: ["user-2"],
    createdBy: "user-2",
    dueDate: "2025-11-30",
    createdAt: "2025-11-16"
  },
  {
    id: "task-7",
    title: "고객 만족도 설문조사",
    description: "기존 고객사 대상 만족도 조사 진행",
    status: "COMPLETED",
    priority: "LOW",
    progress: 100,
    department: "영업",
    assignedTo: ["user-2"],
    createdBy: "user-2",
    dueDate: "2025-11-18",
    createdAt: "2025-11-10"
  },

  // 보안 부서 업무
  {
    id: "task-8",
    title: "보안 취약점 점검",
    description: "전사 시스템 보안 취약점 스캔 및 리포트",
    status: "IN_PROGRESS",
    priority: "URGENT",
    progress: 45,
    department: "보안",
    assignedTo: ["user-3"],
    createdBy: "user-3",
    dueDate: "2025-11-23",
    createdAt: "2025-11-13"
  },
  {
    id: "task-9",
    title: "직원 보안 교육",
    description: "정보보안 및 개인정보보호 교육 진행",
    status: "TODO",
    priority: "MEDIUM",
    progress: 0,
    department: "보안",
    assignedTo: ["user-3"],
    createdBy: "user-3",
    dueDate: "2025-11-27",
    createdAt: "2025-11-15"
  },
  {
    id: "task-10",
    title: "방화벽 정책 업데이트",
    description: "신규 서비스 방화벽 규칙 추가",
    status: "COMPLETED",
    priority: "HIGH",
    progress: 100,
    department: "보안",
    assignedTo: ["user-3"],
    createdBy: "user-3",
    dueDate: "2025-11-19",
    createdAt: "2025-11-11"
  },

  // 회계 부서 업무
  {
    id: "task-11",
    title: "월말 결산 작업",
    description: "11월 매출/매입 전표 정리 및 결산",
    status: "IN_PROGRESS",
    priority: "HIGH",
    progress: 55,
    department: "회계",
    assignedTo: ["user-4"],
    createdBy: "user-4",
    dueDate: "2025-11-30",
    createdAt: "2025-11-18"
  },
  {
    id: "task-12",
    title: "법인세 신고 준비",
    description: "연말 법인세 신고 자료 준비",
    status: "TODO",
    priority: "MEDIUM",
    progress: 0,
    department: "회계",
    assignedTo: ["user-4"],
    createdBy: "user-4",
    dueDate: "2025-12-10",
    createdAt: "2025-11-17"
  },
  {
    id: "task-13",
    title: "예산 집행 현황 분석",
    description: "부서별 예산 집행률 분석 보고",
    status: "COMPLETED",
    priority: "LOW",
    progress: 100,
    department: "회계",
    assignedTo: ["user-4"],
    createdBy: "user-4",
    dueDate: "2025-11-15",
    createdAt: "2025-11-05"
  },

  // 경영지원 부서 업무
  {
    id: "task-14",
    title: "신입사원 채용 공고",
    description: "2026년 상반기 신입사원 채용 공고 게시",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    progress: 70,
    department: "경영지원",
    assignedTo: ["user-5"],
    createdBy: "user-5",
    dueDate: "2025-11-24",
    createdAt: "2025-11-12"
  },
  {
    id: "task-15",
    title: "연말 워크샵 기획",
    description: "전사 연말 워크샵 장소 및 프로그램 기획",
    status: "TODO",
    priority: "LOW",
    progress: 0,
    department: "경영지원",
    assignedTo: ["user-5"],
    createdBy: "user-5",
    dueDate: "2025-12-05",
    createdAt: "2025-11-16"
  },
  {
    id: "task-16",
    title: "복리후생 제도 개선",
    description: "직원 복리후생 설문조사 및 개선안 도출",
    status: "COMPLETED",
    priority: "MEDIUM",
    progress: 100,
    department: "경영지원",
    assignedTo: ["user-5"],
    createdBy: "user-5",
    dueDate: "2025-11-17",
    createdAt: "2025-11-03"
  },

  // 추가 협업 업무
  {
    id: "task-17",
    title: "신규 서비스 론칭 준비",
    description: "개발/영업/보안 협업 프로젝트",
    status: "IN_PROGRESS",
    priority: "URGENT",
    progress: 60,
    department: "개발",
    assignedTo: ["user-1", "user-2", "user-3", "user-6"],
    createdBy: "user-1",
    dueDate: "2025-12-01",
    createdAt: "2025-11-01"
  },
  {
    id: "task-18",
    title: "사무실 이전 준비",
    description: "경영지원 주관 전사 사무실 이전 프로젝트",
    status: "TODO",
    priority: "HIGH",
    progress: 0,
    department: "경영지원",
    assignedTo: ["user-5", "user-4"],
    createdBy: "user-5",
    dueDate: "2025-12-20",
    createdAt: "2025-11-18"
  }
];

// 샘플 제출 현황 데이터
export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "sub-1",
    taskId: "task-2",
    userId: "user-1",
    status: "APPROVED",
    content: "대시보드 UI 개선 완료. 모든 주요 브라우저에서 테스트 완료했습니다.",
    feedback: "완벽합니다! 반응형도 잘 적용되었네요.",
    submittedAt: "2025-11-20T14:30:00",
    reviewedAt: "2025-11-20T16:00:00",
    reviewedBy: "user-6"
  },
  {
    id: "sub-2",
    taskId: "task-7",
    userId: "user-2",
    status: "APPROVED",
    content: "고객 만족도 설문조사 완료. 응답률 85%, 평균 만족도 4.2/5.0",
    feedback: "좋은 결과네요. 개선 사항도 잘 정리되었습니다.",
    submittedAt: "2025-11-18T11:00:00",
    reviewedAt: "2025-11-18T15:30:00",
    reviewedBy: "user-2"
  },
  {
    id: "sub-3",
    taskId: "task-10",
    userId: "user-3",
    status: "APPROVED",
    content: "방화벽 정책 업데이트 완료. 신규 서비스 포트 80, 443 허용",
    feedback: "보안 정책 검토 완료. 승인합니다.",
    submittedAt: "2025-11-19T10:00:00",
    reviewedAt: "2025-11-19T11:00:00",
    reviewedBy: "user-3"
  },
  {
    id: "sub-4",
    taskId: "task-13",
    userId: "user-4",
    status: "APPROVED",
    content: "예산 집행 현황 분석 완료. 첨부 파일 참조 바랍니다.",
    feedback: "상세한 분석 감사합니다.",
    submittedAt: "2025-11-15T17:00:00",
    reviewedAt: "2025-11-15T18:00:00",
    reviewedBy: "user-4"
  },
  {
    id: "sub-5",
    taskId: "task-16",
    userId: "user-5",
    status: "APPROVED",
    content: "복리후생 개선안 3가지 제안: 1) 재택근무 확대 2) 건강검진 지원 3) 자기계발비 인상",
    feedback: "실행 가능한 좋은 제안들입니다. 경영진에 보고하겠습니다.",
    submittedAt: "2025-11-17T16:00:00",
    reviewedAt: "2025-11-17T17:30:00",
    reviewedBy: "user-5"
  },
  {
    id: "sub-6",
    taskId: "task-1",
    userId: "user-1",
    status: "PENDING",
    content: "JWT 인증 API 구현 완료. 테스트 진행 중입니다.",
    submittedAt: "2025-11-18T14:00:00"
  },
  {
    id: "sub-7",
    taskId: "task-5",
    userId: "user-2",
    status: "PENDING",
    content: "A사 제안서 발표 완료. 다음 주 계약서 검토 예정",
    submittedAt: "2025-11-18T16:30:00"
  },
  {
    id: "sub-8",
    taskId: "task-8",
    userId: "user-3",
    status: "REJECTED",
    content: "보안 취약점 점검 1차 완료",
    feedback: "리포트가 너무 간략합니다. 상세한 분석 결과를 포함해주세요.",
    submittedAt: "2025-11-17T10:00:00",
    reviewedAt: "2025-11-17T14:00:00",
    reviewedBy: "user-3"
  },
  {
    id: "sub-9",
    taskId: "task-11",
    userId: "user-4",
    status: "PENDING",
    content: "월말 결산 작업 진행 중. 현재 55% 완료",
    submittedAt: "2025-11-18T17:00:00"
  },
  {
    id: "sub-10",
    taskId: "task-14",
    userId: "user-5",
    status: "PENDING",
    content: "채용 공고 초안 작성 완료. 검토 부탁드립니다.",
    submittedAt: "2025-11-18T15:00:00"
  }
];

// 부서 목록
export const DEPARTMENTS = ["개발", "영업", "보안", "회계", "경영지원"];

// 현재 로그인한 사용자 ID를 로컬 스토리지에서 가져오거나 기본값 사용
export function getCurrentUserId(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("currentUserId") || "user-1";
  }
  return "user-1";
}

// 현재 로그인한 사용자 설정
export function setCurrentUserId(userId: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUserId", userId);
  }
}

// 현재 사용자 정보 가져오기
export function getCurrentUser(): User {
  const userId = getCurrentUserId();
  return MOCK_USERS.find(u => u.id === userId) || MOCK_USERS[0];
}

// 사용자 ID로 사용자 정보 가져오기
export function getUserById(userId: string): User | undefined {
  return MOCK_USERS.find(u => u.id === userId);
}

// 업무 ID로 업무 정보 가져오기
export function getTaskById(taskId: string): Task | undefined {
  return MOCK_TASKS.find(t => t.id === taskId);
}
