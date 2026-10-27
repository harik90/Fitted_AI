@echo off
title Fitted AI - Master Launcher
color 0B
cls

echo ====================================================================
echo             FITTED AI - LOCAL APP LAUNCHER
echo ====================================================================
echo.

:: 1. Launch Backend
echo [1/2] Starting Python FastAPI Backend on Port 8000...
start "Fitted AI - Backend [Port 8000]" cmd /k "title Fitted AI - Backend && color 09 && python -m uvicorn backend.main:app --port 8000 --reload"

echo     Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

:: 2. Launch Frontend
echo.
echo [2/2] Starting Vite Frontend on Port 5173...
start "Fitted AI - Frontend [Port 5173]" cmd /k "title Fitted AI - Frontend && color 0A && cd frontend && npm run dev"

echo     Waiting for frontend to start...
timeout /t 3 /nobreak >nul

:: 3. Open Browser
start http://localhost:5173

echo.
echo ====================================================================
echo                   ALL SERVICES ARE RUNNING!
echo ====================================================================
echo.
echo  [+] Web App:     http://localhost:5173
echo  [+] API Server:  http://localhost:8000
echo  [+] API Docs:    http://localhost:8000/docs
echo.
echo ====================================================================
echo  Press ANY KEY to STOP all servers and exit cleanly...
echo ====================================================================
pause >nul

echo.
echo [!] Stopping servers...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do taskkill /F /PID %%a >nul 2>&1

echo [+] All servers stopped safely!
timeout /t 2 >nul
exit
