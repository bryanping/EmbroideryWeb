'use client'
import { useState } from 'react'
import { useCartStore } from '@/store/cart'
import { formatPrice, calcCartFees } from '@/lib/utils'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const schema = z.object({
  name: z.string().min(2, '請輸入姓名'),
  email: z.string().email('請輸入正確 Email'),
  phone: z.string().regex(/^09\d{8}$/, '請輸入正確手機號碼'),
  address: z.string().min(10, '請輸入完整地址'),
  notes: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const fees = calcCartFees(items)
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items,
          ...fees,
        }),
      })
      const json = await res.json()
      if (json.orderNumber) {
        clearCart()
        router.push(`/order/${json.orderNumber}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full border border-[#e8d5c4] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#8b4513]'
  const labelClass = 'block text-sm font-semibold text-[#2d1a0e] mb-1'
  const errorClass = 'text-red-500 text-xs mt-1'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-[#2d1a0e] mb-8">結帳</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 填寫資料 */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-2xl p-6 border border-[#e8d5c4]">
            <h2 className="font-bold text-[#2d1a0e] mb-4">收件資訊</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>姓名 *</label>
                <input {...register('name')} className={inputClass} placeholder="請輸入姓名" />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Email *</label>
                <input {...register('email')} type="email" className={inputClass} placeholder="your@email.com" />
                {errors.email && <p className={errorClass}>{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelClass}>手機 *</label>
                <input {...register('phone')} className={inputClass} placeholder="0912345678" />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>
              <div>
                <label className={labelClass}>收件地址 *</label>
                <input {...register('address')} className={inputClass} placeholder="台北市信義區..." />
                {errors.address && <p className={errorClass}>{errors.address.message}</p>}
              </div>
              <div>
                <label className={labelClass}>備註（選填）</label>
                <textarea {...register('notes')} rows={2} className={`${inputClass} resize-none`} placeholder="其他說明..." />
              </div>
            </div>
          </div>
        </div>

        {/* 訂單摘要 */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#e8d5c4]">
            <h2 className="font-bold text-[#2d1a0e] mb-4">訂單摘要</h2>
            <div className="space-y-2 text-sm">
              {items.map(item => (
                <div key={item.product.id} className="flex justify-between">
                  <span className="text-[#5a3820]">{item.product.name} × {item.quantity}</span>
                  <span>{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
              {fees.designFee > 0 && (
                <div className="flex justify-between text-[#5a3820]">
                  <span>設計費 × {fees.designCount}</span>
                  <span>{formatPrice(fees.designFee)}</span>
                </div>
              )}
              {fees.productionFee > 0 && (
                <div className="flex justify-between text-[#5a3820]">
                  <span>工本費 × {fees.patchCount}</span>
                  <span>{formatPrice(fees.productionFee)}</span>
                </div>
              )}
              <div className="border-t border-[#e8d5c4] pt-2 flex justify-between font-bold text-base">
                <span>合計</span>
                <span className="text-[#8b4513]">{formatPrice(fees.total)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#8b4513] text-white py-3 rounded-full font-semibold hover:bg-[#7a3a10] disabled:opacity-60 transition-colors"
          >
            {submitting ? '處理中...' : '確認下單並付款'}
          </button>
          <p className="text-xs text-center text-[#a07050]">下單後將導向綠界付款頁面</p>
        </div>
      </form>
    </div>
  )
}
