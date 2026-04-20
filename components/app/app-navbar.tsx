'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Logo } from './logo'
import { LocaleToggle } from './locale-toggle'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { FileText, Download, Settings, LogOut, User, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useTranslations } from '@/lib/i18n/client'
import { createClient } from '@/lib/supabase/client'

export function AppNavbar() {
  const t = useTranslations()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const avatarInitial = userEmail ? userEmail[0].toUpperCase() : '?'
  const displayName = userEmail ?? ''
  const navTabs = [
    { href: '/dashboard', label: t.nav.receipts, icon: FileText },
    { href: '/export', label: t.nav.export, icon: Download },
    { href: '/settings', label: t.nav.settings, icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/dashboard">
            <Logo size="sm" showEnglish={false} />
          </Link>

          {/* Desktop tabs */}
          <div className="hidden md:flex items-center gap-1">
            {navTabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href)
              const Icon = tab.icon
              return (
                <Link key={tab.href} href={tab.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      'gap-2',
                      isActive && 'bg-muted text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>

        {/* User menu - desktop */}
        <div className="hidden md:flex items-center gap-3">
          <LocaleToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="bg-[#0F766E] text-white text-xs">{avatarInitial}</AvatarFallback>
                </Avatar>
                <span className="text-sm max-w-[120px] truncate">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  {t.settings.tabs.profile}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  {t.nav.settings}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t.actions.logout}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? t.actions.closeMenu : t.actions.openMenu}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navTabs.map((tab) => {
              const isActive = pathname.startsWith(tab.href)
              const Icon = tab.icon
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      'w-full justify-start gap-2',
                      isActive && 'bg-muted text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </Button>
                </Link>
              )
            })}
            <div className="pt-4 border-t border-border">
              <div className="mb-3">
                <LocaleToggle />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-destructive"
                onClick={() => { setMobileMenuOpen(false); void handleLogout() }}
              >
                <LogOut className="w-4 h-4" />
                {t.actions.logout}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
