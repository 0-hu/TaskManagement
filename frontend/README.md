# Frontend - Next.js Application

업무 관리 시스템의 프론트엔드 웹 애플리케이션입니다.

## 🏗️ 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **Icons**: Lucide React (SVG icons)
- **State Management**: Zustand
- **Charts**: Recharts
- **Forms**: React Hook Form (if needed)

## 📂 프로젝트 구조
```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Authentication pages (login, register)
│   │   ├── (dashboard)/    # Dashboard pages
│   │   │   ├── dashboard/  # Main dashboard
│   │   │   ├── my-tasks/   # Personal tasks
│   │   │   ├── department-tasks/ # Department tasks
│   │   │   ├── submissions/      # Task submissions
│   │   │   ├── statistics/       # Statistics & charts
│   │   │   ├── settings/         # Settings
│   │   │   ├── trash/            # Trash bin
│   │   │   └── profile/          # User profile
│   │   ├── layout.tsx      # Root layout
│   │   ├── not-found.tsx   # 404 page
│   │   └── error.tsx       # Error boundary
│   ├── components/         # React components
│   │   ├── atoms/          # Basic components (Avatar, Button, etc.)
│   │   ├── molecules/      # Composite components
│   │   ├── organisms/      # Complex components (Sidebar, Header)
│   │   └── ui/             # UI library components
│   ├── lib/                # Utilities & configurations
│   │   └── api/            # API service layer
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── tailwind.config.js      # TailwindCSS configuration
├── next.config.js          # Next.js configuration
└── package.json
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. 개발 서버 실행
```bash
# 개발 모드
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm run start
```

개발 서버: `http://localhost:3000`

## 📱 주요 페이지

### 인증 페이지 (Public)
- `/` - 홈페이지
- `/login` - 로그인
- `/register` - 회원가입

### 대시보드 페이지 (Protected)
- `/dashboard` - 메인 대시보드
  - 통계 카드 (총 업무, 진행중, 완료, 예정)
  - 최근 업무 카드 그리드
  - 업무 테이블

- `/my-tasks` - 내 업무
  - Kanban 보드 (할일, 진행중, 완료, 대기)
  - 업무 생성/수정/삭제 모달
  - 필터링 및 검색

- `/department-tasks` - 부서 업무
  - 부서 선택 탭
  - 부서 통계
  - 팀원 관리
  - 부서 업무 목록

- `/submissions` - 제출 현황
  - 제출 목록 테이블
  - 승인/반려 모달
  - 상태별 필터링

- `/statistics` - 통계
  - 대시보드 통계 (KPI 카드)
  - 업무 상태 분포 (Pie Chart)
  - 우선순위 분포 (Bar Chart)
  - 월별 트렌드 (Line Chart)

- `/settings` - 설정
  - 프로필 설정
  - 계정 설정
  - 알림 설정
  - 부서 관리

- `/trash` - 휴지통
  - 삭제된 업무 목록
  - 복원 기능
  - 영구 삭제

- `/profile` - 프로필
  - 사용자 정보
  - 프로필 편집

## 🎨 UI/UX 디자인 가이드

### 디자인 시스템
- **Border Radius**: `rounded-xl` (12px) 기본 사용
- **Shadows**: `shadow-card` (커스텀 shadow)
- **Transitions**: `transition-all` (smooth animations)
- **Hover Effects**: `hover:shadow-card-hover`

### 색상 팔레트 (TailwindCSS)
```javascript
// tailwind.config.js
colors: {
  'ui-primary': '#4D7CFF',       // Primary blue
  'ui-text': '#1F2937',           // Text color
  'ui-textSecondary': '#6B7280',  // Secondary text
  'ui-border': '#E5E7EB',         // Border color
  'stat-total': '#4D7CFF',        // Total tasks
  'stat-inProgress': '#FFA726',   // In progress
  'stat-completed': '#4CAF50',    // Completed
  'stat-scheduled': '#EC407A',    // Scheduled
}
```

### 아이콘 사용
- **Lucide React**: SVG 기반 아이콘 라이브러리
- **Emoji 금지**: 모든 아이콘은 Lucide React 사용
- 일관된 크기: `w-4 h-4` (작은 아이콘), `w-5 h-5` (중간), `w-6 h-6` (큰 아이콘)

### 컴포넌트 패턴

#### Modal
```typescript
function Modal({ children, onClose, size = 'md' }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}
           onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
```

#### Empty State
```typescript
<div className="bg-white rounded-xl p-12 text-center shadow-card border border-ui-border">
  <div className="flex justify-center mb-4">
    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
      <Icon className="w-12 h-12 text-gray-400" />
    </div>
  </div>
  <h2 className="text-xl font-bold text-ui-text mb-2">제목</h2>
  <p className="text-ui-textSecondary mb-6">설명</p>
</div>
```

## 🔧 주요 컴포넌트

### Atoms
- **Avatar** - 사용자 아바타 (이니셜 또는 이미지)
- **Button** - 버튼 컴포넌트 (variants)
- **Badge** - 상태 뱃지
- **Input** - 입력 필드

### Organisms
- **Sidebar** - 사이드바 네비게이션
- **Header** - 페이지 헤더
- **TaskCard** - 업무 카드
- **StatCard** - 통계 카드

## 📡 API 연동

### API Service Layer
모든 API 호출은 `src/lib/api/` 디렉토리에서 관리

```typescript
// src/lib/api/tasks.ts
export const tasksApi = {
  getAll: (query, token) => ApiClient.get('/tasks', token),
  create: (data, token) => ApiClient.post('/tasks', data, token),
  update: (id, data, token) => ApiClient.put(`/tasks/${id}`, data, token),
  delete: (id, token) => ApiClient.delete(`/tasks/${id}`, token),
};
```

### Authentication
- JWT 토큰을 Zustand store에 저장
- 모든 API 요청에 토큰 포함
- 401 응답 시 자동 로그아웃

```typescript
// src/stores/auth-store.ts
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
```

## 📊 데이터 시각화

### Recharts 사용
```typescript
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';

// Pie Chart - 업무 상태 분포
<PieChart>
  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} />
</PieChart>

// Bar Chart - 우선순위 분포
<BarChart data={data}>
  <Bar dataKey="count" fill="#4D7CFF" />
</BarChart>

// Line Chart - 월별 트렌드
<LineChart data={data}>
  <Line type="monotone" dataKey="completed" stroke="#EC407A" />
</LineChart>
```

## 🎯 상태 관리

### Zustand Stores
- **auth-store** - 인증 상태 관리
- 최소한의 전역 상태 유지
- 대부분 Server Components 사용

## 🔐 인증 및 권한

### Protected Routes
```typescript
// middleware.ts 또는 layout에서 처리
export default function DashboardLayout({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <>{children}</>;
}
```

## 🧪 테스트
```bash
# Jest + React Testing Library
npm run test

# E2E tests (if configured)
npm run test:e2e
```

## 📦 빌드 및 배포

### 개발 빌드
```bash
npm run build
```

### 정적 내보내기 (선택)
```bash
# next.config.js에서 output: 'export' 설정 필요
npm run build
```

### 환경별 설정
- `.env.local` - 로컬 개발
- `.env.development` - 개발 서버
- `.env.production` - 프로덕션

## 🎨 스타일링 가이드

### TailwindCSS 클래스 사용
```typescript
// 버튼 예시
<button className="px-6 py-2.5 bg-ui-primary text-white rounded-xl hover:bg-blue-600 transition-all shadow-sm font-medium">
  클릭
</button>

// 카드 예시
<div className="bg-white rounded-xl p-6 shadow-card border border-ui-border hover:shadow-card-hover transition-all">
  카드 내용
</div>

// 입력 필드 예시
<input className="w-full px-4 py-2.5 border border-ui-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ui-primary/30 focus:border-ui-primary" />
```

## 🐛 디버깅

### React DevTools
- 컴포넌트 계층 구조 확인
- State 및 Props 검사

### Network Tab
- API 요청/응답 확인
- 에러 메시지 확인

### Console Logs
- 개발 중 `console.log()` 사용
- 프로덕션 빌드 전 제거

## ⚡ 성능 최적화

### Server Components
- 기본적으로 Server Components 사용
- 인터랙션이 필요한 경우만 "use client"

### 이미지 최적화
- Next.js Image 컴포넌트 사용
- 적절한 크기 및 포맷

### Code Splitting
- Dynamic imports 활용
- Lazy loading 적용

## 📝 개발 가이드

### 파일 명명 규칙
- 컴포넌트: PascalCase (e.g., `TaskCard.tsx`)
- 폴더: kebab-case (e.g., `my-tasks/`)
- 유틸리티: camelCase (e.g., `formatDate.ts`)

### 코드 스타일
- TypeScript strict mode
- ESLint + Prettier
- 200줄 이하 파일 유지

### 컴포넌트 작성 규칙
1. Server Component 우선
2. "use client"는 최소화
3. Props 타입 명시
4. 재사용 가능하게 설계

## 🔄 Git 워크플로우
```bash
# 1. 변경사항 확인
git diff

# 2. 빌드 테스트 (필수!)
npm run build

# 3. 에러 수정 후 커밋
git add .
git commit -m "feat: 새로운 기능"
git push
```

## 📌 참고사항
- Next.js 15 App Router 사용
- Server Components 기본 사용
- 모든 페이지는 TypeScript로 작성
- TailwindCSS utility-first 접근
- Lucide React 아이콘만 사용 (emoji 금지)

## 🤝 기여하기
1. 기능 브랜치 생성
2. 코드 작성 및 테스트
3. 빌드 성공 확인 (`npm run build`)
4. Pull Request 생성

## 🚨 일반적인 문제 해결

### Hydration Error
- Server와 Client의 HTML이 일치하지 않을 때 발생
- `suppressHydrationWarning` 사용 또는 useEffect로 처리

### API 연결 실패
- 환경 변수 확인 (`NEXT_PUBLIC_API_URL`)
- CORS 설정 확인 (백엔드)
- 네트워크 탭에서 요청/응답 확인

---

**최종 업데이트**: 2025-11-13
