import type { DeskId } from "./edition"

/** Painted covers for this week’s desks — New Yorker energy, XplorAI palette. */
export const weekCover = "/issue/cover-week.jpg"

export const deskCovers: Record<DeskId, string> = {
  tools: "/issue/desk-tools.jpg",
  work: "/issue/desk-work.jpg",
  rules: "/issue/desk-rules.jpg",
  money: "/issue/desk-money.jpg",
  trust: "/issue/desk-trust.jpg",
}

export function deskKicker(label: string) {
  return `The ${label} desk`
}

export function coverForDesk(topic: string) {
  const key = topic.toLowerCase() as DeskId
  return deskCovers[key] ?? weekCover
}

/** One painting per mosaic tile — no repeats. */
export const mosaicCovers = [
  deskCovers.tools,
  "/issue/mosaic-astra.jpg",
  deskCovers.money,
  weekCover,
  deskCovers.rules,
  "/issue/mosaic-action.jpg",
  "/issue/mosaic-email.jpg",
  "/issue/mosaic-nobudget.jpg",
  "/issue/mosaic-owns.jpg",
  deskCovers.work,
  "/issue/mosaic-gov.jpg",
  "/issue/mosaic-label.jpg",
  "/issue/mosaic-stop.jpg",
  deskCovers.trust,
  "/issue/mosaic-august.jpg",
  "/issue/mosaic-touch.jpg",
  "/issue/mosaic-plus.jpg",
  "/issue/mosaic-camera.jpg",
]

/** Carousel cards: unique art per signal. */
export const signalCovers: Record<string, string> = {
  s1: deskCovers.tools,
  s2: deskCovers.money,
  s3: deskCovers.work,
  s4: deskCovers.rules,
  s5: deskCovers.trust,
  s6: "/issue/mosaic-nobudget.jpg",
  s7: "/issue/mosaic-astra.jpg",
  s8: "/issue/mosaic-owns.jpg",
}
