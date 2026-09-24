import type { Metadata } from 'next'
import { PaymentFlow } from '@/components/payment-flow'

export const metadata: Metadata = {
  title: 'Invayt — Link de pago',
  description: 'Consultá el partido y enviá tu comprobante de pago desde Invayt.',
  robots: { index: false, follow: false },
}

export default async function PayPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params

  return <PaymentFlow matchId={matchId} />
}