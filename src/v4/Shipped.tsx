import { useState } from "react"
import { type ShowcasePost, showcaseLikeCount, showcasePosts } from "../data/showcase"

function Build({ post, size }: { post: ShowcasePost; size: "lead" | "small" | "grid" }) {
  return (
    <a className={`v4-build v4-build-${size}`} href={post.url} target="_blank" rel="noreferrer">
      <span className="v4-build-img">
        {post.preview ? <img src={post.preview} alt="" loading="lazy" /> : null}
      </span>
      <span className="v4-build-text">
        <span className="v4-build-desc">{post.what_they_built}</span>
        <span className="v4-build-meta">
          <span className="v4-build-handle">{post.author_handle}</span>
          <span>
            {[post.model_or_tool, `${showcaseLikeCount(post.public_metrics.like_count)} likes`].filter(Boolean).join(" · ")}
          </span>
        </span>
      </span>
    </a>
  )
}

export function Shipped() {
  const [showAll, setShowAll] = useState(false)
  const withMedia = showcasePosts.filter((p) => p.preview)
  const [lead, ...others] = withMedia
  const small = others.slice(0, 4)
  const rest = [...others.slice(4), ...showcasePosts.filter((p) => !p.preview)]

  if (!lead) return null

  return (
    <section id="shipped" className="v4-scene v4-shipped" aria-labelledby="v4-shipped-title">
      <img className="v4-scene-img" src="/scenes/shipped-studio.jpg" alt="" loading="lazy" />
      <div className="v4-scene-wash" aria-hidden="true" />
      <header className="v4-scene-head v4-scene-head-row">
        <div>
          <p className="v4-scene-note">built with AI this week</p>
          <h2 id="v4-shipped-title">What people are making</h2>
        </div>
        {rest.length > 0 && (
          <button type="button" className="v4-text-link v4-text-link-light" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
            {showAll ? "Show fewer" : `All ${showcasePosts.length} builds`} <span aria-hidden="true">{showAll ? "↑" : "→"}</span>
          </button>
        )}
      </header>

      <div className="v4-builds">
        <Build post={lead} size="lead" />
        <div className="v4-builds-side">
          {small.map((post) => (
            <Build key={post.id} post={post} size="small" />
          ))}
        </div>
      </div>

      {showAll && (
        <div className="v4-builds-all">
          {rest.map((post) => (
            <Build key={post.id} post={post} size="grid" />
          ))}
        </div>
      )}
    </section>
  )
}
