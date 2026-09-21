import { Clock, HeartHandshake, ShieldCheck, Smile } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const benefits = [
  {
    icon: HeartHandshake,
    title: 'Dejá de insistir por WhatsApp',
    text: 'Invayt le recuerda a cada uno. Vos no escribís un solo mensaje más.',
  },
  {
    icon: Smile,
    title: 'No vuelvas a ser el malo del grupo',
    text: 'Volvés a ser un compañero, no el que persigue a todos por la plata.',
  },
  {
    icon: Clock,
    title: 'Recuperá tu tiempo',
    text: 'Nada de cruzar capturas ni actualizar planillas. Se resuelve solo.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguí usando Mercado Pago',
    text: 'La plata va a la cuenta que ya usás y queda registrada al instante.',
  },
]

export function BenefitsSection() {
  return (
    <section
      id="beneficios"
      className="border-y border-border bg-muted/40"
    >
      <div className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">Lo que ganás</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Volvé a disfrutar el tercer tiempo.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08}>
              <div className="flex h-full gap-4 rounded-2xl border border-border bg-card p-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <b.icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-1.5 text-pretty leading-relaxed text-muted-foreground">
                    {b.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
