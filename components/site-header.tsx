'use client'

import { Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Logo from '../public/curved-square-logo.png'
const nav = [
  { label: 'Cómo funciona', href: '#como-funciona' },
  { label: 'Beneficios', href: '#beneficios' },
  { label: 'Oferta Fundador', href: '#oferta' },
  { label: 'Preguntas', href: '#faq' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2" aria-label="Ir al inicio de Invayt">
          <img width='40px' src={Logo.src} />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Invayt
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={`/${item.href}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground sm:inline-flex"
            nativeButton={false}
            render={<a href="/#oferta" />}
          >
            Ingresar
          </Button>
          <Button size="sm" nativeButton={false} render={<a href="/#oferta" />}>
            <span className="sm:hidden">Sumate</span>
            <span className="hidden sm:inline">Quiero ser Club Fundador</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
