# 清理 dist 目錄的 PowerShell 腳本
# 用於解決 Windows 文件鎖定問題

$distPath = Join-Path $PSScriptRoot "..\dist"

if (Test-Path $distPath) {
    Write-Host "🗑️  清理 dist 目錄..." -ForegroundColor Yellow
    try {
        Remove-Item $distPath -Recurse -Force -ErrorAction Stop
        Start-Sleep -Milliseconds 300
        Write-Host "✅ 清理完成" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  無法刪除某些文件，嘗試繼續..." -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  dist 目錄不存在，跳過清理" -ForegroundColor Cyan
}
