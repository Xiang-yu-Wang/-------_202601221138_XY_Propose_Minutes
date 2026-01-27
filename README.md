# 股東紀念品網頁 | Shareholder Gift Proxy Collection

一個現代化的 Vue 3 + TypeScript + Vite 單頁應用，用於大倉代領股東紀念品服務的營銷著陸頁。

## 技術棧

- **Vue 3** - 採用 Composition API 與 `<script setup>` 語法
- **TypeScript** - 完整的型別安全
- **Vite** - 現代化的構建工具與開發伺服器
- **Tailwind CSS v4** - 功能優先的 CSS 框架，支援 CSS 變數
- **shadcn-vue** - UI 元件庫（New York 風格）
- **Lucide Vue Next** - 圖示庫
- **VueUse** - Vue Composition 公用程式集合

## 功能特性

- 🎨 響應式設計，支援行動裝置
- ⚡ 快速的開發伺服器與生產構建
- 📱 流暢的頁面滾動與導航
- 🖼️ 圖庫輪播與燈箱效果
- 📧 聯絡表單與線上預約
- 💳 服務方案展示
- 🎯 虛擬滾動導航追蹤

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
│   └── ui/                  # shadcn-vue 元件
├── composables/             # 自訂 Vue Composition
│   └── useScrollSpy.ts
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
- ✅ 自動分割 vendor chunks (vue-vendor, ui-vendor, utils-vendor)
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

## 設定檔

- `components.json` - shadcn-vue 設定（風格：New York，基色：Stone）
- `vite.config.ts` - Vite 設定與路徑別名 `@/` 指向 `./src`
- `tsconfig.json` - TypeScript 設定（嚴格模式啟用）

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