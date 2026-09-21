import { Reveal } from '@/components/reveal'
import { FounderCTA } from '@/components/founder-cta'

const includes = [
  '0,5% de comisión fija durante el primer año',
  'Sin costo fijo ni mensualidad',
  'Solo pagás cuando realmente cobrás',
]

export function FounderOffer() {
  return (
    <section
      id="oferta"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-28"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Sin riesgo</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Si vos no cobrás, Invayt tampoco cobra.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-10 max-w-2xl sm:mt-14">
        <div className="overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-2xl shadow-primary/10">
          <div className="bg-primary px-6 py-10 text-center text-primary-foreground sm:px-8">
            <span className="inline-flex items-center rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Oferta primeros 5 clubes
            </span>
            <div className="mt-4 flex items-baseline justify-center gap-3">
              <span className="font-mono text-2xl font-medium tracking-tight text-primary-foreground/50 line-through decoration-2">
                1-2%
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-6xl font-semibold tracking-tight">
                  0,5%
                </span>
                <span className="text-lg opacity-80">de comisión</span>
              </div>
            </div>
            <p className="mt-3 text-sm opacity-80">
              Durante todo el primer año. Sin costo fijo ni mensualidad.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <ul className="mx-auto flex max-w-xs flex-col gap-3">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base leading-6" aria-hidden="true">
                    {'✅'}
                  </span>
                  <span className="text-sm leading-6 text-foreground">{item}</span>
                </li>
              ))}
            </ul>

            <FounderCTA />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Del 6.º club en adelante la comisión es de 1-2%. Asegurá tu lugar
              entre los primeros 5.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
