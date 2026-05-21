const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!

export type Gacha = {
  id: string
  share_id: string
  name: string
  description: string | null
  created_at: string
}

export type GachaItem = {
  id: string
  gacha_id: string
  name: string
  weight: number
  color: string
  emoji: string
  rarity_label: string
}

export async function fetchGacha(shareId: string): Promise<{ gacha: Gacha; items: GachaItem[] } | null> {
  const res = await fetch(`${GAS_URL}?action=getGacha&shareId=${encodeURIComponent(shareId)}`, {
    cache: 'no-store',
  })
  const data = await res.json()
  if (data.error) return null
  return data
}

export async function createGacha(payload: {
  shareId: string
  name: string
  description: string
  items: Omit<GachaItem, 'id' | 'gacha_id'>[]
}): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ action: 'createGacha', ...payload }),
  })
  const data = await res.json()
  if (data.error) return { success: false, error: data.error }
  return { success: true }
}
