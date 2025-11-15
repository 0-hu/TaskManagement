# 🚀 배포 빠른 시작 가이드 (Railway + Vercel)

**5분 안에 DB 포함 완전 배포! ⚡**

## 📝 사전 준비

- [x] GitHub에 코드 push 완료
- [ ] [Railway](https://railway.app) 계정 (GitHub 연동)
- [ ] [Vercel](https://vercel.com) 계정 (GitHub 연동)

---

## 1️⃣ Railway 배포 (Backend + Database)

### Step 1: 새 프로젝트 생성

1. **Railway** 접속: https://railway.app
2. **"New Project"** 클릭
3. **"Provision PostgreSQL"** 클릭 ⭐ (중요!)
   - PostgreSQL 데이터베이스가 자동 생성됨
   - `DATABASE_URL` 환경 변수가 자동으로 설정됨

### Step 2: Backend 서비스 추가

1. 같은 프로젝트에서 **"+ New"** 클릭
2. **"GitHub Repo"** 선택
3. `TaskManagement` 저장소 선택
4. **Deploy** 클릭

### Step 3: Backend 설정

1. 생성된 서비스 클릭
2. **"Settings"** 탭으로 이동
3. **Root Directory**: `backend` 입력 후 저장
4. **"Variables"** 탭으로 이동

### Step 4: 환경 변수 설정

다음 변수들을 **하나씩** 추가:

```env
# 데이터베이스 (자동 연결!) ⭐
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT 보안 키 (랜덤 문자열로 변경!)
JWT_SECRET=your-super-secret-production-key-please-change-this
JWT_EXPIRES_IN=7d

# 서버 설정
NODE_ENV=production

# CORS (Vercel 배포 후 업데이트 예정)
FRONTEND_URL=http://localhost:3000
```

**💡 중요**:
- `DATABASE_URL=${{Postgres.DATABASE_URL}}` 는 Railway가 자동으로 PostgreSQL URL로 변환합니다!
- `${{ }}` 형식을 정확히 입력하세요!

### Step 5: 배포 확인

1. **"Deployments"** 탭 클릭
2. 배포 로그 확인:
   ```
   ✅ Copying production schema
   ✅ Installing dependencies
   ✅ Generating Prisma Client
   ✅ Building application
   ✅ Running migrations
   ✅ Starting server
   ```

### Step 6: Domain 생성

1. **"Settings"** → **"Networking"** 탭
2. **"Generate Domain"** 클릭
3. 생성된 URL 복사:
   ```
   https://taskmanagement-production-xxxx.up.railway.app
   ```
4. **📋 이 URL을 메모장에 저장!** (Vercel 설정에 필요)

### Step 7: API 테스트

```bash
# 브라우저 또는 터미널에서 확인
curl https://your-backend-url.up.railway.app/api

# 응답 예상: "Task Management API is running!"
```

---

## 2️⃣ Vercel 배포 (Frontend)

### Step 1: 새 프로젝트 생성

1. **Vercel** 접속: https://vercel.com
2. **"Add New..."** → **"Project"** 클릭
3. `TaskManagement` 저장소 선택
4. **"Import"** 클릭

### Step 2: 프로젝트 설정

1. **Framework Preset**: Next.js (자동 감지됨)
2. **Root Directory**: `frontend` 입력
3. **Build Command**: 그대로 두기
4. **Environment Variables** 섹션으로 스크롤

### Step 3: 환경 변수 설정

**Name**과 **Value** 입력:

```env
Name: NEXT_PUBLIC_API_URL
Value: https://your-backend-url.up.railway.app/api
```

**⚠️ 주의**: Railway URL 끝에 `/api` 꼭 추가!

### Step 4: 배포 시작

1. **"Deploy"** 클릭
2. 빌드 완료 대기 (2-3분)
3. **"Visit"** 클릭하여 사이트 확인

### Step 5: Vercel URL 복사

배포 완료 후:
```
https://taskmanagement-xxxx.vercel.app
```

**📋 이 URL을 메모장에 저장!** (Railway CORS 설정에 필요)

---

## 3️⃣ CORS 설정 완료 (30초)

### Railway로 돌아가기

1. Railway 프로젝트 → Backend 서비스
2. **"Variables"** 탭
3. `FRONTEND_URL` 변수 수정:

```env
FRONTEND_URL=https://taskmanagement-xxxx.vercel.app
```

4. **저장** → 자동 재배포 시작!

---

## ✅ 배포 완료!

### 🎉 확인 사항

**Frontend (Vercel)**
```
https://taskmanagement-xxxx.vercel.app
```
- [x] 페이지가 로드됨
- [x] 회원가입 가능
- [x] 로그인 가능

**Backend (Railway)**
```
https://your-backend.up.railway.app/api
```
- [x] API 문서 표시됨
- [x] 응답 정상

**Database (Railway)**
- [x] PostgreSQL 서비스 실행 중
- [x] Tables 생성됨 (Data 탭에서 확인)

---

## 🔄 자동 배포

이제 GitHub에 push하면 **자동으로 재배포**됩니다!

```bash
git add .
git commit -m "Update feature"
git push origin main

# Vercel: Frontend 자동 배포
# Railway: Backend 자동 재빌드 + 마이그레이션
```

---

## 🐛 트러블슈팅

### ❌ "Migration failed" 오류

**증상**: Railway 배포 실패, 로그에 "Migration failed"

**원인**: `DATABASE_URL` 설정 오류

**해결**:
```env
# 잘못된 예시 (실제 URL 직접 입력)
DATABASE_URL=postgresql://postgres:...

# 올바른 예시 (Railway 변수 참조) ✅
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### ❌ CORS 오류 (Network Error)

**증상**: Frontend에서 "Network Error" 또는 CORS 오류

**원인**: Railway `FRONTEND_URL` 미설정 또는 잘못됨

**해결**:
```env
# Railway Variables에서 확인
FRONTEND_URL=https://taskmanagement-xxxx.vercel.app

# http:// 아님, https:// 임!
# 끝에 / 없음!
```

### ❌ "Prisma Client not initialized"

**증상**: API 호출 시 500 오류

**원인**: Prisma Client 생성 실패

**해결**:
1. Railway → Deployments → Logs 확인
2. `npx prisma generate` 성공했는지 확인
3. 실패 시 `railway.json` 확인:
   ```json
   "buildCommand": "cp prisma/schema.production.prisma prisma/schema.prisma && npm install && npx prisma generate && npm run build"
   ```

### ❌ Frontend에서 API 연결 안됨

**증상**: 로그인/회원가입 안됨

**원인**: `NEXT_PUBLIC_API_URL` 잘못됨

**해결**:
1. Vercel → Project → Settings → Environment Variables
2. `NEXT_PUBLIC_API_URL` 확인:
   ```
   https://your-backend.up.railway.app/api
   ```
3. `/api` 경로 포함 확인!
4. 수정 후 **Redeploy** 필요

---

## 📊 Railway Database 확인

### PostgreSQL 데이터 보기

1. Railway → PostgreSQL 서비스 클릭
2. **"Data"** 탭
3. Tables 확인:
   - ✅ User
   - ✅ Task
   - ✅ Department
   - ✅ TaskAssignment
   - ✅ TaskSubmission

### 데이터베이스 연결 정보

**"Connect"** 탭에서:
- Host, Port, Database, Username, Password 확인 가능
- 외부 DB 클라이언트로 접속 가능 (TablePlus, DBeaver 등)

---

## 💰 비용

### Vercel (Frontend)
- **무료**: Hobby 플랜
- 무제한 배포
- 자동 SSL 인증서

### Railway (Backend + Database)
- **무료**: $5 크레딧/월
- PostgreSQL: 500MB (무료)
- Backend 실행: ~$3-5/월
- **크레딧 소진 후**: 자동 중지 (알림 받음)

---

## 📚 더 알아보기

- [DEPLOYMENT.md](./DEPLOYMENT.md) - 상세 배포 가이드
- [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - 배포 전 체크리스트
- [README.md](./README.md) - 프로젝트 전체 문서

---

**배포 성공을 기원합니다! 🎉**

문제가 있다면 로그를 확인하고, GitHub Issues에 질문해주세요!
