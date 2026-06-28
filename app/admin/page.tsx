import { createClient } from '@/lib/supabase/server'
import { ORDER_STATUS_LABEL, OrderStatus } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('status, total')

  const stats = {
    total: orders?.length ?? 0,
    revenue: orders?.reduce((s, o) => s + o.total, 0) ?? 0,
    pending: orders?.filter(o => o.status === 'pending_payment').length ?? 0,
    production: orders?.filter(o => o.status === 'in_production').length ?? 0,
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '總訂單', value: stats.total, unit: '筆' },
          { label: '總營收', value: formatPrice(stats.revenue), unit: '' },
          { label: '待付款', value: stats.pending, unit: '筆' },
          { label: '製作中', value: stats.production, unit: '筆' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-[#8b4513] mt-1">{s.value}{s.unit}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
