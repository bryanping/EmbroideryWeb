import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { OrderStatus } from '@/lib/types'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()

  if (!order) notFound()

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{order.order_number}</h1>
          <p className="text-gray-500 text-sm">{new Date(order.created_at).toLocaleString('zh-TW')}</p>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status as OrderStatus} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-bold text-gray-700 mb-3">客戶資訊</h2>
          <div className="space-y-1 text-sm text-gray-600">
            <p>姓名：<span className="font-semibold text-gray-800">{order.customer_name}</span></p>
            <p>Email：{order.customer_email}</p>
            <p>手機：{order.customer_phone}</p>
            <p>地址：{order.shipping_address}</p>
            {order.notes && <p>備註：{order.notes}</p>}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <h2 className="font-bold text-gray-700 mb-3">費用明細</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-gray-600"><span>商品小計</span><span>{formatPrice(order.subtotal)}</span></div>
            {order.design_fee > 0 && <div className="flex justify-between text-gray-600"><span>設計費</span><span>{formatPrice(order.design_fee)}</span></div>}
            {order.production_fee > 0 && <div className="flex justify-between text-gray-600"><span>工本費</span><span>{formatPrice(order.production_fee)}</span></div>}
            <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100"><span>合計</span><span className="text-[#8b4513]">{formatPrice(order.total)}</span></div>
          </div>
        </div>
      </div>

      {/* 訂單項目 */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <h2 className="font-bold text-gray-700 p-5 border-b border-gray-100">訂購商品</h2>
        <div className="divide-y divide-gray-50">
          {order.order_items?.map((item: {id: string; product_name: string; quantity: number; unit_price: number; design_image_url?: string; design_note?: string}) => (
            <div key={item.id} className="p-5 flex gap-4">
              {item.design_image_url && (
                <img src={item.design_image_url} alt="設計圖" className="w-16 h-16 object-cover rounded-xl border border-gray-100" />
              )}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.product_name} × {item.quantity}</p>
                <p className="text-[#8b4513] font-bold">{formatPrice(item.unit_price * item.quantity)}</p>
                {item.design_note && <p className="text-sm text-gray-500 mt-1">備註：{item.design_note}</p>}
                {!item.design_image_url && <p className="text-xs text-gray-400 mt-1">未上傳設計圖</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
