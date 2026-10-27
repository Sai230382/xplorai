import { useState, type CSSProperties, type PointerEvent } from "react"
import { desks, type EditionStory } from "../data/edition"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

type Props = {
  edition: string
  stories: readonly EditionStory[]
}

function deskLabel(topic: EditionStory["topic"]) {
  return desks.find((desk) => desk.id === topic)?.label ?? topic
}

function durationSeconds(stories: readonly EditionStory[]) {
  const chars = stories.reduce((sum, story) => sum + deskLabel(story.topic).length + story.theme.length + 4, 0)
  return Math.round(Math.min(240, Math.max(48, chars / 7)))
}

function TickerList({ stories, hidden }: { stories: readonly EditionStory[]; hidden?: boolean }) {
  return (
    <ul className="v4-ticker-list" aria-hidden={hidden ? true : undefined}>
      {stories.map((story) => (
        <li key={hidden ? `copy-${story.id}` : story.id}>
          <a href={`#story-${story.id}`} tabIndex={hidden ? -1 : undefined}>
            <span className="v4-ticker-kicker">{deskLabel(story.topic)}</span>
            <span>{story.theme}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Slim headline wire for the current edition. Static when motion is reduced. */
export function BriefTicker({ edition, stories }: Props) {
  const reduced = usePrefersReducedMotion()
  const [paused, setPaused] = useState(false)
  if (stories.length === 0) return null

  const style = { "--v4-ticker-duration": `${durationSeconds(stories)}s` } as CSSProperties
  const hold = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return
    setPaused(true)
  }
  const release = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return
    setPaused(false)
  }

  return (
    <div
      className={`v4-ticker${paused ? " is-paused" : ""}`}
      role="region"
      aria-label={`Headlines from ${edition}`}
      style={style}
      onPointerEnter={hold}
      onPointerLeave={release}
    >
      <div className="v4-ticker-viewport">
        <div className="v4-ticker-track">
          <TickerList stories={stories} />
          {reduced ? null : <TickerList stories={stories} hidden />}
        </div>
      </div>
    </div>
  )
}
