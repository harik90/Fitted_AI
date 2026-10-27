@echo off
title Fitted AI - 1-Click Installer
color 0A
cls

echo ====================================================================
echo             FITTED AI - ONE-CLICK INSTALLATION
echo ====================================================================
echo.

:: 1. Verify Python
echo [1/3] Checking Python installation...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.10+ from https://www.python.org/
    pause
    exit /b 1
)
python --version

:: 2. Verify Node.js & npm
echo.
echo [2/3] Checking Node.js and npm...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)
node --version
call npm --version

:: 3. Python dependencies
echo.
echo [3/3] Installing backend and frontend dependencies...
echo.
echo [*] Installing Python requirements...
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies!
    pause
    exit /b 1
)

:: 4. Frontend dependencies & build
echo.
echo [*] Installing frontend npm packages...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend npm packages!
    cd ..
    pause
    exit /b 1
)

echo [*] Building frontend production bundle...
call npm run build
cd ..

:: Copy .env.example if .env does not exist
if not exist .env (
    copy .env.example .env >nul 2>&1
    echo [*] Created .env from .env.example
)

echo.
echo ====================================================================
echo                   INSTALLATION COMPLETE!
echo ====================================================================
echo.
echo  You can now start the application with one click:
echo    Double-click:  start.bat  (or run: START_SERVER.bat)
echo.
echo ====================================================================
pause
