# 🚀 SEO 環境變數系統 - 快速參考

## 已完成的設置

✅ **環境變數檔案已創建**
- `.env` - 開發環境（localhost:5173）
- `.env.production` - 生產環境（需要修改）
- `.env.local` - 本機個人測試（.gitignore 已包含）

✅ **代碼已修改**
- `src/composables/useSEO.ts` - 改用環境變數
- `scripts/generate-seo-files.js` - 自動生成 robots.txt 和 sitemap.xml
- `package.json` - 添加 prebuild 腳本

✅ **文件已建立**
- `SEO_ENV_CONFIG.md` - 詳細文檔

---

## 🎯 部署前只需 3 步

### 1️⃣ 修改 .env.production

```bash
# 改這一行為你的實際域名
VITE_SEO_URL=https://yourdomain.com
```

**例如：**
```
VITE_SEO_URL=https://dakura.com.tw
VITE_SEO_URL=https://www.dakura.com.tw
```

### 2️⃣ 執行構建

```bash
bun run build
```

**會自動：**
- 生成 `public/sitemap.xml`（含正確域名）
- 生成 `public/robots.txt`（含正確域名）
- 修改 Open Graph meta 標籤（含正確域名）

### 3️⃣ 部署

```bash
bun run preview  # 本機預覽
# 然後上傳 dist/ 到伺服器
```

---

## ✨ 系統如何運作

```
┌─────────────────────────────────────────┐
│  .env.production 設置 VITE_SEO_URL      │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  bun run build 執行                     │
│  (自動執行 prebuild 腳本)               │
└────────────┬────────────────────────────┘
             │
     ┌───────┴────────┐
     ▼                ▼
┌──────────┐  ┌──────────────┐
│ 生成     │  │ 修改         │
│ robots   │  │ SEO meta     │
│ sitemap  │  │ 標籤         │
└──────────┘  └──────────────┘
     │                │
     └────────┬───────┘
              ▼
     所有 URL 都用
     正確的域名
```

---

## 📋 檢查清單

部署前務必檢查：

- [ ] 修改 `.env.production` 的 `VITE_SEO_URL`
- [ ] 執行 `bun run build`
- [ ] 檢查 `public/sitemap.xml` 第一行是否有正確域名
  ```bash
  head -5 public/sitemap.xml
  ```
- [ ] 檢查 `public/robots.txt` 是否有正確域名
  ```bash
  cat public/robots.txt
  ```
- [ ] 部署前用 `bun run preview` 確認頁面加載正常

---

## 🔧 快速測試

**測試開發環境（localhost）：**
```bash
bun run dev
# 新增 meta 會自動用 http://localhost:5173
```

**測試生產環境：**
```bash
# 改 .env.production
VITE_SEO_URL=https://your-test-domain.com

# 執行構建
bun run build

# 預覽
bun run preview
```

---

## ❓ 常見問題

### Q: robots.txt 和 sitemap.xml 在哪裡？
A: `public/` 資料夾內，每次 build 時自動重新生成

### Q: 能本機測試不同域名嗎？
A: 能！建立 `.env.local`，會自動覆蓋其他設置

### Q: 如果部署時忘記改 .env.production？
A: Open Graph 會指向 `example.com`，需要重新 build 和部署

### Q: 環境變數如何使用？
A: `import.meta.env.VITE_SEO_URL` 在 TypeScript 中自動可用

---

## 📚 詳細文檔

更多信息請看 `SEO_ENV_CONFIG.md`

---

## ✅ 現在你可以：

1. ✅ **輕鬆切換域名** - 只需改 .env 文件
2. ✅ **自動生成 SEO 檔案** - build 時自動更新
3. ✅ **無需手動編輯** - robots.txt 和 sitemap.xml
4. ✅ **本機測試不同域名** - 用 .env.local 覆蓋

---

## 🎓 下一步

完成了 **修復 SEO URL** ✅

準備好做下一項了嗎？

- ✅ JSON-LD 結構化數據（1-2 小時） → +30% CTR
- ✅ 懶加載圖片（15 分鐘） → +30-50% 首屏速度

要繼續嗎？
