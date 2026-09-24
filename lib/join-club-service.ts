type SupabasePlayer = {
  id: string
  name: string | null
  last_name: string | null
  phone: string | null
}

type SupabaseClub = {
  id: string
  name: string
}

export type JoinClubPlayer = {
  id: string
  name: string
  lastName: string
  isVerified: boolean
}

export type JoinClubContext = {
  clubId: string
  clubName: string
  players: JoinClubPlayer[]
}

type JoinClubInput = {
  slug: string
  playerId?: string
  name: string
  lastName: string
  phone: string
  email?: string
}

type SupabaseError = {
  message?: string
  hint?: string
  details?: string
}

const MAX_LENGTHS = {
  slug: 120,
  name: 80,
  lastName: 80,
  phone: 40,
  email: 254,
}

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase server configuration is missing.')
  }

  return { url: url.replace(/\/$/, ''), serviceRoleKey }
}

async function supabaseRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
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
    console.error('Supabase request failed', {
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

function validateText(value: string, field: keyof typeof MAX_LENGTHS) {
  if (!value || value.length > MAX_LENGTHS[field]) {
    throw new Error('Revisá los datos ingresados e intentá nuevamente.')
  }
}

async function findClub(slug: string) {
  const clubs = await supabaseRequest<SupabaseClub[]>(
    `clubs?select=id,name&slug=eq.${encodeURIComponent(slug)}&limit=1`,
  )

  if (!clubs[0]) {
    throw new Error('Este club no existe.')
  }

  return clubs[0]
}

export async function resolveJoinClub(slugInput: string): Promise<JoinClubContext> {
  const slug = clean(slugInput)
  validateText(slug, 'slug')

  const club = await findClub(slug)
  const players = await supabaseRequest<SupabasePlayer[]>(
    `players?select=id,name,last_name,phone&club_id=eq.${encodeURIComponent(club.id)}&order=name.asc,last_name.asc`,
  )

  return {
    clubId: club.id,
    clubName: club.name,
    players: players.map((player) => ({
      id: player.id,
      name: clean(player.name),
      lastName: clean(player.last_name),
      isVerified: Boolean(clean(player.phone)),
    })),
  }
}

export async function joinClub(input: JoinClubInput) {
  const slug = clean(input.slug)
  const playerId = clean(input.playerId)
  const name = clean(input.name)
  const lastName = clean(input.lastName)
  const phone = clean(input.phone)
  const email = clean(input.email)

  validateText(slug, 'slug')
  validateText(name, 'name')
  validateText(lastName, 'lastName')
  validateText(phone, 'phone')
  if (email.length > MAX_LENGTHS.email) {
    throw new Error('Revisá los datos ingresados e intentá nuevamente.')
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error('Ingresá un email válido.')
  }

  const club = await findClub(slug)
  const playerData = {
    name,
    last_name: lastName,
    phone,
    email: email || null,
    status: 'active',
  }

  if (playerId) {
    const existingPlayers = await supabaseRequest<SupabasePlayer[]>(
      `players?select=id,phone&club_id=eq.${encodeURIComponent(club.id)}&id=eq.${encodeURIComponent(playerId)}&limit=1`,
    )

    if (!existingPlayers[0]) {
      throw new Error('El jugador seleccionado no pertenece a este club.')
    }
    if (clean(existingPlayers[0].phone)) {
      throw new Error('Este jugador ya está verificado.')
    }

    const updatedPlayers = await supabaseRequest<SupabasePlayer[]>(
      `players?id=eq.${encodeURIComponent(playerId)}&club_id=eq.${encodeURIComponent(club.id)}`,
      {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(playerData),
      },
    )

    return { ...updatedPlayers[0], clubName: club.name }
  }

  const createdPlayers = await supabaseRequest<SupabasePlayer[]>(`players`, {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ club_id: club.id, ...playerData }),
  })

  return { ...createdPlayers[0], clubName: club.name }
}