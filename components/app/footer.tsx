'use client'

import Link from 'next/link'
import { Logo } from './logo'
import { LocaleToggle } from './locale-toggle'
import { useTranslations } from '@/lib/i18n/client'

export function Footer() {
  const t = useTranslations()
  const footerLinks = {
    product: {
      title: t.footer.product,
      links: [
        { label: t.nav.features, href: '#features' },
        { label: t.nav.howItWorks, href: '#how-it-works' },
        { label: t.nav.pricing, href: '#pricing' },
      ],
    },
    resources: {
      title: t.footer.resources,
      links: [
        { label: t.footer.help, href: '#' },
        { label: t.footer.blog, href: '#' },
        { label: t.footer.apiDocs, href: '#' },
      ],
    },
    legal: {
      title: t.footer.legal,
      links: [
        { label: t.footer.terms, href: '/terms' },
        { label: t.footer.privacy, href: '/privacy' },
      ],
    },
    contact: {
      title: t.footer.contact,
      links: [
        { label: 'contact@receiptbridge.app', href: 'mailto:contact@receiptbridge.app' },
      ],
    },
  }

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" showEnglish={false} />
            <p className="mt-3 text-sm text-muted-foreground">
              {t.footer.description}
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-medium text-sm mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <LocaleToggle />
          
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              {t.footer.copyright}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.footer.madeBy}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
