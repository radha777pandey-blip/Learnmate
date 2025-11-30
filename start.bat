@echo off
REM Learnmate Startup Script - Starts both proxy and frontend servers
REM Run this file to start the complete system

echo.
echo ============================================
echo   LEARNMATE - AI Learning System
echo ============================================
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

echo Starting Backend Proxy on port 5000...
start cmd /k "cd backend && python proxy.py"

timeout /t 2 /nobreak

echo Starting Frontend Server on port 8000...
start cmd /k "cd Learnmate && python -m http.server 8000"

echo.
echo ============================================
echo   STARTUP COMPLETE
echo ============================================
echo.
echo Frontend: http://localhost:8000/index.html
echo Backend:  http://localhost:5000/api/recommend
echo.


echo Two command windows should have opened above.
echo Keep both windows open while using the site.
echo.
pause
