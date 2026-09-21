'use client'

import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const WHATSAPP_URL =
  'https://wa.me/5491161417050?text=Buenas%21%20Quisiera%20dar%20de%20alta%20mi%20Club%20de%20Rugby%20en%20Invayt'

declare global {
  interface Window {
    Tally?: {
      openPopup: (
        formId: string,
        options?: {
          emoji?: { text: string; animation: string }
          onSubmit?: () => void
        },
      ) => void
    }
  }
}

export function FounderCTA() {
  function handleClick() {
    if (typeof window === 'undefined' || !window.Tally) {
      // Fallback: si el widget aún no cargó, abrimos el form en una pestaña.
      window.open('https://tally.so/r/Y5XPBq', '_blank', 'noopener,noreferrer')
      return
    }

    window.Tally.openPopup('Y5XPBq', {
      emoji: { text: '👋', animation: 'wave' },
      onSubmit: () => {
        // Navegamos en la ventana principal (top) para salir del iframe de
        // Tally. Si intentáramos redirigir dentro del iframe, WhatsApp lo
        // bloquea porque no permite abrirse embebido.
        const target = window.top ?? window
        try {
          target.location.href = WHATSAPP_URL
        } catch {
          // Si el navegador bloquea el acceso a top, abrimos en una pestaña.
          window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')
        }
      },
    })
  }

  return (
    <Button size="lg" className="mt-8 h-12 w-full text-sm" onClick={handleClick}>
      Quiero ser Club Fundador
      <ArrowRight className="size-4" />
    </Button>
  )
}
