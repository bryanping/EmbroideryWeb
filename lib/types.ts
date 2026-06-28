export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  image_url: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'in_production'
  | 'shipping'
  | 'completed'
  | 'cancelled'

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: '待付款',
  paid: '已付款',
  in_production: '製作中',
  shipping: '寄送中',
  completed: '已完成',
  cancelled: '已取消',
}

export type Order = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: string
  status: OrderStatus
  subtotal: number
  design_fee: number
  production_fee: number
  total: number
  notes: string | null
  payment_no: string | null
  payment_at: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  design_image_url: string | null
  design_note: string | null
  created_at: string
}

export type Accessory = {
  id: string
  name: string
  price: number
  description: string | null
  is_active: boolean
  sort_order: number
}

export type DesignPosition = {
  x: number      // 百分比 0-100
  y: number      // 百分比 0-100
  scale: number  // 1.0 = 原始大小
  rotation: number // 度數
}

// 購物車 item（客戶端 state）
export type CartItem = {
  product: Product
  quantity: number
  designImageUrl?: string
  designNote?: string
  designPosition?: DesignPosition  // 刺繡位置
  accessories: Accessory[]         // 已選配飾
  hasDesign: boolean
}

// 費用計算
export const DESIGN_FEE = 200    // 每張設計圖
export const PATCH_FEE = 100     // 刺繡貼每個工本費
export const SHIPPING_FEE = 60   // 運費（固定）
export const FREE_SHIPPING_THRESHOLD = 1500 // 滿額免運
export const PATCH_SLUG = 'embroidery-patch'
