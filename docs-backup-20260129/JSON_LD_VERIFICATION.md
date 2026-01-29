# ✅ JSON-LD 驗證檢查表

## 本地開發環境驗證

### 步驟 1：啟動預覽服務器
```bash
bun run build
bun run preview
```

### 步驟 2：瀏覽器檢查

訪問各頁面並按 F12 打開開發者工具：

#### 首頁 `http://localhost:4173/`
在 Elements 標籤搜尋 `application/ld+json`，應看到：
- [ ] `@type: "Organization"` - 組織資訊
- [ ] `@type: "WebSite"` - 網站資訊
- [ ] `@type: "LocalBusiness"` - 本地商家（含評分）
- [ ] `@type: "Service"` - 服務項目
- [ ] `@type: "FAQPage"` - 常見問題
- [ ] `@type: "Review"` (×4) - 客戶評價

**預期總數**：約 7-10 個 `<script type="application/ld+json">` 標籤

#### 服務頁 `http://localhost:4173/services`
- [ ] `@type: "Organization"`
- [ ] `@type: "WebSite"`
- [ ] `@type: "Service"`
- [ ] `@type: "BreadcrumbList"` - 麵包屑

**預期總數**：4 個

#### 商品頁 `http://localhost:4173/products`
- [ ] `@type: "Organization"`
- [ ] `@type: "WebSite"`
- [ ] `@type: "ItemList"` - 商品列表（最多 10 個商品）
- [ ] `@type: "BreadcrumbList"`

**預期總數**：4 個

#### 招募頁 `http://localhost:4173/recruitment`
- [ ] `@type: "Organization"`
- [ ] `@type: "WebSite"`
- [ ] `@type: "JobPosting"` (×3) - 三個職位
- [ ] `@type: "BreadcrumbList"`

**預期總數**：6 個

#### 其他頁面（方案、交貨、公告、社群、上傳、聯絡）
- [ ] `@type: "Organization"`
- [ ] `@type: "WebSite"`
- [ ] `@type: "BreadcrumbList"`

**預期總數**：3 個

---

## 快速驗證腳本（可選）

在瀏覽器 Console 執行：

```javascript
// 檢查所有 JSON-LD scripts
const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
console.log(`找到 ${jsonLdScripts.length} 個 JSON-LD 標籤`)

jsonLdScripts.forEach((script, index) => {
  try {
    const data = JSON.parse(script.textContent)
    console.log(`${index + 1}. @type: ${data['@type']}`)
    if (data['@type'] === 'FAQPage') {
      console.log(`   - FAQ 數量: ${data.mainEntity?.length || 0}`)
    }
    if (data['@type'] === 'ItemList') {
      console.log(`   - 商品數量: ${data.itemListElement?.length || 0}`)
    }
    if (data['@type'] === 'LocalBusiness') {
      console.log(`   - 評分: ${data.aggregateRating?.ratingValue || 'N/A'}`)
    }
  } catch (e) {
    console.error(`解析錯誤: ${e.message}`)
  }
})
```

---

## 部署後線上驗證

### Google Rich Results Test

1. 訪問：https://search.google.com/test/rich-results
2. 輸入您的網址
3. 等待測試完成

#### 首頁應通過的測試
- ✅ Organization
- ✅ LocalBusiness
- ✅ FAQPage（8 個問題）
- ⚠️ Review 可能不顯示（需要足夠評價數量）

#### 商品頁應通過的測試
- ✅ Organization
- ✅ Product（商品卡片）

#### 招募頁應通過的測試
- ✅ Organization
- ✅ JobPosting（職位列表）

### Schema.org Validator

1. 訪問：https://validator.schema.org/
2. 輸入您的網址
3. 檢查所有 Schema 無錯誤

---

## 常見問題排查

### 問題 1：看不到 JSON-LD 標籤
**原因**：JSON-LD 是動態注入的（Vue 運行時）  
**解決**：
1. 確保頁面完全加載
2. 在 Elements 標籤搜尋 `ld+json`
3. 檢查 `<head>` 區域

### 問題 2：JSON 格式錯誤
**原因**：TypeScript 編譯錯誤  
**解決**：
```bash
bunx tsc --noEmit
# 修復所有 TypeScript 錯誤
```

### 問題 3：Schema 類型不符預期
**原因**：路由路徑不匹配  
**解決**：檢查 `useJsonLd.ts` 中的 `getPageSchemas` 邏輯

### 問題 4：商品頁無 ItemList
**原因**：未傳入 products 數據  
**解決**：確認 `ProductsView.vue` 有：
```typescript
import { products } from '@/data/products'
useJsonLd({ products })
```

### 問題 5：招募頁無 JobPosting
**原因**：未傳入 positions 數據  
**解決**：確認 `RecruitmentView.vue` 有：
```typescript
import { positions } from '@/data/positions'
useJsonLd({ positions })
```

---

## Google Search Console 監控（部署後）

### 增強功能檢查

1. 登入 Google Search Console
2. 前往「增強功能」
3. 檢查以下項目：

#### FAQ 豐富結果
- 狀態：應為「有效」
- 頁面數：至少 1（首頁）
- 問題數：8 個

#### 產品
- 狀態：應為「有效」
- 頁面數：1（商品頁）
- 產品數：6 個

#### 職位發布
- 狀態：應為「有效」
- 頁面數：1（招募頁）
- 職位數：3 個

#### 麵包屑
- 狀態：應為「有效」
- 頁面數：9（所有內頁）

### 預期時間表

| 時間點 | 預期結果 |
|-------|---------|
| 部署後 1-3 天 | Google 開始爬取新結構 |
| 部署後 1 週 | 結構化數據開始在 Search Console 顯示 |
| 部署後 2 週 | FAQ、Product 在搜尋結果顯示 |
| 部署後 1 個月 | 完整 Rich Results 效果顯現 |

---

## 成功指標

### 技術指標
- ✅ 所有頁面 JSON-LD 無錯誤
- ✅ Google Rich Results Test 通過
- ✅ Schema.org Validator 無警告

### SEO 指標（部署後 1 個月）
- ✅ 搜尋曝光 +50-100%
- ✅ 點擊率（CTR）+30-50%
- ✅ FAQ 點擊來源 >20 次/週
- ✅ Google Jobs 流量 >50 次/月

---

**檢查表版本**：1.0  
**更新日期**：2026年1月27日  
**相關文檔**：[JSON_LD_COMPLETE.md](JSON_LD_COMPLETE.md)
