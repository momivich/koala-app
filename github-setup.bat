@echo off
cd /d "%~dp0"

echo === Step 1: git init ===
git init
git branch -M main

echo.
echo === Step 2: add files ===
git add .

echo.
echo === Step 3: commit ===
git commit -m "koala-app first commit"

echo.
echo ============================================================
echo   DONE. Next steps:
echo.
echo   1. Go to https://github.com/new
echo      - Repository name: koala-app
echo      - Select: Public
echo      - Do NOT add README
echo      - Click "Create repository"
echo.
echo   2. Run these 2 commands (replace YOUR_USERNAME):
echo      git remote add origin https://github.com/YOUR_USERNAME/koala-app.git
echo      git push -u origin main
echo.
echo   3. On GitHub: Settings - Pages - Source: main - Save
echo.
echo   4. Your app URL (ready in a few minutes):
echo      https://YOUR_USERNAME.github.io/koala-app/
echo ============================================================
pause
