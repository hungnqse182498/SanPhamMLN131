#!/usr/bin/env bash
set -u

# Script này chỉ dùng để chạy local development.
# Khi deploy Vercel, Vercel dùng `npm run build`, `vercel.json` và `api/index.js`.

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR" || exit 1

NODE_PID=""
VITE_PID=""
PYTHON_PID=""
MONGO_PID=""

cleanup() {
  echo -e "\n${YELLOW}🛑 Đang dừng tất cả các dịch vụ...${NC}"
  for pid in "$NODE_PID" "$VITE_PID" "$PYTHON_PID" "$MONGO_PID"; do
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
    fi
  done
  exit 0
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo -e "${RED}❌ Thiếu lệnh: $1${NC}"
    echo -e "${YELLOW}Hãy cài dependency cần thiết rồi chạy lại.${NC}"
    exit 1
  fi
}

trap cleanup SIGINT SIGTERM

require_command npm
require_command node
require_command uvicorn

if [ ! -d "node_modules" ]; then
  echo -e "${RED}❌ Chưa có node_modules.${NC}"
  echo -e "${YELLOW}Chạy: npm install${NC}"
  exit 1
fi

if [ ! -f ".env" ]; then
  echo -e "${YELLOW}⚠️  Chưa thấy main-repo/.env. Backend sẽ dùng giá trị mặc định nếu có.${NC}"
fi

if [ ! -f "chatbot/.env" ]; then
  echo -e "${YELLOW}⚠️  Chưa thấy chatbot/.env. Chatbot có thể thiếu GEMINI_API_KEY.${NC}"
fi

echo -e "${GREEN}🚀 Khởi động local development...${NC}\n"
echo -e "${YELLOW}ℹ️  Deploy Vercel không dùng run.sh; dùng npm run build + vercel.json + api/index.js.${NC}\n"

# 0. Chạy MongoDB local nếu project có docker-compose hoặc mongod.
if [ -f "docker-compose.yml" ] || [ -f "compose.yml" ]; then
  if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
    echo -e "${BLUE}▶ Khởi động MongoDB bằng Docker Compose (Port 27017)...${NC}"
    docker compose up -d mongodb
  else
    echo -e "${YELLOW}⚠️  Không tìm thấy Docker Compose. Hãy tự chạy MongoDB tại port 27017.${NC}"
  fi
elif command -v mongod >/dev/null 2>&1; then
  if ! nc -z 127.0.0.1 27017 >/dev/null 2>&1; then
    echo -e "${BLUE}▶ Khởi động MongoDB local (Port 27017)...${NC}"
    mkdir -p ./data/db
    mongod --dbpath ./data/db --bind_ip 127.0.0.1 --port 27017 >/tmp/mln131-mongod.log 2>&1 &
    MONGO_PID=$!
  fi
else
  echo -e "${YELLOW}⚠️  MongoDB chưa chạy tại 127.0.0.1:27017. Leaderboard API sẽ lỗi nếu chưa bật MongoDB.${NC}"
fi

# 1. Chạy Backend Node.js (Puzzle Game API + realtime)
echo -e "${BLUE}▶ Khởi động Puzzle API Node.js (Port 5000)...${NC}"
npm run server &
NODE_PID=$!

# 2. Chạy Frontend (Vite/React)
echo -e "${BLUE}▶ Khởi động Vite Frontend (Port 5173)...${NC}"
npm run dev &
VITE_PID=$!

# 3. Chạy Chatbot Backend (Python/FastAPI)
echo -e "${BLUE}▶ Khởi động Chatbot Backend (Port 8000)...${NC}"
cd chatbot || cleanup

# Ưu tiên .venv trong chatbot, sau đó .venv ở main-repo, rồi .venv ở workspace root.
if [ -f ".venv/bin/activate" ]; then
  source .venv/bin/activate
elif [ -f "../.venv/bin/activate" ]; then
  source ../.venv/bin/activate
elif [ -f "../../.venv/bin/activate" ]; then
  source ../../.venv/bin/activate
fi

uvicorn app.main:app --reload --port 8000 &
PYTHON_PID=$!
cd "$ROOT_DIR" || cleanup

echo -e "\n${YELLOW}✅ Tất cả dịch vụ local đã chạy! Nhấn Ctrl+C để dừng tất cả.${NC}"
echo -e "- Frontend: http://localhost:5173"
echo -e "- Puzzle API trực tiếp: http://localhost:5000/api/leaderboard"
echo -e "- Puzzle API qua Vite proxy: http://localhost:5173/api/leaderboard"
echo -e "- Chatbot API: http://localhost:8000\n"

wait "$NODE_PID" "$VITE_PID" "$PYTHON_PID"
