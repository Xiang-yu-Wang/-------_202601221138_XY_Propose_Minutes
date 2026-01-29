-- ============================================
-- 股東紀念品網頁 Supabase 資料庫結構
-- ============================================

-- 啟用 UUID 擴展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. 公告表 (announcements)
-- ============================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (type IN ('important', 'new', 'info')),
  tags TEXT[] DEFAULT '{}',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立更新時間觸發器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_announcements_updated_at
  BEFORE UPDATE ON announcements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. 產品表 (products)
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  image_url TEXT, -- 使用 Supabase Storage URL
  description TEXT,
  available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. 管理員表 (admin_users) - 可選
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS) 政策
-- ============================================

-- 公告表 RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- 所有人可以讀取公告
CREATE POLICY "公告公開讀取" ON announcements
  FOR SELECT USING (true);

-- 只有已認證用戶可以新增/修改/刪除公告
CREATE POLICY "已認證用戶可管理公告" ON announcements
  FOR ALL USING (auth.role() = 'authenticated');

-- 產品表 RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 所有人可以讀取產品
CREATE POLICY "產品公開讀取" ON products
  FOR SELECT USING (true);

-- 只有已認證用戶可以新增/修改/刪除產品
CREATE POLICY "已認證用戶可管理產品" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 建立 Storage Bucket (在 Supabase Dashboard 執行)
-- ============================================
-- 1. 建立 'products' bucket 用於存放產品圖片
-- 2. 設定公開讀取權限

-- ============================================
-- 範例數據 (可選)
-- ============================================
INSERT INTO announcements (title, content, type, tags, date) VALUES
('歡迎使用新系統', '我們的股東紀念品代領服務已經上線！', 'new', ARRAY['系統', '上線'], CURRENT_DATE),
('服務時間調整', '因應農曆新年，服務時間將有所調整，請密切注意。', 'important', ARRAY['服務', '時程'], CURRENT_DATE);

INSERT INTO products (name, category, price, description, available) VALUES
('7-11 商品卡 面額100', '超商卡', 100, '無使用期限 可當禮物 贈送或自用', true),
('全家超商 禮物卡 面額100', '超商卡', 100, '無使用期限 可當禮物 贈送或自用', true);
