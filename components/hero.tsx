'use client'

import { motion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ease = [0.21, 0.47, 0.32, 0.98] as const

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* soft background wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-accent)_0%,transparent_70%)] opacity-70"
      />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm"
          >
            Programa Club Fundador · Cupos limitados
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease }}
            className="text-balance text-[2rem] font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl sm:leading-[1.05] md:text-6xl"
          >
            Dejá de perseguir a tus compañeros para cobrar el tercer tiempo.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease }}
            className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg"
          >
            Invayt se encarga de cobrar, enviar los recordatorios y registrar
            los pagos. Vos organizás y disfrutás el postpartido.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.19, ease }}
            className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <Button
              size="lg"
              className="h-11 w-full px-5 text-sm sm:w-auto"
              nativeButton={false}
              render={<a href="#oferta" />}
            >
              Quiero ser Club Fundador
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-11 w-full px-5 text-sm sm:w-auto"
              nativeButton={false}
              render={<a href="#como-funciona" />}
            >
              Ver cómo funciona
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28, ease }}
            className="mt-4 text-sm text-muted-foreground"
          >
            Sin costo fijo. Si no cobrás, Invayt tampoco.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
          className="mx-auto mt-12 w-full max-w-[260px] sm:mt-14 sm:max-w-[280px]"
        >
          <div className="overflow-hidden rounded-[2.25rem] border border-border bg-card p-2 shadow-2xl">
            <img
              src="/invayt-demo.gif"
              alt="Demostración de la app Invayt creando un cobro del tercer tiempo"
              className="w-full rounded-[1.75rem]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
