'use client'

import { startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { setClientLocale } from '@/lib/i18n'
import { useLocale } from '@/lib/i18n/client'
import type { Locale } from '@/lib/i18n'

interface LocaleToggleProps {
  className?: string
}

const localeLabels: Record<Locale, string> = {
  'zh-TW': '繁中',
  en: 'EN',
}

export function LocaleToggle({ className }: LocaleToggleProps) {
  const router = useRouter()
  const locale = useLocale()

  const handleSwitch = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      return
    }

    setClientLocale(nextLocale)
    startTransition(() => {
      router.refresh()
    })
  }

  return (
    <div className={cn('inline-flex items-center gap-1 text-sm', className)}>
      {(['zh-TW', 'en'] as const).map((value, index) => (
        <div key={value} className="flex items-center gap-1">
          {index > 0 && <span className="text-border">|</span>}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleSwitch(value)}
            className={cn(
              'h-auto px-1.5 py-0 text-muted-foreground',
              locale === value && 'text-foreground font-medium'
            )}
          >
            {localeLabels[value]}
          </Button>
        </div>
      ))}
    </div>
  )
}
