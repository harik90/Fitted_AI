#!/usr/bin/env bash
set -e

# Activate venv if exists
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

echo "===================================================================="
echo "                   STARTING FITTED AI SERVERS                       "
echo "===================================================================="
echo ""

# Cleanup background processes on exit
cleanup() {
    echo ""
    echo "[!] Stopping all servers..."
    kill $(jobs -p) 2>/dev/null || true
    echo "[+] Servers stopped."
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# Start backend
echo "[1/2] Starting Python FastAPI Backend on port 8000..."
python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

sleep 2

# Start frontend
echo "[2/2] Starting Vite Frontend on port 5173..."
cd frontend
npm run dev -- --host 0.0.0.0 &
FRONTEND_PID=$!
cd ..

echo ""
echo "===================================================================="
echo "                   ALL SERVICES ARE RUNNING!                        "
echo "===================================================================="
echo ""
echo "  [+] Web App:     http://localhost:5173"
echo "  [+] API Server:  http://localhost:8000"
echo "  [+] API Docs:    http://localhost:8000/docs"
echo ""
echo "===================================================================="
echo "  Press Ctrl+C to STOP all servers and exit."
echo "===================================================================="

wait
