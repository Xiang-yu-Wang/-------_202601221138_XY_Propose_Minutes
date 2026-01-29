-- ============================================
-- 交貨照照片表 (delivery_photos)
-- 在 Supabase SQL Editor 中執行此腳本
-- ============================================

-- 建立更新時間函數（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 建立交貨照表
CREATE TABLE IF NOT EXISTS delivery_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  location VARCHAR(100) NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 建立更新時間觸發器
CREATE TRIGGER update_delivery_photos_updated_at
  BEFORE UPDATE ON delivery_photos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 交貨照表 RLS
ALTER TABLE delivery_photos ENABLE ROW LEVEL SECURITY;

-- 所有人可以讀取交貨照
CREATE POLICY "交貨照公開讀取" ON delivery_photos
  FOR SELECT USING (true);

-- 只有已認證用戶可以新增/修改/刪除交貨照
CREATE POLICY "已認證用戶可管理交貨照" ON delivery_photos
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- 範例數據 (可選)
-- ============================================
INSERT INTO delivery_photos (url, title, description, date, location) VALUES
('https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/240152_580163.jpeg', '台北地區交貨', '客戶滿意收到紀念品', '2026-01-15', '台北市'),
('https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/303791_342347.jpeg', '新竹地區交貨', '高效率服務交貨', '2026-01-14', '新竹市'),
('https://custom-images.strikinglycdn.com/res/hrscywv4p/image/upload/c_limit,fl_lossy,h_9000,w_1200,f_auto,q_80/23513522/71050_590858.jpeg', '台中地區交貨', '客戶領取紀念品實況', '2026-01-13', '台中市');
