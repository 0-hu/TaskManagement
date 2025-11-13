#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo ""
echo "======================================"
echo "   Task Management Setup Script"
echo "======================================"
echo ""

# 1. 의존성 설치 확인
print_info "Checking dependencies..."

if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "Node.js and npm are installed"
echo ""

# 2. Backend 설정
print_info "Setting up backend..."
cd backend

if [ ! -d "node_modules" ]; then
    print_info "Installing backend dependencies..."
    npm install
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi

echo ""
print_info "Initializing Prisma..."

# Prisma Client 생성
npx prisma generate
if [ $? -ne 0 ]; then
    print_error "Failed to generate Prisma Client"
    exit 1
fi
print_success "Prisma Client generated"

# 데이터베이스 초기화
if [ ! -f "prisma/dev.db" ]; then
    print_info "Creating database..."
    npx prisma migrate dev --name init
    if [ $? -ne 0 ]; then
        print_warning "Migration failed. Trying db push..."
        npx prisma db push
    fi
    print_success "Database created"
else
    print_success "Database already exists"
fi

cd ..
echo ""

# 3. Frontend 설정
print_info "Setting up frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    print_info "Installing frontend dependencies..."
    npm install
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi

# .env.local 확인
if [ ! -f ".env.local" ]; then
    print_info "Creating .env.local..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001/api" > .env.local
    print_success ".env.local created"
else
    print_success ".env.local already exists"
fi

cd ..
echo ""

# 4. 완료
echo ""
echo "======================================"
print_success "Setup completed successfully!"
echo "======================================"
echo ""
echo "To start the application:"
echo "  ${GREEN}./dev.sh start${NC}"
echo ""
echo "URLs:"
echo "  Backend:  http://localhost:3001"
echo "  API Docs: http://localhost:3001/api"
echo "  Frontend: http://localhost:3000"
echo ""
