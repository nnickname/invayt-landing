import { Wallet } from 'lucide-react'
import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Wallet className="size-4" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Invayt
          </span>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Hecho para clubes de rugby que quieren cobrar sin perseguir a nadie.
        </p>

        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:items-end">
          <Link href="/terminos-y-condiciones" className="transition-colors hover:text-foreground">
            Términos y condiciones
          </Link>
          <p>© {new Date().getFullYear()} Invayt</p>
        </div>
      </div>
    </footer>
  )
}
