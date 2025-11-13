# 최종 구현 계획 (Implementation Roadmap)

## 📋 문서 개요

이 문서는 업무 일감 관리 시스템의 최종 구현 계획입니다.
- **PRD.md**: 제품 요구사항 정의
- **plan.md**: 상세 기술 구현 계획
- **CLAUDE.md**: 개발 가이드라인
- **IMPLEMENTATION.md** (본 문서): 즉시 실행 가능한 단계별 가이드

---

## 🎯 프로젝트 목표

UI.png 디자인에 최대한 가까운 업무 일감 관리 시스템 구축

### 핵심 기능
1. ✅ 개인/부서 업무 관리
2. ✅ 대시보드 (통계 카드, 업무 카드, 업무 테이블)
3. ✅ 업무 제출 및 승인 프로세스
4. ✅ 실시간 통계 및 현황 모니터링

---

## 🛠️ 기술 스택 (확정)

### Frontend
- **Framework**: Next.js 14 (App Router, SSR First)
- **Language**: TypeScript (strict, no any)
- **UI**: Shadcn/ui + TailwindCSS
- **Icons**: Lucide React
- **State**: Zustand (최소화)
- **Data Fetching**: TanStack Query
- **Forms**: React Hook Form + Zod

### Backend
- **Framework**: NestJS
- **Language**: TypeScript (strict)
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Auth**: JWT + Passport

### DevOps
- **Container**: Docker + Docker Compose
- **Package Manager**: npm (일관성)

---

## 📐 개발 원칙 (엄수)

```
✅ SSR First - Server Components 기본
✅ 파일당 200줄 최대
✅ Atomic Design (atoms → molecules → organisms)
✅ kebab-case 파일명 (소문자, Linux 호환)
✅ Type-safe (any 타입 금지)
✅ DRY 원칙 철저히
✅ "use client" 최소화
✅ No fallbacks/workarounds
✅ 매 변경 후 빌드 테스트 필수
```

---

## 🚀 구현 로드맵 (13주)

### Week 1: 프로젝트 초기화
```bash
# 1. 프로젝트 구조 생성
mkdir -p task-management/{frontend,backend}
cd task-management

# 2. Frontend 초기화
cd frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install zustand @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers

# 3. Backend 초기화
cd ../backend
npm i -g @nestjs/cli
nest new . --package-manager npm
npm install @nestjs/passport @nestjs/jwt passport passport-jwt
npm install @nestjs/config
npm install prisma @prisma/client
npm install class-validator class-transformer

# 4. Docker Compose 설정
cd ..
# docker-compose.yml 작성

# 5. Git 초기화
git init
# .gitignore 설정
git add .
git commit -m "chore: 프로젝트 초기화"
```

**체크리스트**:
- [ ] Next.js 14 프로젝트 생성
- [ ] NestJS 프로젝트 생성
- [ ] 필수 패키지 설치
- [ ] Docker Compose 설정
- [ ] CLAUDE.md 복사
- [ ] .env.example 작성
- [ ] Git 초기화 및 첫 커밋

---

### Week 2: 데이터베이스 및 인증 설정

**Backend 작업**:
```bash
cd backend

# Prisma 초기화
npx prisma init

# schema.prisma 작성 (plan.md 참고)
# 마이그레이션
npx prisma migrate dev --name init

# 시드 데이터 작성 및 실행
npx prisma db seed
```

**구현 항목**:
1. Prisma 스키마 작성
   - User, Department, Task 등 8개 모델
2. 인증 모듈 구현
   - JWT 전략
   - 회원가입/로그인 API
   - 인증 가드
3. 사용자 모듈 구현
   - CRUD API
   - 프로필 관리

**체크리스트**:
- [ ] Prisma 스키마 완성
- [ ] 마이그레이션 성공
- [ ] Auth 모듈 완성
- [ ] Users 모듈 완성
- [ ] JWT 인증 테스트
- [ ] Swagger 문서 생성
- [ ] `npm run build` 성공

---

### Week 3: 업무 및 부서 API

**Backend 작업**:
```bash
cd backend/src

# 모듈 생성
nest g module tasks
nest g controller tasks
nest g service tasks

nest g module departments
nest g controller departments
nest g service departments
```

**구현 항목**:
1. Tasks 모듈
   - CRUD API
   - 필터링/검색
   - 할당 기능
   - 상태 변경
2. Departments 모듈
   - CRUD API
   - 멤버 관리

**체크리스트**:
- [ ] Tasks CRUD API
- [ ] 업무 할당 API
- [ ] 업무 필터링 (상태, 기간, 담당자)
- [ ] Departments CRUD API
- [ ] 부서 멤버 관리 API
- [ ] Swagger 문서 업데이트
- [ ] `npm run build` 성공

---

### Week 4: Frontend 레이아웃 및 인증

**Frontend 작업**:
```bash
cd frontend

# Shadcn/ui 초기화
npx shadcn-ui@latest init

# 컴포넌트 설치
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add avatar
```

**파일 구조** (kebab-case):
```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/
│       └── layout.tsx
├── components/
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
│       ├── sidebar/
│       └── header/
└── lib/
    └── api/
```

**구현 항목**:
1. 레이아웃 컴포넌트
   - Sidebar (Server Component)
   - Header (Server Component)
2. 인증 페이지
   - 로그인 (Client Component)
   - 회원가입 (Client Component)
3. API 클라이언트
   - Axios 설정
   - 인증 인터셉터

**체크리스트**:
- [ ] Shadcn/ui 설정
- [ ] Sidebar 컴포넌트 (<200줄)
- [ ] Header 컴포넌트 (<200줄)
- [ ] 로그인 페이지
- [ ] 회원가입 페이지
- [ ] API 클라이언트 설정
- [ ] Auth 스토어 (Zustand)
- [ ] `npm run build` 성공

---

### Week 5-6: UI 컴포넌트 라이브러리 (UI.png 기반)

**파일 구조**:
```
src/components/
├── atoms/
│   ├── button/
│   ├── badge/
│   ├── avatar/
│   └── progress-bar/
├── molecules/
│   ├── stat-card/           # 통계 카드
│   ├── task-card/           # 업무 카드
│   ├── task-status-badge/   # 상태 뱃지
│   └── date-range-picker/   # 날짜 선택기
└── organisms/
    ├── filter-bar/          # 필터 영역
    └── fab-button/          # 일감 추가 버튼
```

**구현 항목**:

1. **Atoms** (기본 컴포넌트, 각 <100줄)
   - Button, Badge, Avatar, Progress Bar

2. **Molecules** (조합 컴포넌트, 각 <150줄)
   - StatCard: 숫자 + 설명 + 프로그레스 바
   - TaskCard: 상태 아이콘 + 제목 + 아바타 + 진행률
   - TaskStatusBadge: 색상별 상태 표시
   - DateRangePicker: 날짜 범위 선택

3. **색상 상수** (lib/constants/colors.ts)
```typescript
export const COLORS = {
  status: {
    todo: '#FF4D4D',
    inProgress: '#4D7CFF',
    completed: '#4CAF50',
    onHold: '#9E9E9E',
  },
  stat: {
    total: '#4D7CFF',
    inProgress: '#FFA726',
    completed: '#EC407A',
    scheduled: '#4CAF50',
  },
  // ... (plan.md 참고)
};
```

**체크리스트**:
- [ ] Atoms 컴포넌트 (4개)
- [ ] Molecules 컴포넌트 (4개)
- [ ] 색상 상수 정의
- [ ] Storybook 설정 (선택)
- [ ] 각 파일 200줄 이하
- [ ] `npm run build` 성공

---

### Week 7-8: 대시보드 구현 (핵심)

**파일 구조**:
```
src/
├── app/(dashboard)/
│   └── my-tasks/
│       └── page.tsx         # Server Component
└── components/organisms/
    ├── stat-cards-section/  # 통계 카드 섹션
    ├── filter-bar/          # 필터 영역
    ├── task-grid/           # 업무 카드 그리드
    └── task-table/          # 업무 목록 테이블
```

**구현 항목**:

1. **통계 카드 섹션** (Server Component)
```typescript
// components/organisms/stat-cards-section/stat-cards-section.tsx
import { StatCard } from '@/components/molecules/stat-card';

export async function StatCardsSection({ userId }: Props) {
  const stats = await fetchStats(userId);

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        title="총 개수"
        value={stats.total}
        description="전체 업무"
        progress={100}
        color="blue"
      />
      {/* 나머지 3개 */}
    </div>
  );
}
```

2. **필터 영역** (Client Component)
```typescript
// components/organisms/filter-bar/filter-bar.tsx
"use client";

export function FilterBar({ onFilterChange }: Props) {
  // 기간 필터: 1주, 2주, 1개월, 3개월, 6개월, 날짜 범위
  // 상태 드롭다운
  // 검색 버튼
}
```

3. **업무 카드 그리드** (Server Component)
```typescript
// components/organisms/task-grid/task-grid.tsx
import { TaskCard } from '@/components/molecules/task-card';

export async function TaskGrid({ filters }: Props) {
  const tasks = await fetchTasks(filters);

  return (
    <div className="grid grid-cols-3 gap-4">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
```

4. **업무 목록 테이블** (Server Component)
```typescript
// components/organisms/task-table/task-table.tsx
export async function TaskTable({ filters }: Props) {
  const tasks = await fetchTasks(filters);

  return (
    <table>
      {/* 제목, 담당자, 마감일, 우선순위 */}
    </table>
  );
}
```

5. **FAB 버튼** (Client Component)
```typescript
// components/organisms/fab-button/fab-button.tsx
"use client";

export function FABButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button className="fixed bottom-6 right-6 ...">
      <Plus />
    </button>
  );
}
```

**체크리스트**:
- [ ] 통계 카드 섹션 (4개 카드)
- [ ] 필터 영역 (기간, 상태, 검색)
- [ ] 업무 카드 그리드 (3열)
- [ ] 업무 목록 테이블
- [ ] FAB 버튼
- [ ] 대시보드 페이지 완성
- [ ] UI.png와 비교 검증
- [ ] 각 파일 200줄 이하
- [ ] `npm run build` 성공

---

### Week 9-10: 업무 관리 기능

**구현 항목**:

1. **업무 생성/수정 모달** (Client Component)
```typescript
// components/organisms/task-form/task-form.tsx
"use client";

export function TaskForm({ taskId, onSubmit }: Props) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  // React Hook Form + Zod 검증
}
```

2. **업무 상세 모달** (Mixed)
```typescript
// components/organisms/task-detail/task-detail.tsx
export function TaskDetail({ taskId }: Props) {
  // Server Component로 데이터 패칭
  // Client Component로 인터랙션
}
```

3. **업무 할당**
4. **업무 삭제/복구**
5. **검색 기능**

**체크리스트**:
- [ ] TaskForm 컴포넌트
- [ ] TaskDetail 컴포넌트
- [ ] 업무 생성 API 연동
- [ ] 업무 수정 API 연동
- [ ] 업무 삭제 API 연동
- [ ] 할당 기능
- [ ] 검색 기능
- [ ] `npm run build` 성공

---

### Week 11: 제출 및 승인

**구현 항목**:
1. 제출 페이지
2. 승인/반려 기능
3. 제출 현황 테이블

**체크리스트**:
- [ ] 제출 폼
- [ ] 제출 목록
- [ ] 승인/반려 버튼
- [ ] 제출 현황 API 연동
- [ ] `npm run build` 성공

---

### Week 12: 부서 업무 및 통계

**구현 항목**:
1. 부서 업무 페이지
2. 통계 페이지 (Recharts)

**체크리스트**:
- [ ] 부서 업무 페이지
- [ ] 부서별/팀원별 필터
- [ ] 통계 차트 (막대, 원형)
- [ ] `npm run build` 성공

---

### Week 13: 테스트 및 최적화

**작업 항목**:
1. 전체 기능 테스트
2. 버그 수정
3. 성능 최적화
4. 코드 리팩토링
5. 문서화

**체크리스트**:
- [ ] 모든 기능 테스트
- [ ] 크로스 브라우저 테스트
- [ ] 반응형 테스트
- [ ] 성능 최적화
- [ ] README 작성
- [ ] 환경 변수 가이드
- [ ] 배포 준비

---

## 📝 필수 개발 워크플로우

**매 변경사항마다 반드시 실행**:

```bash
# 1. 코드 작성
# 2. 변경사항 검토
git diff

# 3. 빌드 테스트 (필수!)
npm run build

# 4. 에러 수정 (있을 경우)
# 5. 다시 빌드 → 성공할 때까지

# 6. 커밋
git add .
git commit -m "feat: 설명"
git push
```

**빌드 실패 시**: 절대 커밋하지 않기!

---

## 🎨 UI.png 디자인 체크리스트

### 레이아웃
- [ ] 사이드바 (240px 고정)
- [ ] 상단 헤더
- [ ] 메인 컨텐츠 영역

### 통계 카드 (4개)
- [ ] 파란색: 총 개수 (138)
- [ ] 주황색: 진행중 (54)
- [ ] 분홍색: 완료 (21)
- [ ] 초록색: 예정 (63)
- [ ] 프로그레스 바 표시

### 필터 영역
- [ ] 기간 필터 (1주, 2주, 1개월, 3개월, 6개월)
- [ ] 날짜 범위 선택기
- [ ] 상태 드롭다운
- [ ] 검색 버튼

### 업무 카드 그리드 (3열)
- [ ] 상태 아이콘 (좌측 상단, 색상별)
- [ ] 업무 제목 (2줄 제한)
- [ ] 담당자 아바타 + 이름
- [ ] 진행률 바
- [ ] 더보기 아이콘 (우측 상단)

### 업무 목록 테이블
- [ ] 제목, 담당자, 마감일 컬럼
- [ ] 담당자 아바타 표시
- [ ] 우선순위 표시
- [ ] 호버 효과

### FAB 버튼
- [ ] 오른쪽 하단 고정
- [ ] 파란색 원형 (56x56px)
- [ ] + 아이콘
- [ ] 그림자 효과

---

## 🔍 품질 체크리스트

### 코드 품질
- [ ] TypeScript strict 모드
- [ ] any 타입 없음
- [ ] 모든 파일 200줄 이하
- [ ] kebab-case 파일명
- [ ] Atomic Design 준수
- [ ] Server Components 우선 사용

### 기능 테스트
- [ ] 로그인/회원가입
- [ ] 업무 생성/수정/삭제
- [ ] 업무 할당
- [ ] 업무 제출/승인
- [ ] 필터링/검색
- [ ] 통계 표시

### 성능
- [ ] 페이지 로딩 3초 이내
- [ ] 빌드 에러 없음
- [ ] Hydration 에러 없음
- [ ] 콘솔 에러 없음

### 문서화
- [ ] README.md 완성
- [ ] .env.example 제공
- [ ] API 문서 (Swagger)
- [ ] 컴포넌트 JSDoc

---

## 🚦 다음 단계

### 즉시 시작
```bash
# 1. 프로젝트 초기화
mkdir task-management
cd task-management

# 2. Frontend 생성
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir

# 3. Backend 생성
npx @nestjs/cli new backend --package-manager npm

# 4. Docker Compose 설정
# docker-compose.yml 작성

# 5. 첫 커밋
git init
git add .
git commit -m "chore: 프로젝트 초기 설정"
```

### 개발 시작
1. Week 1 체크리스트부터 순서대로 진행
2. 매 변경 후 빌드 테스트
3. UI.png와 지속적으로 비교
4. CLAUDE.md 원칙 준수

---

## 📞 참고 문서

- **PRD.md**: 제품 요구사항 상세
- **plan.md**: 기술 구현 상세
- **CLAUDE.md**: 개발 가이드라인
- **UI.png**: 디자인 참고

---

**작성일**: 2025-11-13
**버전**: 1.0
**상태**: 구현 준비 완료

**준비 완료!** 위 단계를 따라 개발을 시작하세요. 🚀
