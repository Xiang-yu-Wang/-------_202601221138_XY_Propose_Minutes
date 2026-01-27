# 優化路線圖 2026

**專案狀態概覽**
- 技術棧：Vue 3 + TypeScript + Vite + Tailwind CSS v4
- 現狀：響應式圖片、字體預載、JSON-LD、虛擬滾動已實現；建置流程在 Windows 編碼環境下偶發非零結束碼（但 dist 產生正常）
- 目標：穩定性、效能、可維運性、SEO 進一步提升

---

## 第一階段：已完成 ✅

### 1. 移除干擾建置的依賴 (成本: S - 已完成)
- **項目**：移除 `terser`、`vite-plugin-compression` 從 devDependencies
- **原因**：避免 Vite 在 Windows 上誤切換到 Terser（易崩潰）或啟用壓縮流程
- **影響**：建置更穩定、流程一致
- **狀態**：✅ 已修改 package.json，bun.lock 已更新

### 2. 新增分析與 CI 基礎設施 (成本: S - 已完成)
- **項目**：
  - 新增 `analyze` 指令：`ANALYZE=true bun run build` → 產生 dist/stats.html
  - 新增 GitHub Actions CI：[\.github/workflows/ci.yml](.github/workflows/ci.yml)
  - 強化 .gitignore（Bun 暫存、鎖檔、stats 報告）
- **原因**：提高可觀測性、快速定位建置問題、每次提交可驗證
- **影響**：
  - Bundle 視覺化分析更便利
  - CI 每次 push/PR 自動驗證
  - 構建 artifact 可下載（dist + stats）
- **狀態**：✅ 已部署，可在 GitHub Actions 中查看執行結果

---

## 第二階段：高優先級（建議近期實施）

### 3. 解決 Windows 路徑編碼問題 (成本: S)
- **項目**：將專案移至 ASCII 路徑（如 `C:\workspace\project`）
- **原因**：
  - Vite 7.3.1 在 Windows 中文路徑下，工具鏈路徑解析出現亂碼
  - 造成建置流程回傳非零退出碼（實際產出正常，但程序狀態異常）
  - 影響 CI/CD 與本地 bunx 直呼行為一致性
- **影響**：
  - ✅ 排除奇異編碼問題
  - ✅ 改善開發體驗（路徑簡化）
  - ✅ CI 流程更穩定（無路徑差異）
- **預期工作**：
  - 複製或移動專案資料夾到純英數路徑
  - 重新 `bun install && bun run build` 驗證
  - Git 重新初始化或修改 remote（可選，若用新路徑）
- **風險**：低（純資料夾搬遷，無邏輯改變）
- **優先級**：**🔴 最高** - 建置穩定性根基

### 4. 伺服器層壓縮策略確認 (成本: S)
- **項目**：
  - 維持「打包期無壓縮」的設計（已在 vite.config.ts）
  - 於部署目標（Nginx/Apache/Vercel/Netlify）啟用 Gzip/Brotli
  - 驗證 `Content-Encoding: gzip` 與 `Vary: Accept-Encoding` 回應頭
- **原因**：
  - 伺服器壓縮比打包期壓縮更穩定、高效
  - 減少本地 Windows 工具鏈負擔
  - 現代 CDN/主機商均內建壓縮支援
- **影響**：
  - ✅ 建置速度提升（跳過壓縮階段）
  - ✅ 部署更快（傳輸體積已在伺服器壓縮）
  - ✅ 更新快取規則簡化（不涉及 .gz 檔管理）
- **檢驗清單**：
  - [ ] Nginx 配置：啟用 `gzip on; gzip_vary on;`
  - [ ] 驗證回應：`curl -I https://你的域名 | grep -i content-encoding`
  - [ ] Lighthouse 測試：確認無 gzip 警告
- **優先級**：**🟠 高** - 效能與穩定性並行

### 5. Web Vitals 與前端錯誤監控 (成本: S-M)
- **項目**：
  - 導入 `web-vitals` package：測量 LCP、CLS、INP、FID、TTFB
  - 簡易錯誤上報：catch 全局 JS 錯誤與未處理 Promise rejection
  - 選定監控後端：Sentry（免費方案）/ 自建簡易 API
- **原因**：
  - 掌握線上使用者體驗數據
  - 快速定位線上問題（客戶端視角）
  - 對轉換率影響有量化依據
- **影響**：
  - ✅ 品質可量測、可驗證
  - ✅ 問題響應更快
  - ✅ 優化決策有數據支撐
- **實施範例**：
  ```typescript
  // src/composables/useWebVitals.ts
  import { getCLS, getFCP, getFID, getLCP, getTTFB } from 'web-vitals'
  
  export function useWebVitals() {
    getCLS(metric => console.log('CLS:', metric.value))
    getLCP(metric => console.log('LCP:', metric.value))
    // ...
    // 上報至 Sentry 或自定義 API
  }
  ```
- **成本估計**：
  - 集成時間：30-60 分鐘
  - 依賴：+1 package（web-vitals）
  - Sentry 帳號設置：免費
- **優先級**：**🟠 高** - 數據驅動優化的基礎

---

## 第三階段：中優先級（1-2 週內考慮）

### 6. 版本鎖定與依賴管理 (成本: S)
- **項目**：
  - 在 package.json 中鎖定關鍵依賴版本（去除 ^，改用 ~）
  - CI 固定 Node/Bun 版本
  - 定期依賴更新流程（月度 security 檢查）
- **原因**：
  - 避免 minor/patch 更新帶來 breaking changes
  - 減少「今天能 build 明天不能」的變動性
  - 團隊間環境一致
- **例示**：
  ```json
  "vite": "~7.3.1",
  "@tailwindcss/vite": "~4.1.18",
  "vue": "~3.5.24"
  ```
- **優先級**：**🟡 中** - 中長期穩定性

### 7. 前端檢查與風格管理 (成本: M)
- **項目**：
  - ESLint + Prettier：程式風格一致化
  - Lint-staged：commit 前自動檢查
  - TypeScript strict 模式驗證
  - Lighthouse CI：PR 預算檢查（JS < 250KB gzip、LCP < 2.5s）
- **原因**：
  - 減少回歸、加速 Code Review
  - 效能預算明確化
  - 新手上車成本低
- **影響**：
  - ✅ 程式品質一致
  - ✅ 構建流程自動化
  - ✅ 性能目標可持續
- **實施**：
  ```bash
  bun add -d eslint prettier @typescript-eslint/{parser,plugin}
  # 新增 .eslintrc.cjs, .prettierrc.json, .husky（可選）
  ```
- **優先級**：**🟡 中** - 團隊規模增長時必需

### 8. PWA 與離線快取策略 (成本: M)
- **項目**：
  - 集成 Vite PWA plugin 或 Workbox
  - 定義快取策略：HTML 短快取、資產長快取
  - Icon、manifest 配置
- **原因**：
  - 回訪速度快
  - 網路不穩定下可用
  - 行動體驗更佳
- **影響**：
  - ✅ 轉換率可能提升 5-15%
  - ✅ Core Web Vitals 改善（FCP/LCP）
  - ✅ 行動友善性提升
- **配置示例**：
  ```typescript
  // vite.config.ts 中
  import { VitePWA } from 'vite-plugin-pwa'
  
  plugins: [
    VitePWA({
      manifest: { ... },
      workbox: {
        runtimeCaching: [ ... ]
      }
    })
  ]
  ```
- **成本估計**：2-4 小時
- **優先級**：**🟡 中** - 行動端轉換關鍵

### 9. 內容預渲染評估 (成本: L)
- **項目**：
  - 研究 `vite-ssg`（靜態網站生成）可行性
  - 若內容穩定，預渲染為靜態 HTML
  - 結合動態部分（表單、API）
- **原因**：
  - 進一步改善 SEO（靜態 HTML 原生支援）
  - 首屏時間最短（無 JS 初始化延遲）
  - CDN 快取友善
- **前提**：
  - 頁面內容相對固定（非高頻動態更新）
  - 本專案為行銷落地頁，適合候選
- **影響**：
  - ✅ Lighthouse 得分可達 95+
  - ✅ 首屏完全可見時間 < 1s（取決於網路）
  - ✅ SEO 排名可能進一步提升
- **風險**：
  - 構建時間增加（需逐頁預渲染）
  - 動態內容適配複雜
- **優先級**：**🟡 中-低** - SEO 極度關鍵時優先

---

## 第四階段：低優先級（長期考慮）

### 10. 圖片與資產規範化 (成本: M)
- **項目**：
  - 建立圖片產出工具（自動轉 WebP/AVIF、限制寬度）
  - 補充 `useResponsiveImage` 使用覆蓋率檢查
  - 建立資產命名與組織規範
- **原因**：
  - 確保一致的資產交付
  - 避免單一大檔回退
  - 新加圖片品質保證
- **優先級**：**🟢 低** - 維護性加強

### 11. 頁面預取與互動優化 (成本: M)
- **項目**：
  - 根據使用者行為，`prefetch` 關鍵資源
  - 優化動畫與過渡（保守以免影響 INP）
  - 細化互動邊界（lazy boundary）
- **原因**：
  - 轉換路徑更順滑
  - 降低互動延遲感知
- **優先級**：**🟢 低** - 已有虛擬滾動基礎

### 12. 結構化資料完整性檢查 (成本: S)
- **項目**：
  - 補充 FAQPage、LocalBusiness、BreadcrumbList 等 JSON-LD
  - 驗證 Rich Snippets 在 Google Search Console 顯示
  - 定期檢查 schema 有效性
- **原因**：
  - Rich Results 提升點擊率 20-30%
- **優先級**：**🟡 中** - 已有 JSON-LD 基礎，補全快速

---

## 成本與優先級矩陣

| 優化項目 | 成本 | 優先級 | 影響 | 推薦時間 |
|---------|------|--------|------|---------|
| 移除干擾依賴 | S | 🔴 | 建置穩定 | ✅ 已完成 |
| 分析與 CI | S | 🔴 | 可觀測性 | ✅ 已完成 |
| **路徑編碼修復** | **S** | **🔴** | **穩定性** | **本週** |
| **伺服器壓縮確認** | **S** | **🟠** | **效能** | **本週** |
| **Web Vitals** | **S-M** | **🟠** | **數據驅動** | **1-2 天** |
| 版本鎖定 | S | 🟡 | 中長期穩定 | 1-2 週 |
| ESLint/Prettier | M | 🟡 | 程式品質 | 2-3 週 |
| PWA 與快取 | M | 🟡 | 轉換率 | 2-3 週 |
| 內容預渲染評估 | L | 🟡 | SEO 極優 | 1 個月 |
| 圖片規範 | M | 🟢 | 維護性 | 1 個月 |
| 頁面預取 | M | 🟢 | 互動流暢 | 1 個月 |
| 結構化資料完整性 | S | 🟡 | SEO | 1-2 週 |

---

## 後續步驟建議

### 本週（優先）
1. [ ] 移至 ASCII 路徑 → `bun install && bun run build` 驗證穩定性
2. [ ] 確認伺服器壓縮設定（Nginx/CDN）
3. [ ] 集成 web-vitals 與簡易錯誤上報

### 1-2 週內
4. [ ] 補充結構化資料（FAQPage、LocalBusiness）
5. [ ] 版本鎖定 package.json 關鍵依賴
6. [ ] ESLint + Prettier 基礎設置

### 2-4 週內
7. [ ] PWA 集成與快取策略設計
8. [ ] Lighthouse CI 預算設置

### 長期（1 個月+）
9. [ ] 內容預渲染可行性研究
10. [ ] 圖片與資產規範化工具建立

---

## 關鍵 KPI 監控

| 指標 | 現狀 | 目標 | 檢驗方式 |
|------|------|------|---------|
| Lighthouse Score | 待驗 | 90+ | PageSpeed Insights |
| LCP | < 3s（推估） | < 2.5s | web-vitals 上報 |
| CLS | < 0.1（推估） | < 0.05 | web-vitals 上報 |
| JS Bundle (gzip) | ~60-70 KB | < 80 KB | `bun run analyze` → stats.html |
| Build Time | ~2-3s | < 3s | CI 日誌 |
| Uptime | 待部署 | 99.9% | 監控服務 |

---

## 資源與參考

- **Vite 官方文件**：https://vitejs.dev
- **Tailwind CSS v4**：https://tailwindcss.com
- **Web Vitals**：https://web.dev/vitals/
- **Sentry**：https://sentry.io
- **PWA**：https://web.dev/progressive-web-apps/
- **結構化資料**：https://schema.org

---

**更新日期**：2026-01-27  
**責任人**：XY  
**狀態**：🔄 進行中
