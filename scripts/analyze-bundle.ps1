# Bundle 分析腳本
# 分析 dist/assets 目錄的檔案大小和結構

$distPath = "dist/assets"

if (-not (Test-Path $distPath)) {
    Write-Host "❌ dist/assets 目錄不存在，請先執行 bun run build" -ForegroundColor Red
    exit 1
}

Write-Host "`n📊 Bundle 分析報告" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# 1. JS 檔案分析
Write-Host "`n📦 JavaScript 檔案 (Top 10)" -ForegroundColor Yellow
$jsFiles = Get-ChildItem "$distPath/*.js" | 
    Select-Object Name, @{N='KB';E={[math]::Round($_.Length/1KB,1)}} |
    Sort-Object KB -Descending

$jsFiles | Select-Object -First 10 | Format-Table -AutoSize

$jsTotal = ($jsFiles | Measure-Object -Property KB -Sum).Sum
Write-Host "  總計: $($jsFiles.Count) 個檔案, $jsTotal KB" -ForegroundColor Cyan

# 2. CSS 檔案分析
Write-Host "`n🎨 CSS 檔案" -ForegroundColor Yellow
$cssFiles = Get-ChildItem "$distPath/*.css" | 
    Select-Object Name, @{N='KB';E={[math]::Round($_.Length/1KB,1)}} |
    Sort-Object KB -Descending

$cssFiles | Format-Table -AutoSize

$cssTotal = ($cssFiles | Measure-Object -Property KB -Sum).Sum
Write-Host "  總計: $($cssFiles.Count) 個檔案, $cssTotal KB" -ForegroundColor Cyan

# 3. 總計
Write-Host "`n📊 總計" -ForegroundColor Yellow
Write-Host "  JS:  $jsTotal KB" -ForegroundColor White
Write-Host "  CSS: $cssTotal KB" -ForegroundColor White
Write-Host "  合計: $($jsTotal + $cssTotal) KB ($([math]::Round(($jsTotal + $cssTotal)/1024, 2)) MB)" -ForegroundColor Green

# 4. 大檔案警告
Write-Host "`n⚠️  大檔案警告 (>50 KB)" -ForegroundColor Yellow
$largeFiles = $jsFiles | Where-Object { $_.KB -gt 50 }
if ($largeFiles.Count -gt 0) {
    $largeFiles | Format-Table -AutoSize
} else {
    Write-Host "  ✅ 無超過 50 KB 的檔案" -ForegroundColor Green
}

# 5. Chunk 分類統計
Write-Host "`n📂 Chunk 分類統計" -ForegroundColor Yellow
$categories = @{
    'Vue Core' = $jsFiles | Where-Object { $_.Name -like '*vue-core*' }
    'Vue Router' = $jsFiles | Where-Object { $_.Name -like '*vue-router*' }
    'Vue Ecosystem' = $jsFiles | Where-Object { $_.Name -like '*vue-ecosystem*' }
    'UI Components (reka-ui)' = $jsFiles | Where-Object { $_.Name -like '*reka-ui*' }
    'Tailwind Utils' = $jsFiles | Where-Object { $_.Name -like '*tailwind*' }
    'Views' = $jsFiles | Where-Object { $_.Name -like '*View-*' }
    'Vendor' = $jsFiles | Where-Object { $_.Name -like '*vendor*' }
    'Others' = $jsFiles | Where-Object { 
        $_.Name -notlike '*vue*' -and 
        $_.Name -notlike '*reka*' -and 
        $_.Name -notlike '*tailwind*' -and 
        $_.Name -notlike '*View-*' -and 
        $_.Name -notlike '*vendor*'
    }
}

foreach ($category in $categories.Keys | Sort-Object) {
    $files = $categories[$category]
    if ($files) {
        $size = ($files | Measure-Object -Property KB -Sum).Sum
        $count = $files.Count
        Write-Host "  $category`: $count 檔案, $size KB" -ForegroundColor White
    }
}

# 6. 優化建議
Write-Host "`n💡 優化建議" -ForegroundColor Cyan

$vueEcosystem = $jsFiles | Where-Object { $_.Name -like '*vue-ecosystem*' }
if ($vueEcosystem -and $vueEcosystem.KB -gt 80) {
    Write-Host "  ⚠️  vue-ecosystem chunk 過大 ($($vueEcosystem.KB) KB)" -ForegroundColor Yellow
    Write-Host "     → 建議檢查是否有未使用的 Vue 相關依賴" -ForegroundColor Gray
}

$rekaUI = $jsFiles | Where-Object { $_.Name -like '*reka-ui*' }
if ($rekaUI -and $rekaUI.KB -gt 20) {
    Write-Host "  ⚠️  reka-ui chunk 可能包含未使用的組件 ($($rekaUI.KB) KB)" -ForegroundColor Yellow
    Write-Host "     → 建議檢查 shadcn-vue 組件是否全部使用" -ForegroundColor Gray
}

$totalSize = $jsTotal + $cssTotal
if ($totalSize -gt 500) {
    Write-Host "  ⚠️  總體積較大 ($totalSize KB)" -ForegroundColor Yellow
    Write-Host "     → 考慮啟用 Route-based Code Splitting" -ForegroundColor Gray
}

Write-Host "`n✅ 分析完成！" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Gray
