import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getReceiptList } from '@/lib/receipts/queries'

function getErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return getErrorResponse('請先登入。', 401)
  }

  const { searchParams } = new URL(request.url)
  const month = searchParams.get('month') ?? undefined
  const receipts = await getReceiptList(user.id, month)

  return NextResponse.json({ receipts })
}
