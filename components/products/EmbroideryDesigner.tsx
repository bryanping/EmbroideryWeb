'use client'
import { useState, useRef, useCallback } from 'react'
import { DesignPosition } from '@/lib/types'
import { Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

type Props = {
  productImage?: string
  productName: string
  designImage?: string
  position: DesignPosition
  onChange: (pos: DesignPosition) => void
}

const DEFAULT_POS: DesignPosition = { x: 50, y: 40, scale: 1, rotation: 0 }

export default function EmbroideryDesigner({ productImage, productName, designImage, position, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ mouseX: number; mouseY: number; posX: number; posY: number } | null>(null)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    setDragging(true)
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      posX: position.x,
      posY: position.y,
    }
  }, [position])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging || !dragStart.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const dx = ((e.clientX - dragStart.current.mouseX) / rect.width) * 100
    const dy = ((e.clientY - dragStart.current.mouseY) / rect.height) * 100
    onChange({
      ...position,
      x: Math.max(5, Math.min(95, dragStart.current.posX + dx)),
      y: Math.max(5, Math.min(95, dragStart.current.posY + dy)),
    })
  }, [dragging, position, onChange])

  const handleMouseUp = useCallback(() => setDragging(false), [])

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    const container = containerRef.current
    if (!container) return
    setDragging(true)
    dragStart.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      posX: position.x,
      posY: position.y,
    }
  }, [position])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging || !dragStart.current || !containerRef.current) return
    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const dx = ((touch.clientX - dragStart.current.mouseX) / rect.width) * 100
    const dy = ((touch.clientY - dragStart.current.mouseY) / rect.height) * 100
    onChange({
      ...position,
      x: Math.max(5, Math.min(95, dragStart.current.posX + dx)),
      y: Math.max(5, Math.min(95, dragStart.current.posY + dy)),
    })
  }, [dragging, position, onChange])

  function adjustScale(delta: number) {
    onChange({ ...position, scale: Math.max(0.5, Math.min(3, position.scale + delta)) })
  }

  function adjustRotation(delta: number) {
    onChange({ ...position, rotation: (position.rotation + delta + 360) % 360 })
  }

  function reset() {
    onChange(DEFAULT_POS)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-[#2d1a0e]">刺繡位置設計</p>
      <p className="text-xs text-[#a07050]">拖曳刺繡圖案到你想要的位置</p>

      {/* 設計畫布 */}
      <div
        ref={containerRef}
        className={`relative w-full aspect-square bg-[#f5ede4] rounded-2xl overflow-hidden border-2 select-none ${
          dragging ? 'border-[#8b4513] cursor-grabbing' : 'border-[#e8d5c4] cursor-default'
        }`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* 商品底圖 */}
        {productImage ? (
          <img src={productImage} alt={productName} className="w-full h-full object-contain pointer-events-none" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl opacity-30">🧵</span>
            <p className="absolute text-[#a07050] text-sm">{productName}</p>
          </div>
        )}

        {/* 設計格線 */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {[25, 50, 75].map(p => (
            <div key={`v${p}`} className="absolute top-0 bottom-0 border-l border-[#8b4513]" style={{ left: `${p}%` }} />
          ))}
          {[25, 50, 75].map(p => (
            <div key={`h${p}`} className="absolute left-0 right-0 border-t border-[#8b4513]" style={{ top: `${p}%` }} />
          ))}
        </div>

        {/* 刺繡貼（可拖曳） */}
        {designImage ? (
          <div
            className="absolute"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: `translate(-50%, -50%) scale(${position.scale}) rotate(${position.rotation}deg)`,
              cursor: dragging ? 'grabbing' : 'grab',
              touchAction: 'none',
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            <img
              src={designImage}
              alt="刺繡設計"
              className="w-16 h-16 object-contain rounded-lg border-2 border-[#8b4513] shadow-lg"
              draggable={false}
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#8b4513] rounded-full flex items-center justify-center">
              <Move size={8} className="text-white" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 rounded-xl px-4 py-3 text-center">
              <p className="text-[#5a3820] text-xs">請先上傳設計圖案</p>
              <p className="text-[#a07050] text-xs">才能調整刺繡位置</p>
            </div>
          </div>
        )}

        {/* 位置標示 */}
        <div className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-lg font-mono">
          {Math.round(position.x)}% , {Math.round(position.y)}%
        </div>
      </div>

      {/* 控制工具列 */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#5a3820] flex-1">縮放</span>
        <button onClick={() => adjustScale(-0.1)} className="p-2 rounded-lg border border-[#e8d5c4] hover:bg-[#f5ede4]">
          <ZoomOut size={14} />
        </button>
        <span className="text-xs font-mono w-10 text-center">{position.scale.toFixed(1)}x</span>
        <button onClick={() => adjustScale(0.1)} className="p-2 rounded-lg border border-[#e8d5c4] hover:bg-[#f5ede4]">
          <ZoomIn size={14} />
        </button>

        <span className="text-xs text-[#5a3820] ml-3">旋轉</span>
        <button onClick={() => adjustRotation(-15)} className="p-2 rounded-lg border border-[#e8d5c4] hover:bg-[#f5ede4]">
          <RotateCcw size={14} />
        </button>
        <span className="text-xs font-mono w-10 text-center">{position.rotation}°</span>
        <button onClick={() => adjustRotation(15)} className="p-2 rounded-lg border border-[#e8d5c4] hover:bg-[#f5ede4]">
          <RotateCcw size={14} className="scale-x-[-1]" />
        </button>

        <button onClick={reset} className="ml-2 text-xs text-[#a07050] hover:text-[#8b4513] underline">
          重置
        </button>
      </div>
    </div>
  )
}
