# TaskManagement (UI Mock + JSON API)

![UI Preview](./UI.png)

Next.js(App Router) + FastAPI 데모로 UI.png 스타일 대시보드를 JSON 파일 데이터를 통해 보여주는 샘플입니다. DB는 사용하지 않고 `backend/data/*.json`을 입출력합니다.

## 구조
- `frontend/` : Next.js 14, Tailwind 기반 UI(SSR 위주, Atomic Design)
- `backend/` : FastAPI, JSON 파일 I/O
- `docs/` : PRD, 구현 가이드(CLAUDE.md 등)

## 빠른 실행
사전 요구: Node.js(18+), npm, Python 3.10+, venv 가능, 포트 3000/8000 사용 가능.

```bash
# 최초 1회
cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
cd ../frontend && npm install

# 개발 서버 한번에 실행/중지
./dev.sh start   # 백엔드(8000) + 프론트(3000) 동시 실행
./dev.sh stop    # 두 서버 중지
```

### 수동 실행(개별)
- 백엔드: `cd backend && source .venv/bin/activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000`
- 프론트: `cd frontend && BACKEND_URL=http://127.0.0.1:8000 npm run dev`

## 환경 변수
- `BACKEND_URL` : 프론트가 호출할 API 베이스 URL (기본 `http://127.0.0.1:8000`)

## 제공 엔드포인트(FastAPI)
- `GET /health`
- `GET /summary`
- `GET /tasks?category=personal|department|all`
- `POST /tasks` (JSON 파일 append)
- `GET /submissions`

## 주요 화면
- 대시보드: 통계 카드, 필터 바, 업무 카드(개인/부서/전체), 제출 현황 테이블

## 개발 규칙 메모
- CLAUDE.md 준수: 파일 200줄 이하, Atomic Design, raw HTML 대신 공용 컴포넌트 사용, SSR 우선.
