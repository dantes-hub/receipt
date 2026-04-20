'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { rocToWestern, westernToRoc } from '@/lib/validators'
import { InfoBadge } from './validation-badge'

interface DateInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  allowMinguo?: boolean
}

export function DateInput({ value, onChange, className, disabled, allowMinguo = true }: DateInputProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const [rocDisplay, setRocDisplay] = useState<string | null>(null)

  useEffect(() => {
    setDisplayValue(value)
    // If it's a western date, show ROC equivalent
    if (allowMinguo && /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value)) {
      setRocDisplay(westernToRoc(value))
    } else {
      setRocDisplay(null)
    }
  }, [value, allowMinguo])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    setDisplayValue(input)
    
    // Try to parse as ROC date
    if (allowMinguo) {
      const converted = rocToWestern(input)
      if (converted) {
        onChange(converted.western)
        return
      }
    }
    
    onChange(input)
  }

  const handleBlur = () => {
    // Try to auto-convert ROC date on blur
    if (allowMinguo) {
      const converted = rocToWestern(displayValue)
      if (converted) {
        setDisplayValue(converted.western)
        setRocDisplay(converted.roc)
        onChange(converted.western)
      }
    }
  }

  return (
    <div className={cn('space-y-1.5', className)}>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="2026/04/19"
        disabled={disabled}
        className="font-mono"
      />
      {rocDisplay && (
        <InfoBadge label={`民國 ${rocDisplay} → ${displayValue}`} />
      )}
    </div>
  )
}
