# Idea Validator - Start Script
# Run this from the project root: .\start.ps1

Write-Host ""
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host "    IDEA VALIDATOR - Starting Services...     " -ForegroundColor Cyan
Write-Host "  ============================================" -ForegroundColor Cyan
Write-Host ""

# Start Backend (in a new PowerShell window)
Write-Host "[1/2] Starting Backend (FastAPI + LangGraph)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'd:\projects\idea_validator\backend'; .\venv\Scripts\Activate.ps1; Write-Host '  Backend running on http://localhost:8000' -ForegroundColor Green; python -m uvicorn server:app --reload"

Start-Sleep -Seconds 2

# Start Frontend (in a new PowerShell window)
Write-Host "[2/2] Starting Frontend (Vite + React)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'd:\projects\idea_validator\frontend'; Write-Host '  Frontend running on http://localhost:5173' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "  Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173  <-- Open this in your browser" -ForegroundColor White
Write-Host ""
