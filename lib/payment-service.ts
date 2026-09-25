type SupabaseMatch = {
  id: string
  club_id: string
  name: string | null
  date: string | null
  amount_per_player: number | null
}

type SupabaseClub = {
  id: string
  name: string
  transfer_cbu: string | null
  transfer_alias: string | null
}

type SupabasePlayer = {
  id: string
  name: string | null
  last_name: string | null
  phone: string | null
}

type PaymentReceiptStatus = 'pending' | 'approved' | 'rejected'

type SupabasePaymentReceipt = {
  player_id: string
  status: PaymentReceiptStatus
}

export type PaymentPlayer = {
  id: string
  name: string
  lastName: string
  isVerified: boolean
  receiptStatus: PaymentReceiptStatus | null
}

export type PaymentContext = {
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
  players: PaymentPlayer[]
}

type SupabaseError = {
  message?: string
  hint?: string
  details?: string
}

const MAX_LENGTHS = {
  matchId: 80,
  playerId: 80,
  phone: 40,
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase server configuration is missing.')
  }

  const tokenPayload = decodeJwtPayload(serviceRoleKey)
  if (tokenPayload?.role === 'anon') {
    throw new Error('Supabase server configuration is invalid: SUPABASE_SERVICE_ROLE_KEY is an anon key.')
  }

  return { url: url.replace(/\/$/, ''), serviceRoleKey }
}

function decodeJwtPayload(token: string): { role?: string } | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8')) as { role?: string }
  } catch {
    return null
  }
}

async function supabaseRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { url, serviceRoleKey } = getSupabaseConfig()
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as SupabaseError | null
    console.error('Supabase payment request failed', {
      status: response.status,
      message: error?.message,
      hint: error?.hint,
    })
    throw new Error('No pudimos comunicarnos con Supabase.')
  }

  return (await response.json()) as T
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function validateId(value: string, field: 'matchId' | 'playerId') {
  if (!value || value.length > MAX_LENGTHS[field]) {
    throw new Error('El enlace de pago no es válido.')
  }
}

function validatePhone(phone: string) {
  if (!phone || phone.length > MAX_LENGTHS.phone) {
    throw new Error('Ingresá un teléfono válido.')
  }
}

async function findMatch(matchIdInput: string) {
  const matchId = clean(matchIdInput)
  validateId(matchId, 'matchId')

  const matches = await supabaseRequest<SupabaseMatch[]>(
    `matches?select=id,club_id,name,date,amount_per_player&id=eq.${encodeURIComponent(matchId)}&limit=1`,
  )

  if (!matches[0]) {
    throw new Error('Este partido no existe.')
  }

  return matches[0]
}

async function findPlayer(match: SupabaseMatch, playerIdInput: string) {
  const playerId = clean(playerIdInput)
  validateId(playerId, 'playerId')

  const players = await supabaseRequest<SupabasePlayer[]>(
    `players?select=id,name,last_name,phone&club_id=eq.${encodeURIComponent(match.club_id)}&id=eq.${encodeURIComponent(playerId)}&limit=1`,
  )

  if (!players[0]) {
    throw new Error('El jugador seleccionado no pertenece a este partido.')
  }

  return players[0]
}

async function findPaymentReceiptStatuses(matchId: string) {
  const receipts = await supabaseRequest<SupabasePaymentReceipt[]>(
    `payment_receipts?select=player_id,status&match_id=eq.${encodeURIComponent(matchId)}`,
  )

  return new Map(receipts.map((receipt) => [receipt.player_id, receipt.status]))
}

async function findPaymentReceiptStatus(matchId: string, playerId: string) {
  const receipts = await supabaseRequest<SupabasePaymentReceipt[]>(
    `payment_receipts?select=status&match_id=eq.${encodeURIComponent(matchId)}&player_id=eq.${encodeURIComponent(playerId)}&limit=1`,
  )

  return receipts[0]?.status || null
}

export async function resolvePayment(matchIdInput: string): Promise<PaymentContext> {
  const match = await findMatch(matchIdInput)
  const [clubs, players, receiptStatuses] = await Promise.all([
    supabaseRequest<SupabaseClub[]>(
      `clubs?select=id,name,transfer_cbu,transfer_alias&id=eq.${encodeURIComponent(match.club_id)}&limit=1`,
    ),
    supabaseRequest<SupabasePlayer[]>(
      `players?select=id,name,last_name,phone&club_id=eq.${encodeURIComponent(match.club_id)}&order=name.asc,last_name.asc`,
    ),
    findPaymentReceiptStatuses(match.id),
  ])

  if (!clubs[0]) {
    throw new Error('No pudimos encontrar el club de este partido.')
  }

  return {
    match: {
      id: match.id,
      name: clean(match.name) || 'Partido',
      date: match.date,
      amountPerPlayer: Number(match.amount_per_player || 0),
    },
    clubName: clubs[0].name,
    transfer: {
      cbu: clean(clubs[0].transfer_cbu) || null,
      alias: clean(clubs[0].transfer_alias) || null,
    },
    players: players.map((player) => ({
      id: player.id,
      name: clean(player.name),
      lastName: clean(player.last_name),
      isVerified: Boolean(clean(player.phone)),
      receiptStatus: receiptStatuses.get(player.id) || null,
    })),
  }
}

export async function verifyPaymentPlayer(input: {
  matchId: string
  playerId: string
  phone: string
}) {
  const match = await findMatch(input.matchId)
  const phone = clean(input.phone)
  validatePhone(phone)
  const player = await findPlayer(match, input.playerId)

  const receiptStatus = await findPaymentReceiptStatus(match.id, player.id)
  if (receiptStatus === 'pending' || receiptStatus === 'approved') {
    throw new Error('Este jugador ya tiene un pago registrado y no puede pagar nuevamente.')
  }

  if (clean(player.phone)) {
    return { isVerified: true }
  }

  await supabaseRequest<SupabasePlayer[]>(
    `players?id=eq.${encodeURIComponent(player.id)}&club_id=eq.${encodeURIComponent(match.club_id)}`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({ phone }),
    },
  )

  return { isVerified: true }
}

export async function uploadPaymentReceipt(input: {
  matchId: string
  playerId: string
  file: File
}) {
  const match = await findMatch(input.matchId)
  const player = await findPlayer(match, input.playerId)

  const receiptStatus = await findPaymentReceiptStatus(match.id, player.id)
  if (receiptStatus === 'pending' || receiptStatus === 'approved') {
    throw new Error('Este jugador ya tiene un pago registrado y no puede pagar nuevamente.')
  }

  if (!clean(player.phone)) {
    throw new Error('Verificá tu teléfono antes de subir el comprobante.')
  }

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  const maxFileSize = 10 * 1024 * 1024
  if (!allowedTypes.includes(input.file.type) || input.file.size === 0 || input.file.size > maxFileSize) {
    throw new Error('Subí un comprobante en PDF, JPG, PNG o WEBP de hasta 10 MB.')
  }

  const { url, serviceRoleKey } = getSupabaseConfig()
  const bucket = process.env.SUPABASE_PAYMENT_RECEIPTS_BUCKET || 'payment-receipts'
  const storagePath = `${match.id}/${player.id}/receipt`
  const storageResponse = await fetch(
    `${url}/storage/v1/object/${encodeURIComponent(bucket)}/${storagePath}`,
    {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        'Content-Type': input.file.type,
        'x-upsert': 'true',
      },
      body: await input.file.arrayBuffer(),
    },
  )

  if (!storageResponse.ok) {
    console.error('Supabase receipt upload failed', { status: storageResponse.status })
    throw new Error('No pudimos subir el comprobante. Intentá nuevamente.')
  }

  const receipts = await supabaseRequest<{ id: string; status: string }[]>(
    `payment_receipts?on_conflict=match_id,player_id`,
    {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body: JSON.stringify({
        match_id: match.id,
        player_id: player.id,
        storage_path: storagePath,
        original_name: input.file.name.slice(0, 255),
        content_type: input.file.type,
        file_size: input.file.size,
        status: 'pending',
      }),
    },
  )

  return { receiptId: receipts[0]?.id, status: receipts[0]?.status || 'pending' }
}