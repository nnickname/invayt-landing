import type { Metadata } from 'next'
import { ResetPasswordForm } from '@/components/reset-password-form'

export const metadata: Metadata = {
  title: 'Restablecer contraseña — Invayt',
  description: 'Elegí una nueva contraseña para tu cuenta de Invayt.',
}

export default function ResetPasswordPage() {
  return <ResetPasswordForm />
}