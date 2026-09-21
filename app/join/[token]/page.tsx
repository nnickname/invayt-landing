import type { Metadata } from 'next'
import { AppLinkFallback } from '@/components/app-link-fallback'

export const metadata: Metadata = {
  title: 'Invayt — Unite al equipo',
  description: 'Abrí este link desde tu celular para unirte al equipo en Invayt.',
  robots: { index: false, follow: false },
}

export default async function JoinPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  return <AppLinkFallback type="join" value={token} />
}