# ReceiptBridge TODO

## Now

- [x] `RB-001` Initialize git repo, create `main` and `dev`, push to GitHub
- [ ] `RB-002` Create Vercel project and sync production env vars
- [ ] `RB-003` Verify magic link auth end-to-end on deployed and local environments
- [x] `RB-004` Align DB schema, TS types, mock data, and UI receipt statuses

## This Week

- [ ] `RB-005` Collect and organize 30 Taiwan receipt samples in `test-receipts/`
- [x] `RB-006` Build `lib/ai/extract.ts` with strict schema and ROC date normalization
- [x] `RB-007` Implement `POST /api/receipts/upload` with async extraction flow

## Next

- [ ] `RB-008` Build validation orchestrator and persist validation logs
- [ ] `RB-009` Wire receipt detail page to real receipt data and edit flow
- [ ] `RB-010` Replace dashboard and receipt list mock data with Supabase queries
- [ ] `RB-013` Connect upload UI to the real upload API
- [ ] `RB-014` Add extraction benchmark script and accuracy report

## Before Launch

- [ ] `RB-011` Confirm accountant export format with a real Taiwan accountant
- [ ] `RB-012` Implement CSV and Excel export in accountant format
- [ ] `RB-015` Add rate limiting and tighten operational safeguards
- [ ] `RB-016` Finish production polish, error tracking, copy review, and mobile QA
- [ ] `RB-017` Prepare demo data, export sample, video, and outreach message
