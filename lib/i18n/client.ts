'use client'

import { useEffect, useState } from 'react'
import {
  getClientLocale,
  getTranslations,
  LOCALE_CHANGE_EVENT,
  type Locale,
  type Translations,
} from './index'

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>('zh-TW')

  useEffect(() => {
    setLocale(getClientLocale())

    const handler = (e: Event) => setLocale((e as CustomEvent<Locale>).detail)
    window.addEventListener(LOCALE_CHANGE_EVENT, handler)
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, handler)
  }, [])

  return locale
}

export function useTranslations(): Translations {
  const locale = useLocale()
  return getTranslations(locale)
}
