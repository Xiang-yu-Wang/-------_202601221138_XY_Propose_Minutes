# 🗜️ 伺服器壓縮快速參考

## 🎯 核心概念

**為什麼需要壓縮？**
- 傳輸體積減少 75%（387 KB → 85 KB）
- 首次載入加快 70%（3.2s → 0.8s）
- 移動設備體驗大幅提升

**壓縮在哪裡進行？**
- ❌ **不在本地建置時**（避免工具鏈崩潰）
- ✅ **在伺服器層**（Nginx/Apache/CDN）

---

## ⚡ 快速部署

### Vercel/Netlify（推薦新手）
```bash
# 1. 推送到 GitHub
git push origin main

# 2. 登入平台並連接倉庫
# Vercel: https://vercel.com
# Netlify: https://netlify.com

# 3. 自動部署 + 自動壓縮 ✅
# 無需任何配置！
```

### Nginx（自架伺服器）
```bash
# 1. 複製配置檔
sudo cp deployment/nginx.conf /etc/nginx/sites-available/shareholder-gift

# 2. 啟用站點
sudo ln -s /etc/nginx/sites-available/shareholder-gift /etc/nginx/sites-enabled/

# 3. 測試配置
sudo nginx -t

# 4. 重新載入
sudo systemctl reload nginx
```

### Apache（自架伺服器）
```bash
# 1. 啟用模組
sudo a2enmod deflate expires headers rewrite

# 2. 複製配置檔
sudo cp deployment/apache.conf /etc/apache2/sites-available/shareholder-gift.conf

# 3. 啟用站點
sudo a2ensite shareholder-gift.conf

# 4. 重新啟動
sudo systemctl restart apache2
```

---

## 🔍 驗證壓縮

### 方法 1：使用腳本（推薦）
```powershell
# 本地測試（預期：未壓縮）
.\scripts\check-compression.ps1

# 生產環境測試
.\scripts\check-compression.ps1 -Url "https://your-domain.com"
```

### 方法 2：使用 curl
```bash
curl -I https://your-domain.com -H "Accept-Encoding: gzip"
# 應看到: Content-Encoding: gzip
```

### 方法 3：線上工具
- https://www.giftofspeed.com/gzip-test/
- https://tools.keycdn.com/brotli-test

---

## 📋 配置檢查清單

### 必須項目
- [ ] Gzip 啟用（Content-Encoding: gzip）
- [ ] Vary 標頭（Vary: Accept-Encoding）
- [ ] HTML 不快取（Cache-Control: no-cache）
- [ ] 靜態資源長快取（Cache-Control: max-age=31536000）
- [ ] HTTPS 啟用

### 建議項目
- [ ] Brotli 啟用（比 Gzip 好 15-20%）
- [ ] 安全標頭（X-Content-Type-Options, X-Frame-Options）
- [ ] CDN 配置（Cloudflare 等）

---

## 📊 預期效果

| 指標 | 未壓縮 | Gzip | Brotli |
|------|--------|------|--------|
| 傳輸大小 | 387 KB | 100 KB | 85 KB |
| 首次載入 | 3.2s | 0.9s | 0.8s |
| 節省 | - | 74% | 78% |

---

## 🚨 常見問題

**Q: 本地開發環境沒有壓縮？**
A: 正常！Vite 開發伺服器不壓縮，僅生產環境需要。

**Q: 如何確認壓縮有效？**
A: 執行 `.\scripts\check-compression.ps1 -Url "https://your-domain.com"`

**Q: 為什麼不用 vite-plugin-compression？**
A: Windows 環境不穩定，伺服器壓縮更可靠且高效。

---

## 📂 配置檔案位置

```
deployment/
├── nginx.conf      # Nginx 完整配置
├── apache.conf     # Apache 完整配置
├── vercel.json     # Vercel 配置（可選）
└── netlify.toml    # Netlify 配置（可選）

scripts/
└── check-compression.ps1  # 壓縮驗證腳本
```

---

## 🎯 快速決策樹

```
需要部署？
├─ 是新手/想要簡單 → Vercel/Netlify（自動壓縮）
├─ 有自己的伺服器
│  ├─ 使用 Nginx → 複製 nginx.conf
│  └─ 使用 Apache → 複製 apache.conf
└─ 已部署 → 執行 check-compression.ps1 驗證
```

---

**完整文檔**: [SERVER_COMPRESSION_GUIDE.md](./SERVER_COMPRESSION_GUIDE.md)  
**下一步**: 部署後執行驗證，然後整合 Web Vitals 監控
