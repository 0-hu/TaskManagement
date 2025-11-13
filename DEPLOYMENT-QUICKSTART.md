# 🚀 배포 빠른 시작 가이드

5분 안에 배포 완료! ⚡

## 📝 체크리스트

- [ ] GitHub에 코드 push 완료
- [ ] Railway 계정 (GitHub 로그인)
- [ ] Vercel 계정 (GitHub 로그인)

---

## 1️⃣ Backend 배포 (3분)

### Railway로 이동
👉 https://railway.app

### 배포 단계
```
1. "New Project" 클릭
2. "Provision PostgreSQL" 클릭 (데이터베이스 생성)
3. "New Service" 클릭
4. "Deploy from GitHub repo" 선택
5. "TaskManagement" 저장소 선택
6. Root Directory에 "backend" 입력
```

### 환경 변수 설정
Backend Service → Variables 탭:
```
DATABASE_URL = ${{Postgres.DATABASE_URL}}
JWT_SECRET = my-super-secret-key-12345
JWT_EXPIRES_IN = 7d
NODE_ENV = production
FRONTEND_URL = https://??????.vercel.app
```
**(Vercel URL은 나중에 업데이트)**

### Domain 생성
Settings → Generate Domain

**생성된 URL 복사**: `https://??????.up.railway.app` ✅

---

## 2️⃣ Frontend 배포 (2분)

### Vercel로 이동
👉 https://vercel.com

### 배포 단계
```
1. "Add New..." → "Project" 클릭
2. "TaskManagement" 저장소 선택
3. Root Directory에 "frontend" 입력
```

### 환경 변수 설정
Environment Variables:
```
NEXT_PUBLIC_API_URL = https://??????.up.railway.app/api
```
**(Railway에서 복사한 URL + /api)**

### Deploy 클릭! 🎉

---

## 3️⃣ CORS 설정 (30초)

Railway → Backend Service → Variables에 추가:
```
FRONTEND_URL = https://??????.vercel.app
```
**(Vercel에서 생성된 URL)**

재배포 자동 시작됨!

---

## ✅ 완료!

### 접속 URL
- **앱**: https://??????.vercel.app
- **API 문서**: https://??????.up.railway.app/api

### 테스트
1. 회원가입
2. 로그인
3. 업무 생성

---

## 🐛 문제 발생 시

### Backend 500 에러?
Railway → Deployments → Logs 확인

### Frontend API 연결 안됨?
1. NEXT_PUBLIC_API_URL 확인
2. Railway URL이 맞는지 확인
3. /api 붙였는지 확인

---

**더 자세한 내용**: [DEPLOYMENT.md](./DEPLOYMENT.md)
