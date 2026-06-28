'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const items = useCartStore(s => s.items)
  const total = items.reduce((sum, i) => sum + i.quantity, 0)

  const links = [
    { href: '/', label: '首頁' },
    { href: '/products', label: '商品' },
    { href: '/customize', label: '客製化' },
    { href: '/orders', label: '查詢訂單' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#fdfaf7] border-b border-[#e8d5c4] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#8b4513]">
          🧵 手作刺繡工坊
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm text-[#5a3820] hover:text-[#8b4513] transition-colors">
              {l.label}
            </Link>
          ))}
          <Link href="/cart" className="relative p-2">
            <ShoppingCart size={22} className="text-[#8b4513]" />
            {total > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8b4513] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {total}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <Link href="/cart" className="relative p-2">
            <ShoppingCart size={22} className="text-[#8b4513]" />
            {total > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8b4513] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {total}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="p-2">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-[#fdfaf7] border-t border-[#e8d5c4] px-4 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[#5a3820] hover:text-[#8b4513]">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
