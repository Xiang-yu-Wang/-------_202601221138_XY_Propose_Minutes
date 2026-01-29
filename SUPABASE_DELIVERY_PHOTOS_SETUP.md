# 交貨照功能 - Supabase 設定指南

## 📋 概述

交貨照管理功能現已升級為使用 **Supabase 雲端資料庫**，這意味著：

1. ✅ 在管理後台新增/修改/刪除的交貨照會自動同步到雲端
2. ✅ 正式網站（GitHub Pages）會自動顯示最新的交貨照
3. ✅ 不需要手動觸發任何同步操作

---

## 🔧 設定步驟

### 步驟 1：登入 Supabase

1. 前往 [Supabase Dashboard](https://app.supabase.com)
2. 登入您的帳號
3. 選擇您的專案

### 步驟 2：建立 delivery_photos 表

1. 點擊左側選單的 **SQL Editor**
2. 點擊 **+ New query**
3. 複製貼上以下 SQL：

```sql
-- 建立 delivery_photos 表
CREATE TABLE IF NOT EXISTS delivery_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  location VARCHAR(100) NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 建立索引優化查詢
CREATE INDEX IF NOT EXISTS idx_delivery_photos_date ON delivery_photos(date DESC);
CREATE INDEX IF NOT EXISTS idx_delivery_photos_location ON delivery_photos(location);

-- 啟用 RLS (Row Level Security)
ALTER TABLE delivery_photos ENABLE ROW LEVEL SECURITY;

-- 公開讀取政策（任何人都可以查看）
CREATE POLICY "公開讀取交貨照" ON delivery_photos
  FOR SELECT USING (true);

-- 認證用戶可以新增、更新、刪除
CREATE POLICY "認證用戶可管理交貨照" ON delivery_photos
  FOR ALL USING (auth.role() = 'authenticated');

-- 如果不需要認證限制，可以改用這個（允許任何人管理）：
-- CREATE POLICY "任何人可管理交貨照" ON delivery_photos FOR ALL USING (true);

-- 啟用即時更新 (Realtime)
ALTER PUBLICATION supabase_realtime ADD TABLE delivery_photos;
```

4. 點擊 **Run** 執行

### 步驟 3：新增初始數據（可選）

如果想要新增一些範例數據，執行以下 SQL：

```sql
INSERT INTO delivery_photos (url, title, description, date, location) VALUES
  ('https://cdn.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1920,f_auto,q_auto/10109401/221215_2_hdvbyu.png', '台北地區交貨', '客戶收到紀念品開心合影', '2024-12-15', '台北市'),
  ('https://cdn.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1920,f_auto,q_auto/10109401/496585_medium.png', '新竹園區交貨', '科技園區順利完成配送', '2024-11-20', '新竹市'),
  ('https://cdn.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1920,f_auto,q_auto/10109401/353377_medium.png', '台中美食節交貨', '中部地區大量訂單完成', '2024-10-08', '台中市');
```

---

## 📱 如何使用

### 管理交貨照

1. 開啟網站 → 點擊右下角「⚙️ 管理」按鈕
2. 選擇「🖼️ 交貨照管理」標籤
3. 點擊「新增交貨照」填寫資料
4. 儲存後會自動同步到雲端！

### 支援的圖片來源

- **Strikingly CDN**：原網站使用的圖床
- **Imgur**：`https://i.imgur.com/xxx.jpg`
- **Cloudinary**：`https://res.cloudinary.com/...`
- **其他公開圖床**：任何 `https://` 開頭的圖片網址

---

## 🔄 自動同步說明

| 操作 | 效果 |
|------|------|
| 新增交貨照 | 立即同步到雲端，所有用戶可見 |
| 編輯交貨照 | 立即同步到雲端 |
| 刪除交貨照 | 立即從雲端移除 |

> **注意**：如果 Supabase 未配置，系統會自動使用本地存儲（localStorage）作為備援。

---

## ❓ 常見問題

### Q: 為什麼正式網站沒有更新？

A: 請確認：
1. Supabase 表已建立
2. `.env.local` 中的 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 已設定
3. 網站已部署最新版本

### Q: 看到 "Supabase 環境變數未設定" 警告？

A: 這表示環境變數未配置，系統會使用本地存儲。要連接雲端，請在 `.env.local` 加入：

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Q: 如何備份數據？

A: 在管理後台點擊「導出 JSON」按鈕，可以下載所有交貨照數據的備份檔案。

---

## 📂 相關檔案

- `supabase/delivery_photos.sql` - 資料庫 schema
- `src/composables/useSupabaseDeliveryPhotoManager.ts` - Supabase 管理邏輯
- `src/components/admin/AdminDeliveryPhotosTab.vue` - 管理介面
- `src/components/DeliveryPhotosSection.vue` - 前台顯示

