import { Link2, Send, Wallet } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const steps = [
  {
    icon: Link2,
    step: '01',
    title: 'Creás el cobro',
    text: 'Ponés el monto por jugador y tenés el link listo en menos de un minuto.',
  },
  {
    icon: Send,
    step: '02',
    title: 'Compartís el link',
    text: 'Lo mandás al grupo una sola vez. Cada uno paga con Mercado Pago desde su teléfono.',
  },
  {
    icon: Wallet,
    step: '03',
    title: 'Te avisamos cuando alguien paga',
    text: 'Desde la app podes ver en tiempo real quién pagó y quién no para enviar seguimientos automatizados.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-28"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">En tres pasos</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Cobrar debería ser la parte más fácil del tercer tiempo.
        </h2>
      </Reveal>

      <div className="mx-auto mt-10 max-w-2xl sm:mt-14">
        <ol className="flex flex-col gap-8 sm:gap-10">
          {steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.1}>
              <li className="relative flex gap-5 sm:gap-6">
                {/* Línea conectora vertical que cruza el espacio hacia la caja siguiente */}
                {i < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[1.375rem] top-14 -bottom-8 w-px bg-border sm:left-7 sm:-bottom-10"
                  />
                )}

                {/* Nodo con ícono */}
                <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-4 ring-background sm:size-14">
                  <s.icon className="size-5 sm:size-6" />
                </span>

                {/* Contenido */}
                <div className="flex-1 rounded-2xl border border-border bg-card p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {s.title}
                    </h3>
                    <span className="font-mono text-sm font-medium text-muted-foreground/70">
                      {s.step}
                    </span>
                  </div>
                  <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                    {s.text}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
