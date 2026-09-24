import { NextResponse } from 'next/server'
import { joinClub, resolveJoinClub } from '@/lib/join-club-service'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>
    const action = typeof body.action === 'string' ? body.action : ''

    if (action === 'resolve') {
      return NextResponse.json(
        await resolveJoinClub(typeof body.slug === 'string' ? body.slug : ''),
      )
    }

    if (action === 'join') {
      return NextResponse.json(
        await joinClub({
          slug: typeof body.slug === 'string' ? body.slug : '',
          playerId: typeof body.playerId === 'string' ? body.playerId : undefined,
          name: typeof body.name === 'string' ? body.name : '',
          lastName: typeof body.lastName === 'string' ? body.lastName : '',
          phone: typeof body.phone === 'string' ? body.phone : '',
          email: typeof body.email === 'string' ? body.email : undefined,
        }),
      )
    }

    return NextResponse.json({ error: 'La acción solicitada no es válida.' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ocurrió un error inesperado.'
    const status = message.includes('no existe') || message.includes('no pertenece') || message.includes('ya está')
      ? 400
      : message.includes('configuration')
        ? 503
        : 500

    return NextResponse.json({ error: message }, { status })
  }
}