import { currentEdition, desks, type DeskId, type EditionStory } from "./edition"

export const newsTopics = desks

export type NewsTopicId = (typeof newsTopics)[number]["id"]

export type NewsStory = {
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
  source: EditionStory["source"]
}

export const newsStories: NewsStory[] = currentEdition.stories.map((story: EditionStory) => ({
  id: story.id,
  topic: story.topic,
  theme: story.theme,
  changed: story.changed,
  matters: story.matters,
  imply: story.imply,
  uses: story.uses,
  example: story.example,
  audience: story.audience,
  watch: story.watch,
  source: story.source,
}))

export const deskStats = [
  { id: "scanned", label: "Items scanned", value: currentEdition.stats.scanned, note: "this week’s pile" },
  { id: "filtered", label: "Passed filter", value: currentEdition.stats.filtered, note: "changed a decision" },
  { id: "verified", label: "Verified", value: currentEdition.stats.verified, note: "a source we can link" },
  { id: "themes", label: "Themes", value: currentEdition.stats.themes, note: "what you read" },
] as const

export const todayBriefing = {
  kicker: currentEdition.kicker,
  title: currentEdition.title,
  summary: currentEdition.summary,
  uncertainty: currentEdition.uncertainty,
  columns: {
    changed: {
      title: "What changed",
      items: currentEdition.columns.changed,
    },
    matters: {
      title: "Why it matters",
      items: currentEdition.columns.matters,
    },
    watch: {
      title: "What to watch next",
      items: currentEdition.columns.watch,
    },
  },
}
