'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { Product } from '@/lib/types'
import { ShoppingCart, Upload, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()
  const [note, setNote] = useState('')

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

  function handleAddToCart() {
    addItem(product, {
      designImageUrl: imageUrl,
      designNote: note,
      hasDesign: !!imageUrl,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="space-y-4">
      {/* 設計圖上傳 */}
      <div>
        <p className="text-sm font-semibold text-[#2d1a0e] mb-2">上傳客製圖案（選填）</p>
        <label className={`flex items-center gap-3 border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors ${imageUrl ? 'border-[#8b4513] bg-[#fdf5ed]' : 'border-[#d4a574] hover:border-[#8b4513]'}`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          {uploading ? (
            <span className="text-[#8b4513] text-sm">上傳中...</span>
          ) : imageUrl ? (
            <>
              <img src={imageUrl} alt="設計圖" className="w-12 h-12 object-cover rounded-lg" />
              <span className="text-[#8b4513] text-sm font-medium flex items-center gap-1">
                <Check size={16} /> 圖案已上傳
              </span>
            </>
          ) : (
            <>
              <Upload size={20} className="text-[#c4784a]" />
              <span className="text-[#5a3820] text-sm">點擊上傳圖案（JPG / PNG）</span>
            </>
          )}
        </label>
        {imageUrl && (
          <p className="text-xs text-[#a07050] mt-1">將加收設計費 NT$200</p>
        )}
      </div>

      {/* 備註 */}
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="設計備註（顏色偏好、尺寸說明等）"
        rows={2}
        className="w-full border border-[#e8d5c4] rounded-xl p-3 text-sm resize-none focus:outline-none focus:border-[#8b4513]"
      />

      {/* 加入購物車 */}
      <button
        onClick={handleAddToCart}
        className={`w-full py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-all ${
          added
            ? 'bg-green-600 text-white'
            : 'bg-[#8b4513] text-white hover:bg-[#7a3a10]'
        }`}
      >
        {added ? <><Check size={18} /> 已加入購物車</> : <><ShoppingCart size={18} /> 加入購物車</>}
      </button>
    </div>
  )
}
