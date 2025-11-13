# Backend - NestJS API Server

업무 관리 시스템의 백엔드 REST API 서버입니다.

## 🏗️ 기술 스택
- **Framework**: NestJS 10
- **Language**: TypeScript (strict mode)
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT + Passport
- **Validation**: class-validator + class-transformer
- **API Documentation**: Swagger/OpenAPI

## 📂 프로젝트 구조
```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── auth/               # Authentication module (JWT)
│   ├── users/              # User management module
│   ├── tasks/              # Task CRUD module
│   ├── departments/        # Department management module
│   ├── submissions/        # Task submission & approval module
│   ├── stats/              # Statistics & analytics module
│   ├── prisma/             # Prisma service
│   └── main.ts             # Application entry point
├── test/                   # E2E tests
└── package.json
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일 생성:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
```

### 3. 데이터베이스 설정
```bash
# Prisma Client 생성
npx prisma generate

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 데이터베이스 초기화 (선택사항)
npx prisma db seed
```

### 4. 개발 서버 실행
```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

서버: `http://localhost:3001`
API 문서: `http://localhost:3001/api`

## 📝 주요 모듈

### Auth Module
JWT 기반 인증 시스템
- 회원가입, 로그인, 로그아웃
- Access Token 발급 및 검증
- Guard를 통한 엔드포인트 보호

**Endpoints**:
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `GET /auth/me` - 현재 사용자 정보

### Users Module
사용자 및 프로필 관리
- 사용자 정보 CRUD
- 프로필 업데이트

**Endpoints**:
- `GET /users` - 사용자 목록
- `GET /users/:id` - 사용자 상세
- `PUT /users/:id` - 사용자 정보 수정

### Tasks Module
업무 관리 핵심 모듈
- 업무 생성, 수정, 삭제
- 상태 및 진행률 업데이트
- 업무 할당 및 필터링

**Endpoints**:
- `GET /tasks` - 업무 목록 (필터링, 페이지네이션)
- `POST /tasks` - 업무 생성
- `GET /tasks/:id` - 업무 상세
- `PUT /tasks/:id` - 업무 수정
- `DELETE /tasks/:id` - 업무 삭제
- `PATCH /tasks/:id/status` - 상태 변경
- `PATCH /tasks/:id/progress` - 진행률 업데이트
- `POST /tasks/:id/assign` - 업무 할당

### Departments Module
부서 및 팀 관리
- 부서 생성 및 관리
- 팀원 추가/제거
- 부서별 역할 관리

**Endpoints**:
- `GET /departments` - 부서 목록
- `POST /departments` - 부서 생성
- `GET /departments/:id` - 부서 상세 (멤버 포함)
- `POST /departments/:id/members` - 팀원 추가
- `DELETE /departments/:id/members/:userId` - 팀원 제거

### Submissions Module
업무 제출 및 승인 워크플로우
- 업무 제출
- 승인/반려 처리
- 피드백 관리

**Endpoints**:
- `GET /submissions` - 제출 목록
- `POST /submissions` - 업무 제출
- `PUT /submissions/:id/approve` - 승인
- `PUT /submissions/:id/reject` - 반려

### Stats Module
통계 및 분석 데이터
- 대시보드 통계
- 업무 상태별/우선순위별/유형별 통계
- 월별 트렌드 데이터

**Endpoints**:
- `GET /stats/dashboard` - 대시보드 통계
- `GET /stats/tasks` - 업무 통계
- `GET /stats/monthly-trend` - 월별 트렌드

## 🗄️ 데이터베이스 스키마

### 주요 모델
- **User** - 사용자 계정
- **Profile** - 사용자 프로필 (1:1)
- **Department** - 부서
- **DepartmentMember** - 부서 멤버십
- **Task** - 업무
- **TaskAssignment** - 업무 할당
- **Submission** - 업무 제출
- **Notification** - 알림

### Prisma 관리 명령어
```bash
# Studio로 데이터베이스 확인
npx prisma studio

# 스키마 동기화
npx prisma db push

# 마이그레이션 생성
npx prisma migrate dev --name <migration_name>

# 프로덕션 마이그레이션
npx prisma migrate deploy
```

## 🔐 인증 및 보안

### JWT 토큰 구조
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Guards
- **JwtAuthGuard** - JWT 토큰 검증 (기본 적용)
- **Public 데코레이터** - 인증 없이 접근 가능한 엔드포인트

### 비밀번호 암호화
- bcrypt를 사용한 해시 처리 (saltRounds: 10)

## 🧪 테스트
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 API 문서
Swagger UI가 자동으로 생성됩니다:
- 개발: `http://localhost:3001/api`
- 모든 엔드포인트 문서화
- Request/Response 스키마
- Try it out 기능

## 🔧 개발 가이드

### 새 모듈 생성
```bash
nest g module <module-name>
nest g controller <module-name>
nest g service <module-name>
```

### DTO 및 Validation
- `class-validator` 사용
- 모든 입력 데이터 검증
- Swagger 데코레이터로 문서화

```typescript
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;
}
```

### 에러 처리
- NestJS 내장 예외 사용
- 일관된 에러 응답 형식

```typescript
throw new NotFoundException('Task not found');
throw new BadRequestException('Invalid input');
throw new UnauthorizedException('Invalid credentials');
```

## 📦 빌드 및 배포
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 실행
npm run start:prod
```

## 🐛 디버깅
```bash
# 디버그 모드로 실행
npm run start:debug
```

VSCode에서 디버깅:
1. F5 또는 Debug 패널 사용
2. Breakpoint 설정
3. 변수 및 호출 스택 확인

## 📝 로깅
- NestJS 내장 Logger 사용
- 환경별로 로그 레벨 조정 가능

```typescript
this.logger.log('Info message');
this.logger.error('Error message');
this.logger.warn('Warning message');
this.logger.debug('Debug message');
```

## 🔄 데이터베이스 마이그레이션 전략
1. 스키마 변경 시 마이그레이션 생성
2. 마이그레이션 파일 검토
3. 개발 환경에서 테스트
4. 프로덕션 적용

## 📌 참고사항
- TypeScript strict mode 사용
- ESLint + Prettier로 코드 포맷팅
- 모든 API는 /api prefix 사용
- CORS 설정으로 프론트엔드와 연결

## 🤝 기여하기
1. 코드 작성 전 이슈 확인
2. 테스트 코드 작성
3. 빌드 및 테스트 통과 확인
4. Pull Request 생성

---

**최종 업데이트**: 2025-11-13
