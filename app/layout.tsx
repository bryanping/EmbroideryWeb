import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: '手作刺繡工坊｜客製化刺繡',
  description: '專業客製化刺繡，提供零錢包、護照包、手搖杯套、杯墊、刺繡貼等商品，接受圖案上傳客製。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
