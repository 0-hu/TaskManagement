# 문제 해결 가이드

## 500 Internal Server Error 발생 시

### 증상
- 로그인 후 대시보드에서 "Internal server error" 발생
- API 요청이 500 에러 반환

### 원인
Prisma Client가 초기화되지 않았거나 데이터베이스가 없음

### 해결 방법

#### 방법 1: setup.sh 실행 (가장 빠름)
```bash
./setup.sh
./dev.sh start
```

#### 방법 2: 수동 설정
```bash
cd backend

# 1. Prisma Client 생성
npx prisma generate

# 2. 데이터베이스 초기화
npx prisma migrate dev --name init
# 또는
npx prisma db push

# 3. 백엔드 시작
npm run start:dev
```

#### 방법 3: 완전 초기화
```bash
cd backend

# 모든 것을 clean하고 다시 시작
rm -rf node_modules/.prisma
rm -rf prisma/dev.db
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

---

## dev.sh 스크립트 사용 시 에러

### Backend 시작 실패
```bash
# 로그 확인
./dev.sh logs backend

# 일반적인 원인:
# 1. Prisma Client 미생성 → ./setup.sh 실행
# 2. 포트 3001 사용 중 → lsof -i :3001 확인 후 프로세스 종료
# 3. 데이터베이스 파일 손상 → rm prisma/dev.db 후 재시작
```

### Frontend 시작 실패
```bash
# 로그 확인
./dev.sh logs frontend

# 일반적인 원인:
# 1. 포트 3000 사용 중 → lsof -i :3000 확인 후 프로세스 종료
# 2. node_modules 없음 → cd frontend && npm install
```

---

## Prisma 관련 에러

### "Prisma Client did not initialize"
```bash
cd backend
npx prisma generate
```

### "Database ... does not exist"
```bash
cd backend
npx prisma migrate dev --name init
```

### "P1001: Can't reach database server"
```bash
# SQLite 파일 경로 확인
cat backend/.env | grep DATABASE_URL

# 올바른 설정:
DATABASE_URL="file:./dev.db"
```

---

## 빠른 체크리스트

문제 발생 시 순서대로 확인:

1. **setup.sh 실행했나?**
   ```bash
   ./setup.sh
   ```

2. **Backend가 실행 중인가?**
   ```bash
   ./dev.sh status
   ```

3. **Prisma Client가 생성되었나?**
   ```bash
   ls backend/node_modules/.prisma/client
   ```

4. **데이터베이스 파일이 있나?**
   ```bash
   ls backend/prisma/dev.db
   ```

5. **포트가 사용 가능한가?**
   ```bash
   lsof -i :3001  # Backend
   lsof -i :3000  # Frontend
   ```

---

## 로그 위치

개발 스크립트 사용 시:
- Backend: `logs/backend.log`
- Frontend: `logs/frontend.log`

확인 방법:
```bash
./dev.sh logs backend 100  # 마지막 100줄
tail -f logs/backend.log   # 실시간 로그
```

---

## 완전 초기화 (최후의 수단)

모든 것을 처음부터:
```bash
# 1. 프로세스 종료
./dev.sh stop

# 2. 데이터베이스 및 캐시 삭제
rm -rf backend/node_modules/.prisma
rm -rf backend/prisma/dev.db
rm -rf backend/prisma/migrations

# 3. 재설정
./setup.sh

# 4. 시작
./dev.sh start
```

---

## 도움이 필요하면

1. 로그 확인: `./dev.sh logs all`
2. GitHub Issues에 로그와 함께 문의
3. 환경 정보 포함 (OS, Node.js 버전)
