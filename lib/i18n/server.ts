import { cookies } from 'next/headers'
import {
  getTranslations,
  isLocale,
  LOCALE_COOKIE_NAME,
  type Locale,
  type Translations,
} from './index'

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get(LOCALE_COOKIE_NAME)?.value
  return isLocale(localeCookie) ? localeCookie : 'zh-TW'
}

export async function getServerTranslations(): Promise<Translations> {
  return getTranslations(await getServerLocale())
}
