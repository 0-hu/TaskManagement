# 🚀 배포 빠른 시작 가이드 (Railway + Vercel)

**5분 안에 완전 배포! ⚡**

## 📝 사전 준비

- [x] GitHub에 코드 push 완료
- [ ] [Railway](https://railway.app) 계정 (GitHub 연동)
- [ ] [Vercel](https://vercel.com) 계정 (GitHub 연동)

---

## 1️⃣ Railway 배포 (FastAPI Backend)

### Step 1: 새 프로젝트 생성

1. **Railway** 접속: https://railway.app
2. **"New Project"** 클릭
3. **"GitHub Repo"** 선택
4. `TaskManagement` 저장소 선택
5. **Deploy** 클릭

### Step 2: Backend 서비스 설정

1. 생성된 서비스 클릭
2. **"Settings"** 탭으로 이동
3. **Root Directory**: `backend` 입력 후 저장
4. **"Variables"** 탭으로 이동

### Step 3: 환경 변수 설정

다음 변수들을 **하나씩** 추가:

```env
# JWT 보안 키 (랜덤 문자열로 변경!)
JWT_SECRET=your-super-secret-production-key-please-change-this
JWT_EXPIRES_IN=7d

# CORS (Vercel 배포 후 업데이트 예정)
FRONTEND_URL=http://localhost:3000
```

**💡 참고**:
- JSON 파일 기반 데이터베이스를 사용하므로 별도 DB 설정 불필요!
- 데이터는 `backend/app/database/data.json` 파일에 저장됩니다

### Step 4: 배포 확인

1. **"Deployments"** 탭 클릭
2. 배포 로그 확인:
   ```
   ✅ Installing Python dependencies
   ✅ Starting FastAPI server
   ```

### Step 5: Domain 생성

1. **"Settings"** → **"Networking"** 탭
2. **"Generate Domain"** 클릭
3. 생성된 URL 복사:
   ```
   https://taskmanagement-production-xxxx.up.railway.app
   ```
4. **📋 이 URL을 메모장에 저장!** (Vercel 설정에 필요)

### Step 6: API 테스트

```bash
# 브라우저 또는 터미널에서 확인
curl https://your-backend-url.up.railway.app/api

# 응답 예상: {"message": "Task Management API is running!", "version": "2.0.0", ...}
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
- [x] API 문서 표시됨 (/api/docs)
- [x] 응답 정상
- [x] JSON 파일 데이터베이스 정상 작동

---

## 🔄 자동 배포

이제 GitHub에 push하면 **자동으로 재배포**됩니다!

```bash
git add .
git commit -m "Update feature"
git push origin main

# Vercel: Frontend 자동 배포
# Railway: Backend 자동 재빌드
```

---

## 🐛 트러블슈팅

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

## 💰 비용

### Vercel (Frontend)
- **무료**: Hobby 플랜
- 무제한 배포
- 자동 SSL 인증서

### Railway (Backend)
- **무료**: $5 크레딧/월
- Backend 실행: ~$2-3/월
- JSON 파일 기반 데이터베이스로 별도 DB 비용 없음
- **크레딧 소진 후**: 자동 중지 (알림 받음)

---

## 📚 더 알아보기

- [DEPLOYMENT.md](./DEPLOYMENT.md) - 상세 배포 가이드
- [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - 배포 전 체크리스트
- [README.md](./README.md) - 프로젝트 전체 문서

---

**배포 성공을 기원합니다! 🎉**

문제가 있다면 로그를 확인하고, GitHub Issues에 질문해주세요!
