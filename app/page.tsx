import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Navbar } from '@/components/app/navbar'
import { Footer } from '@/components/app/footer'
import { Check, X, Play, ArrowRight, Upload, Sparkles, FileSpreadsheet, Shield } from 'lucide-react'
import { getServerTranslations } from '@/lib/i18n/server'

export default async function LandingPage() {
  const t = await getServerTranslations()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden grid-paper">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-5 gap-12 items-center">
              {/* Left content - 60% */}
              <div className="md:col-span-3 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0F766E]/10 text-[#0F766E] text-sm font-medium">
                  <Shield className="w-4 h-4" />
                  {t.landing.badge}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                  {t.landing.hero.headline}
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty">
                  {t.landing.hero.subheadline}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/dashboard">
                    <Button size="lg" className="w-full sm:w-auto bg-[#0F766E] hover:bg-[#0F766E]/90 text-white text-base px-8">
                      {t.landing.hero.cta}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-base">
                    <Play className="mr-2 w-5 h-5" />
                    {t.landing.hero.ctaSecondary}
                  </Button>
                </div>
                
                {/* Trust indicators */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#166534]" />
                    {t.landing.trust.checksum}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#166534]" />
                    {t.landing.trust.invoiceFormat}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#166534]" />
                    {t.landing.trust.govVerify}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-[#166534]" />
                    {t.landing.trust.dateConvert}
                  </span>
                </div>
              </div>
              
              {/* Right mockup - 40% */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Card className="shadow-lg border-border">
                    <CardContent className="p-4">
                      {/* Mock receipt image */}
                      <div className="aspect-[3/4] bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <FileSpreadsheet className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <span className="text-sm">{t.review.receiptPrefix}</span>
                        </div>
                      </div>
                      {/* Mock extracted fields */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t.fields.vendorName}</span>
                          <span className="text-sm font-medium flex items-center gap-1.5">
                            家樂福 中科店
                            <Check className="w-4 h-4 text-[#166534]" />
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t.fields.taxId}</span>
                          <span className="text-sm font-mono flex items-center gap-1.5">
                            83579948
                            <Check className="w-4 h-4 text-[#166534]" />
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">金額</span>
                          <span className="text-sm font-mono flex items-center gap-1.5">
                            NT$ 1,260
                            <Check className="w-4 h-4 text-[#166534]" />
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Floating badges */}
                  <div className="absolute -top-3 -right-3 bg-[#166534] text-white px-3 py-1.5 rounded-lg text-sm font-medium shadow-lg">
                    Checksum 驗證通過
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t.landing.problem.title}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {t.landing.problem.items.map((item, index) => (
                <Card key={index} className="border-border">
                  <CardHeader>
                    <span className="text-4xl mb-2">{item.icon}</span>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="features" className="grid-paper py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t.landing.solution.title}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t.brand.subTagline}
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {t.landing.solution.items.map((item, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-xl bg-[#0F766E]/10 flex items-center justify-center mb-2">
                      {index === 0 && <Upload className="w-6 h-6 text-[#0F766E]" />}
                      {index === 1 && <Sparkles className="w-6 h-6 text-[#0F766E]" />}
                      {index === 2 && <FileSpreadsheet className="w-6 h-6 text-[#0F766E]" />}
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-pretty">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t.landing.comparison.title}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t.landing.comparison.subtitle}
            </p>
            
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 font-medium">功能</th>
                    <th className="text-center py-4 px-4 font-medium text-[#0F766E]">發票橋</th>
                    <th className="text-center py-4 px-4 font-medium text-muted-foreground">一般工具</th>
                  </tr>
                </thead>
                <tbody>
                  {t.landing.comparison.features.map((feature, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="py-4 px-4">{feature.name}</td>
                      <td className="py-4 px-4 text-center">
                        {feature.us === true ? (
                          <Check className="w-5 h-5 text-[#166534] mx-auto" />
                        ) : feature.us === false ? (
                          <X className="w-5 h-5 text-[#991B1B] mx-auto" />
                        ) : (
                          <span className="text-sm font-medium text-[#0F766E]">{feature.us}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {feature.others === true ? (
                          <Check className="w-5 h-5 text-[#166534] mx-auto" />
                        ) : feature.others === false ? (
                          <X className="w-5 h-5 text-[#991B1B] mx-auto" />
                        ) : (
                          <span className="text-sm text-muted-foreground">{feature.others}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="grid-paper py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t.landing.howItWorks.title}
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                {t.landing.howItWorks.steps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-medium mb-1">{step.title}</h3>
                    {step.time && (
                      <span className="text-xs text-[#CA8A04] font-medium">{step.time}</span>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Built For Section */}
        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* SME owners */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>{t.landing.builtFor.sme.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.landing.builtFor.sme.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              {/* Accountants */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>{t.landing.builtFor.accountant.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {t.landing.builtFor.accountant.items.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-[#166534] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="grid-paper py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t.landing.pricing.title}
            </h2>
            
            <Card className="max-w-xl mx-auto border-border bg-card">
              <CardContent className="p-8 text-center">
                <p className="text-lg text-muted-foreground mb-6">
                  {t.landing.pricing.desc}
                </p>
                <a href="mailto:contact@receiptbridge.app">
                  <Button size="lg" className="bg-[#CA8A04] hover:bg-[#CA8A04]/90 text-white">
                    {t.landing.pricing.cta}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section id="contact" className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t.landing.faq.title}
            </h2>
            
            <div className="max-w-2xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {t.landing.faq.items.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-[#0F766E] py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              準備好簡化您的發票流程了嗎？
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              立即開始免費試用，體驗專為台灣中小企業設計的發票管理工具。
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="bg-white text-[#0F766E] hover:bg-white/90 text-base px-8">
                免費開始使用
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
