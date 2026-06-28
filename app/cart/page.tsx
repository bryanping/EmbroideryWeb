'use client'
import { useCartStore } from '@/store/cart'
import { formatPrice, calcCartFees } from '@/lib/utils'
import { Trash2, Plus, Minus } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const fees = calcCartFees(items)

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-xl font-bold text-[#2d1a0e] mb-4">購物車是空的</h2>
        <Link href="/products" className="bg-[#8b4513] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#7a3a10]">
          去選購商品
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#2d1a0e] mb-8">購物車</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 商品列表 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.product.id} className="bg-white rounded-2xl p-4 border border-[#e8d5c4] flex gap-4">
              <div className="w-20 h-20 bg-[#f5ede4] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                {item.product.image_url ? (
                  <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🧵</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-[#2d1a0e]">{item.product.name}</h3>
                  <button onClick={() => removeItem(item.product.id)} className="text-[#c4784a] hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-[#8b4513] font-bold mt-1">{formatPrice(item.product.price)}</p>
                {item.hasDesign && (
                  <p className="text-xs text-[#a07050]">+ 設計費 NT$200</p>
                )}
                {item.accessories?.length > 0 && (
                  <p className="text-xs text-[#a07050]">配飾：{item.accessories.map(a => a.name).join('、')}</p>
                )}
                {item.designNote && (
                  <p className="text-xs text-[#5a3820] mt-1">備註：{item.designNote}</p>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-[#e8d5c4] flex items-center justify-center hover:bg-[#f5ede4]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-semibold w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-[#e8d5c4] flex items-center justify-center hover:bg-[#f5ede4]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 費用小計 */}
        <div className="bg-white rounded-2xl p-6 border border-[#e8d5c4] h-fit">
          <h2 className="font-bold text-[#2d1a0e] mb-4">費用明細</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#5a3820]">商品小計</span>
              <span>{formatPrice(fees.subtotal)}</span>
            </div>
            {fees.accessoriesFee > 0 && (
              <div className="flex justify-between">
                <span className="text-[#5a3820]">配飾費用</span>
                <span>{formatPrice(fees.accessoriesFee)}</span>
              </div>
            )}
            {fees.designFee > 0 && (
              <div className="flex justify-between">
                <span className="text-[#5a3820]">設計費 × {fees.designCount}</span>
                <span>{formatPrice(fees.designFee)}</span>
              </div>
            )}
            {fees.productionFee > 0 && (
              <div className="flex justify-between">
                <span className="text-[#5a3820]">刺繡貼工本費 × {fees.patchCount}</span>
                <span>{formatPrice(fees.productionFee)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#5a3820]">運費</span>
              <span className={fees.shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                {fees.shippingFee === 0 ? '免運' : formatPrice(fees.shippingFee)}
              </span>
            </div>
            {fees.shippingFee > 0 && (
              <p className="text-xs text-[#a07050]">滿 NT$1,500 免運費</p>
            )}
            <div className="border-t border-[#e8d5c4] pt-3 flex justify-between font-bold text-base">
              <span>合計</span>
              <span className="text-[#8b4513]">{formatPrice(fees.total)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block w-full bg-[#8b4513] text-white py-3 rounded-full font-semibold text-center hover:bg-[#7a3a10]"
          >
            前往結帳
          </Link>
        </div>
      </div>
    </div>
  )
}
