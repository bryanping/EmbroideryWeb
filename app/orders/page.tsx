'use client'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS_LABEL, Order } from '@/lib/types'
import Link from 'next/link'
import { Search } from 'lucide-react'

export default function OrdersPage() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setNotFound(false)
    try {
      const res = await fetch(`/api/orders/lookup?q=${encodeURIComponent(query.trim())}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data)
      } else {
        setOrder(null)
        setNotFound(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#2d1a0e] mb-2">查詢訂單</h1>
      <p className="text-[#5a3820] mb-6 text-sm">輸入訂單編號或 Email 查詢訂單狀態</p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="EMB-20240101-0001 或 Email"
          className="flex-1 border border-[#e8d5c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8b4513]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#8b4513] text-white px-5 py-3 rounded-xl hover:bg-[#7a3a10] disabled:opacity-60 flex items-center gap-2"
        >
          <Search size={18} />
          查詢
        </button>
      </form>

      {notFound && (
        <div className="text-center py-8 text-[#a07050]">找不到此訂單</div>
      )}

      {order && (
        <div className="bg-white rounded-2xl border border-[#e8d5c4] p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-mono font-bold text-[#2d1a0e]">{order.order_number}</span>
            <span className="bg-[#f5ede4] text-[#8b4513] px-3 py-1 rounded-full text-sm font-semibold">
              {ORDER_STATUS_LABEL[order.status]}
            </span>
          </div>
          <div className="text-sm text-[#5a3820]">
            <p>訂購日期：{new Date(order.created_at).toLocaleDateString('zh-TW')}</p>
            <p>總金額：{formatPrice(order.total)}</p>
          </div>
          <Link
            href={`/order/${order.order_number}`}
            className="block text-center bg-[#f5ede4] text-[#8b4513] py-2 rounded-xl text-sm font-semibold hover:bg-[#ead5c0]"
          >
            查看詳細訂單
          </Link>
        </div>
      )}
    </div>
  )
}
