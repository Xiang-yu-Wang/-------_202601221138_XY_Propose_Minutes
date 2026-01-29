# Supabase 後端設定指南

## 概述

本專案使用 Supabase 作為後端，提供：
- **認證系統** - Email/密碼登入
- **PostgreSQL 資料庫** - 儲存公告與產品資料
- **Storage** - 儲存產品圖片

## 快速開始

### 步驟 1：建立 Supabase 專案

1. 前往 [supabase.com](https://supabase.com) 並註冊/登入
2. 點擊 **New Project**
3. 填寫專案名稱（例：shareholder-gifts）
4. 選擇資料庫密碼（請記住！）
5. 選擇地區（建議：Southeast Asia - Singapore）
6. 點擊 **Create new project**

### 步驟 2：執行資料庫 Schema

1. 在 Supabase Dashboard 左側選單點擊 **SQL Editor**
2. 點擊 **New query**
3. 複製 `supabase/schema.sql` 的內容貼上
4. 點擊 **Run** 執行

### 步驟 3：設定環境變數

1. 在 Supabase Dashboard 點擊 **Settings** (齒輪圖示)
2. 點擊 **API**
3. 複製以下資訊：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** (Project API keys 區塊) → `VITE_SUPABASE_ANON_KEY`

4. 在專案根目錄建立 `.env.local` 檔案：

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx
```

### 步驟 4：設定 Storage（產品圖片）

1. 在 Supabase Dashboard 點擊 **Storage**
2. 點擊 **New bucket**
3. 名稱輸入：`products`（⚠️ 必須完全一致）
4. 勾選 **Public bucket**
5. 點擊 **Create bucket**

6. 設定 Storage 政策：
   - 點擊剛建立的 `products` bucket
   - 點擊 **Policies** 標籤
   - 點擊 **New policy** → **For full customization**
   
   **政策 1 - 公開讀取（讓圖片可被訪問）：**
   - Name: `Public read access`
   - Allowed operation: `SELECT`
   - Target roles: 選擇 `anon`
   - Policy definition: `true`
   
   **政策 2 - 認證用戶可上傳：**
   - Name: `Authenticated users can upload`
   - Allowed operation: `INSERT`
   - Target roles: 選擇 `authenticated`
   - Policy definition: `true`
   
   **政策 3 - 認證用戶可刪除：**
   - Name: `Authenticated users can delete`
   - Allowed operation: `DELETE`
   - Target roles: 選擇 `authenticated`
   - Policy definition: `true`

### 步驟 5：建立管理員帳號

1. 在 Supabase Dashboard 點擊 **Authentication**
2. 點擊 **Users** 標籤
3. 點擊 **Add user** → **Create new user**
4. 輸入 Email 和密碼
5. 點擊 **Create user**

現在可以使用這個帳號登入管理後台了！

## 部署設定

### Vercel

在 Vercel 專案設定中新增環境變數：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Netlify

在 Netlify 專案設定 > Environment variables 中新增：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 資料庫結構

### announcements 表

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| title | VARCHAR(255) | 公告標題 |
| content | TEXT | 公告內容 |
| type | VARCHAR(50) | 類型：important/new/info |
| tags | TEXT[] | 標籤陣列 |
| date | DATE | 公告日期 |
| created_at | TIMESTAMPTZ | 建立時間 |
| updated_at | TIMESTAMPTZ | 更新時間 |

### products 表

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | UUID | 主鍵 |
| name | VARCHAR(255) | 產品名稱 |
| category | VARCHAR(100) | 分類 |
| price | DECIMAL(10,2) | 價格 |
| image_url | TEXT | 圖片 URL |
| description | TEXT | 描述 |
| available | BOOLEAN | 是否上架 |
| sort_order | INTEGER | 排序順序 |
| created_at | TIMESTAMPTZ | 建立時間 |
| updated_at | TIMESTAMPTZ | 更新時間 |

## Row Level Security (RLS)

資料庫啟用了 RLS：
- **讀取**：所有人都可以讀取公告和產品
- **寫入**：只有已登入的用戶可以新增/修改/刪除

## 故障排除

### 無法連線到 Supabase

1. 確認 `.env.local` 檔案存在且變數正確
2. 確認沒有多餘的空格或引號
3. 重啟開發伺服器：`bun run dev`

### 認證失敗

1. 確認 Email 確認信已點擊（如有啟用）
2. 檢查密碼是否正確
3. 在 Supabase Dashboard > Authentication > Users 確認用戶存在

### 圖片上傳失敗

1. **確認 Storage bucket 名稱正確**：必須是 `products`（不是 `product-images`）
2. **確認 bucket 設定為 public**：在 Supabase Dashboard > Storage 檢查
3. **確認 Storage 政策已設定**：
   - 需要 SELECT 政策允許 `anon` 角色
   - 需要 INSERT 政策允許 `authenticated` 角色
4. **檢查瀏覽器控制台**：按 F12 開啟開發者工具，查看 Console 中的錯誤訊息
5. **確認已登入**：只有登入後才能上傳圖片
6. **檢查檔案格式**：僅支援 JPG、PNG、GIF、WebP
7. **檢查檔案大小**：最大 5MB

## 從舊系統遷移

如果您之前使用 localStorage + GitHub Sync 模式，可以：

1. 從舊系統導出 JSON
2. 登入新的管理後台
3. 使用導入功能匯入數據

## 相關檔案

- `src/lib/supabase.ts` - Supabase 客戶端
- `src/lib/database.types.ts` - TypeScript 類型定義
- `src/composables/useAuth.ts` - 認證邏輯
- `src/composables/useSupabaseAnnouncementManager.ts` - 公告管理
- `src/composables/useSupabaseProductManager.ts` - 產品管理
- `supabase/schema.sql` - 資料庫結構
