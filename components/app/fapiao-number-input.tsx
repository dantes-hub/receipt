'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { validateInvoiceNumber } from '@/lib/validators'
import { Check, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface FaPiaoNumberInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export function FaPiaoNumberInput({ value, onChange, className, disabled }: FaPiaoNumberInputProps) {
  const [validation, setValidation] = useState<{ valid: boolean; error?: string; period?: string } | null>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (value.length === 10) {
      setValidation(validateInvoiceNumber(value))
    } else if (value.length > 0) {
      setValidation({ valid: false, error: '格式: AB12345678' })
    } else {
      setValidation(null)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-uppercase letters, only allow letters and digits
    let newValue = e.target.value.toUpperCase()
    
    // First 2 chars must be letters, rest must be digits
    const letters = newValue.slice(0, 2).replace(/[^A-Z]/g, '')
    const digits = newValue.slice(2).replace(/\D/g, '').slice(0, 8)
    
    newValue = letters + digits
    onChange(newValue)
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="AB12345678"
        maxLength={10}
        disabled={disabled}
        className={cn(
          'font-mono pr-10',
          validation?.valid && 'border-[#166534] focus-visible:ring-[#166534]',
          validation && !validation.valid && value.length === 10 && 'border-[#991B1B] focus-visible:ring-[#991B1B]'
        )}
      />
      {isFocused && !value && (
        <span className="absolute left-3 top-full mt-1 text-xs text-muted-foreground">
          格式: AB12345678
        </span>
      )}
      {validation && value.length === 10 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {validation.valid ? (
                  <Check className="w-4 h-4 text-[#166534]" />
                ) : (
                  <X className="w-4 h-4 text-[#991B1B]" />
                )}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{validation.valid ? '格式正確' : validation.error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
