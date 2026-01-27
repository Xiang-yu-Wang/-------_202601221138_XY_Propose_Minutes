# SEO 優化部署指南

## 已實施的 SEO 功能

### 1. 動態 Meta 標籤管理 ✅
- 每個頁面自動設置 `<title>` 和 `<meta name="description">`
- Open Graph 標籤（og:title, og:description, og:image）用於社群分享
- Twitter Card 標籤
- 規範化連結（canonical URL）防止重複內容

**實現方式：**
- `src/data/seo.ts` - 定義各頁面的 SEO 配置
- `src/composables/useSEO.ts` - 使用 @vueuse/head 動態管理 meta 標籤
- `src/App.vue` - 在根組件啟用 SEO composable

### 2. Robots.txt ✅
- 位置：`public/robots.txt`
- 允許所有搜尋引擎爬蟲

### 3. Sitemap.xml ✅
- 位置：`public/sitemap.xml`
- 列出所有主要頁面
- 包含 lastmod 和 changefreq 資訊

## 部署後的步驟

### 1. 更新 SEO 配置中的基礎 URL
編輯 `src/composables/useSEO.ts`，將：
```typescript
const baseURL = import.meta.env.PROD ? 'https://example.com' : 'http://localhost:5173'
```
改為您的實際域名，例如：
```typescript
const baseURL = import.meta.env.PROD ? 'https://yoursite.com' : 'http://localhost:5173'
```

### 2. 更新 robots.txt 和 sitemap.xml
編輯 `public/robots.txt` 和 `public/sitemap.xml`，將 `https://example.com` 改為您的實際域名。

### 3. 提交到搜尋引擎
完成部署後：
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster Tools: https://www.bing.com/webmasters
- 提交 sitemap.xml URL

## SEO 檢查清單
- ✅ 每頁有獨特的 title 和 description
- ✅ Open Graph 標籤已設置
- ✅ Robots.txt 已配置
- ✅ Sitemap.xml 已配置
- ✅ Mobile-friendly 設計（響應式）
- ✅ 頁面加載速度優化（Gzip 壓縮）
- ⏳ 下步優化建議：
  - Google Analytics 追蹤
  - 結構化數據（JSON-LD）
  - 反向連結建設

## 頁面 SEO 配置概覽

| 頁面 | Title | Keywords |
|------|-------|----------|
| 首頁 | 大倉代領股東紀念品 \| 專業股東禮品代領服務 | 股東紀念品,代領,一股,股票代購 |
| 服務介紹 | 服務介紹 \| 大倉代領股東紀念品 | 股東紀念品,代領服務,代購股票 |
| 方案說明 | 方案說明 \| 大倉代領股東紀念品 | 方案,全餐,收費 |
| 交貨實績 | 交貨實績 \| 大倉代領股東紀念品 | 交貨,實績,代領成果 |
| 商品 | 商品區 \| 大倉代領股東紀念品 | 商品,禮品,購物 |
| 聯絡我們 | 聯絡我們 \| 大倉代領股東紀念品 | 聯絡,電話,LINE,客服 |
