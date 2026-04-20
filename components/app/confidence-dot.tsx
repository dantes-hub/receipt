'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { ConfidenceLevel } from '@/types/receipt'

interface ConfidenceDotProps {
  level: ConfidenceLevel
  score?: number
  className?: string
}

const levelColors: Record<ConfidenceLevel, string> = {
  high: 'bg-[#166534]',
  medium: 'bg-[#B45309]',
  low: 'bg-[#991B1B]',
}

const levelLabels: Record<ConfidenceLevel, string> = {
  high: '辨識信心: 高',
  medium: '辨識信心: 中',
  low: '辨識信心: 低',
}

export function ConfidenceDot({ level, score, className }: ConfidenceDotProps) {
  const label = score !== undefined 
    ? `${levelLabels[level]} (${(score * 100).toFixed(0)}%)`
    : levelLabels[level]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-block w-2 h-2 rounded-full shrink-0',
              levelColors[level],
              className
            )}
            aria-label={label}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
