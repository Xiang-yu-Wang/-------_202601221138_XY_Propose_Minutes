# 📊 Bundle 分析報告

**分析時間**: 2026年1月27日  
**工具**: rollup-plugin-visualizer + 手動分析  
**目標**: 識別可優化的依賴和過大的 chunks

---

## 📦 當前 Bundle 狀態

### 總體概況

| 類型 | 大小 | 檔案數 |
|------|------|--------|
| **JavaScript** | ~260.6 KB | 23 個 |
| **CSS** | ~59.3 KB | 1 個 |
| **總計** | **~320 KB** | 24 個 |

### Top 10 最大檔案

| 檔案 | 大小 | 類型 | 佔比 |
|------|------|------|------|
| vue-ecosystem-C77XPhOm.js | 94.5 KB | Vue 相關 | 29.5% |
| index-C2QULhD0.js | 28.9 KB | 主程式 | 9.0% |
| tailwind-utils-BznqKjY6.js | 25.5 KB | Tailwind | 8.0% |
| vue-router-B-ZK6SDe.js | 25.0 KB | Router | 7.8% |
| reka-ui-C3uLQg38.js | 22.2 KB | UI 組件 | 6.9% |
| HomeView-DO3e2S-Q.js | 14.9 KB | 首頁 | 4.7% |
| index-DZHU4UqI.css | 59.3 KB | 樣式 | 18.5% |

---

## 🔍 問題識別

### 1. vue-ecosystem chunk 過大 ⚠️

**檔案**: `vue-ecosystem-C77XPhOm.js` (94.5 KB)  
**問題**: 這個 chunk 包含了 Vue 相關但非核心的依賴，佔總體積的 **29.5%**

**可能原因**:
- `@vueuse/core` 可能包含未使用的 composables
- `@vueuse/head` 完整載入
- 其他 Vue 生態工具庫

**建議優化**:
1. ✅ 使用 Tree Shaking 移除未使用的 VueUse composables
2. ✅ 檢查是否真的需要所有已導入的 composables
3. ✅ 考慮按需導入而非整包導入

**預期改善**: -15-25 KB (約 -20%)

---

### 2. Tailwind Utils 可能包含未使用的工具

**檔案**: `tailwind-utils-BznqKjY6.js` (25.5 KB)  
**問題**: Tailwind 相關工具較大

**包含內容**:
- `clsx`
- `tailwind-merge`
- `class-variance-authority`

**狀態**: ✅ 已最小化，這是必要的依賴

---

### 3. reka-ui 組件庫

**檔案**: `reka-ui-C3uLQg38.js` (22.2 KB)  
**問題**: shadcn-vue 使用的 reka-ui 組件庫

**已使用組件**:
- Button
- Card (CardContent, CardHeader, CardTitle, CardDescription)
- Dialog (DialogContent, DialogTrigger)
- Input
- Textarea
- Badge

**狀態**: ✅ 大小合理，Tree Shaking 正常工作

---

## 💡 優化建議

### 優先級 A: 高價值優化 (立即執行)

#### 1. VueUse 按需導入優化 ⭐⭐⭐⭐⭐

**當前問題**:
```typescript
import { useToggle, useEventListener, useScroll } from '@vueuse/core'
// 可能觸發整個 @vueuse/core 打包
```

**優化方案**:
```typescript
// 按需導入（如果 Tree Shaking 不生效）
import { useToggle } from '@vueuse/core/useToggle'
import { useEventListener } from '@vueuse/core/useEventListener'
```

**預期改善**: -10-20 KB

**耗時**: 15-20 分鐘

---

#### 2. 檢查未使用的 composables

**建議步驟**:
1. 搜尋所有 `from '@vueuse/core'` 導入
2. 確認每個導入都有使用
3. 移除未使用的導入

**預期改善**: -5-10 KB

**耗時**: 10-15 分鐘

---

### 優先級 B: 中等價值優化 (可選)

#### 3. Route-based Code Splitting

**當前**: 所有 View 都打包在一起  
**建議**: 使用動態導入

```typescript
// router/index.ts
const routes = [
  {
    path: '/',
    component: () => import('@/views/HomeView.vue') // 動態導入
  },
  // ...
]
```

**預期改善**: 首屏 -50-80 KB（但總體積不變）

**耗時**: 30 分鐘

---

#### 4. 移除 dev-only 代碼

檢查是否有開發專用代碼被打包：
```typescript
// 確保使用 import.meta.env.DEV 判斷
if (import.meta.env.DEV) {
  console.log(...)  // 生產環境會自動移除
}
```

**預期改善**: -2-5 KB

**耗時**: 10 分鐘

---

### 優先級 C: 低價值優化 (暫緩)

#### 5. 考慮 Lighter 替代方案

| 當前依賴 | 替代方案 | 節省 |
|---------|---------|------|
| reka-ui (22 KB) | Headless UI (更輕) | ~5-10 KB |
| class-variance-authority | 手動 class 組合 | ~3-5 KB |

**不建議**: 當前依賴體積合理，替換成本高

---

## 📈 優化潛力總結

| 優化項目 | 難度 | 耗時 | 預期節省 | ROI |
|---------|------|------|---------|-----|
| VueUse 按需導入 | 低 | 20 分鐘 | 10-20 KB | ⭐⭐⭐⭐⭐ |
| 移除未使用 composables | 低 | 15 分鐘 | 5-10 KB | ⭐⭐⭐⭐ |
| Route-based splitting | 中 | 30 分鐘 | 首屏 -50KB | ⭐⭐⭐ |
| 移除 dev 代碼 | 低 | 10 分鐘 | 2-5 KB | ⭐⭐ |

**總潛力**: -17-35 KB (約 -5-11%)

---

## ✅ 當前狀況評估

### 做得好的地方 👍

1. ✅ **Chunk 分割合理**
   - Vue core、router、ecosystem 分離
   - UI 組件獨立 chunk
   - Tailwind utils 獨立

2. ✅ **總體積可接受**
   - 320 KB 對於功能完整的 SPA 是合理的
   - 低於 Vite 預設警告閾值 (500 KB)

3. ✅ **沒有明顯的重複依賴**
   - manualChunks 配置正確
   - 沒有同一庫打包多次的問題

4. ✅ **CSS 優化良好**
   - 59.3 KB CSS 已經很精簡
   - Tailwind 按需生成工作正常

### 可改進的地方 📝

1. ⚠️ **vue-ecosystem chunk 偏大** (94.5 KB)
   - 主要問題所在
   - VueUse 可能包含未使用功能

2. ⚠️ **首屏載入可優化**
   - 可透過 Route-based splitting 改善
   - 非關鍵頁面可延遲載入

---

## 🎯 建議執行順序

### 立即執行 (本週)

1. **VueUse 優化** (20 分鐘)
   - 檢查所有 VueUse 導入
   - 確認是否全部使用
   - 考慮按需導入

2. **移除未使用代碼** (15 分鐘)
   - 檢查 composables
   - 檢查 components
   - 移除 console.log

### 下週執行 (可選)

3. **Route-based Code Splitting** (30 分鐘)
   - 改為動態導入
   - 測試首屏改善
   - 驗證所有路由正常

---

## 🔬 詳細分析方法

### 使用 rollup-plugin-visualizer

```bash
# 啟用分析模式建置
$env:ANALYZE='true'
bun run build

# 會生成 dist/stats.html，在瀏覽器開啟查看
```

**視覺化報告功能**:
- 🌳 Tree Map: 查看每個依賴的相對大小
- ☀️ Sunburst: 查看依賴層級關係
- 🔍 可互動：點擊深入查看子模組

### 使用 Vite Bundle Analyzer

```bash
bunx vite-bundle-visualizer
```

---

## 📊 與業界標準對比

| 指標 | 本專案 | 理想值 | 狀態 |
|------|--------|--------|------|
| 總體積 | 320 KB | < 500 KB | ✅ 優秀 |
| 首屏 JS | ~260 KB | < 300 KB | ✅ 良好 |
| 最大 chunk | 94.5 KB | < 100 KB | ⚠️ 接近上限 |
| CSS | 59.3 KB | < 100 KB | ✅ 優秀 |

**結論**: 當前 bundle 狀況 **整體良好**，有 5-11% 的優化空間

---

## 🚀 下一步行動

根據ROI和耗時，建議執行順序：

1. ✅ **VueUse 按需導入檢查** (20 分鐘, -10-20 KB)
2. ✅ **移除未使用 composables** (15 分鐘, -5-10 KB)
3. ⏸️ **Route-based splitting** (30 分鐘, 首屏 -50 KB) *可選*

**總耗時**: 35 分鐘（核心優化）  
**總節省**: 15-30 KB (-5-9%)

---

## 📝 相關檔案

- [vite.config.ts](vite.config.ts) - Bundle 配置
- [scripts/analyze-bundle.ps1](scripts/analyze-bundle.ps1) - 分析腳本
- dist/stats.html - 視覺化報告（執行 ANALYZE=true 建置後生成）

---

**結論**: Bundle 狀況良好，主要優化機會在 VueUse。建議優先執行 VueUse 按需導入檢查，投入 35 分鐘可節省 15-30 KB。✨
