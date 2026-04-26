'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppNavbar } from '@/components/app/app-navbar'
import { TaiwanTaxIdInput } from '@/components/app/taiwan-tax-id-input'
import { User, Building2, Calculator, Tag, Bell, Shield, AlertTriangle, Loader2, Check } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/client'

interface SettingsData {
  email: string
  displayName: string
  businessName: string
  ubn: string
  businessAddress: string
  accountantName: string
  accountantFirm: string
  accountantEmail: string
  preferredFormat: 'xlsx' | 'csv' | 'pdf'
  notifyEmail: boolean
  notifyMonthly: boolean
}

const DEFAULT_SETTINGS: SettingsData = {
  email: '',
  displayName: '',
  businessName: '',
  ubn: '',
  businessAddress: '',
  accountantName: '',
  accountantFirm: '',
  accountantEmail: '',
  preferredFormat: 'xlsx',
  notifyEmail: true,
  notifyMonthly: false,
}

function SaveButton({ onSave, isSaving, showSaved }: { onSave: () => void; isSaving: boolean; showSaved: boolean }) {
  const t = useTranslations()
  return (
    <Button onClick={onSave} disabled={isSaving} className="bg-[#0F766E] hover:bg-[#0F766E]/90 text-white">
      {isSaving ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : showSaved ? (
        <Check className="w-4 h-4 mr-2" />
      ) : null}
      {showSaved ? t.settings.saved : t.settings.saveChanges}
    </Button>
  )
}

export default function SettingsPage() {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSaved, setShowSaved] = useState(false)
  const [data, setData] = useState<SettingsData>(DEFAULT_SETTINGS)

  const tabs = [
    { value: 'profile', label: t.settings.tabs.profile, icon: User },
    { value: 'company', label: t.settings.tabs.company, icon: Building2 },
    { value: 'accountant', label: t.settings.tabs.accountant, icon: Calculator },
    { value: 'categories', label: t.settings.tabs.categories, icon: Tag },
    { value: 'notifications', label: t.settings.tabs.notifications, icon: Bell },
    { value: 'security', label: t.settings.tabs.security, icon: Shield },
    { value: 'danger', label: t.settings.tabs.danger, icon: AlertTriangle },
  ]

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { setData(d); setIsLoading(false) })
      .catch(() => setIsLoading(false))
  }, [])

  const handleSave = async (fields: Partial<SettingsData>) => {
    setIsSaving(true)
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    })
    setIsSaving(false)
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">{t.nav.settings}</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col lg:flex-row gap-6">
          <TabsList className="flex lg:flex-col h-auto bg-transparent gap-1 lg:w-56 shrink-0 overflow-x-auto lg:overflow-visible p-0">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isDanger = tab.value === 'danger'
              return (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={`justify-start gap-2 px-3 py-2 data-[state=active]:bg-muted data-[state=active]:shadow-none whitespace-nowrap ${
                    isDanger ? 'text-destructive data-[state=active]:text-destructive' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="flex-1 min-w-0">
            <TabsContent value="profile" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.tabs.profile}</CardTitle>
                  <CardDescription>{t.settings.profile.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">{t.fields.name}</Label>
                    <Input
                      id="profile-name"
                      value={data.displayName}
                      onChange={(e) => setData({ ...data, displayName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profile-email">{t.fields.email}</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={data.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">{t.settings.profile.emailReadOnly}</p>
                  </div>
                  <div className="pt-4">
                    <SaveButton
                      onSave={() => handleSave({ displayName: data.displayName })}
                      isSaving={isSaving}
                      showSaved={showSaved}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.tabs.company}</CardTitle>
                  <CardDescription>{t.settings.company.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">{t.fields.company}</Label>
                    <Input
                      id="company-name"
                      value={data.businessName}
                      onChange={(e) => setData({ ...data, businessName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-taxid">{t.fields.taxId}</Label>
                    <TaiwanTaxIdInput
                      value={data.ubn}
                      onChange={(value) => setData({ ...data, ubn: value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-address">{t.fields.address}</Label>
                    <Input
                      id="company-address"
                      value={data.businessAddress}
                      onChange={(e) => setData({ ...data, businessAddress: e.target.value })}
                    />
                  </div>
                  <div className="pt-4">
                    <SaveButton
                      onSave={() => handleSave({ businessName: data.businessName, ubn: data.ubn, businessAddress: data.businessAddress })}
                      isSaving={isSaving}
                      showSaved={showSaved}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accountant" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.tabs.accountant}</CardTitle>
                  <CardDescription>{t.settings.accountant.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountant-name">{t.settings.accountant.name}</Label>
                    <Input
                      id="accountant-name"
                      value={data.accountantName}
                      onChange={(e) => setData({ ...data, accountantName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountant-firm">{t.settings.accountant.firm}</Label>
                    <Input
                      id="accountant-firm"
                      value={data.accountantFirm}
                      onChange={(e) => setData({ ...data, accountantFirm: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountant-email">{t.settings.accountant.email}</Label>
                    <Input
                      id="accountant-email"
                      type="email"
                      value={data.accountantEmail}
                      onChange={(e) => setData({ ...data, accountantEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountant-format">{t.settings.accountant.preferredFormat}</Label>
                    <Select
                      value={data.preferredFormat}
                      onValueChange={(value) => setData({ ...data, preferredFormat: value as 'xlsx' | 'csv' | 'pdf' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between pt-4 pb-2">
                    <div>
                      <p className="font-medium">{t.settings.accountant.autoSend}</p>
                      <p className="text-sm text-muted-foreground">{t.settings.accountant.comingSoon}</p>
                    </div>
                    <Switch disabled />
                  </div>
                  <div className="pt-4">
                    <SaveButton
                      onSave={() => handleSave({
                        accountantName: data.accountantName,
                        accountantFirm: data.accountantFirm,
                        accountantEmail: data.accountantEmail,
                        preferredFormat: data.preferredFormat,
                      })}
                      isSaving={isSaving}
                      showSaved={showSaved}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.tabs.categories}</CardTitle>
                  <CardDescription>{t.settings.categories.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(['dining', 'transport', 'office', 'materials', 'other'] as const).map((cat) => (
                      <div key={cat} className="flex items-center gap-2">
                        <Input value={t.categories[cat]} readOnly className="flex-1 bg-muted" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">{t.settings.categories.comingSoon}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.tabs.notifications}</CardTitle>
                  <CardDescription>{t.settings.notifications.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t.settings.notifications.emailLabel}</p>
                      <p className="text-sm text-muted-foreground">{t.settings.notifications.emailDesc}</p>
                    </div>
                    <Switch
                      checked={data.notifyEmail}
                      onCheckedChange={(checked) => setData({ ...data, notifyEmail: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t.settings.notifications.monthlyLabel}</p>
                      <p className="text-sm text-muted-foreground">{t.settings.notifications.monthlyDesc}</p>
                    </div>
                    <Switch
                      checked={data.notifyMonthly}
                      onCheckedChange={(checked) => setData({ ...data, notifyMonthly: checked })}
                    />
                  </div>
                  <div className="pt-4">
                    <SaveButton
                      onSave={() => handleSave({ notifyEmail: data.notifyEmail, notifyMonthly: data.notifyMonthly })}
                      isSaving={isSaving}
                      showSaved={showSaved}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>{t.settings.tabs.security}</CardTitle>
                  <CardDescription>{t.settings.security.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t.settings.security.emailLogin}</Label>
                    <div className="rounded-lg border border-border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{data.email}</p>
                          <p className="text-sm text-muted-foreground">{t.settings.security.magicLinkOnly}</p>
                        </div>
                        <span className="text-xs text-[#166534] bg-[#166534]/10 px-2 py-1 rounded">{t.settings.security.active}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="danger" className="m-0">
              <Card className="border-destructive/30">
                <CardHeader>
                  <CardTitle className="text-destructive">{t.settings.tabs.danger}</CardTitle>
                  <CardDescription>{t.settings.danger.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                    <div>
                      <p className="font-medium text-destructive">{t.settings.danger.deleteTitle}</p>
                      <p className="text-sm text-muted-foreground">{t.settings.danger.deleteDesc}</p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        if (!confirm('確定要永久刪除帳號嗎？此操作無法復原。\n\nAre you sure? This cannot be undone.')) return
                        await fetch('/api/account', { method: 'DELETE' })
                        window.location.href = '/'
                      }}
                    >
                      {t.settings.danger.deleteButton}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
