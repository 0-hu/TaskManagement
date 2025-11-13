# 로컬 개발 환경 설정

## PostgreSQL 설치 및 설정

### Option 1: Docker로 PostgreSQL 실행 (추천)
```bash
# PostgreSQL 컨테이너 실행
docker run --name taskmanagement-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=task_management \
  -p 5432:5432 \
  -d postgres:15

# 확인
docker ps
```

### Option 2: PostgreSQL 직접 설치

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15

# 데이터베이스 생성
createdb task_management
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql

# 데이터베이스 생성
sudo -u postgres createdb task_management
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
```

#### Windows
1. PostgreSQL 공식 사이트에서 설치
2. pgAdmin으로 데이터베이스 생성: `task_management`

---

## Backend 설정

### 1. 의존성 설치
```bash
cd backend
npm install
```

### 2. 환경 변수 확인
`backend/.env` 파일이 이미 있습니다:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management"
JWT_SECRET=dev-secret-key-change-in-production-please
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. 데이터베이스 마이그레이션
```bash
# Prisma Client 생성
npx prisma generate

# 마이그레이션 실행
npx prisma migrate dev --name init

# (선택) Prisma Studio로 데이터 확인
npx prisma studio
```

### 4. 개발 서버 실행
```bash
npm run start:dev
```

서버: http://localhost:3001
API 문서: http://localhost:3001/api

---

## Frontend 설정

### 1. 의존성 설치
```bash
cd frontend
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 3. 개발 서버 실행
```bash
npm run dev
```

프론트엔드: http://localhost:3000

---

## 통합 개발 스크립트 (추천)

프로젝트 루트에서 한 번에 실행:
```bash
./dev.sh start
```

명령어:
- `./dev.sh start` - Backend + Frontend 모두 시작
- `./dev.sh stop` - 모두 중지
- `./dev.sh restart` - 재시작
- `./dev.sh status` - 상태 확인
- `./dev.sh logs all` - 로그 확인

---

## 문제 해결

### PostgreSQL 연결 실패
```bash
# PostgreSQL이 실행 중인지 확인
# macOS
brew services list

# Linux
sudo systemctl status postgresql

# Docker
docker ps
```

### Prisma 마이그레이션 실패
```bash
# 데이터베이스 리셋
npx prisma migrate reset

# 새로 마이그레이션
npx prisma migrate dev
```

### 포트 충돌
```bash
# 포트 사용 확인
# Backend (3001)
lsof -i :3001

# Frontend (3000)
lsof -i :3000

# 프로세스 종료
kill -9 <PID>
```

---

**이제 개발을 시작하세요!** 🚀
