@echo off
title Servidor Chequeo Real
color 0A
echo.
echo ========================================
echo   INICIANDO SERVIDOR CHEQUEO REAL
echo ========================================
echo.

cd /d "%~dp0"

REM Buscar npm en ubicaciones comunes
set NPM_CMD=

if exist "node_modules\.bin\npm.cmd" (
    set NPM_CMD=node_modules\.bin\npm.cmd
    goto :found
)

if exist "%APPDATA%\npm\npm.cmd" (
    set NPM_CMD=%APPDATA%\npm\npm.cmd
    goto :found
)

if exist "%ProgramFiles%\nodejs\npm.cmd" (
    set NPM_CMD=%ProgramFiles%\nodejs\npm.cmd
    goto :found
)

if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" (
    set NPM_CMD=%ProgramFiles(x86)%\nodejs\npm.cmd
    goto :found
)

REM Buscar en PATH
where npm >nul 2>&1
if %errorlevel%==0 (
    set NPM_CMD=npm
    goto :found
)

echo [ERROR] No se encontro npm
echo.
echo Instala Node.js desde: https://nodejs.org/
echo.
pause
exit /b 1

:found
echo [OK] npm encontrado
echo.
echo [INFO] Iniciando servidor...
echo [INFO] URL: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.
echo ========================================
echo.

"%NPM_CMD%" run dev

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] El servidor no pudo iniciar
    echo.
    pause
)

