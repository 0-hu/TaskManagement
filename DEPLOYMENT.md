# 배포 가이드 - Vercel + Railway

이 가이드는 Vercel(Frontend)과 Railway(Backend + Database)를 사용한 무료 배포 방법입니다.

## 📋 배포 순서

1. ✅ Backend 배포 (Railway)
2. ✅ Frontend 배포 (Vercel)
3. ✅ 환경 변수 설정
4. ✅ 테스트 및 확인

---

## 🚂 Step 1: Backend 배포 (Railway)

### 1-1. Railway 계정 생성
1. [Railway](https://railway.app/) 접속
2. GitHub 계정으로 로그인
3. 무료 플랜 선택 ($5 크레딧 제공)

### 1-2. PostgreSQL 데이터베이스 생성
```
1. New Project 클릭
2. "Provision PostgreSQL" 선택
3. 데이터베이스가 생성되면 Connect 탭에서 DATABASE_URL 복사
```

**중요**: DATABASE_URL은 나중에 사용하므로 메모해두세요!
형식: `postgresql://user:password@host:5432/railway`

### 1-3. Backend 서비스 배포
```
1. 같은 프로젝트에서 "New Service" 클릭
2. "Deploy from GitHub repo" 선택
3. TaskManagement 저장소 선택
4. Root Directory: backend 입력
5. Deploy 클릭
```

### 1-4. Backend 환경 변수 설정
Railway 프로젝트 → Backend Service → Variables 탭:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-production-key-change-this
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
```

**중요**:
- `DATABASE_URL`은 Railway가 자동으로 PostgreSQL과 연결해줍니다
- `JWT_SECRET`은 반드시 강력한 랜덤 문자열로 변경하세요

### 1-5. Backend URL 확인
```
Settings → Domains → Generate Domain
생성된 URL: https://your-backend.up.railway.app
```

이 URL을 복사해두세요! (Frontend에서 사용)

---

## ▲ Step 2: Frontend 배포 (Vercel)

### 2-1. Vercel 계정 생성
1. [Vercel](https://vercel.com/) 접속
2. GitHub 계정으로 로그인

### 2-2. 프로젝트 Import
```
1. "Add New..." → Project 클릭
2. TaskManagement 저장소 선택
3. Configure Project:
   - Framework Preset: Next.js
   - Root Directory: frontend
   - Build Command: npm run build (자동 설정됨)
   - Output Directory: .next (자동 설정됨)
```

### 2-3. Frontend 환경 변수 설정
Environment Variables 섹션에서:

```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
```

**중요**: Railway에서 복사한 Backend URL을 사용하고 끝에 `/api`를 붙이세요!

### 2-4. Deploy 클릭
```
배포 완료 후 생성된 URL: https://your-app.vercel.app
```

---

## 🔗 Step 3: CORS 설정 (Backend)

Frontend가 Backend에 접근할 수 있도록 CORS 설정이 필요합니다.

### Railway에 환경 변수 추가
```env
FRONTEND_URL=https://your-app.vercel.app
```

### Backend 코드 확인 (이미 설정되어 있어야 함)
`backend/src/main.ts`:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

---

## ✅ Step 4: 배포 확인

### 4-1. Backend 확인
```bash
# API 문서 확인
https://your-backend.up.railway.app/api

# Health check
curl https://your-backend.up.railway.app/api/health
```

### 4-2. Frontend 확인
```
https://your-app.vercel.app

1. 회원가입 테스트
2. 로그인 테스트
3. 대시보드 접근 확인
4. 업무 생성 테스트
```

### 4-3. 데이터베이스 확인 (Railway)
```
Railway Dashboard → PostgreSQL → Data 탭
- User 테이블에 데이터가 있는지 확인
```

---

## 🎉 배포 완료!

### 배포된 URL
- **Frontend**: https://your-app.vercel.app
- **Backend API**: https://your-backend.up.railway.app/api
- **API 문서**: https://your-backend.up.railway.app/api

---

## 🔄 자동 배포 (CI/CD)

### Git Push로 자동 배포
```bash
# 코드 변경 후
git add .
git commit -m "feat: 새로운 기능"
git push

# Railway와 Vercel이 자동으로 배포!
```

- **Railway**: `main` 브랜치에 push하면 자동 배포
- **Vercel**: 모든 브랜치에 push하면 자동 Preview 생성

---

## 📊 무료 플랜 한도

### Railway (무료 플랜)
- $5 크레딧/월
- PostgreSQL 포함
- 충분히 사용 가능 (소규모 프로젝트)

### Vercel (무료 플랜)
- 무제한 배포
- 100GB 대역폭/월
- 개인 프로젝트에 충분

---

## 🐛 문제 해결

### Backend 500 에러
```bash
# Railway 로그 확인
Railway → Backend Service → Deployments → Logs

# 일반적인 원인:
1. DATABASE_URL 미설정
2. Prisma 마이그레이션 실패
3. JWT_SECRET 미설정
```

### Frontend API 연결 실패
```bash
# 브라우저 개발자 도구 → Network 탭 확인

# 일반적인 원인:
1. NEXT_PUBLIC_API_URL 잘못 설정
2. CORS 설정 누락
3. Backend 서비스 다운
```

### Database 마이그레이션 실패
```bash
# Railway → Backend Service → Settings → Deploy Logs

# 해결 방법:
1. DATABASE_URL이 PostgreSQL을 가리키는지 확인
2. Prisma schema가 PostgreSQL 호환인지 확인
3. 수동 마이그레이션:
   Railway → Backend Service → Settings → Service Variables
```

---

## 🔒 보안 체크리스트

- [ ] JWT_SECRET을 강력한 랜덤 문자열로 변경
- [ ] DATABASE_URL을 절대 공개 저장소에 커밋하지 않기
- [ ] CORS 설정에서 실제 Frontend URL만 허용
- [ ] Prisma Studio를 프로덕션에서 비활성화
- [ ] 환경 변수를 .env.example에만 예시로 저장

---

## 📈 모니터링

### Railway
- Dashboard → Metrics: CPU, Memory, Network 사용량 확인
- Logs: 실시간 로그 모니터링

### Vercel
- Analytics: 페이지 뷰, 성능 확인
- Logs: 빌드 및 런타임 로그

---

## 💰 비용 절감 팁

1. **Railway**: 사용하지 않는 시간에 서비스 일시 중지
2. **이미지 최적화**: Next.js Image 컴포넌트 사용
3. **캐싱 활용**: Vercel의 자동 캐싱 활용
4. **데이터베이스 쿼리 최적화**: N+1 문제 방지

---

## 🚀 다음 단계

- [ ] 커스텀 도메인 연결 (Vercel, Railway 모두 지원)
- [ ] SSL 인증서 자동 설정 (자동으로 됨)
- [ ] 프로덕션 모니터링 도구 추가 (Sentry, LogRocket)
- [ ] 백업 전략 수립 (Railway 자동 백업 활용)

---

**배포 완료! 🎉**

문제가 발생하면 Railway/Vercel의 로그를 먼저 확인하세요.
