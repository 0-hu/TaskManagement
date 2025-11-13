#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 프로젝트 디렉토리
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOGS_DIR="$PROJECT_DIR/logs"

# PID 파일
BACKEND_PID="$PROJECT_DIR/.backend.pid"
FRONTEND_PID="$PROJECT_DIR/.frontend.pid"

# 로그 파일
BACKEND_LOG="$LOGS_DIR/backend.log"
FRONTEND_LOG="$LOGS_DIR/frontend.log"

# 로그 디렉토리 생성
mkdir -p "$LOGS_DIR"

# 헬퍼 함수
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Backend 시작
start_backend() {
    if [ -f "$BACKEND_PID" ]; then
        PID=$(cat "$BACKEND_PID")
        if ps -p "$PID" > /dev/null 2>&1; then
            print_warning "Backend is already running (PID: $PID)"
            return 1
        fi
    fi

    print_info "Starting backend..."
    cd "$BACKEND_DIR"

    # Backend 시작 (백그라운드)
    nohup npm run start:dev > "$BACKEND_LOG" 2>&1 &
    BACKEND_PROCESS=$!
    echo "$BACKEND_PROCESS" > "$BACKEND_PID"

    print_success "Backend started (PID: $BACKEND_PROCESS)"
    print_info "Backend logs: $BACKEND_LOG"
}

# Frontend 시작
start_frontend() {
    if [ -f "$FRONTEND_PID" ]; then
        PID=$(cat "$FRONTEND_PID")
        if ps -p "$PID" > /dev/null 2>&1; then
            print_warning "Frontend is already running (PID: $PID)"
            return 1
        fi
    fi

    print_info "Starting frontend..."
    cd "$FRONTEND_DIR"

    # Frontend 시작 (백그라운드)
    nohup npm run dev > "$FRONTEND_LOG" 2>&1 &
    FRONTEND_PROCESS=$!
    echo "$FRONTEND_PROCESS" > "$FRONTEND_PID"

    print_success "Frontend started (PID: $FRONTEND_PROCESS)"
    print_info "Frontend logs: $FRONTEND_LOG"
}

# Backend 중지
stop_backend() {
    if [ ! -f "$BACKEND_PID" ]; then
        print_warning "Backend PID file not found"
        return 1
    fi

    PID=$(cat "$BACKEND_PID")
    if ! ps -p "$PID" > /dev/null 2>&1; then
        print_warning "Backend process not running"
        rm -f "$BACKEND_PID"
        return 1
    fi

    print_info "Stopping backend (PID: $PID)..."
    kill "$PID" 2>/dev/null

    # 프로세스가 종료될 때까지 대기 (최대 10초)
    for i in {1..10}; do
        if ! ps -p "$PID" > /dev/null 2>&1; then
            rm -f "$BACKEND_PID"
            print_success "Backend stopped"
            return 0
        fi
        sleep 1
    done

    # 강제 종료
    print_warning "Force killing backend..."
    kill -9 "$PID" 2>/dev/null
    rm -f "$BACKEND_PID"
    print_success "Backend stopped (forced)"
}

# Frontend 중지
stop_frontend() {
    if [ ! -f "$FRONTEND_PID" ]; then
        print_warning "Frontend PID file not found"
        return 1
    fi

    PID=$(cat "$FRONTEND_PID")
    if ! ps -p "$PID" > /dev/null 2>&1; then
        print_warning "Frontend process not running"
        rm -f "$FRONTEND_PID"
        return 1
    fi

    print_info "Stopping frontend (PID: $PID)..."
    kill "$PID" 2>/dev/null

    # 프로세스가 종료될 때까지 대기 (최대 10초)
    for i in {1..10}; do
        if ! ps -p "$PID" > /dev/null 2>&1; then
            rm -f "$FRONTEND_PID"
            print_success "Frontend stopped"
            return 0
        fi
        sleep 1
    done

    # 강제 종료
    print_warning "Force killing frontend..."
    kill -9 "$PID" 2>/dev/null
    rm -f "$FRONTEND_PID"
    print_success "Frontend stopped (forced)"
}

# 상태 확인
status() {
    echo ""
    echo "=== Service Status ==="
    echo ""

    # Backend 상태
    if [ -f "$BACKEND_PID" ]; then
        PID=$(cat "$BACKEND_PID")
        if ps -p "$PID" > /dev/null 2>&1; then
            print_success "Backend: Running (PID: $PID)"
            echo "           Port: 3001"
            echo "           Logs: $BACKEND_LOG"
        else
            print_error "Backend: Stopped (stale PID file)"
        fi
    else
        print_error "Backend: Stopped"
    fi

    echo ""

    # Frontend 상태
    if [ -f "$FRONTEND_PID" ]; then
        PID=$(cat "$FRONTEND_PID")
        if ps -p "$PID" > /dev/null 2>&1; then
            print_success "Frontend: Running (PID: $PID)"
            echo "            Port: 3000"
            echo "            Logs: $FRONTEND_LOG"
        else
            print_error "Frontend: Stopped (stale PID file)"
        fi
    else
        print_error "Frontend: Stopped"
    fi

    echo ""
}

# 로그 보기
logs() {
    SERVICE=$1
    LINES=${2:-50}

    case $SERVICE in
        backend|be)
            print_info "Backend logs (last $LINES lines):"
            echo "---"
            tail -n "$LINES" "$BACKEND_LOG"
            ;;
        frontend|fe)
            print_info "Frontend logs (last $LINES lines):"
            echo "---"
            tail -n "$LINES" "$FRONTEND_LOG"
            ;;
        all)
            print_info "Backend logs (last $LINES lines):"
            echo "---"
            tail -n "$LINES" "$BACKEND_LOG"
            echo ""
            print_info "Frontend logs (last $LINES lines):"
            echo "---"
            tail -n "$LINES" "$FRONTEND_LOG"
            ;;
        *)
            print_error "Invalid service: $SERVICE"
            echo "Usage: $0 logs [backend|frontend|all] [lines]"
            exit 1
            ;;
    esac
}

# 메인 명령어 처리
case "$1" in
    start)
        echo ""
        print_info "Starting services..."
        echo ""
        start_backend
        sleep 2
        start_frontend
        echo ""
        print_success "All services started!"
        echo ""
        print_info "Backend:  http://localhost:3001"
        print_info "Frontend: http://localhost:3000"
        echo ""
        ;;

    stop)
        echo ""
        print_info "Stopping services..."
        echo ""
        stop_frontend
        stop_backend
        echo ""
        print_success "All services stopped!"
        echo ""
        ;;

    restart)
        echo ""
        print_info "Restarting services..."
        echo ""
        stop_frontend
        stop_backend
        sleep 2
        start_backend
        sleep 2
        start_frontend
        echo ""
        print_success "All services restarted!"
        echo ""
        print_info "Backend:  http://localhost:3001"
        print_info "Frontend: http://localhost:3000"
        echo ""
        ;;

    status)
        status
        ;;

    logs)
        logs "${2:-all}" "${3:-50}"
        ;;

    *)
        echo ""
        echo "Usage: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Commands:"
        echo "  start     - Start backend and frontend"
        echo "  stop      - Stop backend and frontend"
        echo "  restart   - Restart backend and frontend"
        echo "  status    - Show service status"
        echo "  logs      - Show logs"
        echo ""
        echo "Logs usage:"
        echo "  $0 logs [backend|frontend|all] [lines]"
        echo ""
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 stop"
        echo "  $0 restart"
        echo "  $0 status"
        echo "  $0 logs backend 100"
        echo "  $0 logs all"
        echo ""
        exit 1
        ;;
esac

exit 0
