import { zhTW } from './zh-TW'
import { en } from './en'

export type Locale = 'zh-TW' | 'en'
export type Translations = typeof zhTW

export const LOCALE_COOKIE_NAME = 'receiptbridge-locale'

export const locales: Record<Locale, typeof zhTW> = {
  'zh-TW': zhTW,
  'en': en,
}

export function getTranslations(locale: Locale = 'zh-TW') {
  return locales[locale]
}

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'zh-TW' || value === 'en'
}

export function getClientLocale(): Locale {
  if (typeof document === 'undefined') {
    return 'zh-TW'
  }

  const localeCookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${LOCALE_COOKIE_NAME}=`))
    ?.split('=')[1]

  return isLocale(localeCookie) ? localeCookie : 'zh-TW'
}

export const LOCALE_CHANGE_EVENT = 'receiptbridge-locale-change'

export function setClientLocale(locale: Locale) {
  if (typeof document === 'undefined') {
    return
  }

  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; samesite=lax`
  window.dispatchEvent(new CustomEvent(LOCALE_CHANGE_EVENT, { detail: locale }))
}
