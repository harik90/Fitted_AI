#!/usr/bin/env bash
set -e

echo "Setting up Fitted AI..."

# Python dependencies
echo "Installing backend dependencies..."
python3 -m pip install -r requirements.txt

# Frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
npm run build
cd ..

if [ ! -f ".env" ]; then
    cp .env.example .env
fi

echo "Setup complete!"
echo "To start all servers with one command:"
echo "  ./start.sh"
