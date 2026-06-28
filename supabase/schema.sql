-- ============================================
-- 刺繡網站 Supabase Schema
-- ============================================

-- 商品表
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price INTEGER NOT NULL, -- 台幣，單位元
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 初始商品資料
INSERT INTO products (name, slug, description, price, sort_order) VALUES
  ('小零錢包', 'coin-purse', '精緻小巧的客製化刺繡零錢包', 450, 1),
  ('護照包', 'passport-holder', '大容量客製化刺繡護照包', 680, 2),
  ('手搖杯套', 'cup-sleeve', '防燙隔熱客製化刺繡杯套', 320, 3),
  ('杯墊', 'coaster', '吸水防滑客製化刺繡杯墊', 280, 4),
  ('刺繡貼', 'embroidery-patch', '可熨燙客製化刺繡貼片', 100, 5);

-- 訂單狀態 enum
CREATE TYPE order_status AS ENUM (
  'pending_payment', -- 待付款
  'paid',            -- 已付款
  'in_production',   -- 製作中
  'shipping',        -- 寄送中
  'completed',       -- 完成
  'cancelled'        -- 取消
);

-- 訂單表
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE, -- 顯示用訂單編號
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  status order_status DEFAULT 'pending_payment',
  subtotal INTEGER NOT NULL,       -- 商品金額
  design_fee INTEGER NOT NULL DEFAULT 0,   -- 設計費 200/圖
  production_fee INTEGER NOT NULL DEFAULT 0, -- 工本費 100/個刺繡貼
  total INTEGER NOT NULL,
  notes TEXT,
  payment_no TEXT,    -- 綠界交易編號
  payment_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 訂單項目表
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL, -- 快照商品名稱
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  design_image_url TEXT,  -- 客戶上傳圖片 URL
  design_note TEXT,       -- 設計備註
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 上傳圖片記錄表
CREATE TABLE uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL,  -- Supabase Storage 路徑
  public_url TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 自動更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 訂單編號生成函數 (格式: EMB-20240101-0001)
CREATE SEQUENCE order_seq START 1;
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'EMB-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(nextval('order_seq')::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- RLS 政策
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- 商品：任何人可讀
CREATE POLICY "products_public_read" ON products FOR SELECT USING (is_active = true);

-- 訂單：任何人可建立，service_role 可管理
CREATE POLICY "orders_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (true); -- 透過訂單編號查詢

-- 訂單項目：任何人可建立
CREATE POLICY "order_items_insert" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "order_items_select" ON order_items FOR SELECT USING (true);

-- 上傳：任何人可操作
CREATE POLICY "uploads_all" ON uploads FOR ALL USING (true);

-- Storage bucket（需在 Supabase Dashboard 手動建立）
-- Bucket 名稱: design-images
-- Public: true
