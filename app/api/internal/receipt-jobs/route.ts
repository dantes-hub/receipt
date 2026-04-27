import { NextResponse } from 'next/server'
import { processAvailableReceiptJobs, runReceiptProcessingJob } from '@/lib/receipts/processing'

function isAuthorized(request: Request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '')
  return token && process.env.RECEIPT_JOB_RUNNER_SECRET && token === process.env.RECEIPT_JOB_RUNNER_SECRET
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const jobId = typeof body?.jobId === 'string' ? body.jobId : null

  if (jobId) {
    const result = await runReceiptProcessingJob(jobId)
    return NextResponse.json({ result })
  }

  const limit = typeof body?.limit === 'number' ? body.limit : 10
  const results = await processAvailableReceiptJobs(limit)
  return NextResponse.json({ processed: results.length, results })
}
