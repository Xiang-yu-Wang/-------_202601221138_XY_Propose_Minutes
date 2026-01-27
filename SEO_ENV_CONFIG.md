# SEO 環境變數配置指南

## 概述

所有 SEO 相關的域名配置已遷移至環境變數系統，方便在不同環境中快速切換。

## 文件結構

```
.env                    # 開發環境配置（預設 localhost:5173）
.env.production        # 生產環境配置（需要修改為實際域名）
.env.local             # 本機個人覆蓋（.gitignore 已忽略，不上傳）
scripts/
  └─ generate-seo-files.js  # 構建時自動生成 robots.txt 和 sitemap.xml
```

## 使用說明

### 開發環境（本機開發）

```bash
npm run dev
```
- 自動使用 `.env` 中的配置
- 域名：`http://localhost:5173`
- Open Graph 和 Canonical 連結都指向本機

### 生產環境（部署前必做）

#### 步驟 1：修改 .env.production

```bash
# .env.production

# 改成你的實際域名
VITE_SEO_URL=https://yourdomain.com
VITE_APP_TITLE=大倉代領股東紀念品 | 專業股東禮品代領服務
```

**常見域名示例：**
```
# 台灣域名
https://dakura.com.tw
https://www.dakura.com.tw
https://股東紀念品.tw

# 國際域名
https://dakura.com
https://shareholder-gifts.com

# 子域名
https://app.dakura.com
https://service.dakura.com.tw
```

#### 步驟 2：執行構建

```bash
npm run build
```

**會自動執行：**
1. ✅ `scripts/generate-seo-files.js` 生成 `robots.txt` 和 `sitemap.xml`
2. ✅ 類型檢查 (`vue-tsc`)
3. ✅ Vite 構建

**自動生成的文件：**
- `public/robots.txt` - 搜尋引擎爬蟲指示
- `public/sitemap.xml` - 網站地圖

#### 步驟 3：驗證

```bash
npm run preview
```

檢查：
1. 用瀏覽器開發者工具檢查 `<meta property="og:url">`
2. 確認 Canonical 連結是否正確
3. 檢查 `robots.txt` 和 `sitemap.xml` 是否包含正確域名

### 本機臨時測試（.env.local）

如果想在本機測試不同的域名（例如測試域名），可以建立 `.env.local`：

```bash
# .env.local (本機個人配置，不上傳)

VITE_SEO_URL=https://staging.dakura.com
```

**優先級：** `.env.local` > `.env.production` > `.env`

**提示：** `.env.local` 已在 `.gitignore` 中，不會被提交到 Git，適合本機測試用。

---

## 環境變數應用位置

### 1. TypeScript 代碼（自動更新）

**`src/composables/useSEO.ts`**
```typescript
const baseURL = import.meta.env.VITE_SEO_URL as string

// 自動用於：
// - Open Graph og:url
// - Canonical 連結
// - Twitter Card
// - 所有動態生成的 meta 連結
```

### 2. 靜態文件（構建時生成）

**`public/robots.txt`** - 自動生成
```
Sitemap: https://yourdomain.com/sitemap.xml
```

**`public/sitemap.xml`** - 自動生成
```xml
<loc>https://yourdomain.com/</loc>
<loc>https://yourdomain.com/#/services</loc>
...
```

### 3. HTML Meta 標籤（index.html - 保持預設）

`index.html` 的靜態 meta 標籤保持預設值，因為：
- 會被 `useSEO.ts` 的動態標籤覆蓋
- 靜態 meta 只是 fallback

---

## 常見問題

### Q1：為什麼要分 .env 和 .env.production？

**A：** Vite 會根據環境自動載入對應文件
- `npm run dev` → 使用 `.env` + `.env.local`
- `npm run build` → 使用 `.env.production` + `.env.local`

這樣開發不會誤觸生產 URL。

### Q2：robots.txt 和 sitemap.xml 怎麼更新？

**A：** 每次執行 `npm run build` 都會自動重新生成：
1. 讀取 `VITE_SEO_URL` 環境變數
2. 生成新的 `robots.txt` 和 `sitemap.xml`
3. 放入 `public/` 資料夾

**無需手動編輯這些文件！**

### Q3：如果忘記修改 .env.production 會怎樣？

**A：** 部署後會有問題：
- ❌ Open Graph 連結仍指向 `example.com`
- ❌ Canonical 連結錯誤
- ❌ robots.txt 和 sitemap.xml 仍是 `example.com`
- ❌ Google Search Console 無法驗證

**解決：** 修改 `.env.production` 後重新 `npm run build` 和部署。

### Q4：如何驗證域名配置是否正確？

**A：** 部署後在瀏覽器開發者工具檢查：

```javascript
// Console 執行
document.querySelector('meta[property="og:url"]')?.getAttribute('content')
// 應該返回 https://yourdomain.com/current-page
```

或在網頁原始碼查看：
```html
<meta property="og:url" content="https://yourdomain.com/">
<link rel="canonical" href="https://yourdomain.com/">
```

---

## 部署檢查清單

部署前務必檢查：

- [ ] 修改 `.env.production` 中的 `VITE_SEO_URL`
- [ ] 執行 `npm run build` 重新生成靜態文件
- [ ] 檢查 `robots.txt` 中的 Sitemap URL
- [ ] 檢查 `sitemap.xml` 中的所有 `<loc>` 標籤
- [ ] 用 Google Rich Results Test 驗證 meta 標籤
- [ ] 提交到 Google Search Console
- [ ] 檢查 Open Graph 社群分享預覽

---

## 何時需要修改

| 場景 | 需要修改 | 檔案 |
|------|----------|------|
| 域名變更 | ✅ | `.env.production` |
| 上線前準備 | ✅ | `.env.production` |
| 本機測試其他域名 | ✅ | `.env.local` |
| 開發階段 | ❌ | 無需修改，自動用 localhost |
| 新增頁面 | ❌ | `scripts/generate-seo-files.js` 自動涵蓋 |

---

## 技術細節

### 如何添加新的環境變數

如果未來需要添加新的環境變數（例如 `VITE_ANALYTICS_ID`）：

1. 在 `.env` 和 `.env.production` 中定義
2. 在 TypeScript 中使用：
   ```typescript
   const analyticsId = import.meta.env.VITE_ANALYTICS_ID as string
   ```
3. 重新運行相應命令

**注意：** Vite 只會暴露 `VITE_` 前綴的環境變數給前端代碼。

### 環境變數的優先級

```
.env.local > .env.production/.env > 硬編碼預設值
```

所以在本機測試時，`.env.local` 會覆蓋 `.env.production`。

---

## 快速參考

```bash
# 開發
npm run dev

# 部署前（必做！）
# 1. 編輯 .env.production，改域名
# 2. 執行 build
npm run build

# 預覽生產構建
npm run preview
```

---

**有問題？** 檢查 `scripts/generate-seo-files.js` 的註釋說明。
