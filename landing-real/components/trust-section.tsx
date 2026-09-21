import { MessagesSquare, Compass, ShieldCheck, Users } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const proof = [
  {
    icon: MessagesSquare,
    stat: '15',
    label: 'entrevistas con organizadores de rugby',
  },
  {
    icon: Compass,
    stat: 'A medida',
    label: 'producto diseñado junto al mercado',
  },
  {
    icon: ShieldCheck,
    stat: 'Piloto',
    label: 'exclusivo para clubes fundadores',
  },
  {
    icon: Users,
    stat: 'Solo 5',
    label: 'cupos de club fundador',
  },
]

export function TrustSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Construido con el rugby</p>
        <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          No lo inventamos solos. Lo diseñamos con quienes cobran.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {proof.map((p, i) => (
          <Reveal key={p.label} delay={i * 0.08}>
            <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <p.icon className="size-5" />
              </span>
              <p className="mt-6 text-3xl font-semibold tracking-tight text-foreground">
                {p.stat}
              </p>
              <p className="mt-1.5 text-pretty leading-relaxed text-muted-foreground">
                {p.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
