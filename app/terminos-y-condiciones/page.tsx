import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, FileText, WalletCards } from 'lucide-react'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

export const metadata: Metadata = {
  title: 'Términos y condiciones — Invayt',
  description:
    'Términos y condiciones de uso de Invayt, la app para organizar el cobro del tercer tiempo en clubes de rugby.',
}

const sections = [
  { id: 'aceptacion', label: 'Aceptación de los términos' },
  { id: 'servicio', label: 'El servicio' },
  { id: 'cuentas', label: 'Cuentas y uso permitido' },
  { id: 'pagos', label: 'Aportes y pagos' },
  { id: 'responsabilidades', label: 'Responsabilidades' },
  { id: 'propiedad', label: 'Propiedad intelectual' },
  { id: 'disponibilidad', label: 'Disponibilidad y cambios' },
  { id: 'apple', label: 'Distribución en App Store' },
  { id: 'ley', label: 'Ley aplicable y contacto' },
]

export default function TermsPage() {
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
                <FileText className="size-6" aria-hidden="true" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Información legal
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Términos y condiciones
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                Las reglas para usar Invayt y organizar el cobro del tercer tiempo de tu club de rugby de forma simple y transparente.
              </p>
              <p className="mt-6 text-sm text-muted-foreground">
                Última actualización: 21 de septiembre de 2026
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20 lg:py-20">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              En esta página
            </p>
            <nav aria-label="Secciones de los términos" className="mt-4">
              <ul className="space-y-2 border-l border-border pl-4">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-sm leading-6 text-muted-foreground transition-colors hover:text-primary"
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <article className="max-w-3xl text-[15px] leading-7 text-muted-foreground">
            <div className="rounded-2xl border border-primary/15 bg-accent/45 p-5 text-sm leading-6 text-accent-foreground sm:p-6">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                <p>
                  Al registrarte, acceder o utilizar Invayt, aceptás estos Términos y condiciones. Si usás Invayt en representación de un club, equipo u otra organización, declarás que tenés facultades suficientes para obligarla a cumplirlos.
                </p>
              </div>
            </div>

            <LegalSection id="aceptacion" title="1. Aceptación de los términos">
              <p>
                Estos Términos y condiciones regulan el acceso y uso de la aplicación móvil Invayt, sus funcionalidades de invitación y cobro, y las páginas web vinculadas al servicio (en conjunto, el “Servicio”). El Servicio es operado bajo la marca Invayt.
              </p>
              <p>
                Si no estás de acuerdo con estos términos, no debés crear una cuenta ni utilizar el Servicio. Podemos actualizar estos términos cuando sea necesario. Cuando el cambio sea relevante, procuraremos informarlo dentro de la aplicación o por otro medio razonable. El uso del Servicio después de la entrada en vigencia de los cambios implica su aceptación.
              </p>
            </LegalSection>

            <LegalSection id="servicio" title="2. Qué es Invayt">
              <p>
                Invayt es una herramienta tecnológica para que clubes y equipos de rugby organicen la convocatoria y el cobro de aportes vinculados al tercer tiempo de un partido o encuentro. Permite compartir invitaciones, consultar el estado de los aportes y facilitar el acceso a medios de pago disponibles.
              </p>
              <p>
                Invayt no organiza partidos ni terceros tiempos, no fija el importe que debe aportar cada persona, no garantiza la realización del encuentro y no presta servicios gastronómicos o deportivos. Esas decisiones y prestaciones corresponden al club, equipo u organizador que crea la convocatoria.
              </p>
            </LegalSection>

            <LegalSection id="cuentas" title="3. Cuentas y uso permitido">
              <p>
                Para utilizar determinadas funciones podés necesitar una cuenta. Te comprometés a brindar información verdadera, actualizada y completa, y a mantenerla actualizada. También sos responsable de proteger tus credenciales y de avisar de inmediato si sospechás un acceso no autorizado.
              </p>
              <p>
                El Servicio debe utilizarse de manera lícita y de acuerdo con estos términos. No está permitido:
              </p>
              <ul>
                <li>crear convocatorias, perfiles o solicitudes de pago engañosas o no autorizadas;</li>
                <li>utilizar el Servicio para cometer fraude, lavar activos, infringir derechos de terceros o realizar actividades ilegales;</li>
                <li>intentar acceder a cuentas, datos o sistemas ajenos, o afectar el funcionamiento del Servicio;</li>
                <li>copiar, modificar, descompilar, realizar ingeniería inversa o explotar comercialmente el Servicio sin autorización.</li>
              </ul>
              <p>
                Si una persona menor de edad utiliza Invayt, deberá hacerlo con autorización y supervisión de su madre, padre, tutor o representante legal, quien será responsable por su uso y por los pagos que realice.
              </p>
            </LegalSection>

            <LegalSection id="pagos" title="4. Aportes, comisiones y pagos">
              <div className="not-prose mb-6 flex gap-4 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                  <WalletCards className="size-5" aria-hidden="true" />
                </div>
                <p className="text-sm leading-6">
                  El importe del aporte, su destino y las condiciones del tercer tiempo son definidos por el club, equipo u organizador. Antes de confirmar un pago, revisá siempre los datos que aparecen en pantalla.
                </p>
              </div>
              <p>
                Los pagos pueden procesarse a través de proveedores externos. Al pagar, también aceptás los términos y políticas del proveedor de pago que corresponda. Invayt no almacena los datos completos de tu tarjeta cuando el procesamiento se realiza directamente por un tercero, y no controla sus tiempos de acreditación, autorizaciones, rechazos o medidas de seguridad.
              </p>
              <p>
                La comisión de Invayt, si corresponde, será la que se informe en la aplicación, en la propuesta comercial del club o en la pantalla de confirmación antes de contratar. La oferta pública vigente informa una comisión del 0,5% sobre lo recaudado a través de la plataforma, sin perjuicio de las condiciones particulares que puedan acordarse con cada club.
              </p>
              <p>
                Los pedidos de devolución o desconocimiento relacionados con el importe del tercer tiempo deberán dirigirse primero al club o al organizador que publicó la convocatoria. Invayt podrá colaborar con la gestión, pero no decide por el organizador si corresponde devolver un aporte. Esto no limita los derechos que te reconozca la normativa aplicable ni los reclamos que puedas realizar ante tu entidad financiera o proveedor de pago.
              </p>
            </LegalSection>

            <LegalSection id="responsabilidades" title="5. Responsabilidades de las partes">
              <p>
                El club, equipo u organizador es responsable de la información que publica, de la legitimidad de la convocatoria, de comunicar correctamente el destino de los fondos y de atender consultas sobre el encuentro, el menú, el importe, la asistencia y las devoluciones.
              </p>
              <p>
                Cada usuario es responsable de verificar a quién está pagando, el importe, la fecha del encuentro y cualquier condición informada antes de confirmar la operación. No compartas links de invitación o pago con personas que no deban acceder a ellos.
              </p>
              <p>
                Invayt mantiene medidas razonables para prestar un servicio seguro, pero no garantiza que el Servicio esté disponible de forma ininterrumpida, libre de errores o compatible con todos los dispositivos, redes o versiones de sistemas operativos. Tampoco responde por hechos atribuibles a terceros, incluyendo proveedores de pago, servicios de internet, tiendas de aplicaciones o fallas del dispositivo del usuario.
              </p>
            </LegalSection>

            <LegalSection id="propiedad" title="6. Propiedad intelectual">
              <p>
                El software, diseño, marca Invayt, textos, gráficos, interfaces y demás elementos del Servicio pertenecen a Invayt o se utilizan con autorización y están protegidos por las normas aplicables. Estos términos te otorgan una licencia limitada, personal, no exclusiva, revocable y no transferible para utilizar la aplicación con fines personales o internos del club, mientras cumplas con ellos.
              </p>
              <p>
                Al cargar contenido en Invayt, como nombres, escudos, imágenes o textos del club, declarás que contás con los derechos y autorizaciones necesarios. Nos otorgás una autorización limitada para alojar, reproducir y mostrar ese contenido únicamente para operar y mejorar el Servicio.
              </p>
            </LegalSection>

            <LegalSection id="disponibilidad" title="7. Suspensión, disponibilidad y cambios">
              <p>
                Podemos suspender o limitar una cuenta o convocatoria cuando sea necesario para investigar un uso indebido, proteger a los usuarios, cumplir una obligación legal o preservar la seguridad del Servicio. Cuando sea razonablemente posible, informaremos el motivo y las medidas disponibles para resolver la situación.
              </p>
              <p>
                También podemos modificar, discontinuar o reemplazar funcionalidades. Si una modificación afecta de forma sustancial un pago ya confirmado, procuraremos preservar la información necesaria para que el club y los usuarios puedan resolverlo por los canales correspondientes.
              </p>
            </LegalSection>

            <LegalSection id="apple" title="8. Aplicación distribuida por App Store">
              <p>
                Si descargás Invayt desde Apple App Store, estos términos se celebran entre vos e Invayt, y no con Apple. Apple no es responsable de la aplicación, de su contenido, de su mantenimiento ni de los servicios ofrecidos a través de ella. Apple tampoco tiene obligación de brindar soporte respecto de Invayt.
              </p>
              <p>
                El uso de Invayt en un dispositivo Apple también está sujeto a las reglas de uso de la App Store y del sistema operativo que resulten aplicables. Apple y sus subsidiarias son terceros beneficiarios de estos términos y podrán hacer valer las disposiciones que les sean aplicables.
              </p>
            </LegalSection>

            <LegalSection id="ley" title="9. Ley aplicable y contacto">
              <p>
                Estos términos se interpretarán de acuerdo con las leyes de la República Argentina. Cualquier controversia se someterá a los tribunales competentes que correspondan según la normativa aplicable, sin afectar los derechos irrenunciables de consumidores y usuarios.
              </p>
              <p>
                Si tenés una consulta, reclamo o solicitud relacionada con el Servicio, podés contactarnos mediante los canales de soporte disponibles dentro de la aplicación o a través del sitio web de Invayt. Para ayudarnos a resolverlo más rápido, incluí el correo de tu cuenta, el identificador del partido o convocatoria y una descripción del inconveniente. Nunca envíes datos completos de tarjetas ni contraseñas.
              </p>
              <p>
                Estos términos forman un acuerdo completo sobre el uso del Servicio. Si alguna disposición resulta inválida o inaplicable, las restantes continuarán vigentes.
              </p>
            </LegalSection>

            <div className="mt-12 border-t border-border pt-6 text-sm">
              <p>
                ¿Buscás volver a la información del producto?{' '}
                <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
                  Conocé Invayt
                </Link>
                .
              </p>
            </div>
          </article>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function LegalSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-b border-border py-10 first:pt-0 last:border-b-0">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-5 space-y-5 [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-3 [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-primary [&_ul]:space-y-3 [&_ul]:pl-1">
        {children}
      </div>
    </section>
  )
}