'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { useAuth } from '@/context/AuthContext'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const items = useCartStore(s => s.items)
  const total = items.reduce((sum, i) => sum + i.quantity, 0)
  const { user, signOut } = useAuth()

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

          {/* 購物車 */}
          <Link href="/cart" className="relative p-2">
            <ShoppingCart size={22} className="text-[#8b4513]" />
            {total > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8b4513] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {total}
              </span>
            )}
          </Link>

          {/* 登入狀態 */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 text-sm text-[#5a3820] hover:text-[#8b4513]"
              >
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <User size={22} className="text-[#8b4513]" />
                )}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 bg-white border border-[#e8d5c4] rounded-xl shadow-lg py-2 w-40 z-50">
                  <p className="px-4 py-2 text-xs text-[#a07050] truncate">{user.email}</p>
                  <hr className="border-[#e8d5c4] my-1" />
                  <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-[#2d1a0e] hover:bg-[#f5ede4]">
                    我的訂單
                  </Link>
                  <button
                    onClick={() => { signOut(); setUserMenuOpen(false) }}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={14} /> 登出
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-sm text-[#8b4513] font-semibold hover:underline">
              登入
            </Link>
          )}
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
          {user ? (
            <>
              <Link href="/orders" onClick={() => setOpen(false)} className="text-[#5a3820]">我的訂單</Link>
              <button onClick={() => { signOut(); setOpen(false) }} className="text-left text-red-500 text-sm">登出</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="text-[#8b4513] font-semibold">登入</Link>
          )}
        </div>
      )}
    </nav>
  )
}
