'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { validateTaxId } from '@/lib/validators'
import { Check, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface TaiwanTaxIdInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export function TaiwanTaxIdInput({ value, onChange, className, disabled }: TaiwanTaxIdInputProps) {
  const [validation, setValidation] = useState<{ valid: boolean; error?: string } | null>(null)

  useEffect(() => {
    if (value.length === 8) {
      setValidation(validateTaxId(value))
    } else if (value.length > 0) {
      setValidation({ valid: false, error: '統編必須為 8 位數字' })
    } else {
      setValidation(null)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 8
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 8)
    onChange(newValue)
  }

  return (
    <div className={cn('relative', className)}>
      <Input
        value={value}
        onChange={handleChange}
        placeholder="12345678"
        maxLength={8}
        disabled={disabled}
        className={cn(
          'font-mono pr-10',
          validation?.valid && 'border-[#166534] focus-visible:ring-[#166534]',
          validation && !validation.valid && value.length === 8 && 'border-[#991B1B] focus-visible:ring-[#991B1B]'
        )}
      />
      {validation && value.length === 8 && (
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
              <p>{validation.valid ? 'Checksum 驗證通過' : validation.error}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}
