#!/usr/bin/env bash
set -e

echo "===================================================================="
echo "            FITTED AI - ONE-CLICK INSTALLATION (LINUX/MAC)         "
echo "===================================================================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] python3 could not be found. Please install Python 3.10+."
    exit 1
fi
echo "[+] Python version: $(python3 --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] node could not be found. Please install Node.js 18+."
    exit 1
fi
echo "[+] Node version: $(node -v)"
echo "[+] NPM version: $(npm -v)"

# Setup Python Virtual Environment (optional but recommended)
if [ ! -d "venv" ]; then
    echo "[*] Creating Python virtual environment in ./venv..."
    python3 -m venv venv || true
fi

if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

# Install Python requirements
echo "[*] Installing Python backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Install Frontend dependencies and build
echo "[*] Installing Frontend dependencies..."
cd frontend
npm install
echo "[*] Building Frontend production bundle..."
npm run build
cd ..

# Copy .env.example if .env does not exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "[*] Created .env from .env.example"
fi

echo ""
echo "===================================================================="
echo "                   INSTALLATION COMPLETE!                           "
echo "===================================================================="
echo ""
echo "  To run in development mode:"
echo "    ./start.sh"
echo ""
echo "  To run in production mode (single port 8000):"
echo "    python3 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"
echo "===================================================================="
