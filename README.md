# 업무 일감 관리 시스템 (Task Management System)

개인 업무와 부서 업무를 통합적으로 관리할 수 있는 웹 기반 업무 일감 관리 시스템

![UI Preview](./UI.png)

---

## 📚 문서 구조

### 기획 문서
- **[PRD.md](./PRD.md)** - 제품 요구사항 정의서
  - 프로젝트 개요 및 목표
  - 핵심 기능 요구사항
  - UI/UX 디자인 명세 (UI.png 기반)
  - 시스템 아키텍처
  - 데이터 모델
  - 사용자 시나리오

### 구현 계획
- **[plan.md](./plan.md)** - 상세 기술 구현 계획
  - 기술 스택 및 개발 원칙
  - 프로젝트 구조 (Atomic Design)
  - 데이터베이스 스키마 (Prisma)
  - API 엔드포인트 (40+ 개)
  - 13주 개발 일정
  - 컴포넌트 구현 가이드
  - 개발 워크플로우

- **[IMPLEMENTATION.md](./IMPLEMENTATION.md)** - 즉시 실행 가능한 단계별 가이드
  - Week별 체크리스트
  - 구체적인 명령어 및 코드 예시
  - UI.png 디자인 체크리스트
  - 품질 체크리스트

### 개발 가이드
- **[CLAUDE.md](./CLAUDE.md)** - 개발 가이드라인 및 베스트 프랙티스
  - 설계 원칙 (STRICT)
  - 컴포넌트 아키텍처
  - SSR/Client Components
  - Hydration 에러 방지
  - 개발 워크플로우 (필수)
  - 금지 사항 및 필수 사항

### 디자인
- **[UI.png](./UI.png)** - UI 디자인 참고 이미지

---

## 🎯 프로젝트 개요

### 핵심 기능
- ✅ **개인/부서 업무 관리** - CRUD, 상태 관리, 할당
- ✅ **대시보드** - 통계 카드, 업무 카드 그리드, 업무 테이블
- ✅ **업무 제출 및 승인** - 제출/승인/반려 프로세스
- ✅ **실시간 통계** - 업무 현황 모니터링
- ✅ **검색/필터링** - 기간, 상태, 담당자별 필터
- ✅ **알림 시스템** - 업무 할당, 마감일 알림

### 주요 특징
- 🖥️ **SSR First** - Next.js Server Components 기본 사용
- 🎨 **UI.png 기반** - 디자인 100% 반영
- 📦 **Atomic Design** - atoms → molecules → organisms 패턴
- 🔒 **Type-safe** - TypeScript strict mode
- 📝 **200줄 제한** - 모든 파일 200줄 이하 유지
- 🐫 **kebab-case** - Linux 호환 파일명

---

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router, SSR First)
- **Language**: TypeScript (strict mode)
- **UI Library**: Shadcn/ui + TailwindCSS
- **Icons**: Lucide React
- **State Management**: Zustand (최소화)
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts

### Backend
- **Framework**: NestJS
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **API Documentation**: Swagger

### DevOps
- **Containerization**: Docker + Docker Compose
- **Version Control**: Git
- **Package Manager**: npm

---

## 🚀 빠른 시작

### 전제 조건
- Node.js 18+
- npm
- Docker & Docker Compose (선택)
- PostgreSQL 15

### 1. 프로젝트 초기화

```bash
# 프로젝트 클론 또는 생성
git clone <repository-url>
cd task-management

# 또는 새로 시작
mkdir task-management
cd task-management
```

### 2. Frontend 설정

```bash
# Next.js 프로젝트 생성
npx create-next-app@latest frontend --typescript --tailwind --app --src-dir

cd frontend

# 의존성 설치
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install zustand @tanstack/react-query
npm install react-hook-form zod @hookform/resolvers
npm install recharts react-datepicker

# Shadcn/ui 초기화
npx shadcn-ui@latest init

# 필수 컴포넌트 설치
npx shadcn-ui@latest add button input card dialog dropdown-menu badge avatar
```

### 3. Backend 설정

```bash
cd ..

# NestJS 프로젝트 생성
npm i -g @nestjs/cli
nest new backend --package-manager npm

cd backend

# 의존성 설치
npm install @nestjs/passport @nestjs/jwt passport passport-jwt
npm install @nestjs/config
npm install prisma @prisma/client
npm install class-validator class-transformer
npm install bcrypt
npm install -D @types/bcrypt @types/passport-jwt

# Prisma 초기화
npx prisma init
```

### 4. 환경 변수 설정

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=업무일감 관리
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/task_management
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=3001
```

### 5. 데이터베이스 설정

```bash
cd backend

# Prisma 스키마 작성 (plan.md 참고)
# prisma/schema.prisma 파일 작성

# 마이그레이션
npx prisma migrate dev --name init

# Prisma Client 생성
npx prisma generate

# 시드 데이터 (선택)
npx prisma db seed
```

### 6. 개발 서버 실행

**Backend**:
```bash
cd backend
npm run start:dev
# http://localhost:3001
```

**Frontend** (새 터미널):
```bash
cd frontend
npm run dev
# http://localhost:3000
```

### 7. Swagger API 문서 확인

```
http://localhost:3001/api/docs
```

---

## 📂 프로젝트 구조

```
task-management/
├── frontend/                     # Next.js Frontend
│   ├── src/
│   │   ├── app/                 # App Router 페이지
│   │   │   ├── (auth)/          # 인증 페이지
│   │   │   └── (dashboard)/     # 대시보드 페이지
│   │   ├── components/          # Atomic Design
│   │   │   ├── atoms/           # 기본 컴포넌트
│   │   │   ├── molecules/       # 조합 컴포넌트
│   │   │   ├── organisms/       # 복잡한 컴포넌트
│   │   │   ├── templates/       # 페이지 템플릿
│   │   │   └── ui/              # Shadcn UI
│   │   ├── lib/                 # 유틸리티
│   │   ├── hooks/               # 커스텀 훅
│   │   ├── stores/              # Zustand 스토어
│   │   └── types/               # TypeScript 타입
│   └── package.json
│
├── backend/                     # NestJS Backend
│   ├── src/
│   │   ├── auth/                # 인증 모듈
│   │   ├── users/               # 사용자 모듈
│   │   ├── tasks/               # 업무 모듈
│   │   ├── departments/         # 부서 모듈
│   │   └── prisma/              # Prisma 서비스
│   ├── prisma/
│   │   └── schema.prisma        # DB 스키마
│   └── package.json
│
├── docker-compose.yml           # Docker 설정
├── PRD.md                       # 제품 요구사항
├── plan.md                      # 구현 계획
├── IMPLEMENTATION.md            # 실행 가이드
├── CLAUDE.md                    # 개발 가이드
├── UI.png                       # 디자인 참고
└── README.md                    # 본 문서
```

---

## 📋 개발 단계 (13주)

| Week | 내용 | 체크포인트 |
|------|------|-----------|
| 1 | 프로젝트 초기화 | 환경 설정, Git 초기화 |
| 2 | 데이터베이스 및 인증 | Prisma 스키마, JWT 인증 |
| 3 | 업무/부서 API | CRUD API, 필터링 |
| 4 | Frontend 레이아웃 | Sidebar, Header, 인증 페이지 |
| 5-6 | UI 컴포넌트 라이브러리 | Atoms, Molecules 구현 |
| 7-8 | **대시보드 구현** (핵심) | 통계 카드, 업무 카드, 테이블 |
| 9-10 | 업무 관리 기능 | CRUD, 할당, 검색 |
| 11 | 제출 및 승인 | 제출/승인/반려 |
| 12 | 부서 업무 및 통계 | 부서 페이지, 차트 |
| 13 | 테스트 및 최적화 | 버그 수정, 배포 준비 |

자세한 내용은 [IMPLEMENTATION.md](./IMPLEMENTATION.md) 참고

---

## 🎨 UI 디자인 가이드

### 색상 체계
| 용도 | 색상 | HEX |
|------|------|-----|
| 시작 전 | 빨간색 | #FF4D4D |
| 진행중 | 파란색 | #4D7CFF |
| 완료 | 초록색 | #4CAF50 |
| 진행중 (보조) | 주황색 | #FFA726 |
| 완료 (보조) | 분홍색 | #EC407A |

### 주요 컴포넌트
- **통계 카드** (4개): 총 개수, 진행중, 완료, 예정
- **업무 카드** (3열 그리드): 상태 아이콘 + 제목 + 담당자 + 진행률
- **필터 영역**: 기간 필터, 상태 드롭다운, 검색
- **업무 테이블**: 제목, 담당자, 마감일, 우선순위
- **FAB 버튼**: 오른쪽 하단 고정 일감 추가

자세한 내용은 [PRD.md 섹션 6](./PRD.md#6-uiux-디자인-명세-uipng-기반) 참고

---

## 🔒 개발 원칙 (필수 준수)

### STRICT 원칙
```
✅ SSR First - Server Components 기본
✅ 파일당 200줄 최대
✅ Atomic Design 패턴
✅ kebab-case 파일명 (소문자)
✅ Type-safe (any 타입 금지)
✅ DRY 원칙 철저히
✅ "use client" 최소화
✅ No fallbacks/workarounds
✅ 매 변경 후 빌드 테스트 필수
```

### 개발 워크플로우 (필수)
```bash
# 1. 코드 작성
# 2. 변경사항 검토
git diff

# 3. 빌드 테스트 (필수!)
npm run build

# 4. 에러 수정 (있을 경우)
# 5. 다시 빌드

# 6. 테스트 통과 후 커밋
git add .
git commit -m "feat: 설명"
git push
```

**중요**: 빌드 실패 시 절대 커밋하지 않기!

자세한 내용은 [CLAUDE.md](./CLAUDE.md) 참고

---

## 📝 API 문서

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인
- `GET /api/auth/me` - 현재 사용자

### 업무
- `GET /api/tasks` - 업무 목록 (필터링 지원)
- `POST /api/tasks` - 업무 생성
- `GET /api/tasks/:id` - 업무 상세
- `PUT /api/tasks/:id` - 업무 수정
- `DELETE /api/tasks/:id` - 업무 삭제
- `PATCH /api/tasks/:id/status` - 상태 변경
- `POST /api/tasks/:id/assign` - 업무 할당

### 제출
- `GET /api/submissions` - 제출 목록
- `POST /api/submissions` - 업무 제출
- `PUT /api/submissions/:id/approve` - 승인
- `PUT /api/submissions/:id/reject` - 반려

### 통계
- `GET /api/stats/dashboard` - 대시보드 통계
- `GET /api/stats/tasks` - 업무 통계

자세한 내용은 [plan.md 섹션 5](./plan.md#5-api-엔드포인트) 또는 Swagger 문서 참고

---

## 🧪 테스트

```bash
# Unit Tests
npm test

# E2E Tests
npm run test:e2e

# Coverage
npm run test:cov
```

---

## 📦 빌드 및 배포

### 개발 빌드
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### 프로덕션 빌드 (Docker)
```bash
# Docker Compose로 전체 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 환경별 배포
- **개발**: `npm run dev`
- **스테이징**: Docker Compose
- **프로덕션**: AWS/GCP + GitHub Actions

---

## 🤝 기여 가이드

### 브랜치 전략
- `main` - 프로덕션
- `develop` - 개발
- `feature/*` - 기능 개발
- `hotfix/*` - 긴급 수정

### 커밋 컨벤션
```
feat: 새로운 기능
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 리팩토링
test: 테스트
chore: 빌드/설정
```

### Pull Request
1. 기능 브랜치 생성
2. 코드 작성 및 테스트
3. 빌드 성공 확인
4. PR 생성
5. 코드 리뷰
6. 머지

---

## 📞 문서 참고

| 문서 | 용도 |
|------|------|
| [PRD.md](./PRD.md) | 제품 요구사항 상세 |
| [plan.md](./plan.md) | 기술 구현 상세 |
| [IMPLEMENTATION.md](./IMPLEMENTATION.md) | 단계별 실행 가이드 |
| [CLAUDE.md](./CLAUDE.md) | 개발 가이드라인 |
| [UI.png](./UI.png) | 디자인 참고 |

---

## 📄 라이선스

MIT License

---

## 👥 팀

- **기획**: [이름]
- **개발 리드**: [이름]
- **디자인**: [이름]

---

## 📈 진행 상황

- [x] PRD 작성
- [x] 기술 구현 계획 수립
- [x] UI 디자인 명세
- [x] 개발 가이드 작성
- [ ] 프로젝트 초기화
- [ ] Backend API 구현
- [ ] Frontend 컴포넌트 구현
- [ ] 통합 테스트
- [ ] 배포

---

**버전**: 1.0
**최종 업데이트**: 2025-11-13
**상태**: 구현 준비 완료 ✅

---

**이제 개발을 시작할 준비가 되었습니다!** 🚀

[IMPLEMENTATION.md](./IMPLEMENTATION.md)를 참고하여 Week 1부터 시작하세요.
