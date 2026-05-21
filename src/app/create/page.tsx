'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createGacha } from '@/lib/sheets'
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
        i.id === id ? { ...i, rarity_label: preset.label, weight: preset.weight, color: preset.color } : i
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
    const result = await createGacha({
      shareId,
      name: gachaName.trim(),
      description: description.trim(),
      items: items.map(({ name, weight, color, emoji, rarity_label }) => ({
        name, weight, color, emoji, rarity_label,
      })),
    })

    if (!result.success) {
      setError('作成に失敗しました: ' + (result.error ?? ''))
      setLoading(false)
      return
    }

    router.push(`/gacha/${shareId}?created=1`)
  }

  return (
    <main className="min-h-screen px-4 py-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1 text-purple-300">🎲 ガチャを作る</h1>
      <p className="text-purple-500 text-sm mb-6">アイテムと確率を設定してシェアしよう</p>

      {/* 基本情報 */}
      <div className="space-y-3 mb-6">
        <input
          value={gachaName}
          onChange={(e) => setGachaName(e.target.value)}
          placeholder="ガチャ名（例: 推しキャラガチャ）"
          className="w-full px-4 py-3 rounded-xl bg-purple-950/50 border border-purple-700 text-white placeholder-purple-600 focus:outline-none focus:border-purple-400 text-base"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="説明（任意）"
          className="w-full px-4 py-3 rounded-xl bg-purple-950/50 border border-purple-700 text-white placeholder-purple-600 focus:outline-none focus:border-purple-400 text-base"
        />
      </div>

      {/* アイテム */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-purple-300">アイテム</h2>
        <button
          onClick={addItem}
          className="px-4 py-1.5 text-sm rounded-full bg-purple-800 active:bg-purple-700 text-white"
        >
          ＋ 追加
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => {
          const prob = calcProbability(item.weight, items)
          return (
            <div key={item.id} className="p-3 rounded-2xl bg-purple-950/40 border border-purple-800">
              {/* 1行目: 絵文字・名前・削除 */}
              <div className="flex gap-2 mb-2">
                <input
                  value={item.emoji}
                  onChange={(e) => updateItem(item.id, 'emoji', e.target.value)}
                  className="w-12 text-center px-1 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white focus:outline-none text-lg"
                />
                <input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="アイテム名"
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-purple-900/50 border border-purple-700 text-white placeholder-purple-600 focus:outline-none focus:border-purple-400"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="px-2 py-2 rounded-lg text-purple-500 active:text-red-400"
                >
                  ✕
                </button>
              </div>

              {/* 2行目: レア度・重み・確率 */}
              <div className="flex gap-2 mb-2">
                <input
                  value={item.rarity_label}
                  onChange={(e) => updateItem(item.id, 'rarity_label', e.target.value)}
                  placeholder="レア度"
                  className="w-20 text-center px-2 py-1.5 rounded-lg bg-purple-900/50 border border-purple-700 text-white placeholder-purple-600 focus:outline-none text-sm"
                />
                <div className="flex items-center gap-1.5 flex-1">
                  <span className="text-xs text-purple-400 shrink-0">重み</span>
                  <input
                    type="number"
                    min={1}
                    value={item.weight}
                    onChange={(e) => updateItem(item.id, 'weight', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-14 text-center px-2 py-1.5 rounded-lg bg-purple-900/50 border border-purple-700 text-white focus:outline-none text-sm"
                  />
                  <span className="text-sm text-yellow-400 font-bold">{prob.toFixed(1)}%</span>
                </div>
              </div>

              {/* 3行目: カラー */}
              <div className="flex gap-1.5 flex-wrap mb-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => updateItem(item.id, 'color', c)}
                    className={`w-7 h-7 rounded-full transition-transform ${item.color === c ? 'scale-125 ring-2 ring-white' : ''}`}
                    style={{ background: c }}
                  />
                ))}
              </div>

              {/* 4行目: プリセット */}
              <div className="flex gap-1.5 flex-wrap">
                {PRESET_RARITIES.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(item.id, p)}
                    className="px-2.5 py-0.5 text-xs rounded-full border"
                    style={{ borderColor: p.color, color: p.color }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {error && (
        <p className="mb-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
          ⚠️ {error}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 rounded-2xl text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50 text-white shadow-lg shadow-purple-900 active:scale-95 transition-transform"
      >
        {loading ? '作成中...' : '✨ 作成してシェア！'}
      </button>
    </main>
  )
}
