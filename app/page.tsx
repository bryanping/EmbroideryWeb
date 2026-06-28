import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { ArrowRight, Scissors, Star, Truck } from 'lucide-react'

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

export default async function HomePage() {
  const products = await getProducts()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#f5ede4] to-[#fdfaf7] py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#c4784a] font-medium mb-3 tracking-widest text-sm">CUSTOM EMBROIDERY</p>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2d1a0e] mb-6 leading-tight">
            每一針都是<br />專屬於你的藝術
          </h1>
          <p className="text-[#5a3820] text-lg mb-8">
            上傳你的圖案，我們為你繡出獨一無二的客製作品
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/customize"
              className="bg-[#8b4513] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#7a3a10] transition-colors inline-flex items-center gap-2 justify-center"
            >
              立即客製化 <ArrowRight size={18} />
            </Link>
            <Link
              href="/products"
              className="border border-[#8b4513] text-[#8b4513] px-8 py-3 rounded-full font-semibold hover:bg-[#f5ede4] transition-colors"
            >
              查看商品
            </Link>
          </div>
        </div>
      </section>

      {/* 特色 */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { icon: <Scissors size={32} />, title: '手工刺繡', desc: '每件商品皆為手工製作，細節精緻' },
            { icon: <Star size={32} />, title: '客製設計', desc: '上傳圖案，設計費僅 NT$200' },
            { icon: <Truck size={32} />, title: '安心寄送', desc: '完成後宅配到府，全台灣皆可寄送' },
          ].map((item, i) => (
            <div key={i} className="p-6">
              <div className="text-[#8b4513] flex justify-center mb-4">{item.icon}</div>
              <h3 className="font-bold text-lg text-[#2d1a0e] mb-2">{item.title}</h3>
              <p className="text-[#5a3820] text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 費用說明 */}
      <section className="py-10 px-4 bg-[#f5ede4]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-[#2d1a0e] mb-4">費用透明，無隱藏收費</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white rounded-xl p-5 flex-1 shadow-sm">
              <p className="text-3xl font-bold text-[#8b4513]">NT$200</p>
              <p className="text-[#5a3820] mt-1 text-sm">刺繡設計費（每張圖）</p>
            </div>
            <div className="bg-white rounded-xl p-5 flex-1 shadow-sm">
              <p className="text-3xl font-bold text-[#8b4513]">NT$100</p>
              <p className="text-[#5a3820] mt-1 text-sm">刺繡貼工本費（每個）</p>
            </div>
          </div>
        </div>
      </section>

      {/* 商品列表 */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#2d1a0e] mb-8 text-center">商品系列</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.map(product => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#e8d5c4]"
                >
                  <div className="aspect-square bg-[#f5ede4] flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">🧵</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-[#2d1a0e] text-sm">{product.name}</h3>
                    <p className="text-[#8b4513] font-bold mt-1">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-[#5a3820]">商品載入中...</p>
          )}
          <div className="text-center mt-8">
            <Link href="/products" className="text-[#8b4513] font-semibold hover:underline inline-flex items-center gap-1">
              查看全部商品 <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
