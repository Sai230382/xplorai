import edition from "../content/edition.json"
import { radarPulse } from "./radar"

export const desks = [
  { id: "all", label: "All themes" },
  { id: "tools", label: "Tools" },
  { id: "work", label: "Work" },
  { id: "rules", label: "Rules" },
  { id: "money", label: "Money" },
  { id: "trust", label: "Trust" },
] as const

export type DeskId = Exclude<(typeof desks)[number]["id"], "all">

export type EditionSource = {
  title: string
  url: string
  quote: string
}

export type EditionStory = {
  id: string
  topic: DeskId
  theme: string
  changed: string
  matters: string
  imply: string
  uses: string[]
  example: string
  audience: string
  watch: string
  source: EditionSource
}

export type EditionColumnItem = {
  title: string
  body: string
}

export type EditionSignal = {
  id: string
  raw: string
  topic: string
}

export type Edition = {
  number: number
  edition: string
  date: string
  dateISO: string
  /**
   * Date of the tools-radar pulse currently on the page.
   * Derived from radar.json `pulse.week` so the Brief and the radar cannot drift.
   * Card dates still live on each launch in radar.json.
   */
  toolsPulseDate?: string
  kicker: string
  title: string
  summary: string
  uncertainty: string
  stats: {
    /** Leave unset when the week was not actually counted. Do not invent a scan total. */
    scanned?: number
    filtered: number
    verified: number
    themes: number
  }
  stories: EditionStory[]
  columns: {
    changed: EditionColumnItem[]
    matters: EditionColumnItem[]
    watch: EditionColumnItem[]
  }
  chips: string[]
  signals: EditionSignal[]
}

/** Live edition. Grokbot writes a draft JSON; approve copies it here. */
export const currentEdition: Edition = {
  ...(edition as Edition),
  toolsPulseDate: radarPulse.week,
}
