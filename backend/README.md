# Backend - FastAPI Server

업무 관리 시스템의 FastAPI 기반 REST API 서버입니다.

## 🏗️ 기술 스택
- **Framework**: FastAPI
- **Language**: Python 3.8+
- **Database**: JSON File-based Storage
- **Authentication**: JWT (python-jose)
- **Validation**: Pydantic
- **API Documentation**: OpenAPI (Swagger)

## 📂 프로젝트 구조
```
backend/
├── app/
│   ├── database/
│   │   ├── json_db.py          # JSON file database implementation
│   │   └── data.json           # Data storage (auto-created)
│   ├── models/
│   │   ├── user.py             # User models
│   │   ├── task.py             # Task models
│   │   ├── department.py       # Department models
│   │   └── submission.py       # Submission models
│   ├── routes/
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── tasks.py            # Task CRUD endpoints
│   │   ├── departments.py      # Department endpoints
│   │   ├── submissions.py      # Submission endpoints
│   │   └── stats.py            # Statistics endpoints
│   └── utils/
│       └── security.py         # JWT & password utilities
├── main.py                     # Application entry point
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── railway.json                # Railway deployment config
```

## 🚀 시작하기

### 1. Python 가상환경 생성
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2. 의존성 설치
```bash
pip install -r requirements.txt
```

### 3. 환경 변수 설정 (선택)
`.env` 파일은 이미 존재하며, 필요시 수정:
```env
JWT_SECRET=dev-secret-key-change-in-production-please
JWT_EXPIRES_IN=7d
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 4. 서버 실행
```bash
# 개발 모드 (자동 리로드)
python main.py

# 또는 uvicorn 직접 실행
uvicorn main:app --reload --port 3001
```

서버: `http://localhost:3001`
API 문서: `http://localhost:3001/api/docs`
ReDoc: `http://localhost:3001/api/redoc`

## 📝 주요 모듈

### Auth Routes (`/api/auth`)
JWT 기반 인증 시스템

**Endpoints**:
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인
- `GET /auth/me` - 현재 사용자 정보 (인증 필요)

**Request Example**:
```json
// POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "role": "USER"
}

// Response
{
  "access_token": "eyJhbGciOiJ...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "USER"
  }
}
```

### Tasks Routes (`/api/tasks`)
업무 관리 핵심 모듈

**Endpoints**:
- `GET /tasks` - 업무 목록 (필터링, 페이지네이션)
  - Query params: `status`, `priority`, `type`, `departmentId`, `assignedUserId`, `search`, `page`, `limit`
- `GET /tasks/my-tasks` - 내 업무 목록
- `POST /tasks` - 업무 생성
- `GET /tasks/{task_id}` - 업무 상세
- `PATCH /tasks/{task_id}` - 업무 수정
- `DELETE /tasks/{task_id}` - 업무 삭제
- `PATCH /tasks/{task_id}/assign` - 사용자 할당

**Filters**:
- `status`: TODO, IN_PROGRESS, COMPLETED, ON_HOLD
- `priority`: LOW, MEDIUM, HIGH, URGENT
- `type`: PERSONAL, DEPARTMENT

### Departments Routes (`/api/departments`)
부서 및 팀 관리

**Endpoints**:
- `GET /departments` - 부서 목록
- `POST /departments` - 부서 생성
- `GET /departments/{dept_id}` - 부서 상세
- `PATCH /departments/{dept_id}` - 부서 수정
- `DELETE /departments/{dept_id}` - 부서 삭제
- `POST /departments/{dept_id}/members` - 멤버 추가
- `DELETE /departments/{dept_id}/members/{user_id}` - 멤버 제거
- `GET /departments/{dept_id}/members` - 멤버 목록

### Submissions Routes (`/api/submissions`)
업무 제출 및 승인 워크플로우

**Endpoints**:
- `GET /submissions` - 제출 목록 (필터링)
- `GET /submissions/my-submissions` - 내 제출 목록
- `POST /submissions` - 업무 제출
- `GET /submissions/{submission_id}` - 제출 상세
- `PATCH /submissions/{submission_id}/approve` - 승인
- `PATCH /submissions/{submission_id}/reject` - 반려
- `DELETE /submissions/{submission_id}` - 제출 삭제

### Stats Routes (`/api/stats`)
통계 및 분석 데이터

**Endpoints**:
- `GET /stats/dashboard` - 대시보드 통계
- `GET /stats/tasks` - 업무 통계
- `GET /stats/departments/{dept_id}` - 부서 통계
- `GET /stats/users/{user_id}` - 사용자 통계

## 🗄️ 데이터베이스

### JSON File-based Database
`app/database/json_db.py`에서 구현된 간단하고 가벼운 파일 기반 데이터베이스:

**특징**:
- Thread-safe 파일 I/O
- 자동 타임스탬프 (createdAt, updatedAt)
- CRUD 연산 지원
- 필터링 및 쿼리 기능

**Collections**:
- `users` - 사용자 계정
- `tasks` - 업무
- `departments` - 부서
- `department_members` - 부서 멤버십
- `task_assignments` - 업무 할당
- `task_submissions` - 업무 제출

**데이터 위치**: `app/database/data.json` (자동 생성)

### 데이터베이스 초기화
서버 시작 시 자동으로 `data.json` 파일이 생성됩니다. 초기화하려면:
```bash
rm app/database/data.json
python main.py  # 새 파일 자동 생성
```

## 🔐 인증 및 보안

### JWT 토큰
- **알고리즘**: HS256
- **만료 시간**: 7일 (기본)
- **토큰 구조**:
```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "exp": 1234567890
}
```

### 비밀번호 암호화
- **라이브러리**: passlib + bcrypt
- **해시 라운드**: 기본 설정

### API 인증
모든 보호된 엔드포인트는 `Authorization` 헤더 필요:
```
Authorization: Bearer <access_token>
```

## 📊 API 문서

FastAPI가 자동으로 생성하는 대화형 문서:

**Swagger UI**: `http://localhost:3001/api/docs`
- 모든 엔드포인트 테스트 가능
- Request/Response 스키마 확인
- "Try it out" 기능

**ReDoc**: `http://localhost:3001/api/redoc`
- 깔끔한 읽기 전용 문서
- 검색 기능
- 코드 샘플

## 🔧 개발 가이드

### 새 라우트 추가
1. `app/routes/`에 새 파일 생성
2. APIRouter 정의
3. `main.py`에 라우터 등록

```python
# app/routes/example.py
from fastapi import APIRouter

router = APIRouter(prefix="/example", tags=["example"])

@router.get("")
async def get_examples():
    return {"message": "Hello"}
```

```python
# main.py
from app.routes import example
app.include_router(example.router, prefix="/api")
```

### 새 모델 추가
Pydantic 모델 사용:
```python
from pydantic import BaseModel

class ExampleCreate(BaseModel):
    name: str
    description: str | None = None
```

### 에러 처리
FastAPI HTTPException 사용:
```python
from fastapi import HTTPException, status

raise HTTPException(
    status_code=status.HTTP_404_NOT_FOUND,
    detail="Item not found"
)
```

## 🚀 배포

### Railway 배포
1. `railway.json` 설정 확인
2. 환경 변수 설정 (JWT_SECRET, FRONTEND_URL)
3. GitHub 연동 및 자동 배포

### 환경 변수
프로덕션 환경에서 반드시 설정:
- `JWT_SECRET`: 강력한 랜덤 문자열
- `JWT_EXPIRES_IN`: 토큰 만료 시간
- `FRONTEND_URL`: CORS 설정용
- `PORT`: Railway가 자동 설정

## 🧪 테스트

```bash
# API 테스트
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'

# 헬스 체크
curl http://localhost:3001/api/health
```

## 📌 참고사항

- **Thread-safe**: JSON 파일 접근은 Lock으로 보호됨
- **CORS**: Frontend URL 설정 필요
- **Auto-reload**: 개발 모드에서 코드 변경 시 자동 재시작
- **Data persistence**: JSON 파일로 데이터 영구 저장
- **Demo용**: 프로덕션에서는 실제 데이터베이스 권장

## 🐛 디버깅

### 로그 확인
```bash
# 서버 로그는 터미널에 출력됨
python main.py
```

### 데이터 확인
```bash
# JSON 파일 직접 확인
cat app/database/data.json | python -m json.tool
```

### 일반적인 문제
1. **포트 충돌**: `PORT` 환경 변수 변경
2. **JWT 오류**: `JWT_SECRET` 설정 확인
3. **CORS 오류**: `FRONTEND_URL` 설정 확인

---

**최종 업데이트**: 2025-11-18
**버전**: 2.0 (FastAPI)
