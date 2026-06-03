@echo off
echo ========================================
echo   Koala Portal - Local Server
echo ========================================
echo.
echo --- Your PC IP addresses ---
ipconfig | findstr /c:"IPv4"
echo.
echo Open on smartphone (same Wi-Fi):
echo   http://[IP above]:8080/koala-app.html
echo.
echo Close this window to stop the server.
echo ----------------------------------------
cd /d "%~dp0"
python -m http.server 8080
pause
