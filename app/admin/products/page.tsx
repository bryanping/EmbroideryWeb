import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import ProductToggle from '@/components/admin/ProductToggle'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('sort_order')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">商品管理</h1>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['商品名稱', '價格', '狀態', '操作'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-semibold text-gray-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products?.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold text-gray-800">{product.name}</td>
                <td className="px-4 py-3 text-[#8b4513] font-bold">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {product.is_active ? '上架中' : '已下架'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ProductToggle productId={product.id} isActive={product.is_active} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
