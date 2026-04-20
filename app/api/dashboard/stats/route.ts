import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getReceiptStats } from '@/lib/receipts/queries'

function getCurrentMonth() {
  const now = new Date()
  return `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`
}

function getErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return getErrorResponse('請先登入。', 401)
  }

  const stats = await getReceiptStats(user.id, getCurrentMonth())
  return NextResponse.json({ stats })
}
