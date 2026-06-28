import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_LABEL } from '@/lib/types'
import { CheckCircle } from 'lucide-react'

export default async function OrderPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', orderNumber)
    .single()

  if (!order) notFound()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-[#2d1a0e]">訂單已成立！</h1>
        <p className="text-[#5a3820] mt-1">訂單編號：<span className="font-mono font-bold">{order.order_number}</span></p>
      </div>

      <div className="bg-white rounded-2xl border border-[#e8d5c4] p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-[#5a3820]">訂單狀態</span>
          <span className="bg-[#f5ede4] text-[#8b4513] px-3 py-1 rounded-full text-sm font-semibold">
            {ORDER_STATUS_LABEL[order.status as keyof typeof ORDER_STATUS_LABEL]}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#5a3820]">收件人</span>
          <span className="font-semibold">{order.customer_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#5a3820]">Email</span>
          <span>{order.customer_email}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#5a3820]">手機</span>
          <span>{order.customer_phone}</span>
        </div>
        <div className="border-t border-[#e8d5c4] pt-4">
          <h3 className="font-bold text-[#2d1a0e] mb-3">訂購商品</h3>
          {order.order_items?.map((item: {id: string; product_name: string; quantity: number; unit_price: number; design_image_url?: string}) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span className="text-[#5a3820]">{item.product_name} × {item.quantity}</span>
              <span>{formatPrice(item.unit_price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-[#e8d5c4] pt-3 space-y-1 text-sm">
          {order.design_fee > 0 && (
            <div className="flex justify-between text-[#5a3820]">
              <span>設計費</span><span>{formatPrice(order.design_fee)}</span>
            </div>
          )}
          {order.production_fee > 0 && (
            <div className="flex justify-between text-[#5a3820]">
              <span>工本費</span><span>{formatPrice(order.production_fee)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-1">
            <span>總計</span>
            <span className="text-[#8b4513]">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <p className="text-center text-sm text-[#a07050] mt-6">
        訂單確認信將寄至 {order.customer_email}，製作時間約 7-14 個工作天。
      </p>
    </div>
  )
}
