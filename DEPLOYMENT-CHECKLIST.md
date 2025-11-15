# 배포 전 최종 체크리스트

## ✅ 배포 준비 완료 확인

### 1. 로컬 환경 (개발용)
- [x] SQLite 데이터베이스 사용
- [x] 포트: 3001 (backend), 3000 (frontend)
- [x] Prisma Client 생성됨
- [x] 데이터베이스 마이그레이션 완료

### 2. 프로덕션 환경 (Railway + Vercel)
- [x] PostgreSQL 데이터베이스 프로비저닝 **필수!** ⭐
- [x] Prisma 마이그레이션 자동 실행
- [x] 포트: 자동 (Railway의 PORT 환경변수)
- [x] CORS: 0.0.0.0 바인딩
- [x] 데이터 영속성 보장

---

## 🚀 배포 시 설정할 환경 변수

### Railway (Backend)

**⚠️ 중요: PostgreSQL을 먼저 프로비저닝한 후 Backend 서비스를 추가하세요!**

```env
# 데이터베이스 (자동 연결)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT 설정 (필수!)
JWT_SECRET=your-super-secret-production-key-change-this-12345
JWT_EXPIRES_IN=7d

# 서버 설정
NODE_ENV=production

# CORS (Vercel 배포 후 업데이트)
FRONTEND_URL=https://your-app.vercel.app
```

**중요**:
- `DATABASE_URL=${{Postgres.DATABASE_URL}}` - Railway가 자동으로 PostgreSQL URL로 치환
- `${{ }}` 형식을 정확히 입력!
- `FRONTEND_URL`은 Vercel 배포 후 업데이트
- `JWT_SECRET`은 강력한 랜덤 문자열로 변경

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
```

**중요**: Railway 배포 후 생성된 URL 입력 (끝에 `/api` 필수!)

---

## 📋 배포 순서

### 1️⃣ Railway: PostgreSQL 먼저 추가! ⭐

1. Railway에서 **"New Project"** 클릭
2. **"Provision PostgreSQL"** 클릭
3. PostgreSQL 서비스 생성 확인
4. `DATABASE_URL` 변수가 자동 생성됨

### 2️⃣ Railway: Backend 서비스 추가

1. 같은 프로젝트에서 **"+ New"** → **"GitHub Repo"** 클릭
2. 저장소 선택: `TaskManagement`
3. **Settings** → **Root Directory**: `backend` 입력
4. **Variables** 탭에서 환경 변수 추가 (위 참고)
5. Domain 생성
6. **생성된 URL 복사** ✅

**배포 로그 확인**:
```
✅ Copying production schema (PostgreSQL)
✅ Installing dependencies
✅ Generating Prisma Client
✅ Building application
✅ Running database migrations  ← 중요!
✅ Starting server
```

### 3️⃣ Vercel: Frontend 배포

1. Frontend 배포
2. **Root Directory**: `frontend` 입력
3. 환경 변수 설정 (Railway URL 사용)
4. Deploy
5. **생성된 URL 복사** ✅

### 4️⃣ Railway: CORS 업데이트

1. Railway → Backend 서비스 → **Variables**
2. `FRONTEND_URL`에 Vercel URL 입력
3. 자동 재배포됨

---

## 🔍 배포 후 확인사항

### Backend 확인
```bash
# API 문서 접근
https://your-backend.up.railway.app/api

# Health check
curl https://your-backend.up.railway.app/api

# 응답 예상: "Task Management API is running!"

# Railway 로그 확인
Railway Dashboard → Deployments → Logs
```

### Database 확인
```bash
# Railway PostgreSQL 서비스 클릭
1. "Data" 탭 → Tables 확인
   ✅ User
   ✅ Task
   ✅ Department
   ✅ TaskAssignment
   ✅ TaskSubmission

2. "Metrics" 탭 → 연결 상태 확인
```

### Frontend 확인
```bash
# 앱 접근
https://your-app.vercel.app

# 브라우저 개발자 도구 → Network 탭
# API 요청이 Railway로 가는지 확인
```

### 통합 테스트
1. 회원가입 ✅
2. 로그인 ✅
3. 업무 생성 ✅
4. 대시보드 로드 ✅
5. 페이지 새로고침 → 데이터 유지됨 ✅

---

## 🐛 배포 실패 시

### ❌ Railway: "Migration failed" 오류

**증상**: 배포 로그에 "Migration failed" 또는 "P1001: Can't reach database server"

**원인**:
1. PostgreSQL이 프로비저닝되지 않음
2. `DATABASE_URL` 잘못 설정됨

**해결**:
```bash
# 1. PostgreSQL 서비스 확인
Railway Dashboard → Services → PostgreSQL 존재 확인

# 2. DATABASE_URL 확인
Backend Service → Variables → DATABASE_URL 확인:
✅ 올바름: DATABASE_URL=${{Postgres.DATABASE_URL}}
❌ 잘못됨: DATABASE_URL=postgresql://user:pass@...

# 3. PostgreSQL 서비스가 없다면
프로젝트에서 "+ New" → "Database" → "Add PostgreSQL"
```

### ❌ Railway: "Prisma Client not initialized"

**원인**: Prisma Client 생성 실패 또는 스키마 복사 실패

**해결**:
```bash
# railway.json 확인
"buildCommand": "cp prisma/schema.production.prisma prisma/schema.prisma && npm install && npx prisma generate && npm run build"

# 로그에서 확인:
✅ Copying production schema
✅ npm install
✅ npx prisma generate
```

### ❌ Vercel: 빌드 실패

**원인**:
1. `NEXT_PUBLIC_API_URL` 미설정
2. npm install 실패
3. TypeScript 에러

**해결**:
```bash
# 1. 환경 변수 확인
Vercel → Project → Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api

# 2. 로컬에서 빌드 테스트
cd frontend
npm run build

# 3. 로그 확인
Vercel → Deployments → Build Logs
```

### ❌ CORS 오류 (Network Error)

**증상**: Frontend에서 "Network Error" 또는 "CORS policy" 오류

**원인**: Railway `FRONTEND_URL` 미설정 또는 잘못됨

**해결**:
```env
# Railway Variables 확인
FRONTEND_URL=https://task-management-xxxx.vercel.app

# 주의사항:
❌ http:// (https:// 사용!)
❌ 끝에 / 있음 (없어야 함!)
✅ https://task-management-xxxx.vercel.app
```

---

## 💡 Pro Tips

### 1. 배포 전 로컬 테스트
```bash
# Backend 빌드 테스트
cd backend
npm run build

# Frontend 빌드 테스트
cd frontend
npm run build
```

### 2. Railway 로그 모니터링
```bash
# 실시간 로그 확인
Railway Dashboard → Deployments → Logs (자동 갱신)
```

### 3. Vercel Preview 배포
```bash
# PR 생성 시 자동 Preview 배포
# CORS 설정:
FRONTEND_URL=https://your-app.vercel.app,https://your-app-git-feature.vercel.app
```

### 4. PostgreSQL 백업
```bash
# Railway PostgreSQL → Settings → Backups
자동 백업 활성화 (권장)
```

### 5. 환경 변수 보안
- JWT_SECRET은 절대 공개하지 말 것
- GitHub에 .env 파일 커밋하지 말 것
- Railway/Vercel에서만 환경 변수 설정

---

## 📊 데이터 영속성 확인

**PostgreSQL 사용 시:**
- ✅ 서버 재시작해도 데이터 유지
- ✅ 프로덕션 환경에 적합
- ✅ 자동 백업 가능

**테스트 방법:**
1. 회원가입 및 업무 생성
2. Railway에서 Backend 재시작 (Redeploy)
3. 데이터가 유지되는지 확인

---

## 🎯 체크리스트

배포 전 확인:
- [ ] PostgreSQL 프로비저닝 완료
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}` 설정
- [ ] `JWT_SECRET` 강력한 키로 변경
- [ ] `railway.json` 빌드 명령어 확인
- [ ] 로컬에서 빌드 테스트 완료

배포 후 확인:
- [ ] Backend API 응답 확인
- [ ] PostgreSQL Tables 생성 확인
- [ ] Frontend 정상 로드
- [ ] 회원가입/로그인 성공
- [ ] 데이터 생성 후 재배포 → 데이터 유지 확인

---

## 📞 문제 발생 시

1. [DEPLOYMENT-QUICKSTART.md](./DEPLOYMENT-QUICKSTART.md) - 빠른 배포 가이드
2. [DEPLOYMENT.md](./DEPLOYMENT.md) - 상세 가이드
3. Railway/Vercel 로그 확인
4. PostgreSQL 연결 상태 확인
5. GitHub Issues에 로그와 함께 문의

---

**배포 성공을 기원합니다! 🎉**

**이제 완전한 프로덕션 환경이 준비되었습니다!**
- ✅ PostgreSQL 데이터베이스
- ✅ 자동 마이그레이션
- ✅ 데이터 영속성
- ✅ 자동 재배포
