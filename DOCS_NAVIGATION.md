# 📚 文檔總導航

> **最後更新：2026-01-29** | Supabase 雲端後端已上線！

---

## 🎯 快速導航

### 👨‍💼 給老闆 / 管理員（推薦）

| 文檔 | 說明 | 閱讀時間 |
|------|------|----------|
| 📖 **[QUICK_START_FOR_BOSS.md](QUICK_START_FOR_BOSS.md)** | 5 分鐘快速入門 | 5 分鐘 |
| 📋 **[ADMIN_PANEL_GUIDE.md](ADMIN_PANEL_GUIDE.md)** | 管理後台完整指南 | 15 分鐘 |
| 🛒 [PRODUCT_UPLOAD_QUICKSTART.md](PRODUCT_UPLOAD_QUICKSTART.md) | 產品上傳教學 | 5 分鐘 |
| 📢 [ANNOUNCEMENT_MANAGEMENT_GUIDE.md](ANNOUNCEMENT_MANAGEMENT_GUIDE.md) | 公告管理詳細指南 | 10 分鐘 |

---

### 👨‍💻 給開發者

#### 🚀 快速開始
| 文檔 | 說明 |
|------|------|
| 📘 **[README.md](README.md)** | 專案概述與技術棧 |
| 🔧 **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** | Supabase 後端設定 |
| 🔑 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | 開發者快速參考 |

#### 🔍 SEO 相關
| 文檔 | 說明 |
|------|------|
| 🌐 [SEO_QUICK_START.md](SEO_QUICK_START.md) | SEO 配置快速入門 |
| 📊 [JSON_LD_COMPLETE.md](JSON_LD_COMPLETE.md) | 結構化數據說明 |
| 🔗 [SEO_DEPLOYMENT_GUIDE.md](SEO_DEPLOYMENT_GUIDE.md) | SEO 部署指南 |

#### 📸 圖片優化
| 文檔 | 說明 |
|------|------|
| 🖼️ [RESPONSIVE_IMAGES_SUMMARY.md](RESPONSIVE_IMAGES_SUMMARY.md) | 響應式圖片摘要 |
| ⚡ [IMAGE_LAZY_LOAD_COMPLETE.md](IMAGE_LAZY_LOAD_COMPLETE.md) | 延遲載入說明 |

#### ⚡ 效能優化
| 文檔 | 說明 |
|------|------|
| 📊 [BUNDLE_ANALYSIS_REPORT.md](BUNDLE_ANALYSIS_REPORT.md) | 打包分析報告 |
| 🚀 [OPTIMIZATION_PROGRESS.md](OPTIMIZATION_PROGRESS.md) | 優化進度追蹤 |

---

### 🚀 給部署人員

| 文檔 | 說明 |
|------|------|
| ✅ **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | 部署檢查清單 |
| ⚙️ [SEO_ENV_CONFIG.md](SEO_ENV_CONFIG.md) | 環境變數配置 |
| 🖥️ [SERVER_COMPRESSION_GUIDE.md](SERVER_COMPRESSION_GUIDE.md) | 伺服器壓縮配置 |

---

### 📦 給專案經理

| 文檔 | 說明 |
|------|------|
| 📋 **[DELIVERY_SUMMARY.md](DELIVERY_SUMMARY.md)** | 完整交付清單 |
| 🗓️ [OPTIMIZATION_ROADMAP_2026.md](OPTIMIZATION_ROADMAP_2026.md) | 優化路線圖 |

---

## 🚀 30 秒快速開始

### 1. 啟動開發伺服器
```bash
bun run dev
```

### 2. 訪問管理後台
```
http://localhost:5173/admin
```

### 3. 登入
使用 **Supabase 帳號**（Email + 密碼）

### 4. 開始管理
- 📢 新增/編輯公告
- 🛒 上傳/管理產品
- 資料自動同步到雲端！

---

## 📁 專案關鍵檔案

```
根目錄/
├── .env.local                        ← Supabase 環境變數
├── README.md                         ← 專案說明
├── SUPABASE_SETUP.md                 ← Supabase 設定指南
├── ADMIN_PANEL_GUIDE.md              ← 管理後台指南
├── QUICK_START_FOR_BOSS.md           ← 老闆快速入門

src/
├── lib/
│   ├── supabase.ts                   ← Supabase 客戶端
│   └── database.types.ts             ← 資料庫類型定義
├── composables/
│   ├── useAuth.ts                    ← 認證邏輯
│   ├── useSupabaseAnnouncementManager.ts ← 公告管理
│   └── useSupabaseProductManager.ts  ← 產品管理
├── components/
│   └── AdminPanelV2.vue              ← 管理後台元件

supabase/
└── schema.sql                        ← 資料庫 Schema
```

---

## 🔧 系統架構

```
┌─────────────────────────────────────────────────────────┐
│                     前端 (Vue 3)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ AdminPanelV2│  │ Components  │  │   Views     │     │
│  └──────┬──────┘  └─────────────┘  └─────────────┘     │
│         │                                               │
│  ┌──────┴──────────────────────────────────────────┐   │
│  │              Composables                         │   │
│  │  ┌───────────┐ ┌───────────────┐ ┌───────────┐  │   │
│  │  │ useAuth   │ │ useSupabase-  │ │ useSupabase│  │   │
│  │  │           │ │ Announcement  │ │ Product    │  │   │
│  │  └───────────┘ └───────────────┘ └───────────┘  │   │
│  └──────────────────────┬──────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Supabase 雲端                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ PostgreSQL  │  │    Auth     │  │   Storage   │     │
│  │ (資料庫)    │  │ (認證系統)  │  │ (圖片儲存) │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

---

## ❓ 常見問題

### Q: 如何建立管理員帳號？
前往 Supabase Dashboard → Authentication → Users → Add user

### Q: Supabase 未配置怎麼辦？
系統會自動使用本地儲存模式（localStorage），但資料只存在當前瀏覽器。

### Q: 如何備份資料？
在管理後台點擊「導出」按鈕下載 JSON 檔案。

### Q: 忘記密碼怎麼辦？
在 Supabase Dashboard 重設用戶密碼，或使用「忘記密碼」功能（需設定）。

---

## 📞 聯絡支援

如有問題，請聯絡：
- 📱 電話：0982-571-134（贊哥）
- 💬 LINE：@792nvftc
- 📧 郵箱：playegg903@gmail.com
