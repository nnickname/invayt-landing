import { Wallet } from 'lucide-react'

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

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Invayt
        </p>
      </div>
    </footer>
  )
}
