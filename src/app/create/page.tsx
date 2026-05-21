'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { calcProbability } from '@/lib/gacha'
import { nanoid } from 'nanoid'

type ItemDraft = {
  id: string
  name: string
  weight: number
  color: string
  emoji: string
  rarity_label: string
}

const PRESET_RARITIES = [
  { label: 'SSR', weight: 3, color: '#f59e0b' },
  { label: 'SR', weight: 12, color: '#a855f7' },
  { label: 'R', weight: 35, color: '#3b82f6' },
  { label: 'N', weight: 50, color: '#6b7280' },
]

const COLORS = ['#f59e0b', '#a855f7', '#3b82f6', '#10b981', '#ef4444', '#ec4899', '#6b7280', '#f97316']

function newItem(): ItemDraft {
  return { id: nanoid(), name: '', weight: 10, color: '#a855f7', emoji: '⭐', rarity_label: '' }
}

export default function CreatePage() {
  const router = useRouter()
  const [gachaName, setGachaName] = useState('')
  const [description, setDescription] = useState('')
  const [items, setItems] = useState<ItemDraft[]>([newItem()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function addItem() {
    setItems((prev) => [...prev, newItem()])
  }

  function removeItem(id: string) {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateItem(id: string, field: keyof ItemDraft, value: string | number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  function applyPreset(id: string, preset: typeof PRESET_RARITIES[number]) {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, rarity_label: preset.label, weight: preset.weight, color: preset.color }
          : i
      )
    )
  }

  async function handleSubmit() {
    if (!gachaName.trim()) { setError('ガチャ名を入力してください'); return }
    if (items.some((i) => !i.name.trim())) { setError('全アイテムに名前を入力してください'); return }
    if (items.length < 2) { setError('アイテムは2つ以上必要です'); return }

    setLoading(true)
    setError('')

    const shareId = nanoid(8)

    const { data: gacha, error: gachaErr } = await supabase
      .from('gachas')
      .insert({ name: gachaName.trim(), description: description.trim() || null, share_id: shareId })
      .select()
      .single()

    if (gachaErr || !gacha) {
      setError('作成に失敗しました: ' + (gachaErr?.message ?? ''))
      setLoading(false)
      return
    }

    const itemRows = items.map((i) => ({
      gacha_id: gacha.id,
      name: i.name.trim(),
      weight: i.weight,
      color: i.color,
      emoji: i.emoji,
      rarity_label: i.rarity_label,
    }))

    const { error: itemsErr } = await supabase.from('gacha_items').insert(itemRows)

    if (itemsErr) {
      setError('アイテム保存に失敗: ' + itemsErr.message)
      setLoading(false)
      return
    }

    router.push(`/gacha/${shareId}?created=1`)
  }

  return (
    <main className="min-h-screen px-4 py-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-purple-300">🎲 ガチャを作る</h1>
      <p className="text-purple-500 text-sm mb-8">アイテムと確率を設定して、URLをシェアしよう</p>

      <section className="mb-8 space-y-4">
        <div>
          <label className="block text-sm text-purple-300 mb-1">ガチャ名 *</label>
          <input
            value={gachaName}
            onChange={(e) => setGachaName(e.target.value)}
            placeholder="例: 推しキャラガチャ"
            className="w-full px-4 py-3 rounded-xl bg-purple-950/50 border border-purple-700 text-white placeholder-purple-600 focus:outline-none focus:border-purple-400"
          />
        </div>
        <div>
          <label className="block text-sm text-purple-300 mb-1">説明（任意）</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="例: ハーフアニバーサリー記念！"
            className="w-full px-4 py-3 rounded-xl bg-purple-950/50 border border-purple-700 text-white placeholder-purple-600 focus:outline-none focus:border-purple-400"
          />
        </div>
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-purple-300">アイテム一覧</h2>
          <button
            onClick={addItem}
            className="px-4 py-1.5 text-sm rounded-full bg-purple-800 hover:bg-purple-700 text-white transition-colors"
          >
            ＋ 追加
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item) => {
            const prob = calcProbability(item.weight, items)
            return (
              <div key={item.id} className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800">
                <div className="flex gap-2 mb-3">
                  <input
                    value={item.emoji}
                    onChange={(e) => updateItem(item.id, 'emoji', e.target.value)}
                    className="w-14 text-center px-2 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white focus:outline-none"
                    placeholder="🌟"
                  />
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                    placeholder="アイテム名"
                    className="flex-1 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white placeholder-purple-600 focus:outline-none focus:border-purple-400"
                  />
                  <input
                    value={item.rarity_label}
                    onChange={(e) => updateItem(item.id, 'rarity_label', e.target.value)}
                    placeholder="レア度"
                    className="w-20 text-center px-2 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white placeholder-purple-600 focus:outline-none text-sm"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="px-3 py-2 rounded-lg text-purple-500 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex gap-2 items-center flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-400">重み:</span>
                    <input
                      type="number"
                      min={1}
                      value={item.weight}
                      onChange={(e) => updateItem(item.id, 'weight', Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center px-2 py-1 rounded-lg bg-purple-900/50 border border-purple-700 text-white focus:outline-none text-sm"
                    />
                    <span className="text-xs text-yellow-400 font-bold">{prob.toFixed(1)}%</span>
                  </div>

                  <div className="flex gap-1 ml-auto">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateItem(item.id, 'color', c)}
                        className={`w-6 h-6 rounded-full transition-transform ${item.color === c ? 'scale-125 ring-2 ring-white' : ''}`}
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-1 mt-2">
                  {PRESET_RARITIES.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyPreset(item.id, p)}
                      className="px-2 py-0.5 text-xs rounded-full border transition-colors hover:brightness-125"
                      style={{ borderColor: p.color, color: p.color }}
                    >
                      {p.label}
                    </button>
                  ))}
                  <span className="text-xs text-purple-600 ml-1 self-center">← プリセット</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {error && (
        <p className="mb-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
          ⚠️ {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 rounded-full text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white transition-all transform hover:scale-[1.02] shadow-lg shadow-purple-900"
      >
        {loading ? '作成中...' : '✨ ガチャを作成してシェア！'}
      </button>
    </main>
  )
}
