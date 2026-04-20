import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const updateSchema = z.object({
  displayName: z.string().max(100).optional(),
  businessName: z.string().max(200).optional(),
  ubn: z.string().max(8).optional(),
  businessAddress: z.string().max(500).optional(),
  accountantName: z.string().max(100).optional(),
  accountantFirm: z.string().max(200).optional(),
  accountantEmail: z.string().email().optional().or(z.literal('')),
  preferredFormat: z.enum(['xlsx', 'csv', 'pdf']).optional(),
  notifyEmail: z.boolean().optional(),
  notifyMonthly: z.boolean().optional(),
})

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const rows = await db.select().from(profiles).where(eq(profiles.id, user.id))
  const profile = rows[0] ?? null

  return NextResponse.json({
    email: user.email,
    displayName: profile?.displayName ?? '',
    businessName: profile?.businessName ?? '',
    ubn: profile?.ubn ?? '',
    businessAddress: profile?.businessAddress ?? '',
    accountantName: profile?.accountantName ?? '',
    accountantFirm: profile?.accountantFirm ?? '',
    accountantEmail: profile?.accountantEmail ?? '',
    preferredFormat: profile?.preferredFormat ?? 'xlsx',
    notifyEmail: profile?.notifyEmail ?? true,
    notifyMonthly: profile?.notifyMonthly ?? false,
  })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  await db
    .insert(profiles)
    .values({ id: user.id, ...parsed.data })
    .onConflictDoUpdate({ target: profiles.id, set: parsed.data })

  return NextResponse.json({ ok: true })
}
