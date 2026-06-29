#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Khởi động tất cả các dịch vụ...${NC}\n"

# 0. Chạy MongoDB nếu có docker compose trong project
MONGO_PID=""
if [ -f "docker-compose.yml" ] || [ -f "compose.yml" ]; then
    if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
        echo -e "${BLUE}▶ Khởi động MongoDB (Port 27017)...${NC}"
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

# 1. Chạy Backend Node.js (Puzzle Game)
echo -e "${BLUE}▶ Khởi động Node.js Server (Port 5000)...${NC}"
npm run server &
NODE_PID=$!

# 2. Chạy Frontend (Vite/React)
echo -e "${BLUE}▶ Khởi động Vite Frontend (Port 5173)...${NC}"
npm run dev &
VITE_PID=$!

# 3. Chạy Chatbot Backend (Python/FastAPI)
echo -e "${BLUE}▶ Khởi động Chatbot Backend (Port 8000)...${NC}"
cd chatbot
# Thử kích hoạt môi trường ảo (ưu tiên .venv trong chatbot, sau đó mới thử .venv ở ngoài)
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
elif [ -f "../../.venv/bin/activate" ]; then
    source ../../.venv/bin/activate
fi

uvicorn app.main:app --reload --port 8000 &
PYTHON_PID=$!
cd ..

echo -e "\n${YELLOW}✅ Tất cả dịch vụ đã chạy! Nhấn Ctrl+C để dừng tất cả.${NC}"
echo -e "- Frontend: http://localhost:5173"
echo -e "- Puzzle API: http://localhost:5000"
echo -e "- Chatbot API: http://localhost:8000\n"

# Lắng nghe sự kiện Ctrl+C để tự động tắt hết các process chạy ngầm
trap "echo -e '\n${YELLOW}🛑 Đang dừng tất cả các dịch vụ...${NC}'; kill $NODE_PID $VITE_PID $PYTHON_PID $MONGO_PID 2>/dev/null; exit" SIGINT SIGTERM

# Chờ các process hoàn thành (thực tế là chờ cho đến khi user bấm Ctrl+C)
wait $NODE_PID $VITE_PID $PYTHON_PID
