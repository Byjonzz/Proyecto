@echo off
REM ConectaNet Dashboard - Inicio Rápido (Windows)

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          ConectaNet Dashboard - INICIO RAPIDO                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verificar Node.js
echo Verificando Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js no esta instalado
    echo Descargalo desde https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION%

echo.
echo Verificando npm...
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION%

echo.
echo Instalando dependencias...
call npm install
echo.

echo.
echo ═══════════════════════════════════════════════════════════════════
echo Iniciando servidor de desarrollo...
echo.
echo URL: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo ═══════════════════════════════════════════════════════════════════
echo.

call npm run dev
pause
