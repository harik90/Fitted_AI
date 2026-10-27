# Fitted AI - Windows Setup Script
Write-Host "Setting up Fitted AI..." -ForegroundColor Cyan

# Install Python dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
python -m pip install -r requirements.txt

# Setup Frontend
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build
Set-Location ..

if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
}

Write-Host "Setup complete!" -ForegroundColor Green
Write-Host "To start all servers with one command:" -ForegroundColor Cyan
Write-Host "  .\start.bat" -ForegroundColor Yellow
