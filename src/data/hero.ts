import { currentEdition } from "./edition"

export type FragmentKind = "headline" | "datapoint" | "model" | "signal"
export type FragmentCluster = "news" | "learn" | "launch"

export type HeroFragment = {
  id: string
  kind: FragmentKind
  cluster: FragmentCluster
  text: string
  scatter: { x: number; y: number; rotate: number }
  priority: "high" | "low"
}

/** Start positions stay human. Weekly bot only replaces `text` via the edition chips. */
export const heroLayout: Omit<HeroFragment, "text">[] = [
  { id: "f1", kind: "headline", cluster: "news", scatter: { x: 6, y: 14, rotate: -9 }, priority: "high" },
  { id: "f2", kind: "model", cluster: "launch", scatter: { x: 78, y: 8, rotate: 7 }, priority: "high" },
  { id: "f3", kind: "datapoint", cluster: "news", scatter: { x: 42, y: 6, rotate: -3 }, priority: "high" },
  { id: "f4", kind: "signal", cluster: "learn", scatter: { x: 58, y: 72, rotate: 12 }, priority: "low" },
  { id: "f5", kind: "headline", cluster: "news", scatter: { x: 18, y: 78, rotate: 6 }, priority: "high" },
  { id: "f6", kind: "model", cluster: "launch", scatter: { x: 70, y: 48, rotate: -11 }, priority: "high" },
  { id: "f7", kind: "datapoint", cluster: "learn", scatter: { x: 4, y: 48, rotate: 8 }, priority: "low" },
  { id: "f8", kind: "signal", cluster: "news", scatter: { x: 86, y: 82, rotate: -5 }, priority: "high" },
  { id: "f9", kind: "headline", cluster: "learn", scatter: { x: 32, y: 36, rotate: -14 }, priority: "high" },
  { id: "f10", kind: "model", cluster: "launch", scatter: { x: 88, y: 28, rotate: 4 }, priority: "low" },
  { id: "f11", kind: "datapoint", cluster: "news", scatter: { x: 52, y: 88, rotate: 9 }, priority: "low" },
  { id: "f12", kind: "signal", cluster: "launch", scatter: { x: 24, y: 8, rotate: -6 }, priority: "low" },
  { id: "f13", kind: "headline", cluster: "learn", scatter: { x: 64, y: 18, rotate: 15 }, priority: "high" },
  { id: "f14", kind: "datapoint", cluster: "launch", scatter: { x: 10, y: 64, rotate: -10 }, priority: "high" },
  { id: "f15", kind: "signal", cluster: "news", scatter: { x: 40, y: 58, rotate: 3 }, priority: "low" },
  { id: "f16", kind: "model", cluster: "learn", scatter: { x: 82, y: 60, rotate: -8 }, priority: "high" },
  { id: "f17", kind: "headline", cluster: "launch", scatter: { x: 48, y: 22, rotate: 11 }, priority: "high" },
  { id: "f18", kind: "datapoint", cluster: "learn", scatter: { x: 14, y: 30, rotate: -4 }, priority: "low" },
]

export const heroFragments: HeroFragment[] = heroLayout.map((slot, index) => ({
  ...slot,
  text: currentEdition.chips[index] ?? slot.id,
}))
