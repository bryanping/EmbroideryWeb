import { createClient } from '@/lib/supabase/server'
import { Order, ORDER_STATUS_LABEL, OrderStatus } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">訂單管理</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['訂單編號', '客戶', '金額', '狀態', '建立時間', '操作'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders?.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-[#8b4513] font-semibold">{order.order_number}</td>
                <td className="px-4 py-3">
                  <p className="font-semibold">{order.customer_name}</p>
                  <p className="text-gray-500 text-xs">{order.customer_email}</p>
                </td>
                <td className="px-4 py-3 font-bold">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <OrderStatusBadge status={order.status as OrderStatus} />
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(order.created_at).toLocaleDateString('zh-TW')}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="text-[#8b4513] hover:underline font-semibold">
                    查看
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!orders?.length && (
          <p className="text-center py-10 text-gray-400">暫無訂單</p>
        )}
      </div>
    </div>
  )
}
