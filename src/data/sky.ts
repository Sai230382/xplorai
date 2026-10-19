import { currentEdition, desks, type DeskId, type Edition, type EditionStory } from "./edition"

/** Brand lines that stay stable across editions. Not statistics. */
const BRAND_LINES = [
  "What changed in AI",
  "What it means for your work",
  "Every morning",
] as const

const TRAIL = new Set([
  "a",
  "an",
  "the",
  "of",
  "and",
  "or",
  "to",
  "in",
  "on",
  "for",
  "with",
  "is",
  "are",
  "was",
  "be",
  "its",
  "that",
])

export type SkyTickerCopy = {
  far: string[]
  near: string[]
  mobile: string[]
}

function deskLabel(topic: DeskId) {
  return desks.find((desk) => desk.id === topic)?.label ?? topic
}

function clipWords(text: string, maxWords: number, maxChars: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean)
  const kept: string[] = []
  for (const word of words) {
    const next = [...kept, word].join(" ")
    if (kept.length >= maxWords || (kept.length > 0 && next.length > maxChars)) break
    kept.push(word)
  }
  while (kept.length > 2 && TRAIL.has(kept[kept.length - 1].replace(/[^a-z]/gi, "").toLowerCase())) {
    kept.pop()
  }
  return kept.join(" ").replace(/[,:;–—-]+$/, "")
}

function storyHook(story: EditionStory) {
  const theme = story.theme.trim().replace(/^The\s+/i, "")
  const head = theme.split(/\s+[—–]\s+|:\s+/)[0] ?? theme
  return clipWords(head, 4, 32)
}

function pushUnique(list: string[], seen: Set<string>, bit: string) {
  const clean = bit.replace(/\s+/g, " ").trim()
  const key = clean.toLowerCase()
  if (!clean || seen.has(key)) return
  seen.add(key)
  list.push(clean)
}

function widen(phrases: string[], min = 8) {
  if (phrases.length === 0) return phrases
  const out = [...phrases]
  while (out.length < min) out.push(...phrases)
  return out
}

function interleave(left: string[], right: string[]) {
  const out: string[] = []
  const n = Math.max(left.length, right.length)
  for (let i = 0; i < n; i += 1) {
    if (right[i]) out.push(right[i])
    if (left[i]) out.push(left[i])
  }
  return out
}

/** Desk names, short hooks, and column titles from the live edition, plus brand lines. */
export function skyTicker(edition: Edition = currentEdition): SkyTickerCopy {
  const seen = new Set<string>()
  const hooks: string[] = []
  const columns: string[] = []
  const brand: string[] = []

  for (const line of BRAND_LINES) pushUnique(brand, seen, line)
  if (edition.kicker) pushUnique(brand, seen, edition.kicker)

  for (const story of edition.stories) {
    const hook = storyHook(story)
    if (!hook) continue
    pushUnique(hooks, seen, `${deskLabel(story.topic)} · ${hook}`)
  }

  for (const item of edition.columns.changed) {
    pushUnique(columns, seen, clipWords(item.title, 8, 42))
  }

  const far = brand.length || columns.length ? [...brand, ...columns] : [edition.edition]
  const near = hooks.length ? hooks : [...columns]
  const mobile = interleave(near, far)

  return {
    far: widen(far),
    near: widen(near),
    mobile: mobile.length ? mobile : [edition.edition],
  }
}
