'use client'
import { Accessory } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { Plus, Minus } from 'lucide-react'

type Props = {
  accessories: Accessory[]
  selected: Accessory[]
  onChange: (selected: Accessory[]) => void
}

export default function AccessorySelector({ accessories, selected, onChange }: Props) {
  function toggle(acc: Accessory) {
    const isSelected = selected.some(s => s.id === acc.id)
    if (isSelected) {
      onChange(selected.filter(s => s.id !== acc.id))
    } else {
      onChange([...selected, acc])
    }
  }

  if (!accessories.length) return null

  return (
    <div>
      <p className="text-sm font-semibold text-[#2d1a0e] mb-2">加購配飾（選填）</p>
      <div className="space-y-2">
        {accessories.map(acc => {
          const isSelected = selected.some(s => s.id === acc.id)
          return (
            <label
              key={acc.id}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                isSelected
                  ? 'border-[#8b4513] bg-[#fdf5ed]'
                  : 'border-[#e8d5c4] hover:border-[#c4784a]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-[#8b4513] bg-[#8b4513]' : 'border-[#d4a574]'
                }`}>
                  {isSelected && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2d1a0e]">{acc.name}</p>
                  {acc.description && <p className="text-xs text-[#a07050]">{acc.description}</p>}
                </div>
              </div>
              <span className="text-sm font-bold text-[#8b4513]">+{formatPrice(acc.price)}</span>
              <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggle(acc)} />
            </label>
          )
        })}
      </div>
    </div>
  )
}
