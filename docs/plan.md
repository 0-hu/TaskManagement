# 구현 계획 (Implementation Plan)

## 1. 프로젝트 개요

### 1.1 목표
UI.png 디자인에 최대한 가깝게 업무 일감 관리 시스템을 구현

### 1.2 범위
Phase 1 MVP 개발에 집중 (3개월)
- 사용자 인증/인가
- 개인 업무 관리
- 대시보드 (통계 카드, 업무 카드, 업무 테이블)
- 기본 검색/필터링

---

## 2. 기술 스택

### 2.1 Frontend
```
- Framework: Next.js 14 (App Router, SSR First)
- Language: TypeScript (strict mode, no any types)
- UI Library:
  - TailwindCSS (스타일링)
  - Shadcn/ui (컴포넌트 라이브러리)
  - Lucide React (아이콘)
- State Management: Zustand (최소화, Server Components 우선)
- Data Fetching: TanStack Query (React Query)
- Form: React Hook Form + Zod (검증)
- Charts: Recharts
- Date Picker: react-datepicker
```

### 2.2 Backend
```
- Framework: NestJS
- Language: TypeScript (strict mode)
- Database: PostgreSQL 15
- ORM: Prisma
- Authentication: JWT + Passport
- Validation: class-validator
- API Documentation: Swagger
```

### 2.3 DevOps
```
- Containerization: Docker + Docker Compose
- Version Control: Git
- Package Manager: npm (일관성 유지)
```

### 2.4 개발 원칙 (CLAUDE.md 기반)
```
✅ SSR First - Server Components 기본 사용
✅ 파일당 200줄 최대 제한
✅ Atomic Design 패턴 (Atoms → Molecules → Organisms)
✅ Type-safe (any 타입 금지)
✅ DRY 원칙 철저히 준수
✅ kebab-case 파일명 (소문자, Linux 호환)
✅ "use client" 최소화
✅ No fallbacks/workarounds (근본 원인 해결)
✅ 매 변경 후 빌드 테스트 필수
```

---

## 3. 프로젝트 구조 (Atomic Design + kebab-case)

```
task-management/
├── frontend/                     # Next.js 프론트엔드
│   ├── src/
│   │   ├── app/                 # App Router 페이지 (kebab-case)
│   │   │   ├── (auth)/          # 인증 관련 페이지
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx         # Server Component
│   │   │   │   └── register/
│   │   │   │       └── page.tsx
│   │   │   ├── (dashboard)/     # 대시보드 레이아웃
│   │   │   │   ├── layout.tsx           # Server Component
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── my-tasks/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── department-tasks/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── submissions/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── statistics/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   │
│   │   ├── components/          # Atomic Design 패턴
│   │   │   ├── atoms/           # 기본 빌딩 블록 (각 <200줄)
│   │   │   │   ├── button/
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── input/
│   │   │   │   ├── badge/
│   │   │   │   ├── avatar/
│   │   │   │   ├── progress-bar/
│   │   │   │   └── icon/
│   │   │   │
│   │   │   ├── molecules/       # 단순 컴포넌트 조합 (각 <200줄)
│   │   │   │   ├── stat-card/
│   │   │   │   │   ├── stat-card.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── task-card/
│   │   │   │   ├── filter-button/
│   │   │   │   ├── date-range-picker/
│   │   │   │   ├── task-status-badge/
│   │   │   │   └── user-avatar-with-name/
│   │   │   │
│   │   │   ├── organisms/       # 복잡한 컴포넌트 (각 <200줄)
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── sidebar.tsx      # Server Component
│   │   │   │   │   ├── sidebar-menu.tsx # Server Component
│   │   │   │   │   └── index.ts
│   │   │   │   ├── header/
│   │   │   │   │   ├── header.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── task-grid/
│   │   │   │   │   ├── task-grid.tsx    # Server Component
│   │   │   │   │   └── index.ts
│   │   │   │   ├── task-table/
│   │   │   │   │   ├── task-table.tsx
│   │   │   │   │   ├── task-table-row.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── filter-bar/
│   │   │   │   │   ├── filter-bar.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── task-form/
│   │   │   │   │   ├── task-form.tsx    # "use client"
│   │   │   │   │   └── index.ts
│   │   │   │   └── fab-button/
│   │   │   │       ├── fab-button.tsx   # "use client"
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   ├── templates/       # 페이지 템플릿
│   │   │   │   ├── dashboard-template/
│   │   │   │   │   ├── dashboard-template.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   └── auth-template/
│   │   │   │       ├── auth-template.tsx
│   │   │   │       └── index.ts
│   │   │   │
│   │   │   └── ui/              # Shadcn UI 컴포넌트
│   │   │       ├── button.tsx
│   │   │       ├── input.tsx
│   │   │       ├── card.tsx
│   │   │       └── dialog.tsx
│   │   │
│   │   ├── lib/                 # 유틸리티 함수 (각 <200줄)
│   │   │   ├── api/
│   │   │   │   ├── client.ts
│   │   │   │   ├── tasks.ts
│   │   │   │   └── auth.ts
│   │   │   ├── utils/
│   │   │   │   ├── date.ts
│   │   │   │   ├── format.ts
│   │   │   │   └── cn.ts
│   │   │   └── constants/
│   │   │       ├── colors.ts
│   │   │       └── config.ts
│   │   │
│   │   ├── hooks/               # 커스텀 훅 (각 <200줄)
│   │   │   ├── use-tasks.ts
│   │   │   ├── use-auth.ts
│   │   │   ├── use-stats.ts
│   │   │   └── use-mounted.ts   # Hydration 방지
│   │   │
│   │   ├── stores/              # Zustand 스토어 (최소화)
│   │   │   ├── auth-store.ts
│   │   │   └── ui-store.ts
│   │   │
│   │   ├── types/               # TypeScript 타입 정의
│   │   │   ├── task.ts
│   │   │   ├── user.ts
│   │   │   ├── department.ts
│   │   │   └── api.ts
│   │   │
│   │   └── styles/              # 글로벌 스타일
│   │       └── globals.css
│   │
│   ├── public/                  # 정적 파일
│   ├── package.json
│   ├── package-lock.json        # npm 사용
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── CLAUDE.md                # 개발 가이드
│
├── backend/                     # NestJS 백엔드
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── auth/                # 인증 모듈
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   └── guards/
│   │   ├── users/               # 사용자 모듈
│   │   │   ├── users.module.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.controller.ts
│   │   │   └── dto/
│   │   ├── tasks/               # 업무 모듈
│   │   │   ├── tasks.module.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.controller.ts
│   │   │   └── dto/
│   │   ├── departments/         # 부서 모듈
│   │   │   ├── departments.module.ts
│   │   │   ├── departments.service.ts
│   │   │   └── departments.controller.ts
│   │   ├── common/              # 공통 모듈
│   │   │   ├── filters/
│   │   │   ├── interceptors/
│   │   │   └── decorators/
│   │   └── prisma/              # Prisma 모듈
│   │       ├── prisma.module.ts
│   │       └── prisma.service.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma        # 데이터베이스 스키마
│   │   ├── migrations/
│   │   └── seed.ts              # 시드 데이터
│   │
│   ├── test/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── docker-compose.yml           # Docker Compose 설정
├── .gitignore
├── .env.example
├── CLAUDE.md                    # 전체 프로젝트 가이드
├── PRD.md
├── plan.md
└── README.md
```

**주요 원칙**:
- 📁 모든 폴더/파일: **kebab-case** (예: `task-card.tsx`)
- 📄 파일당 **200줄 최대**
- 🏗️ **Atomic Design**: atoms → molecules → organisms → templates
- 🖥️ 기본은 **Server Components**, 인터랙션 필요시만 "use client"
- 🔄 컴포넌트별 **index.ts**로 깔끔한 import

---

## 4. 데이터베이스 스키마

### 4.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 사용자
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  avatar    String?
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 관계
  departments       DepartmentMember[]
  assignedTasks     TaskAssignment[]
  createdTasks      Task[]             @relation("TaskCreator")
  comments          Comment[]
  notifications     Notification[]
  taskSubmissions   TaskSubmission[]

  @@map("users")
}

enum Role {
  ADMIN
  MANAGER
  USER
}

// 부서
model Department {
  id          String   @id @default(uuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 관계
  members DepartmentMember[]
  tasks   Task[]

  @@map("departments")
}

// 부서 멤버 (User-Department 중간 테이블)
model DepartmentMember {
  id           String   @id @default(uuid())
  userId       String
  departmentId String
  role         DepartmentRole @default(MEMBER)
  joinedAt     DateTime @default(now())

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  department Department @relation(fields: [departmentId], references: [id], onDelete: Cascade)

  @@unique([userId, departmentId])
  @@map("department_members")
}

enum DepartmentRole {
  LEADER
  MEMBER
}

// 업무
model Task {
  id          String       @id @default(uuid())
  title       String
  description String?
  status      TaskStatus   @default(TODO)
  priority    Priority     @default(MEDIUM)
  progress    Int          @default(0)
  type        TaskType     @default(PERSONAL)
  startDate   DateTime?
  dueDate     DateTime?
  createdById String
  departmentId String?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  // 관계
  createdBy   User               @relation("TaskCreator", fields: [createdById], references: [id])
  department  Department?        @relation(fields: [departmentId], references: [id])
  assignments TaskAssignment[]
  comments    Comment[]
  attachments Attachment[]
  submissions TaskSubmission[]

  @@map("tasks")
}

enum TaskStatus {
  TODO        // 예정
  IN_PROGRESS // 진행중
  COMPLETED   // 완료
  ON_HOLD     // 보류
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum TaskType {
  PERSONAL    // 개인 업무
  DEPARTMENT  // 부서 업무
}

// 업무 할당
model TaskAssignment {
  id        String   @id @default(uuid())
  taskId    String
  userId    String
  assignedAt DateTime @default(now())

  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([taskId, userId])
  @@map("task_assignments")
}

// 업무 제출
model TaskSubmission {
  id          String           @id @default(uuid())
  taskId      String
  submittedBy String
  status      SubmissionStatus @default(PENDING)
  comment     String?
  feedback    String?
  submittedAt DateTime         @default(now())
  reviewedAt  DateTime?

  task        Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  submittedByUser User @relation(fields: [submittedBy], references: [id])

  @@map("task_submissions")
}

enum SubmissionStatus {
  PENDING   // 제출 대기
  SUBMITTED // 제출됨
  APPROVED  // 승인
  REJECTED  // 반려
}

// 댓글
model Comment {
  id        String   @id @default(uuid())
  content   String
  taskId    String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("comments")
}

// 첨부파일
model Attachment {
  id        String   @id @default(uuid())
  filename  String
  url       String
  size      Int
  mimeType  String
  taskId    String
  createdAt DateTime @default(now())

  task Task @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@map("attachments")
}

// 알림
model Notification {
  id        String           @id @default(uuid())
  type      NotificationType
  title     String
  message   String
  userId    String
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("notifications")
}

enum NotificationType {
  TASK_ASSIGNED
  TASK_UPDATED
  TASK_COMPLETED
  SUBMISSION_REQUEST
  SUBMISSION_APPROVED
  SUBMISSION_REJECTED
  COMMENT_ADDED
}
```

---

## 5. API 엔드포인트

### 5.1 인증 (Auth)
```
POST   /api/auth/register       회원가입
POST   /api/auth/login          로그인
POST   /api/auth/logout         로그아웃
GET    /api/auth/me             현재 사용자 정보
POST   /api/auth/refresh        토큰 갱신
```

### 5.2 사용자 (Users)
```
GET    /api/users               전체 사용자 목록
GET    /api/users/:id           사용자 상세
PUT    /api/users/:id           사용자 정보 수정
DELETE /api/users/:id           사용자 삭제
GET    /api/users/:id/stats     사용자 통계
```

### 5.3 업무 (Tasks)
```
GET    /api/tasks               업무 목록 (필터링/검색 지원)
POST   /api/tasks               업무 생성
GET    /api/tasks/:id           업무 상세
PUT    /api/tasks/:id           업무 수정
DELETE /api/tasks/:id           업무 삭제
PATCH  /api/tasks/:id/status    업무 상태 변경
PATCH  /api/tasks/:id/progress  업무 진행률 변경
POST   /api/tasks/:id/assign    업무 할당
DELETE /api/tasks/:id/assign/:userId  할당 해제
GET    /api/tasks/my            내 업무 목록
GET    /api/tasks/department/:id 부서 업무 목록
```

### 5.4 업무 제출 (Submissions)
```
GET    /api/submissions         제출 목록
POST   /api/submissions         업무 제출
GET    /api/submissions/:id     제출 상세
PUT    /api/submissions/:id/approve  승인
PUT    /api/submissions/:id/reject   반려
```

### 5.5 댓글 (Comments)
```
GET    /api/tasks/:taskId/comments    댓글 목록
POST   /api/tasks/:taskId/comments    댓글 작성
PUT    /api/comments/:id              댓글 수정
DELETE /api/comments/:id              댓글 삭제
```

### 5.6 부서 (Departments)
```
GET    /api/departments         부서 목록
POST   /api/departments         부서 생성
GET    /api/departments/:id     부서 상세
PUT    /api/departments/:id     부서 수정
DELETE /api/departments/:id     부서 삭제
POST   /api/departments/:id/members  멤버 추가
DELETE /api/departments/:id/members/:userId  멤버 제거
```

### 5.7 통계 (Statistics)
```
GET    /api/stats/dashboard     대시보드 통계
GET    /api/stats/tasks         업무 통계
GET    /api/stats/submissions   제출 통계
GET    /api/stats/users/:id     사용자별 통계
GET    /api/stats/departments/:id  부서별 통계
```

### 5.8 알림 (Notifications)
```
GET    /api/notifications       알림 목록
PATCH  /api/notifications/:id/read  읽음 처리
DELETE /api/notifications/:id   알림 삭제
PATCH  /api/notifications/read-all  전체 읽음 처리
```

---

## 6. 개발 단계

### Phase 1: 프로젝트 셋업 (1주)

#### Week 1
- [x] PRD 작성
- [x] Plan 작성
- [ ] 프로젝트 초기화
  - [ ] Frontend: Next.js 프로젝트 생성
  - [ ] Backend: NestJS 프로젝트 생성
  - [ ] Docker Compose 설정
- [ ] 개발 환경 구성
  - [ ] ESLint, Prettier 설정
  - [ ] Git 초기화 및 .gitignore 설정
- [ ] 데이터베이스 설정
  - [ ] PostgreSQL Docker 컨테이너
  - [ ] Prisma 초기화 및 스키마 작성
  - [ ] 마이그레이션 실행

### Phase 2: 백엔드 기본 구조 (2주)

#### Week 2
- [ ] 인증 모듈
  - [ ] JWT 인증 구현
  - [ ] 회원가입 API
  - [ ] 로그인 API
  - [ ] 인증 가드 구현
- [ ] 사용자 모듈
  - [ ] 사용자 CRUD API
  - [ ] 사용자 프로필 API

#### Week 3
- [ ] 업무 모듈 (기본)
  - [ ] 업무 CRUD API
  - [ ] 업무 목록 조회 (필터링)
  - [ ] 업무 할당 API
  - [ ] 업무 상태 변경 API
- [ ] 부서 모듈 (기본)
  - [ ] 부서 CRUD API
  - [ ] 부서 멤버 관리 API

### Phase 3: 프론트엔드 기본 구조 (2주)

#### Week 4
- [ ] 레이아웃 구성
  - [ ] Sidebar 컴포넌트
  - [ ] Header 컴포넌트
  - [ ] MainLayout 컴포넌트
- [ ] 인증 페이지
  - [ ] 로그인 페이지
  - [ ] 회원가입 페이지
  - [ ] 인증 스토어 (Zustand)

#### Week 5
- [ ] UI 컴포넌트 라이브러리
  - [ ] Shadcn/ui 설치 및 설정
  - [ ] 공통 컴포넌트 구현
    - [ ] Button, Input, Select
    - [ ] Card, Badge, Avatar
    - [ ] Dialog, Dropdown
- [ ] TailwindCSS 커스텀 설정
  - [ ] 색상 체계 적용
  - [ ] 타이포그래피 설정

### Phase 4: 대시보드 구현 (3주)

#### Week 6
- [ ] 통계 카드 컴포넌트
  - [ ] StatCard 컴포넌트 구현
  - [ ] 프로그레스 바 컴포넌트
  - [ ] 통계 API 연동
- [ ] 필터 영역
  - [ ] 기간 필터 컴포넌트
  - [ ] 날짜 범위 선택기
  - [ ] 상태 드롭다운

#### Week 7
- [ ] 업무 카드 그리드
  - [ ] TaskCard 컴포넌트 구현
  - [ ] 상태 아이콘 컴포넌트
  - [ ] 담당자 아바타 표시
  - [ ] 진행률 바
  - [ ] 3열 그리드 레이아웃

#### Week 8
- [ ] 업무 목록 테이블
  - [ ] TaskTable 컴포넌트 구현
  - [ ] 테이블 행 컴포넌트
  - [ ] 체크박스 선택 기능
  - [ ] 정렬 기능
- [ ] 일감 추가 버튼 (FAB)
  - [ ] FAB 컴포넌트 구현
  - [ ] 업무 생성 모달

### Phase 5: 업무 관리 기능 (2주)

#### Week 9
- [ ] 업무 생성/수정
  - [ ] TaskForm 컴포넌트
  - [ ] React Hook Form 구현
  - [ ] 유효성 검사 (Zod)
  - [ ] API 연동
- [ ] 업무 상세
  - [ ] TaskDetail 컴포넌트
  - [ ] 업무 정보 표시
  - [ ] 상태 변경 기능

#### Week 10
- [ ] 업무 할당
  - [ ] 담당자 선택 컴포넌트
  - [ ] 할당 API 연동
- [ ] 업무 삭제/복구
  - [ ] 삭제 확인 다이얼로그
  - [ ] 휴지통 기능
- [ ] 검색 기능
  - [ ] 검색 입력 컴포넌트
  - [ ] 검색 API 연동

### Phase 6: 제출 및 승인 기능 (1주)

#### Week 11
- [ ] 업무 제출
  - [ ] 제출 폼 컴포넌트
  - [ ] 제출 API 연동
- [ ] 제출 현황 페이지
  - [ ] 제출 목록 테이블
  - [ ] 상태별 필터
  - [ ] 승인/반려 버튼

### Phase 7: 부서 업무 및 통계 (1주)

#### Week 12
- [ ] 부서 업무 페이지
  - [ ] 부서별 필터 추가
  - [ ] 팀원별 필터 추가
- [ ] 통계 페이지
  - [ ] Recharts 연동
  - [ ] 차트 컴포넌트 구현
  - [ ] 통계 API 연동

### Phase 8: 테스트 및 최적화 (1주)

#### Week 13
- [ ] 테스트
  - [ ] 주요 기능 테스트
  - [ ] 버그 수정
  - [ ] 크로스 브라우저 테스트
- [ ] 최적화
  - [ ] 성능 최적화
  - [ ] 코드 리팩토링
  - [ ] 문서화
- [ ] 배포 준비
  - [ ] 환경 변수 설정
  - [ ] Docker 이미지 빌드
  - [ ] README 작성

---

## 7. 개발 우선순위

### 7.1 Must Have (필수)
1. 사용자 인증 (로그인/회원가입)
2. 개인 업무 CRUD
3. 대시보드 (통계 카드, 업무 카드, 업무 테이블)
4. 업무 상태 관리
5. 기간 필터

### 7.2 Should Have (중요)
1. 업무 할당
2. 부서 업무 관리
3. 검색 기능
4. 업무 제출/승인
5. 알림 기능

### 7.3 Nice to Have (추가)
1. 댓글 기능
2. 첨부파일
3. 통계 차트
4. 모바일 반응형
5. 다크 모드

---

## 8. 주요 컴포넌트 구현 가이드

### 8.1 StatCard 컴포넌트
```typescript
// components/dashboard/StatCard.tsx
interface StatCardProps {
  title: string;
  value: number;
  description: string;
  progress: number;
  color: 'blue' | 'orange' | 'pink' | 'green';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  progress,
  color
}) => {
  // UI.png의 통계 카드 디자인 구현
  // - 상단: 큰 숫자
  // - 중단: 설명 텍스트
  // - 하단: 진행률 바
};
```

### 8.2 TaskCard 컴포넌트
```typescript
// components/dashboard/TaskCard.tsx
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    status: TaskStatus;
    progress: number;
    assignee: {
      name: string;
      avatar: string;
    };
  };
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  // UI.png의 업무 카드 디자인 구현
  // - 상태 아이콘 (색상별)
  // - 제목 (2줄 제한)
  // - 담당자 아바타
  // - 진행률 바
};
```

### 8.3 FilterBar 컴포넌트
```typescript
// components/dashboard/FilterBar.tsx
interface FilterBarProps {
  onPeriodChange: (period: string) => void;
  onStatusChange: (status: string) => void;
  onSearch: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onPeriodChange,
  onStatusChange,
  onSearch
}) => {
  // UI.png의 필터 영역 구현
  // - 기간 필터 (1주, 2주, 1개월, 3개월, 6개월)
  // - 날짜 범위 선택기
  // - 상태 드롭다운
  // - 검색 버튼
};
```

---

## 9. 색상 상수 정의

```typescript
// lib/constants.ts
export const COLORS = {
  status: {
    todo: '#FF4D4D',        // 빨간색 - 시작 전
    inProgress: '#4D7CFF',  // 파란색 - 진행중
    completed: '#4CAF50',   // 초록색 - 완료
    onHold: '#9E9E9E',      // 회색 - 보류
  },
  stat: {
    total: '#4D7CFF',       // 파란색 - 총 개수
    inProgress: '#FFA726',  // 주황색 - 진행중
    completed: '#EC407A',   // 분홍색 - 완료
    scheduled: '#4CAF50',   // 초록색 - 예정
  },
  priority: {
    low: '#4CAF50',
    medium: '#FFA726',
    high: '#FF6B6B',
    urgent: '#D32F2F',
  },
  ui: {
    background: '#F5F5F5',
    card: '#FFFFFF',
    border: '#E0E0E0',
    text: '#424242',
    textSecondary: '#616161',
    primary: '#4D7CFF',
  }
};

export const TASK_STATUS = {
  TODO: { label: '예정', color: COLORS.status.todo },
  IN_PROGRESS: { label: '진행중', color: COLORS.status.inProgress },
  COMPLETED: { label: '완료', color: COLORS.status.completed },
  ON_HOLD: { label: '보류', color: COLORS.status.onHold },
};
```

---

## 10. 환경 변수

### 10.1 Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=업무일감 관리
```

### 10.2 Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_management
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
PORT=3001
```

### 10.3 Docker Compose
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: task_management
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/task_management
      JWT_SECRET: your-secret-key-here

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    environment:
      NEXT_PUBLIC_API_URL: http://backend:3001/api

volumes:
  postgres_data:
```

---

## 11. 구현 체크리스트

### 11.1 백엔드
- [ ] NestJS 프로젝트 초기화
- [ ] Prisma 스키마 작성
- [ ] 데이터베이스 마이그레이션
- [ ] 인증 모듈 (JWT)
- [ ] 사용자 모듈
- [ ] 업무 모듈
- [ ] 부서 모듈
- [ ] 제출 모듈
- [ ] 통계 API
- [ ] Swagger 문서화

### 11.2 프론트엔드
- [ ] Next.js 프로젝트 초기화
- [ ] TailwindCSS 설정
- [ ] Shadcn/ui 설치
- [ ] 레이아웃 컴포넌트 (Sidebar, Header)
- [ ] 로그인/회원가입 페이지
- [ ] 대시보드 페이지
  - [ ] 통계 카드
  - [ ] 필터 영역
  - [ ] 업무 카드 그리드
  - [ ] 업무 목록 테이블
  - [ ] FAB 버튼
- [ ] 내 업무 페이지
- [ ] 부서 업무 페이지
- [ ] 제출 현황 페이지
- [ ] 통계 페이지
- [ ] 설정 페이지
- [ ] 업무 생성/수정 모달
- [ ] 업무 상세 모달

### 11.3 DevOps
- [ ] Docker Compose 설정
- [ ] 환경 변수 설정
- [ ] Git 초기화
- [ ] README 작성

---

## 12. 다음 단계

1. 프로젝트 초기화
2. 백엔드 기본 구조 구현
3. 프론트엔드 레이아웃 구현
4. 대시보드 페이지 구현 (UI.png 기반)
5. 업무 관리 기능 구현
6. 테스트 및 최적화

---

## 13. 참고 사항

### 13.1 코딩 컨벤션
- TypeScript strict 모드 사용
- ESLint + Prettier 자동 포맷팅
- 컴포넌트는 함수형 컴포넌트 사용
- 상태 관리는 Zustand 사용
- API 호출은 React Query 사용

### 13.2 Git 브랜치 전략
- main: 프로덕션 브랜치
- develop: 개발 브랜치
- feature/*: 기능 개발 브랜치
- hotfix/*: 긴급 수정 브랜치

### 13.3 커밋 메시지 컨벤션
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 설정 등
```

---

## 14. 개발 워크플로우 (필수 준수)

### 14.1 모든 변경사항에 대한 필수 단계

**CRITICAL: 이 워크플로우는 반드시 따라야 합니다**

```bash
# 1. 코드 작성 후
# 2. 변경사항 검토
git diff

# 3. 빌드 테스트 (필수!)
cd frontend && npm run build
cd ../backend && npm run build

# 4. 타입 에러 수정 (있을 경우)
# 5. 빌드 에러 수정 (있을 경우)

# 6. 테스트 실행 (있을 경우)
npm test

# 7. 모든 테스트가 통과한 후에만 커밋
git add .
git commit -m "feat: 설명적인 커밋 메시지"
git push
```

### 14.2 빌드가 실패하는 경우

**절대 커밋하지 마세요!**

1. TypeScript 에러 확인 및 수정
2. Import 경로 확인
3. 타입 정의 확인
4. 누락된 의존성 설치
5. 다시 빌드 → 성공할 때까지 반복

### 14.3 컴포넌트 개발 워크플로우

```
1. 기존 컴포넌트 검토 → 재사용 가능한지 확인
2. 새 컴포넌트 필요 시:
   a. Atomic Design 레벨 결정 (atom/molecule/organism)
   b. kebab-case로 폴더/파일 생성
   c. Server Component 우선 고려
   d. 인터랙션 필요시에만 "use client" 추가
   e. 파일이 200줄 넘어가면 분리
3. 타입 정의 (types/ 폴더)
4. 컴포넌트 구현
5. 빌드 테스트
6. 커밋
```

### 14.4 Hydration 에러 방지

```typescript
// ❌ 절대 금지
const Component = () => {
  const now = Date.now(); // 서버/클라이언트 불일치
  return <div>{now}</div>;
};

// ✅ 올바른 방법
"use client";
const Component = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>;

  return <div>{Date.now()}</div>;
};
```

### 14.5 파일 크기 관리

**200줄 제한 엄수**

```typescript
// ❌ 나쁜 예: 한 파일에 모든 로직
// task-card.tsx (500줄)
export const TaskCard = () => {
  // 너무 많은 로직...
};

// ✅ 좋은 예: 분리
// task-card/task-card.tsx (100줄)
export const TaskCard = () => {
  return (
    <Card>
      <TaskCardHeader {...} />
      <TaskCardBody {...} />
      <TaskCardFooter {...} />
    </Card>
  );
};

// task-card/task-card-header.tsx (50줄)
// task-card/task-card-body.tsx (80줄)
// task-card/task-card-footer.tsx (60줄)
```

---

## 15. SSR vs Client Components 가이드

### 15.1 Server Components (기본)

**언제 사용**: 대부분의 경우

```typescript
// components/organisms/task-grid/task-grid.tsx
// "use client" 없음 = Server Component

import { TaskCard } from '@/components/molecules/task-card';

export async function TaskGrid({ userId }: { userId: string }) {
  // 서버에서 데이터 페칭 가능
  const tasks = await fetchTasks(userId);

  return (
    <div className="grid grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

### 15.2 Client Components ("use client")

**언제 사용**: 다음의 경우만

- onClick, onChange 등 이벤트 핸들러
- useState, useEffect 등 React hooks
- Browser API (window, localStorage)
- 외부 라이브러리가 클라이언트 전용인 경우

```typescript
// components/organisms/fab-button/fab-button.tsx
"use client"; // 필요한 경우만!

import { useState } from 'react';
import { Plus } from 'lucide-react';

export function FABButton({ onTaskCreate }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 ..."
    >
      <Plus />
    </button>
  );
}
```

### 15.3 혼합 패턴

```typescript
// Server Component (부모)
// app/(dashboard)/my-tasks/page.tsx
import { TaskGrid } from '@/components/organisms/task-grid';
import { FABButton } from '@/components/organisms/fab-button'; // Client Component

export default async function MyTasksPage() {
  return (
    <div>
      <TaskGrid userId="123" /> {/* Server */}
      <FABButton /> {/* Client */}
    </div>
  );
}
```

---

## 16. 금지 사항 (CRITICAL)

### 16.1 절대 하지 말 것

```typescript
// ❌ setTimeout으로 상태 동기화
setTimeout(() => setData(newData), 100);

// ❌ window.location.reload()로 상태 리셋
window.location.reload();

// ❌ any 타입 사용
const data: any = fetchData();

// ❌ 하드코딩된 색상
<div style={{ color: '#4D7CFF' }}>

// ❌ 200줄 초과 파일
// (파일이 길어지면 즉시 분리)

// ❌ PascalCase 파일명
// TaskCard.tsx (X)
// task-card.tsx (O)
```

### 16.2 항상 해야 할 것

```typescript
// ✅ 근본 원인 해결
// 데이터 문제는 백엔드에서 해결

// ✅ 타입 안전성
const data: TaskData = fetchData();

// ✅ 테마 색상 사용
import { COLORS } from '@/lib/constants/colors';
<div style={{ color: COLORS.status.inProgress }}>

// ✅ 파일 분리
// 200줄 넘어가면 즉시 분리

// ✅ kebab-case
// task-card.tsx (O)
```

---

## 17. 최종 체크리스트

### 17.1 프로젝트 시작 전
- [ ] CLAUDE.md 숙지
- [ ] package.json 확인 (npm 사용)
- [ ] Atomic Design 패턴 이해
- [ ] SSR vs Client Components 이해

### 17.2 컴포넌트 생성 시
- [ ] kebab-case 파일명
- [ ] Atomic Design 레벨 결정
- [ ] Server Component 우선
- [ ] 200줄 이하 유지
- [ ] 타입 정의 작성

### 17.3 코드 작성 후
- [ ] TypeScript 에러 없음
- [ ] 빌드 성공 (npm run build)
- [ ] 테스트 통과 (있을 경우)
- [ ] git diff 검토
- [ ] 커밋 및 푸시

### 17.4 PR/배포 전
- [ ] 모든 빌드 성공
- [ ] 모든 테스트 통과
- [ ] 환경 변수 설정
- [ ] 문서 업데이트

---

**작성일**: 2025-11-13
**버전**: 2.0 (CLAUDE.md 반영)
**다음 업데이트**: 구현 진행 중 필요시

**주요 변경사항 (v2.0)**:
- CLAUDE.md 개발 원칙 통합
- Atomic Design 패턴 적용
- kebab-case 파일 네이밍 적용
- SSR First 원칙 강조
- 파일당 200줄 제한 추가
- 개발 워크플로우 필수 준수 사항 추가
- 금지 사항 및 필수 사항 명시
