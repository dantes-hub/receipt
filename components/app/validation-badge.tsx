import { cn } from '@/lib/utils'
import { Check, AlertTriangle, X, Info } from 'lucide-react'
import type { ValidationStatus } from '@/types/receipt'

interface ValidationBadgeProps {
  status: ValidationStatus
  label: string
  className?: string
}

const statusConfig: Record<ValidationStatus, { 
  icon: typeof Check
  bgColor: string
  textColor: string
  borderColor: string
}> = {
  pass: {
    icon: Check,
    bgColor: 'bg-[#166534]/10',
    textColor: 'text-[#166534]',
    borderColor: 'border-[#166534]/20',
  },
  warn: {
    icon: AlertTriangle,
    bgColor: 'bg-[#B45309]/10',
    textColor: 'text-[#B45309]',
    borderColor: 'border-[#B45309]/20',
  },
  fail: {
    icon: X,
    bgColor: 'bg-[#991B1B]/10',
    textColor: 'text-[#991B1B]',
    borderColor: 'border-[#991B1B]/20',
  },
}

export function ValidationBadge({ status, label, className }: ValidationBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

interface InfoBadgeProps {
  label: string
  className?: string
}

export function InfoBadge({ label, className }: InfoBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium',
        'bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20',
        className
      )}
    >
      <Info className="w-3 h-3" />
      {label}
    </span>
  )
}
