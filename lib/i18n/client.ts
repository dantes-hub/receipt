'use client'

import { useEffect, useState } from 'react'
import {
  getClientLocale,
  getTranslations,
  type Locale,
  type Translations,
} from './index'

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>('zh-TW')

  useEffect(() => {
    setLocale(getClientLocale())
  }, [])

  return locale
}

export function useTranslations(): Translations {
  const locale = useLocale()
  return getTranslations(locale)
}
