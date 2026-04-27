import * as Sentry from '@sentry/node'

let sentryInitialized = false

function ensureSentry() {
  if (sentryInitialized || !process.env.SENTRY_DSN) {
    return
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '0'),
  })
  sentryInitialized = true
}

export function captureException(error: unknown, context: Record<string, unknown> = {}) {
  ensureSentry()

  if (!sentryInitialized) {
    return
  }

  Sentry.withScope((scope) => {
    for (const [key, value] of Object.entries(context)) {
      scope.setExtra(key, value)
    }
    Sentry.captureException(error)
  })
}
