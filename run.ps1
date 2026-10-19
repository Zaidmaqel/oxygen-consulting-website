Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Oxygen Marketing Platform - .NET 8" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Ensure dotnet in PATH if installed in user profile
if (-not (Get-Command dotnet -ErrorAction SilentlyContinue)) {
    if (Test-Path "$env:USERPROFILE\.dotnet\dotnet.exe") {
        $env:PATH = "$env:USERPROFILE\.dotnet;$env:PATH"
    }
}

Write-Host "`nRunning Unit Tests to verify system health..." -ForegroundColor Yellow
dotnet test tests/OxygenMarketing.Tests/OxygenMarketing.Tests.csproj

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nTests Passed! Launching web platform at http://localhost:5200..." -ForegroundColor Green
    Start-Process "http://localhost:5200"
    dotnet run --project src/OxygenMarketing/OxygenMarketing.csproj --urls "http://localhost:5200"
} else {
    Write-Host "`nTests failed. Please review errors." -ForegroundColor Red
}
