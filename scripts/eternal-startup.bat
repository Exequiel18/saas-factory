@echo off
set "NODE_BIN=c:\Users\Exequiel rogers\Desktop\Nueva carpeta\bin\node-v20.10.0-win-x64"
set "PM2=%NODE_BIN%\pm2.cmd"
cd /d "c:\Users\Exequiel rogers\Desktop\Nueva carpeta"
echo [ETERNAL STARTUP] Resurrecting Empire...
call "%PM2%" resurrect
if errorlevel 1 (
    echo [ETERNAL STARTUP] Resurrect failed, starting fresh ecosystem.
    call "%PM2%" start ecosystem.config.js
)
echo [ETERNAL STARTUP] Empire is now unstoppable.
timeout /t 5
