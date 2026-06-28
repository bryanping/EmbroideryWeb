'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const links = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/orders', label: '訂單管理', icon: <ShoppingBag size={18} /> },
  { href: '/admin/products', label: '商品管理', icon: <Package size={18} /> },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <aside className="w-56 bg-[#2d1a0e] min-h-screen flex flex-col">
      <div className="p-6 border-b border-[#5a3820]">
        <h2 className="text-white font-bold text-lg">🧵 後台管理</h2>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              pathname === link.href
                ? 'bg-[#8b4513] text-white'
                : 'text-[#c4784a] hover:bg-[#5a3820] hover:text-white'
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-[#c4784a] hover:text-white text-sm w-full rounded-xl hover:bg-[#5a3820]"
        >
          <LogOut size={18} /> 登出
        </button>
      </div>
    </aside>
  )
}
