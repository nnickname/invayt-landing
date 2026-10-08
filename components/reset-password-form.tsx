'use client'

import Link from 'next/link'
import { useEffect, useState, type FormEvent } from 'react'
import { CheckCircle2, KeyRound, LoaderCircle } from 'lucide-react'

export function ResetPasswordForm() {
  const [accessToken, setAccessToken] = useState('')
  const [isReadingToken, setIsReadingToken] = useState(true)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    const hashParams = new URLSearchParams(url.hash.slice(1))
    const token = url.searchParams.get('access_token') || hashParams.get('access_token') || ''

    setAccessToken(token)
    setIsReadingToken(false)

    if (token) {
      url.searchParams.delete('access_token')
      hashParams.delete('access_token')
      window.history.replaceState(null, '', `${url.pathname}${url.search}`)
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !anonKey) {
      setError('El servicio de recuperación no está configurado. Contactanos para recibir ayuda.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      })

      if (!response.ok) {
        const result = (await response.json().catch(() => null)) as { msg?: string; message?: string } | null
        const detail = result?.msg || result?.message || ''
        setError(
          /expired|invalid|token/i.test(detail)
            ? 'Este enlace venció o ya fue utilizado. Solicitá uno nuevo desde la aplicación.'
            : 'No pudimos cambiar tu contraseña. Revisá el enlace e intentá nuevamente.',
        )
        return
      }

      setIsComplete(true)
    } catch {
      setError('No pudimos comunicarnos con el servicio. Revisá tu conexión e intentá nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-9">
        <Link href="/" className="text-sm font-semibold text-primary hover:underline">
          Invayt
        </Link>

        <div className="mt-8 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {isComplete ? (
            <CheckCircle2 className="size-6" aria-hidden="true" />
          ) : (
            <KeyRound className="size-6" aria-hidden="true" />
          )}
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          {isComplete ? 'Contraseña actualizada' : 'Restablecer contraseña'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {isComplete
            ? 'Ya podés iniciar sesión en Invayt con tu nueva contraseña.'
            : 'Ingresá una nueva contraseña para volver a acceder a tu cuenta.'}
        </p>

        {isComplete ? (
          <Link
            href="/"
            className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Volver a Invayt
          </Link>
        ) : isReadingToken ? (
          <p className="mt-7 text-sm text-muted-foreground">Verificando el enlace...</p>
        ) : !accessToken ? (
          <p role="alert" className="mt-7 rounded-lg bg-destructive/10 p-4 text-sm leading-6 text-destructive">
            El enlace no contiene un token válido. Solicitá un nuevo correo de recuperación.
          </p>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Nueva contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium text-foreground">
                Confirmar contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="min-h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm leading-5 text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
              {isSubmitting ? 'Actualizando...' : 'Guardar nueva contraseña'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}