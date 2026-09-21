'use client'

import { useEffect } from 'react'
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  joinDeepLink,
  payDeepLink,
} from '@/lib/app-links'

type AppLinkFallbackProps =
  | { type: 'join'; value: string }
  | { type: 'pay'; value: string }

export function AppLinkFallback({ type, value }: AppLinkFallbackProps) {
  const deepLink = type === 'join' ? joinDeepLink(value) : payDeepLink(value)

  useEffect(() => {
    if (type === 'join') {
      window.location.replace(deepLink)
    }
  }, [deepLink, type])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-7 text-center shadow-2xl shadow-primary/10 sm:p-10">
        <div className="mb-6 text-xl font-semibold tracking-tight text-primary">
          Invayt
        </div>

        {type === 'join' ? (
          <>
            <h1 className="text-xl font-semibold text-foreground">
              Abrí este link desde tu celular para unirte al equipo
            </h1>
            <a
              className="mt-7 flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              href={deepLink}
            >
              Abrir en la app
            </a>
            <StoreLinks />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Si no tenés la app instalada, descargala arriba y después volvé a
              tocar el link de invitación desde WhatsApp.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-primary">
              Link de pago de partido
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Abrí este link en la app Invayt para ver los detalles del partido.
            </p>
            <div className="mt-6 text-left">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Identificador del partido
              </p>
              <div className="mt-2 break-words rounded-lg border border-primary/20 bg-accent p-3 font-mono text-sm text-foreground">
                {value}
              </div>
            </div>
            <a
              className="mt-6 flex h-12 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              href={deepLink}
            >
              Abrir en la app
            </a>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              La app recibirá este identificador para cargar el partido. El pago
              online estará disponible próximamente.
            </p>
          </>
        )}
      </div>
    </main>
  )
}

function StoreLinks() {
  return (
    <div className="mt-3 space-y-3">
      <StoreLink href={APP_STORE_URL}>Descargar en App Store</StoreLink>
      <StoreLink href={GOOGLE_PLAY_URL}>Descargar en Google Play</StoreLink>
    </div>
  )
}

function StoreLink({ href, children }: { href: string; children: string }) {
  if (!href) {
    return (
      <span className="flex h-12 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-muted-foreground">
        {children} · Próximamente
      </span>
    )
  }

  return (
    <a
      className="flex h-12 items-center justify-center rounded-lg border border-primary px-5 text-sm font-medium text-primary transition-colors hover:bg-accent"
      href={href}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  )
}