import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'

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

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#2d1a0e] mb-2">商品系列</h1>
      <p className="text-[#5a3820] mb-8">選擇商品後可上傳客製圖案，加收設計費 NT$200</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#e8d5c4] group"
          >
            <div className="aspect-square bg-[#f5ede4] flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <span className="text-5xl">🧵</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#2d1a0e]">{product.name}</h3>
              {product.description && (
                <p className="text-[#5a3820] text-sm mt-1 line-clamp-2">{product.description}</p>
              )}
              <p className="text-[#8b4513] font-bold text-lg mt-2">{formatPrice(product.price)}</p>
              <p className="text-xs text-[#a07050] mt-1">+ 設計費 NT$200 / 圖</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
