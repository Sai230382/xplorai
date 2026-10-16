import { showcaseLikeCount, showcasePosterTitle, showcasePosts } from "../data/showcase"

const PREVIEW_TONES = ["tone-peri", "tone-indigo", "tone-lav", "tone-slate", "tone-cream"] as const

export function ShippedShowcase() {
  return (
    <div className="shipped-grid">
      {showcasePosts.map((post, index) => {
        const tone = PREVIEW_TONES[index % PREVIEW_TONES.length]
        const likes = showcaseLikeCount(post.public_metrics.like_count)
        return (
          <a
            key={post.id}
            className="shipped-card"
            href={post.url}
            target="_blank"
            rel="noopener"
          >
            <div className={post.preview ? "shipped-preview has-photo" : `shipped-preview ${tone}`} aria-hidden="true">
              {post.preview ? (
                <img src={post.preview} alt="" loading="lazy" />
              ) : (
                <p>{showcasePosterTitle(post.what_they_built)}</p>
              )}
            </div>
            <div className="shipped-body">
              <p className="shipped-handle">{post.author_handle}</p>
              <p className="shipped-desc">{post.what_they_built}</p>
              <div className="shipped-meta">
                {post.model_or_tool ? <span className="shipped-chip">{post.model_or_tool}</span> : null}
                <span className="shipped-likes">{likes} likes</span>
              </div>
            </div>
            <span className="sr-only">Opens the original post in a new tab.</span>
          </a>
        )
      })}
    </div>
  )
}
