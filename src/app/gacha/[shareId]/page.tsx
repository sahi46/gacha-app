import { notFound } from 'next/navigation'
import { fetchGacha } from '@/lib/sheets'
import GachaPlayer from '@/components/GachaPlayer'

type Props = {
  params: Promise<{ shareId: string }>
  searchParams: Promise<{ created?: string }>
}

export default async function GachaPage({ params, searchParams }: Props) {
  const { shareId } = await params
  const { created } = await searchParams

  const data = await fetchGacha(shareId)
  if (!data) return notFound()

  const { gacha, items } = data
  const sorted = [...items].sort((a, b) => b.weight - a.weight)

  return <GachaPlayer gacha={gacha} items={sorted} isNew={created === '1'} />
}
