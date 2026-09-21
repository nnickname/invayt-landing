'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: '¿Cuánto cuesta usar Invayt?',
    a: 'No hay mensualidad, ni costo fijo, ni setup. La plataforma solo cobra una comisión del 0,5% sobre lo recaudado a través de la app. Si vos no cobrás, Invayt tampoco cobra.',
  },
  {
    q: '¿Cómo pagan los jugadores?',
    a: 'Cada uno abre el link desde su teléfono y paga con Mercado Pago, tarjeta o transferencia. No instalan nada.',
  },
  {
    q: '¿A dónde llega la plata?',
    a: 'Directo a la cuenta que ya usás para el evento. Vos nunca más manejás la plata de todos ni ponés de tu bolsillo.',
  },
  {
    q: '¿Sirve para algo más que el tercer tiempo?',
    a: 'De momento no. Pero a futuro lanzaremos nuevas funcionalidades que te sean útiles.',
  },
  {
    q: '¿Tengo que perseguir a los que no pagan?',
    a: 'No. Invayt manda los recordatorios automáticos. Vos solo mirás quién ya pagó.',
  },
  {
    q: '¿Qué significa ser Club Fundador?',
    a: 'Los primeros 5 clubes acceden a condiciones fundadoras sin mensualidad y a acompañamiento directo de nuestro equipo.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-medium text-foreground">{q}</span>
        <Plus
          className={cn(
            'size-5 shrink-0 text-muted-foreground transition-transform duration-300',
            open && 'rotate-45',
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-pretty leading-relaxed text-muted-foreground">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqSection() {
  return (
    <section
      id="faq"
      className="border-t border-border bg-muted/40"
    >
      <div className="mx-auto max-w-3xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Preguntas frecuentes</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Todo lo que querés saber antes de sumarte.
          </h2>
        </Reveal>

        <div className="mt-10 space-y-3 sm:mt-12">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <FaqItem q={f.q} a={f.a} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
