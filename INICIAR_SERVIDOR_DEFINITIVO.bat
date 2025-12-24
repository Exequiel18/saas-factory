@echo off
title Servidor Chequeo Real - Iniciando...
color 0A
cls
echo.
echo ========================================
echo   INICIANDO SERVIDOR CHEQUEO REAL
echo ========================================
echo.

cd /d "%~dp0"

REM Usar Node.js de la carpeta bin (si existe)
if exist "bin\node-v20.10.0-win-x64\npm.cmd" (
    echo [OK] Usando Node.js local...
    set NPM_CMD=bin\node-v20.10.0-win-x64\npm.cmd
    goto :start
)

REM Buscar npm en otras ubicaciones
if exist "node_modules\.bin\npm.cmd" (
    set NPM_CMD=node_modules\.bin\npm.cmd
    goto :start
)

if exist "%APPDATA%\npm\npm.cmd" (
    set NPM_CMD=%APPDATA%\npm\npm.cmd
    goto :start
)

if exist "%ProgramFiles%\nodejs\npm.cmd" (
    set NPM_CMD=%ProgramFiles%\nodejs\npm.cmd
    goto :start
)

if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" (
    set NPM_CMD=%ProgramFiles(x86)%\nodejs\npm.cmd
    goto :start
)

REM Buscar en PATH
where npm >nul 2>&1
if %errorlevel%==0 (
    set NPM_CMD=npm
    goto :start
)

echo [ERROR] No se encontro npm
echo.
echo Instala Node.js desde: https://nodejs.org/
echo.
pause
exit /b 1

:start
echo [OK] npm encontrado: %NPM_CMD%
echo.
echo [INFO] Verificando dependencias...
if not exist "node_modules" (
    echo [INFO] Instalando dependencias (esto puede tardar 2-3 minutos)...
    "%NPM_CMD%" install
    if %errorlevel% neq 0 (
        echo [ERROR] No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencias ya instaladas
)
echo.
echo ========================================
echo [INFO] Iniciando servidor...
echo [INFO] URL: http://localhost:3000
echo ========================================
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

