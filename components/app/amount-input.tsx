'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { formatNumber, parseFormattedNumber } from '@/lib/validators'

interface AmountInputProps {
  value: number
  onChange: (value: number) => void
  className?: string
  disabled?: boolean
}

export function AmountInput({ value, onChange, className, disabled }: AmountInputProps) {
  const [displayValue, setDisplayValue] = useState(formatNumber(value))
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value))
    }
  }, [value, isFocused])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    // Convert full-width to half-width and allow only digits and commas
    const cleaned = input
      .replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
      .replace(/[^\d,]/g, '')
    
    setDisplayValue(cleaned)
    
    const numericValue = parseFormattedNumber(cleaned)
    if (!isNaN(numericValue)) {
      onChange(numericValue)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Remove formatting on focus for easier editing
    setDisplayValue(value.toString())
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Reformat on blur
    setDisplayValue(formatNumber(value))
  }

  return (
    <div className={cn('relative', className)}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
        NT$
      </span>
      <Input
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        className="font-mono text-right pl-12 pr-3"
        inputMode="numeric"
      />
    </div>
  )
}
