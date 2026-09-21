import type { Metadata } from 'next'
import { AppLinkFallback } from '@/components/app-link-fallback'

export const metadata: Metadata = {
  title: 'Invayt — Link de pago',
  description: 'Abrí este link desde tu celular para ver el partido y continuar en Invayt.',
  robots: { index: false, follow: false },
}

export default async function PayPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params

  return <AppLinkFallback type="pay" value={matchId} />
}