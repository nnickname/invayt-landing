import type { Metadata } from 'next'
import { JoinClubFlow } from '@/components/join-club-flow'

export const metadata: Metadata = {
  title: 'Invayt — Unite al equipo',
  description: 'Completá tus datos para unirte al equipo en Invayt.',
  robots: { index: false, follow: false },
}

export default async function JoinPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <JoinClubFlow slug={slug} />
}