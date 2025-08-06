@echo off
echo ========================================
echo   VThink Dashboard - Iniciando...
echo ========================================
echo.

REM Limpia la pantalla
cls

REM Navega al directorio del dashboard
cd /d "%~dp0apps\dashboard"

REM Verifica si existe node_modules
if not exist "node_modules" (
    echo [!] Instalando dependencias con pnpm...
    pnpm install
)

REM Mata cualquier proceso en el puerto 3001
echo [*] Liberando puerto 3001...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001"') do taskkill /F /PID %%a 2>nul

REM Inicia el servidor
echo [*] Iniciando servidor en http://localhost:3001
echo.
echo [!] Presiona Ctrl+C para detener el servidor
echo.
npx next dev -p 3001