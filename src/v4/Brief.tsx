import { currentEdition, type EditionStory } from "../data/edition"

type Props = {
  onOpenStory: (story: EditionStory) => void
  onOpenNote: () => void
}

export function Brief({ onOpenStory, onOpenNote }: Props) {
  const { stories, edition } = currentEdition

  return (
    <section id="brief" className="v4-brief" aria-labelledby="v4-brief-title">
      <img className="v4-brief-backdrop" src="/scenes/brief-station.jpg" alt="" />
      <div className="v4-brief-fade" aria-hidden="true" />
      <div className="v4-section">
        <header className="v4-head">
          <div>
            <p className="v4-cap">The Brief · {edition}</p>
            <h2 id="v4-brief-title">
              What changed this week,
              <br />
              and what to do about it
            </h2>
          </div>
          <p className="v4-head-meta">{stories.length} verified stories · every one linked to its source</p>
        </header>

        <div className="v4-brief-body">
          <figure className="v4-plate">
            <img src="/doors/brief.jpg" alt="Oil painting of a stack of paper washed with indigo ink beside a cup" />
            <figcaption>
              Every story answers two questions: what does this mean for you, and what would someone actually do
              about it?
            </figcaption>
          </figure>

          <ol className="v4-stories">
            {stories.map((story, i) => (
              <li key={story.id} className="v4-story">
                <div className="v4-story-meta">
                  <span className="v4-story-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="v4-chip">{story.topic}</span>
                </div>
                <h3>
                  <button type="button" className="v4-story-link" onClick={() => onOpenStory(story)}>
                    {story.theme}
                  </button>
                </h3>
                <p className="v4-story-for">For {story.audience.charAt(0).toLowerCase() + story.audience.slice(1)}</p>
                <div className="v4-takeaways">
                  <div>
                    <h4>What it means for you</h4>
                    <p>{story.imply}</p>
                  </div>
                  <div>
                    <h4>In practice</h4>
                    <p>{story.example}</p>
                  </div>
                </div>
                <div className="v4-story-foot">
                  <button type="button" className="v4-text-link" onClick={() => onOpenStory(story)}>
                    Full story &amp; action steps <span aria-hidden="true">→</span>
                  </button>
                  <a className="v4-source" href={story.source.url} target="_blank" rel="noreferrer">
                    Source: {story.source.title} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="v4-brief-more">
          <button type="button" className="v4-text-link v4-text-link-strong" onClick={onOpenNote}>
            Read the editor’s note and what we’re still unsure about <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
