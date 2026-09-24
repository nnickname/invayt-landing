'use client'

import { useEffect, useMemo, useState } from 'react'
import { Check, CheckCircle2, ChevronRight, Copy, FileUp, Loader2, ShieldCheck, UserRound, WalletCards } from 'lucide-react'

type Player = {
  id: string
  name: string
  lastName: string
  isVerified: boolean
}

type PaymentContext = {
  match: {
    id: string
    name: string
    date: string | null
    amountPerPlayer: number
  }
  clubName: string
  transfer: {
    cbu: string | null
    alias: string | null
  }
  players: Player[]
}

export function PaymentFlow({ matchId }: { matchId: string }) {
  const [payment, setPayment] = useState<PaymentContext | null>(null)
  const [selectedPlayerId, setSelectedPlayerId] = useState('')
  const [phone, setPhone] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [copiedValue, setCopiedValue] = useState<'cbu' | 'alias' | null>(null)

  useEffect(() => {
    let active = true

    async function loadPayment() {
      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'resolve', matchId }),
        })
        const data = (await response.json()) as PaymentContext & { error?: string }
        if (!response.ok) throw new Error(data.error || 'No pudimos cargar el pago.')
        if (active) setPayment(data)
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'No pudimos cargar el pago.')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadPayment()
    return () => {
      active = false
    }
  }, [matchId])

  const selectedPlayer = useMemo(
    () => payment?.players.find((player) => player.id === selectedPlayerId) || null,
    [payment, selectedPlayerId],
  )
  const isVerified = Boolean(selectedPlayer?.isVerified)

  function selectPlayer(playerId: string) {
    setSelectedPlayerId(playerId)
    setPhone('')
    setFile(null)
    setError('')
    setSuccess(false)
  }

  async function copyTransferValue(value: string, type: 'cbu' | 'alias') {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedValue(type)
      window.setTimeout(() => setCopiedValue((current) => current === type ? null : current), 1800)
    } catch {
      setError('No pudimos copiar el dato. Seleccionalo y copialo manualmente.')
    }
  }

  async function verifyPhone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedPlayer || verifying) return

    setVerifying(true)
    setError('')
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', matchId, playerId: selectedPlayer.id, phone }),
      })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(data.error || 'No pudimos verificar tu teléfono.')

      setPayment((current) => current ? {
        ...current,
        players: current.players.map((player) => player.id === selectedPlayer.id ? { ...player, isVerified: true } : player),
      } : current)
      setPhone('')
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : 'No pudimos verificar tu teléfono.')
    } finally {
      setVerifying(false)
    }
  }

  async function uploadReceipt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedPlayer || !isVerified || !file || uploading) return

    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('matchId', matchId)
    formData.append('playerId', selectedPlayer.id)
    formData.append('file', file)

    try {
      const response = await fetch('/api/payment', { method: 'POST', body: formData })
      const data = (await response.json()) as { error?: string }
      if (!response.ok) throw new Error(data.error || 'No pudimos subir el comprobante.')
      setSuccess(true)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'No pudimos subir el comprobante.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <PaymentShell><LoadingState /></PaymentShell>
  if (error && !payment) return <PaymentShell><ErrorState message={error} /></PaymentShell>
  if (!payment) return null

  return (
    <PaymentShell>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">{payment.clubName}</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{payment.match.name}</h1>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span>{formatDate(payment.match.date)}</span>
          <strong className="font-semibold text-foreground">{formatAmount(payment.match.amountPerPlayer)}</strong>
        </div>
      </div>

      <TransferDetails transfer={payment.transfer} onCopy={copyTransferValue} copiedValue={copiedValue} />

      <section>
        <div className="flex items-center gap-2">
          <UserRound className="size-5 text-primary" />
          <h2 className="font-semibold text-foreground">Seleccioná tu jugador</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Elegí tu nombre del plantel para asociar correctamente el pago.</p>
        <div className="mt-4 grid gap-2">
          {payment.players.map((player) => (
            <button
              key={player.id}
              type="button"
              onClick={() => selectPlayer(player.id)}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors ${selectedPlayerId === player.id ? 'border-primary bg-accent' : 'border-border bg-background hover:bg-muted/50'}`}
            >
              <span>
                <span className="block text-sm font-medium text-foreground">{player.name} {player.lastName}</span>
                <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  {player.isVerified && <><ShieldCheck className="size-3.5 text-primary" /> Teléfono verificado</>}
                </span>
              </span>
              {selectedPlayerId === player.id && <CheckCircle2 className="size-5 text-primary" />}
            </button>
          ))}
        </div>
      </section>

      {selectedPlayer && !isVerified && (
        <form onSubmit={verifyPhone} className="mt-7 rounded-2xl border border-primary/20 bg-accent/50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-semibold text-foreground">Verificá tu identidad</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Antes de subir el comprobante necesitamos asociar un teléfono a este jugador.</p>
            </div>
          </div>
          <label className="mt-4 block text-sm font-medium text-foreground">
            Teléfono<span className="ml-1 text-primary">*</span>
            <input type="tel" required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+54 9 11..." className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm font-normal outline-none transition-shadow placeholder:text-muted-foreground/70 focus:border-primary focus:ring-3 focus:ring-primary/15" />
          </label>
          <button type="submit" disabled={verifying} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-60">
            {verifying ? <><Loader2 className="size-4 animate-spin" /> Verificando...</> : <>Verificar teléfono <ChevronRight className="size-4" /></>}
          </button>
        </form>
      )}

      {selectedPlayer && isVerified && !success && (
        <form onSubmit={uploadReceipt} className="mt-7 border-t border-border pt-7">
          <div className="flex items-center gap-2">
            <FileUp className="size-5 text-primary" />
            <h2 className="font-semibold text-foreground">Subí tu comprobante</h2>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tu teléfono ya está verificado. Adjuntá el comprobante de pago para enviarlo al club.</p>
          <label className="mt-4 block cursor-pointer rounded-xl border border-dashed border-primary/40 bg-accent/30 p-5 text-center transition-colors hover:bg-accent">
            <FileUp className="mx-auto size-7 text-primary" />
            <span className="mt-2 block text-sm font-medium text-foreground">{file ? file.name : 'Elegir archivo'}</span>
            <span className="mt-1 block text-xs text-muted-foreground">PDF, JPG, PNG o WEBP · máximo 10 MB</span>
            <input type="file" accept="application/pdf,image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] || null)} className="sr-only" />
          </label>
          <button type="submit" disabled={!file || uploading} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-60">
            {uploading ? <><Loader2 className="size-4 animate-spin" /> Subiendo...</> : <>Enviar comprobante <ChevronRight className="size-4" /></>}
          </button>
        </form>
      )}

      {success && <div className="mt-7 rounded-2xl border border-primary/20 bg-accent p-5 text-center"><CheckCircle2 className="mx-auto size-8 text-primary" /><h2 className="mt-3 font-semibold text-foreground">Comprobante enviado</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">El club recibió tu comprobante y lo revisará.</p></div>}
      {error && <p className="mt-5 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive" role="alert">{error}</p>}
    </PaymentShell>
  )
}

function TransferDetails({
  transfer,
  onCopy,
  copiedValue,
}: {
  transfer: PaymentContext['transfer']
  onCopy: (value: string, type: 'cbu' | 'alias') => void
  copiedValue: 'cbu' | 'alias' | null
}) {
  const hasTransferDetails = transfer.cbu || transfer.alias

  return (
    <section className="mb-7 rounded-2xl border border-border bg-muted/30 p-5">
      <div className="flex items-center gap-2">
        <WalletCards className="size-5 text-primary" />
        <div>
          <h2 className="font-semibold text-foreground">Datos para transferir</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Transferí el importe indicado y luego adjuntá el comprobante.</p>
        </div>
      </div>

      {hasTransferDetails ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {transfer.cbu && <TransferValue label="CBU" value={transfer.cbu} copied={copiedValue === 'cbu'} onCopy={() => onCopy(transfer.cbu!, 'cbu')} />}
          {transfer.alias && <TransferValue label="Alias" value={transfer.alias} copied={copiedValue === 'alias'} onCopy={() => onCopy(transfer.alias!, 'alias')} />}
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-background px-3 py-2.5 text-sm text-muted-foreground">El club todavía no configuró sus datos de transferencia.</p>
      )}
    </section>
  )
}

function TransferValue({ label, value, copied, onCopy }: { label: string; value: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span className="break-all font-mono text-sm text-foreground">{value}</span>
        <button type="button" onClick={onCopy} className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-primary transition-colors hover:bg-accent" aria-label={`Copiar ${label}`} title={`Copiar ${label}`}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
      {copied && <p className="mt-1 text-xs text-primary">Copiado</p>}
    </div>
  )
}

function PaymentShell({ children }: { children: React.ReactNode }) {
  return <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12"><div className="w-full max-w-xl rounded-3xl border border-border bg-card p-7 shadow-2xl shadow-primary/10 sm:p-10"><div className="mb-8 text-xl font-semibold tracking-tight text-primary">Invayt</div>{children}</div></main>
}

function LoadingState() {
  return <div className="flex min-h-80 flex-col items-center justify-center text-center"><Loader2 className="size-7 animate-spin text-primary" /><p className="mt-4 text-sm text-muted-foreground">Cargando la información del pago...</p></div>
}

function ErrorState({ message }: { message: string }) {
  return <div className="py-12 text-center"><div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">!</div><h1 className="mt-5 text-xl font-semibold text-foreground">No pudimos abrir este pago</h1><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{message}</p><a href="/" className="mt-7 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">Volver al inicio</a></div>
}

function formatDate(date: string | null) {
  if (!date) return 'Fecha a confirmar'
  const parsedDate = new Date(date)
  return Number.isNaN(parsedDate.getTime()) ? 'Fecha a confirmar' : new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(parsedDate)
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount)
}