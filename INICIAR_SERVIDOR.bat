@echo off
echo Iniciando servidor de desarrollo...
echo.

cd /d "%~dp0"

REM Buscar npm en las ubicaciones comunes
set NPM_PATH=
if exist "node_modules\.bin\npm.cmd" (
    set NPM_PATH=node_modules\.bin\npm.cmd
) else if exist "%APPDATA%\npm\npm.cmd" (
    set NPM_PATH=%APPDATA%\npm\npm.cmd
) else if exist "%ProgramFiles%\nodejs\npm.cmd" (
    set NPM_PATH=%ProgramFiles%\nodejs\npm.cmd
) else if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" (
    set NPM_PATH=%ProgramFiles(x86)%\nodejs\npm.cmd
)

if "%NPM_PATH%"=="" (
    echo ERROR: No se encontro npm
    echo.
    echo Instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo Usando npm en: %NPM_PATH%
echo.
echo Iniciando servidor en http://localhost:3000
echo Presiona Ctrl+C para detener
echo.

"%NPM_PATH%" run dev

pause

