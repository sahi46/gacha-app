import type { GachaItem } from './sheets'

export function pullGacha(items: GachaItem[]): GachaItem {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
  let random = Math.random() * totalWeight

  for (const item of items) {
    random -= item.weight
    if (random <= 0) return item
  }
  return items[items.length - 1]
}

export function calcProbability(weight: number, items: { weight: number }[]): number {
  const total = items.reduce((sum, i) => sum + i.weight, 0)
  if (total === 0) return 0
  return (weight / total) * 100
}
