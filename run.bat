@echo off
echo Starting Oxygen Marketing Platform...
cd /d "%~dp0"
dotnet run --project src/OxygenMarketing/OxygenMarketing.csproj --urls "http://localhost:5200"
pause
