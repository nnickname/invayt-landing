import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Mail, ShieldCheck, UserRoundX } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Eliminar cuenta — Invayt',
  description:
    'Conocé cómo solicitar la eliminación de tu cuenta de Invayt por correo electrónico.',
}

const supportEmail = 'equipo@invayt.com'
const emailSubject = 'Solicitud de eliminación de cuenta de Invayt'
const emailBody = [
  'Hola, quiero solicitar la eliminación de mi cuenta de Invayt.',
  '',
  'Correo asociado a mi cuenta: ',
].join('\n')
const mailtoHref = `mailto:${supportEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="border-b border-border bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/75"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver a Invayt
            </Link>

            <div className="mt-10 max-w-3xl">
              <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
                <UserRoundX className="size-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Gestión de tu cuenta
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Solicitar la eliminación de tu cuenta
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                Si ya no querés usar Invayt, podés pedir que eliminemos tu cuenta enviándonos un correo electrónico.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Mail className="size-6" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Cómo enviar tu solicitud
            </h2>
            <ol className="mt-5 space-y-4 text-base leading-7 text-muted-foreground">
              <li className="flex gap-3">
                <span className="font-semibold text-primary">1.</span>
                <span>Escribinos desde la dirección de correo asociada a tu cuenta de Invayt.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">2.</span>
                <span>Usá el asunto “Solicitud de eliminación de cuenta de Invayt”.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-semibold text-primary">3.</span>
                <span>Incluí en el mensaje el correo asociado a tu cuenta para que podamos identificarla.</span>
              </li>
            </ol>

            <a
              href={mailtoHref}
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-center font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:w-auto"
            >
              <Mail className="size-5" aria-hidden="true" />
              Enviar correo para eliminar mi cuenta
            </a>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Si no se abre tu aplicación de correo, escribinos a{' '}
              <a
                href={`mailto:${supportEmail}`}
                className="font-medium text-primary underline underline-offset-4 hover:text-primary/75"
              >
                {supportEmail}
              </a>
              .
            </p>
          </div>

          <div className="mt-6 flex gap-4 rounded-2xl border border-border bg-secondary/40 p-5 text-sm leading-6 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <p>
              Para proteger tu cuenta, podemos solicitar información adicional para verificar que sos su titular. No incluyas contraseñas ni datos completos de tarjetas en el correo.
            </p>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿Querés volver al sitio?{' '}
            <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
              Conocé Invayt
            </Link>
            .
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}