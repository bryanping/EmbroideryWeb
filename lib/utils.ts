import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { CartItem, DESIGN_FEE, PATCH_FEE, PATCH_SLUG, SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return `NT$ ${price.toLocaleString()}`
}

export function calcCartFees(items: CartItem[]) {
  // 商品小計
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // 配飾費用
  const accessoriesFee = items.reduce((sum, item) =>
    sum + item.accessories.reduce((a, acc) => a + acc.price, 0) * item.quantity, 0)

  // 設計費（有上傳圖的每個 item 收一次）
  const designCount = items.filter(i => i.hasDesign).length
  const designFee = designCount * DESIGN_FEE

  // 刺繡貼工本費
  const patchCount = items
    .filter(i => i.product.slug === PATCH_SLUG)
    .reduce((sum, i) => sum + i.quantity, 0)
  const productionFee = patchCount * PATCH_FEE

  // 運費（滿額免運）
  const itemTotal = subtotal + accessoriesFee
  const shippingFee = itemTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE

  const total = subtotal + accessoriesFee + designFee + productionFee + shippingFee

  return { subtotal, accessoriesFee, designFee, productionFee, shippingFee, total, designCount, patchCount }
}
