import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { db } from '@/lib/db'
import { receipts, profiles, validationLogs, receiptCorrections, exportBatches } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = user.id

  // Delete all user data in dependency order
  const userReceipts = await db.select({ id: receipts.id }).from(receipts).where(eq(receipts.userId, userId))
  const receiptIds = userReceipts.map((r) => r.id)

  for (const receiptId of receiptIds) {
    await db.delete(validationLogs).where(eq(validationLogs.receiptId, receiptId))
    await db.delete(receiptCorrections).where(eq(receiptCorrections.receiptId, receiptId))
  }

  await db.delete(exportBatches).where(eq(exportBatches.userId, userId))
  await db.delete(receipts).where(eq(receipts.userId, userId))
  await db.delete(profiles).where(eq(profiles.id, userId))

  // Delete Supabase auth user (requires service role)
  await supabaseAdmin.auth.admin.deleteUser(userId)

  return NextResponse.json({ ok: true })
}
