'use client'

import { useState } from 'react'
import { pullGacha, calcProbability } from '@/lib/gacha'
import type { Gacha, GachaItem } from '@/lib/supabase'

type Props = {
  gacha: Gacha
  items: GachaItem[]
  isNew?: boolean
}

export default function GachaPlayer({ gacha, items, isNew }: Props) {
  const [result, setResult] = useState<GachaItem | null>(null)
  const [animating, setAnimating] = useState(false)
  const [showItems, setShowItems] = useState(false)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<GachaItem[]>([])

  function pull() {
    if (animating) return
    setResult(null)
    setAnimating(true)
    setTimeout(() => {
      const picked = pullGacha(items)
      setResult(picked)
      setHistory((prev) => [picked, ...prev].slice(0, 20))
      setAnimating(false)
    }, 800)
  }

  function copyUrl() {
    navigator.clipboard.writeText(window.location.href.split('?')[0])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen px-4 py-10 max-w-lg mx-auto flex flex-col">
      {isNew && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-green-900/30 border border-green-700 text-green-300 text-sm text-center">
          🎉 ガチャを作成しました！URLをシェアしてみんなに引いてもらおう
        </div>
      )}

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">{gacha.name}</h1>
        {gacha.description && (
          <p className="text-purple-400 text-sm">{gacha.description}</p>
        )}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-56 h-56 mb-8 relative flex items-center justify-center">
          {animating && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-spin opacity-30" />
          )}

          {result && !animating ? (
            <div
              className="w-48 h-48 rounded-3xl flex flex-col items-center justify-center shadow-2xl animate-spin-gacha"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${result.color}88, ${result.color}22)`,
                borderColor: result.color,
                border: `2px solid ${result.color}`,
              }}
            >
              <span className="text-6xl mb-2">{result.emoji}</span>
              <span className="text-white font-bold text-center px-2 text-lg leading-tight">
                {result.name}
              </span>
              {result.rarity_label && (
                <span
                  className="mt-1 px-3 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: result.color, color: '#fff' }}
                >
                  {result.rarity_label}
                </span>
              )}
            </div>
          ) : !animating ? (
            <div className="w-48 h-48 rounded-3xl border-2 border-dashed border-purple-700 flex items-center justify-center text-purple-600">
              <span className="text-5xl">?</span>
            </div>
          ) : (
            <div className="w-48 h-48 rounded-3xl bg-purple-900/50 flex items-center justify-center">
              <div className="text-5xl animate-spin">🎰</div>
            </div>
          )}
        </div>

        <button
          onClick={pull}
          disabled={animating}
          className="px-14 py-5 text-2xl font-bold rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 text-white transition-all transform hover:scale-105 shadow-xl shadow-purple-900 mb-4"
        >
          {animating ? '引いてる...' : 'ガチャを引く！'}
        </button>

        <button
          onClick={copyUrl}
          className="px-6 py-2 rounded-full border border-purple-700 text-purple-400 hover:border-purple-500 hover:text-purple-300 text-sm transition-colors"
        >
          {copied ? '✅ コピーしました！' : '🔗 URLをコピー'}
        </button>
      </div>

      <div className="mt-8">
        <button
          onClick={() => setShowItems(!showItems)}
          className="w-full text-center text-sm text-purple-500 hover:text-purple-300 transition-colors py-2"
        >
          {showItems ? '▲ アイテム一覧を閉じる' : '▼ アイテム一覧を見る'}
        </button>

        {showItems && (
          <div className="mt-3 space-y-2">
            {items.map((item) => {
              const prob = calcProbability(item.weight, items)
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl bg-purple-950/40 border border-purple-900"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="flex-1 text-white text-sm">{item.name}</span>
                  {item.rarity_label && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: item.color, color: '#fff' }}
                    >
                      {item.rarity_label}
                    </span>
                  )}
                  <span className="text-yellow-400 text-sm font-bold">{prob.toFixed(1)}%</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xs text-purple-500 mb-2">引いた履歴</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((h, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-xs"
                style={{ background: h.color + '33', border: `1px solid ${h.color}66`, color: h.color }}
              >
                {h.emoji} {h.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
