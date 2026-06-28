import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CartItem, DESIGN_FEE, PATCH_FEE, PATCH_SLUG } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return `NT$ ${price.toLocaleString()}`
}

export function calcCartFees(items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // 有上傳設計圖的 item 各收一次設計費
  const designCount = items.filter(i => i.hasDesign).length
  const designFee = designCount * DESIGN_FEE

  // 刺繡貼每個加工本費
  const patchCount = items
    .filter(i => i.product.slug === PATCH_SLUG)
    .reduce((sum, i) => sum + i.quantity, 0)
  const productionFee = patchCount * PATCH_FEE

  const total = subtotal + designFee + productionFee

  return { subtotal, designFee, productionFee, total, designCount, patchCount }
}
