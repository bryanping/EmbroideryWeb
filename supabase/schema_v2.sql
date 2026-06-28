-- ============================================
-- Schema V2：配飾系統 + 運費 + 刺繡位置
-- ============================================

-- 配飾表（小配件，可加購）
CREATE TABLE accessories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO accessories (name, price, description, sort_order) VALUES
  ('鑰匙圈扣環', 50, '可掛在包包上的金屬扣環', 1),
  ('拉鍊頭裝飾', 80, '精緻金屬拉鍊頭吊飾', 2),
  ('掛繩', 60, '可調長度掛繩', 3),
  ('禮盒包裝', 100, '精美禮盒包裝，適合送禮', 4);

-- 訂單配飾關聯表
CREATE TABLE order_item_accessories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  accessory_id UUID REFERENCES accessories(id),
  accessory_name TEXT NOT NULL,
  price INTEGER NOT NULL
);

-- 新增欄位到 orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_fee INTEGER DEFAULT 60;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS accessories_fee INTEGER DEFAULT 0;

-- 新增欄位到 order_items（刺繡位置）
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS design_position JSONB;
-- 格式：{ x: 45, y: 30, scale: 1.2, rotation: 0 } (百分比)

-- RLS
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_accessories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "accessories_public_read" ON accessories FOR SELECT USING (is_active = true);
CREATE POLICY "order_item_accessories_insert" ON order_item_accessories FOR INSERT WITH CHECK (true);
CREATE POLICY "order_item_accessories_select" ON order_item_accessories FOR SELECT USING (true);
