# LEARNMATE Startup Script for PowerShell
# Run: powershell -ExecutionPolicy Bypass -File start.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  LEARNMATE - AI Learning System" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Get the directory where this script is located
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Host "Starting Backend Proxy on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$scriptDir\backend'; python proxy.py`""

Start-Sleep -Seconds 2

Write-Host "Starting Frontend Server on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd '$scriptDir\Learnmate'; python -m http.server 8000`""

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  STARTUP COMPLETE" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:8000/index.html" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000/api/recommend" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two PowerShell windows should have opened above." -ForegroundColor Yellow
Write-Host "Keep both windows open while using the site." -ForegroundColor Yellow
Write-Host ""
Write-Sleep -Seconds 5
