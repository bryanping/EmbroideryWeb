import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'

async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    return data ?? []
  } catch {
    return []
  }
}

export default async function CustomizePage() {
  const products = await getProducts()

  const steps = [
    { num: '01', title: '選擇商品', desc: '從零錢包、護照包、杯套、杯墊、刺繡貼中選擇' },
    { num: '02', title: '上傳圖案', desc: '上傳你的圖案（JPG/PNG），加收設計費 NT$200' },
    { num: '03', title: '填寫資料', desc: '填寫收件資訊，選擇顏色與備註' },
    { num: '04', title: '付款完成', desc: '透過綠界安全付款，約 7-14 工作天完成製作' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#2d1a0e] mb-2">客製化刺繡</h1>
      <p className="text-[#5a3820] mb-10">選擇商品，上傳你的專屬圖案，讓我們為你手工製作。</p>

      {/* 流程說明 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {steps.map(step => (
          <div key={step.num} className="bg-[#f5ede4] rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-[#c4784a] mb-2">{step.num}</p>
            <h3 className="font-bold text-[#2d1a0e] text-sm mb-1">{step.title}</h3>
            <p className="text-xs text-[#5a3820]">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* 選商品 */}
      <h2 className="text-xl font-bold text-[#2d1a0e] mb-4">選擇要客製化的商品</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(product => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="bg-white rounded-2xl overflow-hidden border border-[#e8d5c4] hover:shadow-lg transition-shadow group"
          >
            <div className="aspect-video bg-[#f5ede4] flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <span className="text-4xl">🧵</span>
              )}
            </div>
            <div className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-[#2d1a0e]">{product.name}</h3>
                <p className="text-[#8b4513] font-bold text-sm">{formatPrice(product.price)}</p>
              </div>
              <ArrowRight size={18} className="text-[#c4784a]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
