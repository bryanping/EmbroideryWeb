import { OrderStatus, ORDER_STATUS_LABEL } from '@/lib/types'

const statusColor: Record<OrderStatus, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  in_production: 'bg-purple-100 text-purple-700',
  shipping: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor[status]}`}>
      {ORDER_STATUS_LABEL[status]}
    </span>
  )
}
