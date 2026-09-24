'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, CheckCircle2, ChevronRight, Loader2, Plus, ShieldCheck, UserRound } from 'lucide-react'

type Player = {
  id: string
  name: string
  lastName: string
  isVerified: boolean
}

type ClubContext = {
  clubName: string
  players: Player[]
}

type FormValues = {
  name: string
  lastName: string
  phone: string
  email: string
}

const emptyForm: FormValues = { name: '', lastName: '', phone: '', email: '' }

export function JoinClubFlow({ slug }: { slug: string }) {
  const [club, setClub] = useState<ClubContext | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [isNewPlayer, setIsNewPlayer] = useState(false)
  const [form, setForm] = useState<FormValues>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    let active = true

    async function loadClub() {
      try {
        const response = await fetch('/api/join-club', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'resolve', slug }),
        })
        const data = (await response.json()) as ClubContext & { error?: string }

        if (!response.ok) throw new Error(data.error || 'No pudimos cargar el club.')
        if (active) setClub(data)
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar el club.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadClub()
    return () => {
      active = false
    }
  }, [slug])

  const availablePlayers = useMemo(
    () => club?.players.filter((player) => !player.isVerified) || [],
    [club],
  )
  const verifiedPlayers = useMemo(
    () => club?.players.filter((player) => player.isVerified) || [],
    [club],
  )

  function choosePlayer(player: Player) {
    setSelectedPlayerId(player.id)
    setIsNewPlayer(false)
    setError('')
    setForm({ name: player.name, lastName: player.lastName, phone: '', email: '' })
  }

  function chooseNewPlayer() {
    setSelectedPlayerId(null)
    setIsNewPlayer(true)
    setError('')
    setForm(emptyForm)
  }

  function updateField(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting || (!selectedPlayerId && !isNewPlayer)) return

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/join-club', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          slug,
          playerId: selectedPlayerId || undefined,
          ...form,
        }),
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) throw new Error(data.error || 'No pudimos completar la unión.')
      setSuccess(true)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No pudimos completar la unión.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 sm:px-6">
      <div className="w-full max-w-lg rounded-[2rem] border border-border bg-card p-6 shadow-2xl shadow-primary/10 sm:p-9">
        <div className="mb-8 flex items-center justify-between">
          <a href="/" className="text-xl font-semibold tracking-tight text-primary">Invayt</a>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">Unión al equipo</span>
        </div>

        {loading ? <LoadingState /> : error && !club ? <ErrorState message={error} /> : success ? (
          <SuccessState clubName={club?.clubName || 'tu club'} />
        ) : club ? (
          <>
            <header>
              <p className="text-sm font-medium text-primary">{club.clubName}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">Ingresar al equipo</h1>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Elegí tu nombre del plantel y completá tus datos para activarte en el club.
              </p>
            </header>

            <section className="mt-8" aria-labelledby="players-title">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 id="players-title" className="text-sm font-semibold text-foreground">¿Cuál sos?</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Los nombres con tilde de verificación ya tienen teléfono cargado.</p>
                </div>
                <span className="text-xs text-muted-foreground">{availablePlayers.length} disponibles</span>
              </div>

              <div className="mt-3 space-y-2">
                {availablePlayers.map((player) => {
                  const selected = selectedPlayerId === player.id
                  return (
                    <button
                      key={player.id}
                      type="button"
                      onClick={() => choosePlayer(player)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${selected ? 'border-primary bg-accent' : 'border-border bg-background hover:border-primary/50'}`}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                        {initials(player)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-foreground">{player.name} {player.lastName}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">Falta completar datos</span>
                      </span>
                      <span className={`flex size-5 items-center justify-center rounded-full border ${selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border'}`}>
                        {selected && <Check className="size-3" />}
                      </span>
                    </button>
                  )
                })}
              </div>

              {verifiedPlayers.length > 0 && (
                <div className="mt-4 rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 text-primary" />
                    <span>{verifiedPlayers.length} jugador{verifiedPlayers.length === 1 ? '' : 'es'} ya verificado{verifiedPlayers.length === 1 ? '' : 's'}</span>
                  </div>
                </div>
              )}

              <button type="button" onClick={chooseNewPlayer} className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary transition-colors hover:text-primary/70">
                <Plus className="size-3.5" /> No estoy en la lista, crear jugador nuevo
              </button>
            </section>

            {(selectedPlayerId || isNewPlayer) && (
              <form onSubmit={submit} className="mt-7 border-t border-border pt-7">
                <div className="mb-5 flex items-center gap-2">
                  <UserRound className="size-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Completá tus datos</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nombre" value={form.name} onChange={(value) => updateField('name', value)} required />
                  <Field label="Apellido" value={form.lastName} onChange={(value) => updateField('lastName', value)} required />
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Teléfono" type="tel" value={form.phone} onChange={(value) => updateField('phone', value)} required placeholder="+54 9 11..." />
                  <Field label="Email" type="email" value={form.email} onChange={(value) => updateField('email', value)} placeholder="Opcional" />
                </div>
                {error && <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive" role="alert">{error}</p>}
                <button type="submit" disabled={submitting} className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-60">
                  {submitting ? <><Loader2 className="size-4 animate-spin" /> Guardando...</> : <>Confirmar unión <ChevronRight className="size-4" /></>}
                </button>
              </form>
            )}
          </>
        ) : null}
      </div>
    </main>
  )
}

function Field({ label, value, onChange, type = 'text', required = false, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block text-sm font-medium text-foreground">
      {label}{required && <span className="ml-1 text-primary">*</span>}
      <input type={type} value={value} required={required} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:ring-3 focus:ring-primary/15" />
    </label>
  )
}

function LoadingState() {
  return <div className="flex min-h-80 flex-col items-center justify-center text-center"><Loader2 className="size-7 animate-spin text-primary" /><p className="mt-4 text-sm text-muted-foreground">Cargando la información del club...</p></div>
}

function ErrorState({ message }: { message: string }) {
  return <div className="py-12 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">!</div><h1 className="mt-5 text-xl font-semibold text-foreground">No pudimos abrir este enlace</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</p><a href="/" className="mt-7 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">Volver al inicio</a></div>
}

function SuccessState({ clubName }: { clubName: string }) {
  return <div className="py-10 text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent text-primary"><CheckCircle2 className="size-8" /></div><h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">¡Ya formás parte del equipo!</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Tus datos fueron completados en <strong className="font-semibold text-foreground">{clubName}</strong>. Ya podés cerrar esta ventana.</p></div>
}

function initials(player: Player) {
  return `${player.name.charAt(0)}${player.lastName.charAt(0)}`.toUpperCase()
}