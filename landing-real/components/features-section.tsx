import {
  BellRing,
  CreditCard,
  Eye,
  FileSpreadsheet,
  Repeat,
  Users,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'

const features = [
  {
    icon: Eye,
    title: 'Seguimiento en vivo',
    text: 'Ves quién pagó y quién falta al instante, sin preguntarle a nadie.',
  },
  {
    icon: CreditCard,
    title: 'Todos los medios de pago',
    text: 'Mercado Pago, tarjeta de crédito, débito y transferencia. Cada uno paga como quiere.',
  },
  {
    icon: BellRing,
    title: 'Recordatorios automáticos',
    text: 'Invayt le recuerda a los que faltan. Vos no tenés que escribir un solo mensaje.',
  },
  {
    icon: Repeat,
    title: 'Cobros recurrentes',
    text: 'Tercer tiempo, cuota o viáticos. Se configura una sola vez.',
  },
  {
    icon: Users,
    title: 'Plantel organizado',
    text: 'Todos los jugadores en un lugar, con su historial de pagos.',
  },
  {
    icon: FileSpreadsheet,
    title: 'Todo queda registrado',
    text: 'Cada pago documentado automáticamente. Sin planillas.',
  },
]

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Lo hace por vos</p>
        <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Todo lo que hacías a mano, ahora se hace solo.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={(i % 3) * 0.06}>
            <div className="h-full bg-card p-6">
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
