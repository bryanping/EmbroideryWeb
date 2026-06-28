import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/products/AddToCartButton'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const [{ data: product }, { data: accessories }] = await Promise.all([
    supabase.from('products').select('*').eq('slug', slug).eq('is_active', true).single(),
    supabase.from('accessories').select('*').eq('is_active', true).order('sort_order'),
  ])

  if (!product) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 商品圖片 */}
        <div className="sticky top-24 self-start">
          <div className="aspect-square bg-[#f5ede4] rounded-2xl flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-contain p-6" />
            ) : (
              <span className="text-8xl">🧵</span>
            )}
          </div>
        </div>

        {/* 右側：資訊 + 設計工具 */}
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-[#c4784a] text-sm font-medium mb-1">客製化刺繡</p>
            <h1 className="text-3xl font-bold text-[#2d1a0e]">{product.name}</h1>
            {product.description && (
              <p className="text-[#5a3820] leading-relaxed mt-2">{product.description}</p>
            )}
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#8b4513]">NT$ {product.price}</span>
            <span className="text-[#a07050] text-sm">起（依配件與設計費用調整）</span>
          </div>

          <p className="text-sm text-[#a07050] bg-[#f5ede4] rounded-xl p-3">
            ✨ 上傳圖案後可在下方拖曳調整刺繡位置，製作時間約 7-14 個工作天。
          </p>

          <AddToCartButton product={product} accessories={accessories ?? []} />
        </div>
      </div>
    </div>
  )
}
