import { deskCovers, deskKicker } from "../data/covers"
import { newsStories, todayBriefing } from "../data/news"
import { desks, type DeskId } from "../data/edition"
import { site } from "../data/site"

function deskLabel(id: DeskId) {
  return desks.find((desk) => desk.id === id)?.label ?? id
}

export function ThemesBento() {
  return (
    <section id="themes" className="mag mag-themes" aria-labelledby="themes-title">
      <header className="mag-head">
        <p className="mag-kicker">
          The magazine · {site.edition} · {site.date}
        </p>
        <h2 id="themes-title" className="mag-title">
          The week in five themes
        </h2>
        <p className="mag-dek">{todayBriefing.summary}</p>
      </header>

      <div className="mag-grid">
        {newsStories.map((story) => (
          <a key={story.id} className="mag-card" href={`#brief-${story.id}`}>
            <span className="mag-art">
              <img src={deskCovers[story.topic]} alt="" />
            </span>
            <span className="mag-kicker">{deskKicker(deskLabel(story.topic))}</span>
            <span className="mag-card-title">{story.theme}</span>
            <span className="mag-card-dek">{story.changed}</span>
          </a>
        ))}

        <a className="mag-card mag-subscribe" href="#news">
          <span className="mag-kicker">This week</span>
          <span className="mag-card-title">The briefs that matter. The week you need.</span>
          <span className="mag-card-dek">What changed, why it matters, what to watch — with a source you can open.</span>
          <span className="btn gold sm">Read the briefs</span>
        </a>
      </div>
    </section>
  )
}
