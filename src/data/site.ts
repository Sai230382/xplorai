import { currentEdition } from "./edition"

export const site = {
  name: "XplorAI",
  domain: "xplorai.in",
  tagline: "Understand what matters in AI.",
  taglineLines: ["Understand", "what matters", "in AI."],
  lede: "A short weekly briefing on what changed in AI, why it matters to ordinary work, and what to watch — without the jargon.",
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
