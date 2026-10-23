@echo off
cd /d "%~dp0"
echo Starting RED & REGA Landing Page Server...
start "" http://localhost:3000/
node server.js
pause
