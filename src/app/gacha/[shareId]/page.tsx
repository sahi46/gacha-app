import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import GachaPlayer from '@/components/GachaPlayer'

type Props = {
  params: Promise<{ shareId: string }>
  searchParams: Promise<{ created?: string }>
}

export default async function GachaPage({ params, searchParams }: Props) {
  const { shareId } = await params
  const { created } = await searchParams

  const { data: gacha } = await supabase
    .from('gachas')
    .select()
    .eq('share_id', shareId)
    .single()

  if (!gacha) return notFound()

  const { data: items } = await supabase
    .from('gacha_items')
    .select()
    .eq('gacha_id', gacha.id)
    .order('weight', { ascending: false })

  if (!items || items.length === 0) return notFound()

  return <GachaPlayer gacha={gacha} items={items} isNew={created === '1'} />
}
