'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LocaleToggle } from '@/components/app/locale-toggle'
import { Logo } from '@/components/app/logo'
import { Mail, ArrowLeft, Check, Loader2 } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/client'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const t = useTranslations()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setIsLoading(false)
    if (error) {
      setError(t.errors.uploadFailed)
    } else {
      setIsSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-background grid-paper flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-border shadow-sm">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showEnglish={false} />
            </div>
            <CardTitle className="text-2xl">{t.login.title}</CardTitle>
            <CardDescription className="text-base mt-2">
              {t.login.subtitle}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {isSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#166534]/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#166534]" />
                </div>
                <p className="text-lg font-medium mb-2">{t.login.sent}</p>
                <p className="text-muted-foreground text-sm mb-6">
                  我們已將登入連結寄送至 <strong>{email}</strong>
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSent(false)
                    setEmail('')
                  }}
                >
                  使用其他 email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.fields.email}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t.login.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#0F766E] hover:bg-[#0F766E]/90 text-white"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      傳送中...
                    </>
                  ) : (
                    t.login.submit
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <Link
            href="/"
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.login.backHome}
          </Link>
          <span className="text-border">|</span>
          <LocaleToggle />
          <span className="text-border">|</span>
          <a
            href="#"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.login.privacy}
          </a>
        </div>
      </div>
    </div>
  )
}
