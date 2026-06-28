import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product, Accessory, DesignPosition } from '@/lib/types'

type AddItemOpts = {
  designImageUrl?: string
  designNote?: string
  designPosition?: DesignPosition
  accessories?: Accessory[]
  hasDesign?: boolean
}

type CartStore = {
  items: CartItem[]
  addItem: (product: Product, opts?: AddItemOpts) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, opts = {}) =>
        set((state) => {
          // 每次都新增（允許同商品多筆，含不同設計）
          return {
            items: [
              ...state.items,
              {
                product,
                quantity: 1,
                designImageUrl: opts.designImageUrl,
                designNote: opts.designNote,
                designPosition: opts.designPosition,
                accessories: opts.accessories ?? [],
                hasDesign: opts.hasDesign ?? false,
              },
            ],
          }
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter(i => i.product.id !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter(i => i.product.id !== productId)
            : state.items.map(i => i.product.id === productId ? { ...i, quantity } : i),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: 'embroidery-cart' }
  )
)
