import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/lib/types'

type CartStore = {
  items: CartItem[]
  addItem: (product: Product, opts?: { designImageUrl?: string; designNote?: string; hasDesign?: boolean }) => void
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
          const existing = state.items.find(i => i.product.id === product.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                product,
                quantity: 1,
                designImageUrl: opts.designImageUrl,
                designNote: opts.designNote,
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
