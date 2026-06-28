export default function Footer() {
  return (
    <footer className="bg-[#2d1a0e] text-[#c4784a] mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-2">🧵 手作刺繡工坊</h3>
          <p className="text-sm text-[#a07050]">每一針都是用心的刺繡，為你客製專屬設計。</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">費用說明</h4>
          <ul className="text-sm text-[#a07050] space-y-1">
            <li>刺繡設計費：NT$ 200 / 圖</li>
            <li>刺繡貼工本費：NT$ 100 / 個</li>
            <li>其他商品不另收工本費</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-2">聯絡我們</h4>
          <p className="text-sm text-[#a07050]">Instagram: @embroidery_workshop</p>
          <p className="text-sm text-[#a07050]">Email: hello@embroidery.tw</p>
        </div>
      </div>
      <div className="border-t border-[#5a3820] text-center py-4 text-xs text-[#a07050]">
        © 2024 手作刺繡工坊. All rights reserved.
      </div>
    </footer>
  )
}
