ALTER TABLE "profiles"
  ADD COLUMN IF NOT EXISTS "business_address" text,
  ADD COLUMN IF NOT EXISTS "accountant_name" text,
  ADD COLUMN IF NOT EXISTS "accountant_firm" text,
  ADD COLUMN IF NOT EXISTS "accountant_email" text,
  ADD COLUMN IF NOT EXISTS "preferred_format" text DEFAULT 'xlsx',
  ADD COLUMN IF NOT EXISTS "notify_email" boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS "notify_monthly" boolean DEFAULT false;
