'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Logo } from './logo'
import { LocaleToggle } from './locale-toggle'
import { Menu, X } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/client'

interface NavbarProps {
  isApp?: boolean
}

export function Navbar({ isApp = false }: NavbarProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const hashPrefix = pathname === '/' ? '' : '/'
  const marketingLinks = [
    { href: `${hashPrefix}#features`, label: t.nav.features },
    { href: `${hashPrefix}#how-it-works`, label: t.nav.howItWorks },
    { href: `${hashPrefix}#pricing`, label: t.nav.pricing },
    { href: `${hashPrefix}#contact`, label: t.nav.contact },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Logo size="md" />
        </Link>

        {/* Desktop navigation */}
        {!isApp && (
          <div className="hidden md:flex items-center gap-8">
            {marketingLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-3">
          <LocaleToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">
              {t.nav.login}
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="bg-[#0F766E] hover:bg-[#0F766E]/90 text-white">
              {t.nav.tryFree}
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? '關閉選單' : '開啟選單'}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && !isApp && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {marketingLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              <Link href="/login" className="block">
                <Button variant="outline" className="w-full">
                  {t.nav.login}
                </Button>
              </Link>
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 text-white">
                  {t.nav.tryFree}
                </Button>
              </Link>
              <div className="pt-2">
                <LocaleToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
