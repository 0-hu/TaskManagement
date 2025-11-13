# 배포 전 최종 체크리스트

## ✅ 배포 준비 완료 확인

### 1. 로컬 환경 (개발용)
- [x] SQLite 사용 (`backend/prisma/schema.prisma`)
- [x] DATABASE_URL = "file:./dev.db"
- [x] 포트: 3001 (backend), 3000 (frontend)

### 2. 프로덕션 환경 (Railway + Vercel)
- [x] PostgreSQL 사용 (`backend/prisma/schema.production.prisma`)
- [x] Railway 빌드 시 자동으로 schema 전환
- [x] 포트: 자동 (Railway의 PORT 환경변수)
- [x] CORS: 0.0.0.0 바인딩

---

## 🚀 배포 시 설정할 환경 변수

### Railway (Backend)
```env
# 자동 설정됨
DATABASE_URL=${{Postgres.DATABASE_URL}}

# 수동 설정 필요
JWT_SECRET=your-super-secret-production-key-change-this-12345
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**중요**:
- `FRONTEND_URL`은 Vercel 배포 후 업데이트
- `JWT_SECRET`은 강력한 랜덤 문자열로 변경

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
```

**중요**: Railway 배포 후 생성된 URL 입력

---

## 📋 배포 순서

### 1️⃣ Backend 먼저 (Railway)
1. PostgreSQL 프로비저닝
2. Backend 배포
3. 환경 변수 설정 (FRONTEND_URL은 임시로 아무거나)
4. Domain 생성
5. **생성된 URL 복사** ✅

### 2️⃣ Frontend 다음 (Vercel)
1. Frontend 배포
2. 환경 변수 설정 (Railway URL 사용)
3. Deploy
4. **생성된 URL 복사** ✅

### 3️⃣ Backend 환경 변수 업데이트 (Railway)
1. FRONTEND_URL에 Vercel URL 입력
2. 자동 재배포됨

---

## 🔍 배포 후 확인사항

### Backend 확인
```bash
# API 문서 접근
https://your-backend.up.railway.app/api

# Health check
curl https://your-backend.up.railway.app/api/health

# Railway 로그 확인
Railway Dashboard → Deployments → Logs
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

---

## 🐛 배포 실패 시

### Railway 빌드 실패
```bash
# 로그 확인: Deployments → Logs

# 일반적인 원인:
1. DATABASE_URL 미설정 → Variables 확인
2. Prisma schema 에러 → schema.production.prisma 확인
3. 빌드 명령어 에러 → railway.json 확인
```

### Vercel 빌드 실패
```bash
# 로그 확인: Deployments → Build Logs

# 일반적인 원인:
1. NEXT_PUBLIC_API_URL 미설정
2. npm install 실패 → package.json 확인
3. TypeScript 에러 → npm run build로 로컬 테스트
```

### API 연결 실패 (CORS 에러)
```bash
# Railway 환경 변수 확인
FRONTEND_URL=https://your-app.vercel.app

# 또는 여러 도메인 지원:
FRONTEND_URL=https://your-app.vercel.app,https://preview.vercel.app
```

---

## 💡 Pro Tips

1. **Preview 배포 활용**: Vercel은 모든 PR에 자동 Preview 생성
2. **로그 모니터링**: Railway와 Vercel 로그를 실시간으로 확인
3. **환경 변수 보안**: JWT_SECRET은 절대 공개하지 말것
4. **데이터베이스 백업**: Railway Dashboard에서 자동 백업 활용

---

## 📞 문제 발생 시

1. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 확인
2. [DEPLOYMENT.md](./DEPLOYMENT.md) 상세 가이드 참고
3. Railway/Vercel 로그 확인
4. GitHub Issues에 로그와 함께 문의

---

**배포 성공을 기원합니다! 🎉**
