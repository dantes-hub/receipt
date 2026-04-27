type LogLevel = 'info' | 'warn' | 'error'

interface LogPayload {
  event: string
  level: LogLevel
  timestamp: string
  [key: string]: unknown
}

function writeLog(level: LogLevel, event: string, context: Record<string, unknown> = {}) {
  const payload: LogPayload = {
    event,
    level,
    timestamp: new Date().toISOString(),
    ...context,
  }

  const message = JSON.stringify(payload)
  if (level === 'error') {
    console.error(message)
    return
  }
  if (level === 'warn') {
    console.warn(message)
    return
  }
  console.log(message)
}

export function logInfo(event: string, context?: Record<string, unknown>) {
  writeLog('info', event, context)
}

export function logWarn(event: string, context?: Record<string, unknown>) {
  writeLog('warn', event, context)
}

export function logError(event: string, context?: Record<string, unknown>) {
  writeLog('error', event, context)
}
