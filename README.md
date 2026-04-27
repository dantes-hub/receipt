# ReceiptBridge

ReceiptBridge is a Next.js app for uploading Taiwan receipts, extracting structured data with AI, validating the result against Taiwan-specific rules, and exporting accountant-friendly CSV output.

## Stack

- Next.js 16 App Router
- React 19
- Supabase Auth + Storage
- Postgres + Drizzle ORM
- OpenAI structured extraction
- Vitest + ESLint
- Optional Sentry server-side error tracking

## Current product shape

- Receipt uploads are persisted immediately.
- Extraction work is queued in `receipt_processing_jobs`.
- A best-effort in-request kickoff still runs via `waitUntil(...)`.
- Jobs are retryable because queue state is stored in Postgres.
- PDF upload is explicitly not enabled yet.

## Required environment variables

### App + Auth

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Database

- `DATABASE_URL`

### AI extraction

- `OPENAI_API_KEY`
- `OPENAI_RECEIPT_MODEL`
  Optional. Defaults to `gpt-4o-2024-11-20`.

### Storage

- `SUPABASE_RECEIPTS_BUCKET`
  Optional. Defaults to `receipts`.

### Queue runner

- `RECEIPT_JOB_RUNNER_SECRET`
  Required if you want a cron or external runner to call the internal queue route.

### Observability

- `SENTRY_DSN`
  Optional. Enables server-side exception capture.
- `SENTRY_TRACES_SAMPLE_RATE`
  Optional. Defaults to `0`.

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with the variables above.

3. Run migrations:

```bash
npm run db:migrate
```

4. Start the app:

```bash
npm run dev
```

## Database and storage requirements

### Tables

The app expects these tables:

- `profiles`
- `receipts`
- `receipt_corrections`
- `validation_logs`
- `export_batches`
- `receipt_processing_jobs`

### Supabase bucket

Create a private bucket named `receipts` unless you override it with `SUPABASE_RECEIPTS_BUCKET`.

Recommended path layout:

- `{userId}/{year}/{month}/{uuid}.{ext}`

## Migration flow

This repo currently contains hand-authored SQL migrations under `drizzle/migrations/`.

Use:

```bash
npm run db:migrate
```

When you add schema changes:

1. Update [lib/db/schema.ts](/Users/mac/Documents/sketchs/receiptbridge/lib/db/schema.ts:1)
2. Add a matching SQL migration file in `drizzle/migrations/`
3. Run migrations locally
4. Verify with `npm run build`, `npm run lint`, `npm test`

## Queue runner

Upload requests enqueue rows in `receipt_processing_jobs`. The upload request still kicks off the job immediately, but the durable source of truth is the database job row.

You can process backlog jobs with:

```bash
curl -X POST \
  -H "Authorization: Bearer $RECEIPT_JOB_RUNNER_SECRET" \
  http://localhost:3000/api/internal/receipt-jobs
```

You can also target a single job:

```bash
curl -X POST \
  -H "Authorization: Bearer $RECEIPT_JOB_RUNNER_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"jobId":"<job-id>"}' \
  http://localhost:3000/api/internal/receipt-jobs
```

In production, point a cron runner at that internal route.

## File handling policy

- Supported now: `image/jpeg`, `image/png`, `image/heic`, `image/heif`
- Rejected on signature mismatch even if MIME type claims otherwise
- PDF is intentionally rejected until a real PDF extraction path exists
- Max file size: 10 MB

## Demo data

This repo includes demo fixtures in `demo/receipts.json`.

To seed them into a local database:

```bash
DEMO_USER_ID=<supabase-user-uuid> npm run seed:demo
```

The inserted receipts will belong to that user ID so you can log in as that user and see them in the app.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## CI

GitHub Actions is configured in `.github/workflows/ci.yml` to run:

- TypeScript
- ESLint
- Vitest
