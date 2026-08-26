# setup-android-capacitor.ps1
# HearthsideYarn Android Environment Verification Script
# Run this to verify all required tools are installed and configured.

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " HearthsideYarn Android Environment Check " -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# --- Node.js ---
Write-Host "[1/10] Node.js..." -NoNewline
try {
    $nodeVer = node --version 2>&1
    Write-Host " OK ($nodeVer)" -ForegroundColor Green
} catch {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allGood = $false
}

# --- npm ---
Write-Host "[2/10] npm..." -NoNewline
try {
    $npmVer = npm --version 2>&1
    Write-Host " OK (v$npmVer)" -ForegroundColor Green
} catch {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allGood = $false
}

# --- JAVA_HOME ---
Write-Host "[3/10] JAVA_HOME..." -NoNewline
$javaHome = [System.Environment]::GetEnvironmentVariable("JAVA_HOME", "Machine")
if (-not $javaHome) { $javaHome = $env:JAVA_HOME }
if ($javaHome -and (Test-Path $javaHome)) {
    Write-Host " OK ($javaHome)" -ForegroundColor Green
} else {
    Write-Host " NOT SET or invalid" -ForegroundColor Red
    $allGood = $false
}

# --- Java ---
Write-Host "[4/10] Java..." -NoNewline
try {
    $javaVer = (java -version 2>&1 | Select-String "version").ToString().Trim()
    Write-Host " OK ($javaVer)" -ForegroundColor Green
} catch {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allGood = $false
}

# --- javac ---
Write-Host "[5/10] javac..." -NoNewline
try {
    $javacVer = (javac -version 2>&1).ToString().Trim()
    Write-Host " OK ($javacVer)" -ForegroundColor Green
} catch {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allGood = $false
}

# --- ANDROID_HOME ---
Write-Host "[6/10] ANDROID_HOME..." -NoNewline
$androidHome = [System.Environment]::GetEnvironmentVariable("ANDROID_HOME", "User")
if (-not $androidHome) { $androidHome = $env:ANDROID_HOME }
if ($androidHome -and (Test-Path $androidHome)) {
    Write-Host " OK ($androidHome)" -ForegroundColor Green
} else {
    Write-Host " NOT SET or invalid" -ForegroundColor Red
    $allGood = $false
}

# --- Android SDK Tools ---
Write-Host "[7/10] Android SDK tools..." -NoNewline
$sdkManager = Join-Path $androidHome "cmdline-tools\latest\bin\sdkmanager.bat"
$adb = Join-Path $androidHome "platform-tools\adb.exe"
$toolsOk = $true
$toolDetails = @()
if (Test-Path $sdkManager) { $toolDetails += "sdkmanager" } else { $toolsOk = $false }
if (Test-Path $adb) { $toolDetails += "adb" } else { $toolsOk = $false }
if ($toolsOk) {
    Write-Host " OK ($($toolDetails -join ', '))" -ForegroundColor Green
} else {
    Write-Host " MISSING ($($toolDetails -join ', '))" -ForegroundColor Red
    $allGood = $false
}

# --- Capacitor ---
Write-Host "[8/10] Capacitor..." -NoNewline
try {
    $capVer = npx cap --version 2>&1
    Write-Host " OK (v$capVer)" -ForegroundColor Green
} catch {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allGood = $false
}

# --- Android Project ---
Write-Host "[9/10] Android project..." -NoNewline
$androidDir = Join-Path $PSScriptRoot "android"
$gradlew = Join-Path $androidDir "gradlew.bat"
if ((Test-Path $androidDir) -and (Test-Path $gradlew)) {
    Write-Host " OK" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND (run: npx cap add android)" -ForegroundColor Red
    $allGood = $false
}

# --- Gradle ---
Write-Host "[10/10] Gradle wrapper..." -NoNewline
if (Test-Path $gradlew) {
    Write-Host " OK (gradlew.bat found)" -ForegroundColor Green
} else {
    Write-Host " NOT FOUND" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
if ($allGood) {
    Write-Host " All checks passed! Ready to build." -ForegroundColor Green
} else {
    Write-Host " Some checks failed. See above for details." -ForegroundColor Yellow
}
Write-Host "============================================" -ForegroundColor Cyan
