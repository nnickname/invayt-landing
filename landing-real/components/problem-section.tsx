import { MessageCircle, Sheet, TrendingDown } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const problems = [
  {
    icon: MessageCircle,
    title: 'Insistís por WhatsApp',
    text: '"Chicos, falta pagar…" Lo mandás una y otra vez. Nadie contesta, pero todos lo leen.',
  },
  {
    icon: Sheet,
    title: 'Haces contabilidad manual',
    text: 'Anotás quién transfirió, revisás los comprobantes y siempre falta la plata de alguien.',
  },
  {
    icon: TrendingDown,
    title: 'Coordinás con los visitantes',
    text: 'Para calcular la comida, la bebida y que no falte nada en el postpartido.',
  },
]

export function ProblemSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">El problema de siempre</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Vos organizás el tercer tiempo. No deberías ser el cobrador.
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-5 md:grid-cols-3">
        {problems.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-muted text-muted-foreground">
                <p.icon className="size-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
