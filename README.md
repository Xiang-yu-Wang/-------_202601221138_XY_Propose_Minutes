# 股東紀念品網頁 | Shareholder Gift Proxy Collection

一個現代化的 Vue 3 + TypeScript + Vite 單頁應用，用於大倉代領股東紀念品服務的營銷著陸頁。

> **🎉 新功能！** 已整合公告管理系統，讓內容管理員可直接在網頁上管理公告，無需編輯代碼！  
> 👉 快速入門指南：[QUICK_START_FOR_BOSS.md](QUICK_START_FOR_BOSS.md)

## 技術棧

- **Vue 3** - 採用 Composition API 與 `<script setup>` 語法
- **TypeScript** - 完整的型別安全
- **Vite** - 現代化的構建工具與開發伺服器
- **Tailwind CSS v4** - 功能優先的 CSS 框架，支援 CSS 變數
- **shadcn-vue** - UI 元件庫（New York 風格）
- **Lucide Vue Next** - 圖示庫
- **VueUse** - Vue Composition 公用程式集合

## 功能特性

### 🎯 核心功能
- 🎨 響應式設計，支援行動裝置
- ⚡ 快速的開發伺服器與生產構建
- 📱 流暢的頁面滾動與導航
- 🖼️ 圖庫輪播與燈箱效果
- 📧 聯絡表單與線上預約
- 💳 服務方案展示
- 🎯 虛擬滾動導航追蹤

### 🔍 SEO 與結構化數據
- 🔍 **完整 SEO 優化**（meta 標籤、sitemap、robots.txt）
- 📊 **JSON-LD 結構化數據**（9 種 Schema.org 類型，40+ 結構化片段）
- ⭐ **Google Rich Results**（FAQ、商品卡片、職位列表、評價星級）

### 📢 公告管理系統 ✨ NEW
- 🎯 **無需技術背景**即可管理公告
- ⚡ **即時同步**到首頁和公告頁面
- 💾 **備份與復原**功能（導出/導入 JSON）
- 🔐 **密碼保護**的管理後台
- 📊 **統計面板**顯示公告數量
- 📝 **分類管理**（重要/新消息/一般資訊）

**管理後台地址**: `http://localhost:5173/#/admin`（預設密碼: `admin123`）

## 專案結構

```
src/
├── App.vue                  # 主元件
├── main.ts                  # 應用入口
├── style.css                # Tailwind v4 + 主題變數
├── components/              # 頁面區塊與 UI 元件
│   ├── Navbar.vue
│   ├── HeroSection.vue
│   ├── ServicesSection.vue
│   ├── PlansSection.vue
│   ├── GallerySection.vue
│   ├── AdvantagesSection.vue
│   ├── ContactSection.vue
│   ├── FooterSection.vue
│   ├── UploadSection.vue
│   ├── AdminPanel.vue       # 🆕 公告管理面板
│   └── ui/                  # shadcn-vue 元件
├── views/                   # 頁面視圖
│   ├── HomeView.vue
│   ├── AnnouncementsView.vue
│   ├── AdminView.vue        # 🆕 管理後台頁面
│   └── ...
├── composables/             # 自訂 Vue Composition
│   ├── useScrollSpy.ts      # 滾動監控
│   ├── useSEO.ts            # SEO meta 標籤管理
│   ├── useJsonLd.ts         # JSON-LD 結構化數據
│   ├── useResourcePreload.ts # 資源預載與 Web Vitals
│   └── useAnnouncementManager.ts # 🆕 公告管理邏輯
├── data/                    # 數據管理
│   ├── announcements.ts     # 公告預設數據
│   ├── products.ts
│   └── ...
├── router/                  # Vue Router
│   └── index.ts             # 路由配置（含 /admin）
└── lib/
    └── utils.ts            # 工具函數 (cn())
```

## 快速開始

### 安裝依賴

```bash
bun install
```

### 開發模式

```bash
bun run dev
```

應用將在 [http://localhost:5173](http://localhost:5173) 開啟

**📢 管理公告**: 訪問 `http://localhost:5173/#/admin` 進入公告管理後台（預設密碼: `admin123`）

### 生產構建

```bash
bun run build
```

**Windows 用戶注意**：如果遇到建置錯誤（exit code 9），請先手動清理 dist 目錄：

```powershell
# 清理後重新建置
Remove-Item dist -Recurse -Force -ErrorAction SilentlyContinue
bun run build

# 或使用提供的清理腳本
powershell -ExecutionPolicy Bypass -File scripts/clean-dist.ps1
bun run build
```

建置產出會自動進行以下優化：
- ✅ 自動分割 vendor chunks (v
- ✅ **自動生成 SEO 檔案**（sitemap.xml、robots.txt）

**SEO 部署準備**：部署前請修改 `.env.production` 中的域名，詳見 [SEO_QUICK_START.md](SEO_QUICK_START.md)ue-vendor, ui-vendor, utils-vendor)
- ✅ CSS 代碼分割
- ✅ 移除開發用 console 語句
- ✅ Gzip 壓縮（總大小約 0.31 MB）

### 預覽生產構建

```bash
bun run preview
```

## 開發指南

### 新增 shadcn-vue 元件

```bash
bunx --bun shadcn-vue@latest add [component-name]
```

元件會被新增至 `src/components/ui/` 目錄

### 元件開發模式

所有元件使用 Vue 3 Composition API 與 `<script setup>` 語法：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

const count = ref(0)
</script>

<template>
  <Button @click="count++">Count: {{ count }}</Button>
</template>
```

### 樣式規範

- 使用 Tailwind 功能類別進行樣式設定
- 優先使用 CSS 變數進行主題自訂
- 響應式設計：使用 `md:` 和 `lg:` 斷點
- 無 scoped 樣式（僅使用 Tailwind 類別）

### 常見任務

#### 新增新的區塊
1. 在 `src/components/` 建立新元件：`[Name]Section.vue`
2. 在 `App.vue` 中匯入並使用
3. 若需導航連結，在 `Navbar.vue` 中新增
4. 如需滾動監控，更新 `useScrollSpy` 的區塊 ID

#### 修改聯絡資訊
搜尋以下關鍵字並更新：
- 電話：`0982-571-134`
- LINE：`@792nvftc`
- 郵箱：`playegg903@gmail.com`

#### 管理公告 ✨ NEW
無需編輯代碼，直接在管理後台操作：

1. **訪問管理後台**: `http://localhost:5173/#/admin`
2. **登入**: 預設密碼 `admin123`
3. **管理公告**: 
   - 新增公告 → 立即同步到首頁
   - 編輯公告 → 即時更新
   - 刪除公告 → 立即移除
   - 導出備份 → 下載 JSON 檔案
   - 導入復原 → 上傳備份恢復

**詳細說明**: 
- 給老闆: [QUICK_START_FOR_BOSS.md](QUICK_START_FOR_BOSS.md) - 5 分鐘快速入門
- 給開發者: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 快速參考卡
- 完整文檔: [ANNOUNCEMENT_MANAGEMENT_GUIDE.md](ANNOUNCEMENT_MANAGEMENT_GUIDE.md)

**修改密碼**: 編輯 `.env` 檔案中的 `VITE_ADMIN_PASSWORD`

#### 驗證 JSON-LD 結構化數據
開發環境中檢查：
```bash
# 啟動預覽服務器
bun run preview

# 訪問 http://localhost:4173
# 打開瀏覽器開發者工具
# 在 Elements/Elements 標籤搜尋 "application/ld+json"
# 應該看到多個 <script type="application/ld+json"> 標籤
```

部署後使用 Google 工具驗證：
1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. 輸入您的網址測試每個頁面
3. 檢查是否正確識別 Schema 類型

詳細說明請見 [JSON_LD_COMPLETE.md](JSON_LD_COMPLETE.md)

## 設定檔

- `components.json` - shadcn-vue 設定（風格：New York，基色：Stone）
- `vite.config.ts` - Vite 設定與路徑別名 `@/` 指向 `./src`
- `tsconfig.json` - TypeScript 設定（嚴格模式啟用）
- `.env` - 環境變數（包含管理後台密碼 `VITE_ADMIN_PASSWORD`）

## 文檔導航

### 📚 完整文檔列表
- **[DOCS_NAVIGATION.md](DOCS_NAVIGATION.md)** - 文檔總導航（推薦從這裡開始）

### 🎯 給不同角色的快速入口
- **老闆/內容管理員**: [QUICK_START_FOR_BOSS.md](QUICK_START_FOR_BOSS.md) - 5 分鐘學會管理公告
- **開發者**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 開發快速參考
- **部署人員**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - 部署檢查清單
- **項目經理**: [DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md) - 完整交付清單

### 📖 詳細文檔
- [ANNOUNCEMENT_MANAGEMENT_GUIDE.md](ANNOUNCEMENT_MANAGEMENT_GUIDE.md) - 公告系統完整指南
- [ANNOUNCEMENT_SYSTEM_COMPLETE.md](ANNOUNCEMENT_SYSTEM_COMPLETE.md) - 技術架構說明
- [SEO_QUICK_START.md](SEO_QUICK_START.md) - SEO 快速配置
- [JSON_LD_COMPLETE.md](JSON_LD_COMPLETE.md) - 結構化數據說明

## 色彩系統

主題色彩定義於 `src/style.css`（OKLCH 色彩空間）：

- **主要色彩**：翡翠綠 (Emerald-600)、蒂爾 (Teal-600)、青藍 (Cyan-700)
- **中性色**：石頭灰 (Stone)
- **支援亮暗模式**

## 聯絡方式

- 📱 電話：0982-571-134（贊哥）
- 💬 LINE：@792nvftc
- 📧 郵箱：playegg903@gmail.com

## 許可證

MIT