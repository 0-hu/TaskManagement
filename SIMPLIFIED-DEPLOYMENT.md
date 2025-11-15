# 간편 배포 가이드 (데이터베이스 없이)

## 🎉 주요 변경사항

**더 이상 데이터베이스가 필요하지 않습니다!**

- ✅ Prisma 제거
- ✅ PostgreSQL/SQLite 불필요
- ✅ 메모리 기반 저장소 사용
- ✅ 즉시 실행 가능
- ✅ 배포 설정 간소화

## 🚀 로컬 개발 (한 줄 명령어)

### 1. 첫 실행 (설정)
```bash
./setup.sh
```

### 2. 서버 시작
```bash
./dev.sh start
```

### 3. 서버 중지
```bash
./dev.sh stop
```

### 4. 상태 확인
```bash
./dev.sh status
```

**더 이상 Prisma 명령어가 필요하지 않습니다!**

---

## 📦 Vercel + Railway 배포

### 필수 환경 변수만 설정하면 끝!

#### Railway (Backend)
```env
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

**PostgreSQL 프로비저닝 불필요!**

#### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api
```

### 배포 순서
1. **Railway**: Backend 배포 → URL 복사
2. **Vercel**: Frontend 배포 (Railway URL 입력)
3. **Railway**: FRONTEND_URL 업데이트 (Vercel URL 입력)

완료!

---

## ⚠️ 중요: 데이터 영속성

**메모리 기반 저장소의 특징:**
- 🔄 서버 재시작 시 모든 데이터 삭제
- 💾 데이터가 영구 저장되지 않음
- 🧪 테스트 및 데모 용도로 적합

**프로덕션 환경에서 사용하려면:**
1. PostgreSQL 또는 MySQL 데이터베이스 설정
2. Prisma ORM 재도입
3. 데이터 마이그레이션 설정

---

## 📊 로컬 vs 프로덕션

| 항목 | 로컬 개발 | Vercel + Railway |
|------|----------|------------------|
| **데이터베이스** | 불필요 | 불필요 |
| **환경 변수** | `.env` | Railway/Vercel 설정 |
| **실행 방법** | `./dev.sh start` | 자동 배포 |
| **데이터 유지** | 서버 실행 중만 | 서버 실행 중만 |

---

## 🎯 빠른 테스트

```bash
# 1. 설정
./setup.sh

# 2. 시작
./dev.sh start

# 3. 브라우저에서 접속
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# API Docs: http://localhost:3001/api/docs

# 4. 회원가입 → 로그인 → 업무 생성
# 모든 기능이 DB 없이 동작합니다!
```

---

## 🐛 문제 해결

### 포트가 이미 사용 중인 경우
```bash
./dev.sh stop
./dev.sh start
```

### 로그 확인
```bash
./dev.sh logs backend
./dev.sh logs frontend
./dev.sh logs all
```

### 완전 초기화
```bash
rm -rf backend/node_modules frontend/node_modules
./setup.sh
```

---

## 📚 더 자세한 정보

- [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - 배포 전 체크리스트
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 상세 배포 가이드
- [README.md](./README.md) - 프로젝트 전체 문서

---

**Happy Coding! 🚀**
