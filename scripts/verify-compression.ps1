# 伺服器壓縮驗證腳本
# 用法: .\scripts\verify-compression.ps1 -Url "https://your-domain.com"

param(
    [Parameter(Mandatory=$false)]
    [string]$Url = "http://localhost:5173",
    
    [Parameter(Mandatory=$false)]
    [switch]$Detailed = $false
)

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      伺服器壓縮配置驗證工具 v1.0                      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📍 測試網址: $Url`n" -ForegroundColor Yellow

# 測試 Gzip 壓縮
function Test-Gzip {
    param([string]$TestUrl)
    
    Write-Host "🔍 測試 Gzip 壓縮..." -ForegroundColor Green
    
    try {
        $response = Invoke-WebRequest -Uri $TestUrl -Method Head -Headers @{
            "Accept-Encoding" = "gzip, deflate"
        } -UseBasicParsing -ErrorAction Stop
        
        $encoding = $response.Headers["Content-Encoding"]
        $vary = $response.Headers["Vary"]
        
        if ($encoding -match "gzip") {
            Write-Host "  ✅ Gzip 壓縮: 已啟用" -ForegroundColor Green
            Write-Host "     Content-Encoding: $encoding" -ForegroundColor Gray
        } else {
            Write-Host "  ❌ Gzip 壓縮: 未啟用" -ForegroundColor Red
            $encodingDisplay = if ($encoding) { $encoding } else { '無' }
            Write-Host "     Content-Encoding: $encodingDisplay" -ForegroundColor Gray
            Write-Host "     ⚠️  建議在 Nginx/Apache 配置中啟用 gzip" -ForegroundColor Yellow
        }
        
        if ($vary -match "Accept-Encoding") {
            Write-Host "  ✅ Vary 標頭: 正確設置 (支援 CDN 快取)" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Vary 標頭: 未設置或不完整" -ForegroundColor Yellow
            Write-Host "     建議加入: Vary: Accept-Encoding" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  ❌ 請求失敗: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# 測試 Brotli 壓縮
function Test-Brotli {
    param([string]$TestUrl)
    
    Write-Host "🔍 測試 Brotli 壓縮..." -ForegroundColor Green
    
    try {
        $response = Invoke-WebRequest -Uri $TestUrl -Method Head -Headers @{
            "Accept-Encoding" = "br, gzip, deflate"
        } -UseBasicParsing -ErrorAction Stop
        
        $encoding = $response.Headers["Content-Encoding"]
        
        if ($encoding -match "br") {
            Write-Host "  ✅ Brotli 壓縮: 已啟用 (優於 Gzip 15-20%)" -ForegroundColor Green
            Write-Host "     Content-Encoding: $encoding" -ForegroundColor Gray
        } else {
            Write-Host "  ℹ️  Brotli 壓縮: 未啟用 (可選，需安裝模組)" -ForegroundColor Cyan
            $encodingDisplay = if ($encoding) { $encoding } else { '無' }
            Write-Host "     Content-Encoding: $encodingDisplay" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  ❌ 請求失敗: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# 測試快取標頭
function Test-CacheHeaders {
    param([string]$TestUrl)
    
    Write-Host "🔍 測試快取標頭..." -ForegroundColor Green
    
    try {
        # 測試 HTML
        $htmlResponse = Invoke-WebRequest -Uri $TestUrl -Method Head -UseBasicParsing -ErrorAction Stop
        $htmlCache = $htmlResponse.Headers["Cache-Control"]
        
        Write-Host "  HTML 檔案:" -ForegroundColor Cyan
        if ($htmlCache -match "no-cache|no-store|must-revalidate") {
            Write-Host "    ✅ Cache-Control: $htmlCache" -ForegroundColor Green
        } el$cacheDisplay = if ($htmlCache) { $htmlCache } else { '未設置' }
            Write-Host "    ⚠️  Cache-Control: $cacheDisplay
            Write-Host "    ⚠️  Cache-Control: $($htmlCache ?? '未設置')" -ForegroundColor Yellow
            Write-Host "    建議: no-store, no-cache, must-revalidate" -ForegroundColor Gray
        }
        
        # 測試 JS/CSS（如果有）
        $assetUrls = @(
            "$Url/assets/index.js",
            "$Url/assets/index.css"
        )
        
        foreach ($assetUrl in $assetUrls) {
            try {
                $assetResponse = Invoke-WebRequest -Uri $assetUrl -Method Head -UseBasicParsing -ErrorAction SilentlyContinue
                if ($assetResponse) {
                    $assetCache = $assetResponse.Headers["Cache-Control"]
                    $fileName = ($assetUrl -split '/')[-1]
                    
                    Write-Host "`n  靜態資源 ($fileName):" -ForegroundColor Cyan
                    if ($assetCache -match "max-age=\d+|immutable") {
                        Write-Host "    ✅ Cache-Control: $assetCache" -ForegroundColor Green
                    } el$cacheDisplay = if ($assetCache) { $assetCache } else { '未設置' }
                        Write-Host "    ⚠️  Cache-Control: $cacheDisplay
                        Write-Host "    ⚠️  Cache-Control: $($assetCache ?? '未設置')" -ForegroundColor Yellow
                        Write-Host "    建議: public, max-age=31536000, immutable" -ForegroundColor Gray
                    }
                }
            } catch {
                # 忽略找不到的資源
            }
        }
        
    } catch {
        Write-Host "  ❌ 請求失敗: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# 測試安全標頭
function Test-SecurityHeaders {
    param([string]$TestUrl)
    
    Write-Host "🔍 測試安全標頭..." -ForegroundColor Green
    
    try {
        $response = Invoke-WebRequest -Uri $TestUrl -Method Head -UseBasicParsing -ErrorAction Stop
        
        $securityHeaders = @{
            "X-Content-Type-Options" = "nosniff"
            "X-Frame-Options" = "DENY|SAMEORIGIN"
            "X-XSS-Protection" = "1; mode=block"
        }
        
        foreach ($header in $securityHeaders.Keys) {
            $value = $response.Headers[$header]
            $expected = $securityHeaders[$header]
            
            if ($value -match $expected) {
                Write-Host "  ✅ $header`: $value" -ForegroundColor Green
            } el$valueDisplay = if ($value) { $value } else { '未設置' }
                Write-Host "  ⚠️  $header`: $valueDisplay
                Write-Host "  ⚠️  $header`: $($value ?? '未設置')" -ForegroundColor Yellow
            }
        }
        
    } catch {
        Write-Host "  ❌ 請求失敗: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

# 計算壓縮率
function Test-CompressionRatio {
    param([string]$TestUrl)
    
    Write-Host "🔍 測試壓縮效果..." -ForegroundColor Green
    
    try {
        # 未壓縮大小
        $uncompressed = Invoke-WebRequest -Uri $TestUrl -UseBasicParsing -ErrorAction Stop
        $uncompressedSize = $uncompressed.RawContentLength
        
        # 壓縮後大小
        $compressed = Invoke-WebRequest -Uri $TestUrl -Headers @{
            "Accept-Encoding" = "gzip, deflate"
        } -UseBasicParsing -ErrorAction Stop
        $compressedSize = $compressed.RawContentLength
        
        $ratio = [math]::Round((1 - $compressedSize / $uncompressedSize) * 100, 2)
        
        Write-Host "  未壓縮: $([math]::Round($uncompressedSize/1KB, 2)) KB" -ForegroundColor Gray
        Write-Host "  已壓縮: $([math]::Round($compressedSize/1KB, 2)) KB" -ForegroundColor Gray
        Write-Host "  壓縮率: $ratio% ↓" -ForegroundColor $(if($ratio -gt 50) { "Green" } elseif($ratio -gt 30) { "Yellow" } else { "Red" })
        
        if ($ratio -lt 30) {
            Write-Host "  ⚠️  壓縮率偏低，請檢查伺服器配置" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "  ℹ️  無法計算壓縮率（可能本地開發環境未啟用壓縮）" -ForegroundColor Cyan
    }
    
    Write-Host ""
}

# 執行測試
Test-Gzip -TestUrl $Url
Test-Brotli -TestUrl $Url
Test-CacheHeaders -TestUrl $Url
Test-SecurityHeaders -TestUrl $Url

if ($Detailed) {
    Test-CompressionRatio -TestUrl $Url
}

# 總結
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                    測試完成                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📝 下一步:" -ForegroundColor Yellow
Write-Host "  1. 如果是本地開發環境 (localhost)，壓縮未啟用是正常的" -ForegroundColor Gray
Write-Host "  2. 部署到生產環境後，再次執行此腳本驗證" -ForegroundColor Gray
Write-Host "  3. 參考 deployment/ 目錄中的配置範例" -ForegroundColor Gray
Write-Host "  4. 使用線上工具驗證: https://www.giftofspeed.com/gzip-test/" -ForegroundColor Gray
Write-Host ""
