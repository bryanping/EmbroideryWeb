import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { CartItem, DESIGN_FEE, PATCH_FEE, PATCH_SLUG } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, address, notes, items } = body as {
      name: string
      email: string
      phone: string
      address: string
      notes?: string
      items: CartItem[]
    }

    if (!items?.length) {
      return NextResponse.json({ error: '購物車為空' }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // 計算費用
    const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
    const designCount = items.filter(i => i.hasDesign).length
    const designFee = designCount * DESIGN_FEE
    const patchCount = items.filter(i => i.product.slug === PATCH_SLUG).reduce((s, i) => s + i.quantity, 0)
    const productionFee = patchCount * PATCH_FEE
    const total = subtotal + designFee + productionFee

    // 產生訂單編號
    const { data: orderNumData } = await supabase.rpc('generate_order_number')
    const orderNumber = orderNumData ?? `EMB-${Date.now()}`

    // 建立訂單
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
        notes: notes || null,
        subtotal,
        design_fee: designFee,
        production_fee: productionFee,
        total,
        status: 'pending_payment',
      })
      .select()
      .single()

    if (error) throw error

    // 建立訂單項目
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.product.price,
      design_image_url: item.designImageUrl || null,
      design_note: item.designNote || null,
    }))

    await supabase.from('order_items').insert(orderItems)

    // TODO: 串接綠界付款（暫時直接返回訂單編號）
    return NextResponse.json({ orderNumber: order.order_number, orderId: order.id })
  } catch (err) {
    console.error('建立訂單失敗:', err)
    return NextResponse.json({ error: '建立訂單失敗' }, { status: 500 })
  }
}
