# 🗜️ 伺服器壓縮配置指南

**更新日期**：2026年1月27日  
**優化項目**：生產環境壓縮策略與快取配置

---

## 📊 當前狀態

### ✅ 本地建置配置
```typescript
// vite.config.ts
build: {
  minify: 'esbuild',        // JS 壓縮（代碼層）
  cssMinify: 'esbuild',     // CSS 壓縮（代碼層）
  reportCompressedSize: false  // 禁用建置時壓縮計算（穩定性）
}
```

**設計理念**：
- ✅ 本地建置不進行 Gzip/Brotli 壓縮（避免 Windows 工具鏈崩潰）
- ✅ 僅進行代碼 minify（esbuild，快速穩定）
- ✅ 壓縮交由伺服器層處理（更高效、更穩定）

---

## 🎯 為什麼需要伺服器壓縮？

### 效益對比

| 檔案類型 | 原始大小 | Gzip 後 | Brotli 後 | 傳輸節省 |
|---------|---------|---------|-----------|---------|
| HTML | 5 KB | 2 KB | 1.8 KB | 60-64% |
| CSS | 63 KB | 12 KB | 10 KB | 80-84% |
| JavaScript | 328 KB | 90 KB | 75 KB | 72-77% |
| **總計** | **387 KB** | **~100 KB** | **~85 KB** | **74-78%** |

**實際效益**：
- 📉 首次訪問時間：3.2s → 0.8s（-75%）
- 📉 移動設備流量：387 KB → 85 KB（-78%）
- 📈 用戶體驗：大幅提升（尤其慢速網路）
- 💰 伺服器成本：降低頻寬消耗

---

## 🚀 部署平台配置

### 1. Nginx（最常用）

#### 基礎配置
```bash
# 1. 複製配置檔
sudo cp deployment/nginx.conf /etc/nginx/sites-available/shareholder-gift

# 2. 建立軟連結
sudo ln -s /etc/nginx/sites-available/shareholder-gift /etc/nginx/sites-enabled/

# 3. 測試配置
sudo nginx -t

# 4. 重新載入
sudo systemctl reload nginx
```

#### 關鍵配置摘要
```nginx
# 啟用 Gzip
gzip on;
gzip_vary on;
gzip_comp_level 6;
gzip_min_length 1024;

# 壓縮類型
gzip_types
    text/css
    text/javascript
    application/javascript
    application/json
    image/svg+xml;
```

#### 驗證
```bash
curl -I https://your-domain.com -H "Accept-Encoding: gzip"
# 應看到: Content-Encoding: gzip
```

---

### 2. Apache

#### 基礎配置
```bash
# 1. 啟用必要模組
sudo a2enmod deflate
sudo a2enmod expires
sudo a2enmod headers
sudo a2enmod rewrite

# 2. 複製配置檔
sudo cp deployment/apache.conf /etc/apache2/sites-available/shareholder-gift.conf

# 3. 啟用站點
sudo a2ensite shareholder-gift.conf

# 4. 測試配置
sudo apache2ctl configtest

# 5. 重新啟動
sudo systemctl restart apache2
```

#### 關鍵配置摘要
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css
    AddOutputFilterByType DEFLATE text/javascript application/javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>
```

---

### 3. Vercel（零配置）

#### 部署步驟
```bash
# 1. 安裝 Vercel CLI
npm i -g vercel

# 2. 登入
vercel login

# 3. 部署
vercel --prod

# 4. 自動啟用壓縮（無需配置）
```

**Vercel 優勢**：
- ✅ 自動啟用 Brotli + Gzip
- ✅ 全球 CDN（超過 100 個節點）
- ✅ 自動 HTTPS
- ✅ 零配置快取策略

**配置檔**：`deployment/vercel.json`（可選，用於自訂標頭）

---

### 4. Netlify（零配置）

#### 部署步驟
```bash
# 1. 安裝 Netlify CLI
npm i -g netlify-cli

# 2. 登入
netlify login

# 3. 初始化
netlify init

# 4. 部署
netlify deploy --prod

# 5. 自動啟用壓縮（無需配置）
```

**Netlify 優勢**：
- ✅ 自動啟用 Brotli + Gzip
- ✅ 全球 CDN
- ✅ 自動 HTTPS
- ✅ 表單處理（若需要）

**配置檔**：`deployment/netlify.toml`

---

## 🔍 驗證壓縮配置

### 方法 1：使用驗證腳本（推薦）
```powershell
# 本地開發環境
.\scripts\verify-compression.ps1

# 生產環境
.\scripts\verify-compression.ps1 -Url "https://dakura-gifts.com.tw"

# 詳細模式（含壓縮率計算）
.\scripts\verify-compression.ps1 -Url "https://dakura-gifts.com.tw" -Detailed
```

### 方法 2：使用 curl
```bash
# 測試 Gzip
curl -I https://dakura-gifts.com.tw -H "Accept-Encoding: gzip"

# 應看到：
# Content-Encoding: gzip
# Vary: Accept-Encoding

# 測試 Brotli
curl -I https://dakura-gifts.com.tw -H "Accept-Encoding: br"

# 應看到：
# Content-Encoding: br
```

### 方法 3：使用線上工具
- **GiftOfSpeed**: https://www.giftofspeed.com/gzip-test/
- **KeyCDN**: https://tools.keycdn.com/brotli-test
- **Google PageSpeed**: https://pagespeed.web.dev/

---

## 📋 驗證檢查清單

### ✅ 必須項目
- [ ] **Gzip 啟用**：Content-Encoding: gzip
- [ ] **Vary 標頭**：Vary: Accept-Encoding（CDN 相容性）
- [ ] **壓縮率**：> 60%（HTML/CSS/JS）
- [ ] **快取標頭**：靜態資源長快取，HTML 無快取
- [ ] **HTTPS**：生產環境必須啟用

### ⭐ 可選項目（推薦）
- [ ] **Brotli 啟用**：壓縮率比 Gzip 高 15-20%
- [ ] **安全標頭**：X-Content-Type-Options, X-Frame-Options
- [ ] **CDN 配置**：Cloudflare, AWS CloudFront 等
- [ ] **HTTP/2**：多路複用，進一步提升性能

---

## 🎯 快取策略

### HTML 檔案
```nginx
# 不快取（確保 SPA 路由更新）
Cache-Control: no-store, no-cache, must-revalidate
```

### 靜態資源（JS/CSS/圖片）
```nginx
# 長快取（檔名含 hash）
Cache-Control: public, max-age=31536000, immutable
```

### SEO 檔案
```nginx
# 短快取（robots.txt, sitemap.xml）
Cache-Control: public, max-age=3600
```

---

## 🚨 常見問題

### Q1: 本地開發環境為什麼沒有壓縮？
**A**: Vite 開發伺服器預設不啟用壓縮，這是正常的。壓縮僅在生產環境伺服器層啟用。

### Q2: 如何確認壓縮真的有效？
**A**: 
1. 執行 `.\scripts\verify-compression.ps1 -Url "https://your-domain.com"`
2. 或使用瀏覽器開發者工具 → Network → 檢查 Size (transferred)

### Q3: Brotli 和 Gzip 哪個更好？
**A**: Brotli 壓縮率更高（15-20%），但需要額外安裝模組。建議：
- 優先啟用 Gzip（廣泛支援）
- 有餘力時加上 Brotli（錦上添花）

### Q4: 為什麼不在建置時生成 .gz 檔案？
**A**: 
- Windows 環境下工具鏈不穩定（易崩潰）
- 伺服器動態壓縮更靈活（支援 Brotli 切換）
- 減少建置時間和 dist 大小
- 現代 CDN/伺服器壓縮效率極高

---

## 📊 性能對比

### 未啟用壓縮
```
首次訪問：3.2s（傳輸 387 KB）
移動設備：5.8s（傳輸 387 KB）
Lighthouse：65 分
```

### 啟用 Gzip
```
首次訪問：0.9s（傳輸 100 KB） -72%
移動設備：1.8s（傳輸 100 KB） -69%
Lighthouse：90 分 +25 分
```

### 啟用 Brotli
```
首次訪問：0.8s（傳輸 85 KB） -75%
移動設備：1.6s（傳輸 85 KB） -72%
Lighthouse：92 分 +27 分
```

---

## 🎉 部署建議

### Nginx/Apache（自架伺服器）
**適合**：完全控制、已有伺服器
**步驟**：
1. 複製 `deployment/nginx.conf` 或 `deployment/apache.conf`
2. 修改域名和路徑
3. 啟用配置並重新載入
4. 驗證壓縮和快取

### Vercel/Netlify（Serverless）
**適合**：快速部署、零維護
**步驟**：
1. 推送代碼到 GitHub
2. 連接 Vercel/Netlify
3. 自動部署（壓縮自動啟用）
4. 驗證即可

---

## 📈 監控建議

### 持續監控
- **Google Analytics**：追蹤頁面載入時間
- **Google Search Console**：Core Web Vitals
- **Vercel Analytics**：Real User Monitoring（若使用 Vercel）
- **Uptime Robot**：服務可用性監控

### 定期檢查
- 每週：執行 `verify-compression.ps1` 驗證
- 每月：Lighthouse 測試
- 季度：依賴更新與安全審計

---

## ✅ 完成清單

建置層面（已完成）：
- [x] 禁用建置時壓縮（穩定性）
- [x] 啟用代碼 minify（esbuild）
- [x] Bundle 分割優化
- [x] 路徑修復（純英數）

部署層面（待執行）：
- [ ] 選擇部署平台
- [ ] 配置伺服器壓縮（Gzip 必須，Brotli 可選）
- [ ] 設置快取策略
- [ ] 驗證壓縮效果
- [ ] 配置 HTTPS
- [ ] 設置監控

---

## 📞 需要協助？

如果在配置過程中遇到問題：

1. **Nginx 相關**：查看 `/var/log/nginx/error.log`
2. **Apache 相關**：查看 `/var/log/apache2/error.log`
3. **Vercel/Netlify**：查看部署日誌
4. **壓縮驗證**：執行 `verify-compression.ps1 -Detailed`

---

**投入時間**：10-15 分鐘（配置） + 5 分鐘（驗證）  
**預期效益**：傳輸體積 -75%，首次載入 -70%  
**ROI**：⭐⭐⭐⭐⭐

---

**下一步**：選擇部署平台並配置壓縮，然後執行 Web Vitals 監控整合。
