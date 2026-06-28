'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ProductToggle({ productId, isActive }: { productId: string; isActive: boolean }) {
  const [active, setActive] = useState(isActive)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('products').update({ is_active: !active }).eq('id', productId)
    if (!error) {
      setActive(!active)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
        active
          ? 'bg-red-50 text-red-600 hover:bg-red-100'
          : 'bg-green-50 text-green-600 hover:bg-green-100'
      }`}
    >
      {loading ? '...' : active ? '下架' : '上架'}
    </button>
  )
}
