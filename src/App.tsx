import { useState } from "react"
import type { EditionStory } from "./data/edition"
import { Brief } from "./v4/Brief"
import { Hero } from "./v4/Hero"
import { NoteModal, StoryModal } from "./v4/Modal"
import { OnX } from "./v4/OnX"
import { Radar } from "./v4/Radar"
import { Shipped } from "./v4/Shipped"
import { SiteFooter } from "./v4/SiteFooter"
import { SiteNav } from "./v4/SiteNav"

/** V4 front page: news, what people are saying on X, new tools, and builds. Academy & Playbook live in src/legacy. */
export default function App() {
  const [story, setStory] = useState<EditionStory | null>(null)
  const [noteOpen, setNoteOpen] = useState(false)

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
