import { useState } from "react"
import { coverForDesk, deskKicker, weekCover } from "../data/covers"
import { desks, type DeskId } from "../data/edition"
import { newsStories, todayBriefing } from "../data/news"
import { site } from "../data/site"
import { Misprint } from "./Misprint"

function deskLabel(id: DeskId) {
  return desks.find((desk) => desk.id === id)?.label ?? id
}

export function BriefsReel() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <section id="news" className="mag mag-briefs" aria-labelledby="news-title">
      <header className="mag-head">
        <p className="mag-kicker">
          {todayBriefing.kicker} · {site.edition} · {site.date}
        </p>
        <Misprint as="h2" id="news-title" text="This week’s brief" className="mag-title" />
      </header>

      <article className="mag-issue">
        <figure className="mag-issue-art">
          <img src={weekCover} alt="" />
        </figure>
        <div className="mag-issue-copy">
          <p className="mag-kicker">Comment</p>
          <h3 className="mag-comment">{todayBriefing.title}</h3>
          <p className="mag-issue-lede">{todayBriefing.summary}</p>
          <p className="mag-lead-note">{todayBriefing.uncertainty}</p>
        </div>
      </article>

      <div className="mag-latest">
        <Misprint as="h3" text="The latest" className="mag-latest-label" />
        {newsStories.map((story, index) => {
          const isOpen = open === story.id
          return (
            <article
              key={story.id}
              id={`brief-${story.id}`}
              className={["mag-row", isOpen ? "is-open" : ""].filter(Boolean).join(" ")}
            >
              <a className="mag-row-art" href={story.source.url} target="_blank" rel="noreferrer">
                <img src={coverForDesk(story.topic)} alt="" />
              </a>
              <div className="mag-row-copy">
                <p className="mag-kicker">
                  {deskKicker(deskLabel(story.topic))} · {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mag-story">{story.theme}</h3>
                <p>{isOpen ? story.matters : story.changed}</p>
                {isOpen ? (
                  <>
                    <p className="mag-imply">
                      <strong>What this implies.</strong> {story.imply}
                    </p>
                    <div className="mag-uses">
                      <p>
                        <strong>If you actually use it.</strong>
                      </p>
                      <ul>
                        {story.uses.map((use) => (
                          <li key={use}>{use}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="mag-example">
                      <strong>Example.</strong> {story.example}
                    </p>
                    <p className="mag-watch">
                      <strong>Watch.</strong> {story.watch}
                    </p>
                    <p className="mag-cite">
                      <a href={story.source.url} target="_blank" rel="noreferrer">
                        {story.source.title}
                      </a>
                      <span> “{story.source.quote}”</span>
                    </p>
                  </>
                ) : null}
                <p className="mag-for">
                  For {story.audience.charAt(0).toLowerCase() + story.audience.slice(1)}
                </p>
                <button
                  type="button"
                  className={isOpen ? "btn ink sm" : "btn gold sm"}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : story.id)}
                >
                  {isOpen ? "Close" : "Read brief"}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
