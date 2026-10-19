import { currentEdition } from "./edition"

export const site = {
  name: "XplorAI",
  domain: "xplorai.in",
  headline: "AI keeps moving. Your work can keep up.",
  bridge: "What changed. What to learn. What to try.",
  tagline: "Every morning: what changed in AI, and what to do about it.",
  taglineLines: ["Every morning:", "what changed in AI,", "and what to do about it."],
  lede: "A short briefing for people who use AI at work. What changed, why it matters for your job, and what to do next.",
  email: "hello@xplorai.in",
  edition: currentEdition.edition,
  date: currentEdition.date,
  dateISO: currentEdition.dateISO,
}

export const nav = [
  { id: "news", label: "Brief", href: "#news" },
  { id: "library", label: "Library", href: "#library" },
  { id: "launches", label: "Tools", href: "#launches" },
] as const

export const ctas = {
  briefing: { label: "Read this week’s brief", href: "#news" },
  how: { label: "Open the tools radar", href: "#launches" },
} as const
