# ReceiptBridge Roadmap

Last updated: 2026-04-20

## Current State

Already done:
- Next.js app scaffolded
- UI pages built
- Supabase auth wired
- auth callback route wired
- `proxy.ts` auth guard in place
- Drizzle schema and migrations created
- Supabase tables and storage set up
- Taiwan validator utilities started
- zh-TW and EN translations exist
- mobile-first UI baseline exists
- upload API created with async extraction kickoff
- OpenAI extraction contract and ROC date normalization implemented
- receipt queries wired for dashboard, list, detail, and export
- accountant CSV export route implemented

Not done yet:
- Vercel deploy
- end-to-end login verification
- production-grade background job infrastructure
- PDF extraction support
- accountant export format confirmation
- analytics, error tracking, QA, and outreach assets

## Tickets

### RB-001 Git Initialization and GitHub Repo

- Priority: P0
- Estimate: 1h
- Acceptance:
- local git repo initialized
- `main` and `dev` branches created
- GitHub remote created and pushed
- README includes setup, env vars, and local run steps

### RB-002 Vercel Project and Environment Sync

- Priority: P0
- Estimate: 1h
- Acceptance:
- Vercel project created
- all `.env.local` runtime vars mirrored in Vercel
- preview deployment succeeds
- auth callback URL matches deployed domain

### RB-003 End-to-End Auth Verification

- Priority: P0
- Estimate: 1h
- Acceptance:
- magic link login works on `localhost:3002`
- protected routes redirect correctly
- authenticated user reaches `/dashboard`
- sign-out and re-login behave correctly

### RB-004 Canonical Receipt Domain Model Alignment

- Priority: P0
- Estimate: 3h
- Acceptance:
- one receipt status model shared across DB, TS types, UI badges, and API
- one extracted receipt schema shared across AI, validators, DB, and export
- mock data updated to match canonical types
- no frontend code depends on obsolete status names if DB uses different statuses

### RB-005 Receipt Sample Set and Test Harness

- Priority: P0
- Estimate: 3h
- Acceptance:
- `test-receipts/` gitignored
- at least 30 Taiwan receipts collected
- coverage across convenience store, restaurant, handwritten, fuel, e-invoice, and industrial or hardware
- script can run extraction on all samples and write results to disk

### RB-006 GPT-4o Extraction Contract

- Priority: P0
- Estimate: 5h
- Acceptance:
- `lib/ai/extract.ts` created
- OpenAI structured output uses strict schema
- schema covers required fields and per-field confidence
- ROC date normalization handled
- extraction output validates with Zod before persistence

### RB-007 Upload API and Async Processing Flow

- Priority: P0
- Estimate: 5h
- Acceptance:
- `POST /api/receipts/upload` accepts multipart upload
- file stored in Supabase private bucket
- receipt row created immediately with pending or extracting status
- extraction runs asynchronously after upload
- client receives receipt ID and can observe status changes
- file type and size limits enforced

### RB-008 Taiwan Validation Orchestrator

- Priority: P0
- Estimate: 4h
- Acceptance:
- `validateReceipt(extracted)` implemented
- tax ID, invoice number, ROC date, and amount or tax checks all run through one orchestrator
- per-field result and overall result returned
- validation results stored on receipt row
- validation logs written to `validation_logs`

### RB-009 Receipt Detail Page Wired to Real Data

- Priority: P0
- Estimate: 5h
- Acceptance:
- `app/receipts/[id]/page.tsx` loads real receipt by ID
- image, extracted fields, confidence, and validation badges come from DB
- inline edits update receipt and write correction log
- confirm action persists final reviewed state

### RB-010 Dashboard and Receipts List Wired to Supabase

- Priority: P1
- Estimate: 4h
- Acceptance:
- dashboard stats use real queries
- recent receipts list uses real data
- receipts table uses real pagination and filtering
- no mock data dependency on dashboard or list pages

### RB-011 Accountant Export Format Confirmation

- Priority: P0
- Estimate: 30m
- Acceptance:
- one real Taiwan accountant reviews desired export columns
- preferred CSV or Excel structure documented
- debit and credit mapping assumptions explicitly confirmed

### RB-012 Accountant CSV and Excel Export

- Priority: P0
- Estimate: 6h
- Acceptance:
- `lib/export/accountant-csv.ts` implemented
- UTF-8 BOM CSV opens cleanly in Taiwan Excel
- Excel export generated with readable widths
- exported columns match confirmed accountant format
- export batch recorded in DB

### RB-013 Upload UX Wiring

- Priority: P1
- Estimate: 3h
- Acceptance:
- dashboard upload widget hits real API
- per-file progress and processing state visible
- error states for invalid file, oversize, and extraction failure
- mobile camera upload works in-browser

### RB-014 Accuracy Benchmark and Prompt Iteration

- Priority: P0
- Estimate: 4h
- Acceptance:
- test script scores required fields on sample set
- accuracy report generated
- prompt iterated until target threshold is met or bottlenecks documented
- threshold defined explicitly per required field set

### RB-015 Rate Limiting and Operational Safety

- Priority: P1
- Estimate: 2h
- Acceptance:
- upload endpoint rate-limited
- OpenAI key spending cap set
- file validation hardened
- failure paths logged

### RB-016 Production Polish

- Priority: P0
- Estimate: 4h
- Acceptance:
- Sentry or equivalent error tracking installed
- privacy policy and terms pages added
- zh-TW copy reviewed by native speaker
- mobile QA done on real iPhone and Android
- no horizontal overflow at 375px

### RB-017 Demo Readiness

- Priority: P0
- Estimate: 4h
- Acceptance:
- seeded demo data available
- export example available
- 90-second demo video recorded
- outreach message drafted in zh-TW and EN

## Weekly Plan

### Week 1

- `RB-001`
- `RB-002`
- `RB-003`
- `RB-004`
- `RB-005`
- `RB-006`
- `RB-007`
- Ship goal: upload a receipt and get validated extracted data stored in DB

### Week 2

- `RB-008`
- `RB-009`
- `RB-010`
- `RB-013`
- `RB-014`
- Ship goal: real review workflow with visible validation

### Week 3

- `RB-011`
- `RB-012`
- `RB-015`
- `RB-016`
- `RB-017`
- Ship goal: production-ready demo that can be sent to the partner

## MVP Definition of Done

- deployed on Vercel with working auth
- receipt upload works on mobile
- GPT-4o extraction persisted to DB
- Taiwan validation visibly runs
- review screen works with real data
- accountant-approved CSV and Excel export works
- demo-ready seeded data and outreach assets exist
