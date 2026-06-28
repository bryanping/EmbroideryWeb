'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { Product, Accessory, DesignPosition } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { ShoppingCart, Upload, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import AccessorySelector from './AccessorySelector'
import EmbroideryDesigner from './EmbroideryDesigner'

const DEFAULT_POS: DesignPosition = { x: 50, y: 40, scale: 1, rotation: 0 }

type Props = {
  product: Product
  accessories: Accessory[]
}

export default function AddToCartButton({ product, accessories }: Props) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [note, setNote] = useState('')
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([])
  const [position, setPosition] = useState<DesignPosition>(DEFAULT_POS)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `designs/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('design-images').upload(path, file)
      if (!error) {
        const { data } = supabase.storage.from('design-images').getPublicUrl(path)
        setImageUrl(data.publicUrl)
      }
    } finally {
      setUploading(false)
    }
  }

  // 計算本 item 額外費用
  const accessoriesCost = selectedAccessories.reduce((s, a) => s + a.price, 0)
  const designCost = imageUrl ? 200 : 0
  const isPatch = product.slug === 'embroidery-patch'
  const patchCost = isPatch ? 100 : 0
  const itemTotal = product.price + designCost + patchCost + accessoriesCost

  function handleAddToCart() {
    addItem(product, {
      designImageUrl: imageUrl,
      designNote: note,
      designPosition: imageUrl ? position : undefined,
      accessories: selectedAccessories,
      hasDesign: !!imageUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-5">
      {/* 費用明細 */}
      <div className="bg-[#f5ede4] rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between text-[#5a3820]">
          <span>商品價格</span>
          <span>{formatPrice(product.price)}</span>
        </div>
        {imageUrl && (
          <div className="flex justify-between text-[#5a3820]">
            <span>刺繡設計費</span>
            <span>+{formatPrice(designCost)}</span>
          </div>
        )}
        {isPatch && (
          <div className="flex justify-between text-[#5a3820]">
            <span>刺繡貼工本費</span>
            <span>+{formatPrice(patchCost)}</span>
          </div>
        )}
        {selectedAccessories.map(acc => (
          <div key={acc.id} className="flex justify-between text-[#5a3820]">
            <span>{acc.name}</span>
            <span>+{formatPrice(acc.price)}</span>
          </div>
        ))}
        <div className="border-t border-[#d4a574] pt-2 flex justify-between font-bold text-[#2d1a0e]">
          <span>本項小計</span>
          <span className="text-[#8b4513]">{formatPrice(itemTotal)}</span>
        </div>
      </div>

      {/* 設計圖上傳 */}
      <div>
        <p className="text-sm font-semibold text-[#2d1a0e] mb-2">上傳客製圖案（選填）</p>
        <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${
          imageUrl ? 'border-[#8b4513] bg-[#fdf5ed]' : 'border-[#d4a574] hover:border-[#8b4513]'
        }`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          {uploading ? (
            <span className="text-[#8b4513] text-sm">上傳中...</span>
          ) : imageUrl ? (
            <div className="flex items-center gap-3 w-full">
              <img src={imageUrl} alt="設計圖" className="w-14 h-14 object-cover rounded-lg border border-[#d4a574]" />
              <div>
                <p className="text-[#8b4513] text-sm font-medium flex items-center gap-1">
                  <Check size={16} /> 圖案已上傳
                </p>
                <p className="text-xs text-[#a07050]">點擊可更換</p>
              </div>
            </div>
          ) : (
            <>
              <Upload size={20} className="text-[#c4784a]" />
              <span className="text-[#5a3820] text-sm">點擊上傳圖案（JPG / PNG）</span>
            </>
          )}
        </label>
      </div>

      {/* 刺繡位置設計工具（僅上傳圖後顯示） */}
      {(imageUrl || product.image_url) && (
        <EmbroideryDesigner
          productImage={product.image_url ?? undefined}
          productName={product.name}
          designImage={imageUrl}
          position={position}
          onChange={setPosition}
        />
      )}

      {/* 設計備註 */}
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="設計備註（顏色偏好、尺寸說明、特殊要求等）"
        rows={2}
        className="w-full border border-[#e8d5c4] rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[#8b4513]"
      />

      {/* 配飾選擇 */}
      <AccessorySelector
        accessories={accessories}
        selected={selectedAccessories}
        onChange={setSelectedAccessories}
      />

      {/* 加入購物車 */}
      <button
        onClick={handleAddToCart}
        className={`w-full py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 transition-all text-base ${
          added ? 'bg-green-600 text-white' : 'bg-[#8b4513] text-white hover:bg-[#7a3a10]'
        }`}
      >
        {added ? <><Check size={20} /> 已加入購物車</> : <><ShoppingCart size={20} /> 加入購物車 · {formatPrice(itemTotal)}</>}
      </button>
    </div>
  )
}
