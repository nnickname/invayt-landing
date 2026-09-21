import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/reveal'

export function FinalCta() {
  return (
    <section id="final" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-28">
      <Reveal className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-16 sm:py-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(255,255,255,0.15)_0%,transparent_70%)]"
          />
          <h2 className="relative text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Volvé a disfrutar el tercer tiempo.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed opacity-90 sm:mt-5 sm:text-lg">
            Vos organizás. Invayt se ocupa de cobrar.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 w-full max-w-xs bg-background px-6 text-sm text-foreground hover:bg-background/90 sm:w-auto sm:max-w-none"
              nativeButton={false}
              render={<a href="#oferta" />}
            >
              Quiero ser Club Fundador
              <ArrowRight className="size-4" />
            </Button>
          </div>
          <p className="relative mt-4 text-sm opacity-80">
            Cupos limitados · Sin tarjeta de crédito para empezar
          </p>
        </div>
      </Reveal>
    </section>
  )
}
