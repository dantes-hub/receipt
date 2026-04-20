export const RECEIPTS_BUCKET =
  process.env.SUPABASE_RECEIPTS_BUCKET ||
  process.env.NEXT_PUBLIC_SUPABASE_RECEIPTS_BUCKET ||
  'receipts'
