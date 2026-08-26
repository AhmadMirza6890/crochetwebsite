# build-android-aab.ps1
# Builds a signed AAB (Android App Bundle) for Google Play upload.

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " HearthsideYarn - Building Release AAB  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$root = $PSScriptRoot

# Set environment
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-21.0.12.101-hotspot"
$env:ANDROID_HOME = "C:\Android"
$env:ANDROID_SDK_ROOT = "C:\Android"
$machinePath = [System.Environment]::GetEnvironmentVariable("Path","Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("Path","User")
$env:Path = "$machinePath;$userPath;$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\cmdline-tools\latest\bin"

Write-Host ""
Write-Host "[1/4] npm install..." -ForegroundColor Yellow
Push-Location $root
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

Write-Host ""
Write-Host "[2/4] npx cap sync android..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) { throw "cap sync failed" }

Write-Host ""
Write-Host "[3/4] Gradle bundleRelease..." -ForegroundColor Yellow
$gradlew = Join-Path $root "android\gradlew.bat"
Push-Location (Join-Path $root "android")
& $gradlew bundleRelease --no-daemon
if ($LASTEXITCODE -ne 0) { throw "Gradle bundleRelease failed" }
Pop-Location

Write-Host ""
Write-Host "[4/4] Verifying output..." -ForegroundColor Yellow
$aabPath = Join-Path $root "android\app\build\outputs\bundle\release\app-release.aab"
if (Test-Path $aabPath) {
    $size = [math]::Round((Get-Item $aabPath).Length / 1MB, 2)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host " BUILD SUCCESSFUL! " -ForegroundColor Green
    Write-Host " AAB: $aabPath" -ForegroundColor Green
    Write-Host " Size: $size MB" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} else {
    throw "AAB NOT FOUND at $aabPath"
}

Pop-Location
