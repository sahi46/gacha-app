import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
