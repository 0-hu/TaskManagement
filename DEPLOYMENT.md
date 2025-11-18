# 배포 가이드 (Vercel + Railway)

이 문서는 프론트엔드를 Vercel에, 백엔드를 Railway에 배포하는 방법을 안내합니다.

## 📋 사전 준비

1. **GitHub 계정** 및 이 저장소를 본인 계정으로 fork
2. **Vercel 계정** (https://vercel.com) - GitHub 연동
3. **Railway 계정** (https://railway.app) - GitHub 연동

---

## 🚂 1단계: Railway에 백엔드 배포

### 1.1 Railway 프로젝트 생성

1. [Railway Dashboard](https://railway.app/dashboard) 접속
2. **New Project** 클릭
3. **Deploy from GitHub repo** 선택
4. 본인이 fork한 `TaskManagement` 저장소 선택

### 1.2 백엔드 서비스 설정

1. Railway가 자동으로 저장소를 감지하면 **Add Service** 클릭
2. Root directory를 `backend`로 설정:
   - Settings → **Root Directory** → `backend` 입력
3. Start Command 확인:
   - Settings → **Start Command**
   - 이미 `railway.json`에 설정되어 있음: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 1.3 공개 도메인 생성

1. Settings → **Networking** 섹션
2. **Generate Domain** 클릭
3. 생성된 도메인 복사 (예: `https://taskmanagement-production.up.railway.app`)

### 1.4 헬스 체크

배포 완료 후 브라우저에서 확인:
```
https://your-app.railway.app/health
```
응답: `{"status": "ok"}`

---

## ▲ 2단계: Vercel에 프론트엔드 배포

### 2.1 Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard) 접속
2. **Add New... → Project** 클릭
3. GitHub에서 fork한 저장소 Import

### 2.2 프로젝트 설정

1. **Framework Preset**: Next.js (자동 감지됨)
2. **Root Directory**: `frontend` 선택
3. **Build Command**: `npm run build` (기본값)
4. **Output Directory**: `.next` (기본값)

### 2.3 환경 변수 설정 ⚠️ 중요!

**Environment Variables** 섹션에서:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | Railway에서 생성한 백엔드 도메인 (예: `https://taskmanagement-production.up.railway.app`) |

**주의**:
- 환경 변수 이름은 반드시 `NEXT_PUBLIC_` 접두사 포함
- 마지막에 `/` 없이 입력

### 2.4 배포 시작

1. **Deploy** 버튼 클릭
2. 빌드 및 배포 진행 (약 2-3분 소요)
3. 배포 완료 후 자동으로 생성된 Vercel 도메인 확인

---

## ✅ 3단계: 배포 확인

### 프론트엔드 확인
1. Vercel 도메인으로 접속 (예: `https://task-management.vercel.app`)
2. 대시보드가 정상적으로 로드되는지 확인
3. 아바타 이미지가 표시되는지 확인

### 백엔드 연동 확인
1. 브라우저 개발자 도구(F12) → Network 탭 열기
2. 페이지 새로고침
3. Railway 백엔드로 API 호출이 정상적으로 이루어지는지 확인

---

## 🔄 재배포 (업데이트 시)

### 자동 배포
GitHub main 브랜치에 push하면 자동으로 재배포됩니다:
- **Vercel**: main 브랜치 push 시 자동 빌드 및 배포
- **Railway**: main 브랜치 push 시 자동 빌드 및 배포

### 수동 배포
1. **Vercel**: Deployments 탭에서 Redeploy 버튼
2. **Railway**: Deployments 탭에서 Deploy 버튼

---

## 🛠️ 트러블슈팅

### CORS 오류 발생 시
백엔드 `main.py`에 CORS 설정이 있는지 확인:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인만 허용 권장
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 환경 변수 반영 안 될 때
1. Vercel Dashboard → 프로젝트 → Settings → Environment Variables
2. 변수 수정 후 **Redeploy** 필요

### Railway 빌드 실패 시
1. Railway Dashboard → Deployments → 실패한 배포 클릭
2. Build Logs 확인
3. `requirements.txt` 파일 확인

### 프론트엔드 빌드 실패 시
1. Vercel Dashboard → Deployments → 실패한 배포 클릭
2. Build Logs 확인
3. 로컬에서 `npm run build` 테스트

---

## 📊 데이터 영속성

**중요**: 현재 백엔드는 JSON 파일 기반이므로:
- Railway 재배포 시 데이터가 **초기화**됩니다
- 프로덕션 환경에서는 데이터베이스 사용을 권장합니다
- Railway에서 PostgreSQL 추가 가능:
  1. Railway 프로젝트에서 **New** 클릭
  2. **Database → PostgreSQL** 선택
  3. 연결 정보를 환경 변수로 백엔드에 전달

---

## 🔐 보안 권장사항

프로덕션 배포 시:

1. **CORS 설정**: 특정 도메인만 허용
   ```python
   allow_origins=["https://your-vercel-domain.vercel.app"]
   ```

2. **환경 변수**: 민감한 정보는 환경 변수로 관리

3. **HTTPS**: Vercel과 Railway는 기본적으로 HTTPS 제공

---

## 📞 문제 발생 시

1. Vercel 로그: https://vercel.com/docs/deployments/troubleshoot
2. Railway 로그: https://docs.railway.app/deploy/deployments
3. GitHub Issues: 이 저장소의 Issues 탭에 문의

---

배포 완료! 🎉
