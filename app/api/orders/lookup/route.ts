import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()
  if (!q) return NextResponse.json({ error: 'query required' }, { status: 400 })

  const supabase = await createClient()
  const isOrderNumber = q.startsWith('EMB-')

  const query = supabase.from('orders').select('*, order_items(*)')

  const { data, error } = isOrderNumber
    ? await query.eq('order_number', q).single()
    : await query.eq('customer_email', q).order('created_at', { ascending: false }).limit(1).single()

  if (error || !data) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
