# Server Compression Verification Script
# Usage: .\scripts\check-compression.ps1 -Url "https://your-domain.com"

param(
    [Parameter(Mandatory=$false)]
    [string]$Url = "http://localhost:5173"
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Server Compression Check" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Testing URL: $Url`n" -ForegroundColor Yellow

# Test Gzip
Write-Host "[1] Testing Gzip Compression..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri $Url -Method Head -Headers @{
        "Accept-Encoding" = "gzip, deflate"
    } -UseBasicParsing -ErrorAction Stop
    
    $encoding = $response.Headers["Content-Encoding"]
    $vary = $response.Headers["Vary"]
    
    if ($encoding -match "gzip") {
        Write-Host "  [OK] Gzip: Enabled" -ForegroundColor Green
        Write-Host "       Content-Encoding: $encoding" -ForegroundColor Gray
    } else {
        Write-Host "  [WARN] Gzip: Not Enabled" -ForegroundColor Yellow
        if ($encoding) {
            Write-Host "       Content-Encoding: $encoding" -ForegroundColor Gray
        } else {
            Write-Host "       Content-Encoding: None" -ForegroundColor Gray
        }
    }
    
    if ($vary -match "Accept-Encoding") {
        Write-Host "  [OK] Vary Header: Correct" -ForegroundColor Green
    } else {
        Write-Host "  [WARN] Vary Header: Missing" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "  [ERROR] Request Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Brotli
Write-Host "[2] Testing Brotli Compression..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri $Url -Method Head -Headers @{
        "Accept-Encoding" = "br, gzip, deflate"
    } -UseBasicParsing -ErrorAction Stop
    
    $encoding = $response.Headers["Content-Encoding"]
    
    if ($encoding -match "br") {
        Write-Host "  [OK] Brotli: Enabled (Better than Gzip!)" -ForegroundColor Green
    } else {
        Write-Host "  [INFO] Brotli: Not Enabled (Optional)" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "  [ERROR] Request Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Cache Headers
Write-Host "[3] Testing Cache Headers..." -ForegroundColor Green

try {
    $htmlResponse = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -ErrorAction Stop
    $htmlCache = $htmlResponse.Headers["Cache-Control"]
    
    Write-Host "  HTML File:" -ForegroundColor Cyan
    if ($htmlCache -match "no-cache|no-store|must-revalidate") {
        Write-Host "    [OK] Cache-Control: $htmlCache" -ForegroundColor Green
    } else {
        if ($htmlCache) {
            Write-Host "    [WARN] Cache-Control: $htmlCache" -ForegroundColor Yellow
        } else {
            Write-Host "    [WARN] Cache-Control: Not Set" -ForegroundColor Yellow
        }
        Write-Host "    Recommend: no-store, no-cache, must-revalidate" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "  [ERROR] Request Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test Security Headers
Write-Host "[4] Testing Security Headers..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri $Url -Method Head -UseBasicParsing -ErrorAction Stop
    
    $headers = @{
        "X-Content-Type-Options" = "nosniff"
        "X-Frame-Options" = "DENY|SAMEORIGIN"
        "X-XSS-Protection" = "1; mode=block"
    }
    
    foreach ($header in $headers.Keys) {
        $value = $response.Headers[$header]
        $expected = $headers[$header]
        
        if ($value -match $expected) {
            Write-Host "  [OK] $header`: $value" -ForegroundColor Green
        } else {
            if ($value) {
                Write-Host "  [WARN] $header`: $value" -ForegroundColor Yellow
            } else {
                Write-Host "  [WARN] $header`: Not Set" -ForegroundColor Yellow
            }
        }
    }
    
} catch {
    Write-Host "  [ERROR] Request Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Test Complete" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. If testing localhost, compression is not expected" -ForegroundColor Gray
Write-Host "  2. Deploy to production and run this script again" -ForegroundColor Gray
Write-Host "  3. Check deployment/*.conf for server configuration" -ForegroundColor Gray
Write-Host "  4. Use online tools: https://www.giftofspeed.com/gzip-test/" -ForegroundColor Gray
Write-Host ""
