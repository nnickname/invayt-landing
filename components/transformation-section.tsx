import { ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const before = [
  'Perseguís a cada uno por WhatsApp',
  'Cruzás capturas y planillas a mano',
  'Ponés de tu bolsillo lo que falta',
  'Quedás como el pesado del grupo',
]

const after = [
  'Mandás un solo link y cada uno paga solo',
  'Ves quién pagó en tiempo real',
  'La plata va a la cuenta que ya usás',
  'Volvés a disfrutar el tercer tiempo',
]

export function TransformationSection() {
  return (
    <section className="border-y border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary">El cambio</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            No se trata de cobrar. Se trata de dejar de perseguir.
          </h2>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:mt-14 sm:gap-5 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card p-6 sm:p-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                antes
              </span>
              <ul className="mt-6 space-y-4">
                {before.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-base leading-5" aria-hidden="true">
                      {'❌'}
                    </span>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-2xl border border-primary/20 bg-card p-6 shadow-xl shadow-primary/5 sm:p-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                con Invayt
              </span>
              <ul className="mt-6 space-y-4">
                {after.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-base leading-5" aria-hidden="true">
                      {'✅'}
                    </span>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="mx-auto mt-8 max-w-xl sm:mt-10">
          <p className="flex items-center justify-center gap-2 text-center text-pretty text-base font-medium text-foreground sm:text-lg">
            <ArrowRight className="size-5 shrink-0 text-primary" />
            Vos cobrás completo. Y quedás bien con todos.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
