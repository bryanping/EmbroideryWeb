import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import AddToCartButton from '@/components/products/AddToCartButton'
import { PATCH_SLUG } from '@/lib/types'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const isPatch = product.slug === PATCH_SLUG

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 圖片 */}
        <div className="aspect-square bg-[#f5ede4] rounded-2xl flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-8xl">🧵</span>
          )}
        </div>

        {/* 資訊 */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-[#2d1a0e]">{product.name}</h1>
          {product.description && (
            <p className="text-[#5a3820] leading-relaxed">{product.description}</p>
          )}

          <div className="bg-[#f5ede4] rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-[#5a3820]">商品價格</span>
              <span className="font-bold text-[#2d1a0e]">{formatPrice(product.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#5a3820]">刺繡設計費</span>
              <span className="font-bold text-[#2d1a0e]">NT$ 200 / 圖</span>
            </div>
            {isPatch && (
              <div className="flex justify-between">
                <span className="text-[#5a3820]">刺繡貼工本費</span>
                <span className="font-bold text-[#2d1a0e]">NT$ 100 / 個</span>
              </div>
            )}
          </div>

          <div className="border-t border-[#e8d5c4] pt-4">
            <p className="text-sm text-[#a07050] mb-4">
              ✨ 下單後請上傳客製圖案，我們將依圖案進行刺繡設計，製作時間約 7-14 個工作天。
            </p>
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  )
}
