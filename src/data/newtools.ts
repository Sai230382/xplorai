import newtools from "../content/newtools.json"

export type NewToolTrend = {
  theme: string
  why_it_matters: string
  sources: string[]
}

export type NewTool = {
  name: string
  url: string
  /** YYYY-MM-DD: the day it was announced or released. */
  launch_date: string
  category: string
  one_liner: string
  who_its_for: string
  pricing: string
  features: string[]
  use_cases: string[]
  eli5: string
  pick_of_week: boolean
  try_steps?: string[]
  sources: string[]
  /** "coming_soon" tools are shown with their announced date and no "try it" copy. */
  status: "available" | "coming_soon"
  /** YYYY-MM-DD the public launch is announced for (coming_soon only). */
  available_from?: string
}

export type NewToolsWeek = {
  week_of: string
  label: string
  window: string
  curated_by: string
  trends: NewToolTrend[]
  tools: NewTool[]
}

/** "New AI tools this week" page data. Replace src/content/newtools.json each week. */
export const newToolsWeek = newtools as NewToolsWeek

export const NEW_TOOLS_PATH = "/new-tools"

/** "https://www.figma.com/release-notes/" -> "figma.com" */
export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./u, "")
  } catch {
    return url
  }
}
