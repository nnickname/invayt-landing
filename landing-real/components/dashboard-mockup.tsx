import {
  ArrowUpRight,
  Check,
  Clock,
  LayoutDashboard,
  Receipt,
  Search,
  Settings,
  Users,
  Wallet,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const players = [
  { name: 'Tomás Herrera', initials: 'TH', amount: '$30.000', status: 'paid' },
  { name: 'Mateo Giménez', initials: 'MG', amount: '$30.000', status: 'paid' },
  { name: 'Lucas Fernández', initials: 'LF', amount: '$30.000', status: 'pending' },
  { name: 'Santiago Ruiz', initials: 'SR', amount: '$30.000', status: 'paid' },
  { name: 'Bruno Acosta', initials: 'BA', amount: '$30.000', status: 'pending' },
] as const

const bars = [40, 62, 55, 78, 70, 92, 85]

export function DashboardMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-primary/10 ring-1 ring-black/5',
        className,
      )}
    >
      {/* top bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full bg-border" />
          <span className="size-3 rounded-full bg-border" />
          <span className="size-3 rounded-full bg-border" />
        </div>
        <div className="mx-auto flex items-center gap-2 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-primary" />
          app.invayt.com/cobros
        </div>
      </div>

      <div className="flex min-h-[420px]">
        {/* sidebar */}
        <aside className="hidden w-48 shrink-0 flex-col gap-1 border-r border-border bg-muted/30 p-3 sm:flex">
          <div className="mb-3 flex items-center gap-2 px-2 py-1">
            <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="size-4" />
            </span>
            <span className="text-sm font-semibold text-foreground">
              Los Tordos RC
            </span>
          </div>
          {[
            { icon: LayoutDashboard, label: 'Resumen', active: true },
            { icon: Receipt, label: 'Cobros' },
            { icon: Users, label: 'Plantel' },
            { icon: Settings, label: 'Ajustes' },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm',
                item.active
                  ? 'bg-background font-medium text-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </div>
          ))}
        </aside>

        {/* main */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Tercer tiempo · Fecha 7</p>
              <h3 className="text-base font-semibold text-foreground">
                vs. Marista RC
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground">
              <Search className="size-3.5" />
              Buscar jugador
            </div>
          </div>

          {/* stat cards */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-[11px] text-muted-foreground">Recaudado</p>
              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                $204.000
              </p>
              <p className="mt-1 flex items-center gap-0.5 text-[11px] font-medium text-primary">
                <ArrowUpRight className="size-3" /> 82% del objetivo
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-[11px] text-muted-foreground">Pagaron</p>
              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                24<span className="text-sm text-muted-foreground">/30</span>
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[80%] rounded-full bg-primary" />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-3">
              <p className="text-[11px] text-muted-foreground">Pendiente</p>
              <p className="mt-1 font-mono text-lg font-semibold text-foreground">
                $51.000
              </p>
              <p className="mt-1 flex items-center gap-0.5 text-[11px] text-muted-foreground">
                <Clock className="size-3" /> 6 jugadores
              </p>
            </div>
          </div>

          {/* chart */}
          <div className="mb-5 rounded-xl border border-border bg-background p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">
                Recaudación por fecha
              </p>
              <p className="text-[11px] text-muted-foreground">Últimas 7</p>
            </div>
            <div className="flex h-20 items-end gap-2">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex-1 rounded-t-md',
                    i === bars.length - 1 ? 'bg-primary' : 'bg-primary/25',
                  )}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* player list */}
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            {players.map((p, i) => (
              <div
                key={p.name}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5',
                  i !== players.length - 1 && 'border-b border-border',
                )}
              >
                <span className="grid size-8 place-items-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                  {p.initials}
                </span>
                <span className="flex-1 text-sm text-foreground">{p.name}</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {p.amount}
                </span>
                {p.status === 'paid' ? (
                  <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
                    <Check className="size-3" /> Pagó
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    <Clock className="size-3" /> Pendiente
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
