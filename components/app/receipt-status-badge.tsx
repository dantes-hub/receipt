'use client'

import { cn } from '@/lib/utils'
import { Loader2, ScanSearch, CheckCircle, AlertTriangle } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/client'
import type { ReceiptStatus } from '@/types/receipt'

interface ReceiptStatusBadgeProps {
  status: ReceiptStatus
  className?: string
}

const statusStyle: Record<ReceiptStatus, {
  icon: typeof Loader2
  bgColor: string
  textColor: string
  borderColor: string
  spin: boolean
}> = {
  pending: {
    icon: Loader2,
    bgColor: 'bg-muted',
    textColor: 'text-muted-foreground',
    borderColor: 'border-border',
    spin: true,
  },
  extracting: {
    icon: Loader2,
    bgColor: 'bg-[#0F766E]/10',
    textColor: 'text-[#0F766E]',
    borderColor: 'border-[#0F766E]/20',
    spin: true,
  },
  review: {
    icon: ScanSearch,
    bgColor: 'bg-[#B45309]/10',
    textColor: 'text-[#B45309]',
    borderColor: 'border-[#B45309]/20',
    spin: false,
  },
  confirmed: {
    icon: CheckCircle,
    bgColor: 'bg-[#166534]/10',
    textColor: 'text-[#166534]',
    borderColor: 'border-[#166534]/20',
    spin: false,
  },
  error: {
    icon: AlertTriangle,
    bgColor: 'bg-[#991B1B]/10',
    textColor: 'text-[#991B1B]',
    borderColor: 'border-[#991B1B]/20',
    spin: false,
  },
}

export function ReceiptStatusBadge({ status, className }: ReceiptStatusBadgeProps) {
  const t = useTranslations()
  const style = statusStyle[status]
  const Icon = style.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium border',
        style.bgColor,
        style.textColor,
        style.borderColor,
        className
      )}
    >
      <Icon className={cn('w-4 h-4', style.spin && 'animate-spin')} />
      {t.status[status]}
    </span>
  )
}
