import { useState } from "react"
import { NEW_TOOLS_PATH } from "./data/newtools"
import type { EditionStory } from "./data/edition"
import { Brief } from "./v4/Brief"
import { Hero } from "./v4/Hero"
import { NewToolsPage } from "./v4/NewTools"
import { NoteModal, StoryModal } from "./v4/Modal"
import { OnX } from "./v4/OnX"
import { Radar } from "./v4/Radar"
import { Shipped } from "./v4/Shipped"
import { SiteFooter } from "./v4/SiteFooter"
import { SiteNav } from "./v4/SiteNav"

/**
 * V4 front page: news, what people are saying on X, new tools, and builds. Academy & Playbook live in src/legacy.
 * "/new-tools" renders the weekly "New AI tools this week" page (src/content/newtools.json).
 */
export default function App() {
  const [story, setStory] = useState<EditionStory | null>(null)
  const [noteOpen, setNoteOpen] = useState(false)
  const path = window.location.pathname.replace(/\/+$/u, "")

  if (path === NEW_TOOLS_PATH) {
    return (
      <>
        <SiteNav home={false} />
        <main>
          <NewToolsPage />
        </main>
        <SiteFooter home={false} />
      </>
    )
  }

  return (
    <>
      <a className="v4-skip" href="#brief">
        Skip to today’s Brief
      </a>
      <SiteNav />
      <main>
        <Hero />
        <Brief onOpenStory={setStory} onOpenNote={() => setNoteOpen(true)} />
        <OnX />
        <Radar />
        <Shipped />
      </main>
      <SiteFooter />
      {story && <StoryModal story={story} onClose={() => setStory(null)} />}
      {noteOpen && <NoteModal onClose={() => setNoteOpen(false)} />}
    </>
  )
}
