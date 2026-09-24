import { NextResponse } from 'next/server'
import {
  resolvePayment,
  uploadPaymentReceipt,
  verifyPaymentPlayer,
} from '@/lib/payment-service'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file')
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'Seleccioná un comprobante.' }, { status: 400 })
      }

      return NextResponse.json(
        await uploadPaymentReceipt({
          matchId: typeof formData.get('matchId') === 'string' ? String(formData.get('matchId')) : '',
          playerId: typeof formData.get('playerId') === 'string' ? String(formData.get('playerId')) : '',
          file,
        }),
      )
    }

    const body = (await request.json()) as Record<string, unknown>
    const action = typeof body.action === 'string' ? body.action : ''

    if (action === 'resolve') {
      return NextResponse.json(
        await resolvePayment(typeof body.matchId === 'string' ? body.matchId : ''),
      )
    }

    if (action === 'verify') {
      return NextResponse.json(
        await verifyPaymentPlayer({
          matchId: typeof body.matchId === 'string' ? body.matchId : '',
          playerId: typeof body.playerId === 'string' ? body.playerId : '',
          phone: typeof body.phone === 'string' ? body.phone : '',
        }),
      )
    }

    return NextResponse.json({ error: 'La acción solicitada no es válida.' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
    const status = message.includes('no existe') || message.includes('no pertenece') || message.includes('válido') || message.includes('Verificá') || message.includes('Subí') || message.includes('Seleccioná')
      ? 400
      : message.includes('configuration') || message.includes('configuración')
        ? 503
        : 500

    return NextResponse.json({ error: message }, { status })
  }
}