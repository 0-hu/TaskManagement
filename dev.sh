#!/usr/bin/env bash
set -euo pipefail

BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_URL="${BACKEND_URL:-http://127.0.0.1:${BACKEND_PORT}}"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_PID_FILE="${ROOT_DIR}/.backend.pid"
FRONTEND_PID_FILE="${ROOT_DIR}/.frontend.pid"

start_backend() {
  if [ -f "${BACKEND_PID_FILE}" ] && kill -0 "$(cat "${BACKEND_PID_FILE}")" 2>/dev/null; then
    echo "Backend already running (pid $(cat "${BACKEND_PID_FILE}"))."
    return
  fi

  echo "Starting backend on ${BACKEND_PORT}..."
  (
    cd "${ROOT_DIR}/backend"
    exec uvicorn main:app --host 0.0.0.0 --port "${BACKEND_PORT}"
  ) >/dev/null 2>&1 &
  echo $! >"${BACKEND_PID_FILE}"
}

start_frontend() {
  if [ -f "${FRONTEND_PID_FILE}" ] && kill -0 "$(cat "${FRONTEND_PID_FILE}")" 2>/dev/null; then
    echo "Frontend already running (pid $(cat "${FRONTEND_PID_FILE}"))."
    return
  fi

  echo "Starting frontend on ${FRONTEND_PORT} (BACKEND_URL=${BACKEND_URL})..."
  (
    cd "${ROOT_DIR}/frontend"
    BACKEND_URL="${BACKEND_URL}" PORT="${FRONTEND_PORT}" exec npm run dev
  ) >/dev/null 2>&1 &
  echo $! >"${FRONTEND_PID_FILE}"
}

stop_process() {
  local pid_file="$1"
  local label="$2"
  if [ -f "${pid_file}" ]; then
    local pid
    pid="$(cat "${pid_file}")"
    if kill -0 "${pid}" 2>/dev/null; then
      echo "Stopping ${label} (${pid})..."
      kill "${pid}" 2>/dev/null || true
    fi
    rm -f "${pid_file}"
  else
    echo "${label} not running."
  fi
}

case "${1:-}" in
  start)
    start_backend
    start_frontend
    ;;
  stop)
    stop_process "${FRONTEND_PID_FILE}" "frontend"
    stop_process "${BACKEND_PID_FILE}" "backend"
    ;;
  *)
    echo "Usage: $0 {start|stop}"
    exit 1
    ;;
esac
