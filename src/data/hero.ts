import { currentEdition, desks, type DeskId, type Edition, type EditionStory } from "./edition"
import { site } from "./site"

export type CoverWireItem = {
  desk: string
  line: string
}

export type CoverContent = {
  kicker: string
  edition: string
  date: string
  tagline: string
  taglineLines: readonly string[]
  lede: string
  plateAlt: string
  plateCaption: string
  plateDate: string
  wire: CoverWireItem[]
  ticker: string[]
}

function deskLabel(topic: DeskId) {
  return desks.find((desk) => desk.id === topic)?.label ?? topic
}

function deskPhrase(topic: DeskId) {
  return `The ${deskLabel(topic).toLowerCase()} desk`
}

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0")
}

/** Prefer the story theme (already a short sentence). Fall back to `changed`. */
export function coverLine(story: EditionStory) {
  const raw = story.theme.trim() || firstSentence(story.changed)
  if (!raw) return story.changed.trim()
  return /[.!?]$/.test(raw) ? raw : `${raw}.`
}

function firstSentence(text: string) {
  const match = text.trim().match(/^[^.!?]+[.!?]?/)
  return match?.[0]?.trim() ?? text.trim()
}

function humanizeId(id: string) {
  const drop = new Set(["window", "the", "a"])
  const acronyms: Record<string, string> = {
    finra: "FINRA",
    cot: "CoT",
    ai: "AI",
    gpt: "GPT",
  }
  return id
    .split("-")
    .filter((word) => !drop.has(word))
    .map((word) => acronyms[word] ?? `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ")
}

function tickerHead(text: string, max = 24) {
  const head = text.split(/[:—–]/)[0]?.trim() ?? text.trim()
  if (head.length <= max) return head
  const words = head.split(/\s+/)
  const kept: string[] = []
  for (const word of words) {
    const next = [...kept, word].join(" ")
    if (kept.length && next.length > max) break
    kept.push(word)
  }
  return kept.join(" ")
}

function tickerPhrase(story: EditionStory) {
  const head = story.theme.split(/[:—–]/)[0]?.trim() ?? story.theme.trim()
  if (head.length <= 24) return head
  return humanizeId(story.id)
}

function extraTickerBits(story: EditionStory) {
  const desk = deskLabel(story.topic)
  const afterColon = story.theme.split(":")[1]?.trim()
  if (!afterColon) return [] as string[]
  return afterColon
    .split(/[,;]/)
    .map((part) => part.replace(/\.+$/, "").trim())
    .filter((part) => part.length >= 8 && part.length <= 28)
    .slice(-1)
    .map((part) => `${desk} · ${part}`)
}

export function coverFromEdition(edition: Edition = currentEdition): CoverContent {
  const wire = edition.stories.map((story, index) => ({
    desk: `${deskPhrase(story.topic)} · ${padIndex(index)}`,
    line: coverLine(story),
  }))

  const seen = new Set<string>()
  const ticker: string[] = []
  const push = (bit: string) => {
    const key = bit.toLowerCase()
    if (!bit || seen.has(key)) return
    seen.add(key)
    ticker.push(bit)
  }

  for (const story of edition.stories) {
    push(`${deskLabel(story.topic)} · ${tickerPhrase(story)}`)
    for (const extra of extraTickerBits(story)) push(extra)
  }
  for (const column of edition.columns.changed) {
    push(tickerHead(column.title, 36))
  }

  return {
    kicker: `${edition.edition} · this week`,
    edition: edition.edition,
    date: edition.date,
    tagline: site.tagline,
    taglineLines: site.taglineLines,
    lede: site.lede,
    plateAlt:
      "Cover painting for this week’s briefing: a person at a desk, with a violet hand reaching toward the work.",
    plateCaption: `Cover · ${edition.edition}`,
    plateDate: edition.date,
    wire: wire.length
      ? wire
      : [{ desk: `${edition.edition} · 01`, line: firstSentence(edition.summary) }],
    ticker: ticker.length ? ticker : [edition.edition, edition.kicker],
  }
}

/** Live cover copy. Weekly updates flow from edition.json — nothing here is issue-specific. */
export const cover = coverFromEdition()
