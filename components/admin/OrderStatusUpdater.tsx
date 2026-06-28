'use client'
import { useState } from 'react'
import { OrderStatus, ORDER_STATUS_LABEL } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import OrderStatusBadge from './OrderStatusBadge'

const statusFlow: OrderStatus[] = ['pending_payment', 'paid', 'in_production', 'shipping', 'completed']

export default function OrderStatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: OrderStatus }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleUpdate(newStatus: OrderStatus) {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    if (!error) {
      setStatus(newStatus)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      <OrderStatusBadge status={status} />
      <select
        value={status}
        onChange={e => handleUpdate(e.target.value as OrderStatus)}
        disabled={loading}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8b4513]"
      >
        {statusFlow.map(s => (
          <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
        ))}
        <option value="cancelled">{ORDER_STATUS_LABEL.cancelled}</option>
      </select>
    </div>
  )
}
