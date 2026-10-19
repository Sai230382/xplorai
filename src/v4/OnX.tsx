import { xPosts, xPostText } from "../data/xposts"
import { shortDate } from "./format"

/** Posts with an editor's take lead; the section never shows more than three. */
function pickPosts() {
  const withTake = xPosts.filter((p) => p.take?.trim())
  const rest = xPosts.filter((p) => !p.take?.trim())
  return [...withTake, ...rest].slice(0, 3)
}

export function OnX() {
  const posts = pickPosts()

  return (
    <section id="on-x" className="v4-scene v4-onx" aria-labelledby="v4-onx-title">
      <img className="v4-scene-img" src="/scenes/onx-cafe.jpg" alt="" loading="lazy" />
      <div className="v4-scene-wash" aria-hidden="true" />
      <header className="v4-scene-head">
        <p className="v4-scene-note">what people are saying</p>
        <h2 id="v4-onx-title">Worth reading on X</h2>
        <p>We read the timeline so you don’t have to. Three recent posts, and why each one is worth your time.</p>
      </header>

      <div className="v4-posts">
        {posts.map((post) => (
          <article key={post.url} className="v4-post">
            <header>
              {post.avatarUrl ? (
                <img className="v4-avatar" src={post.avatarUrl} alt="" width={44} height={44} loading="lazy" />
              ) : (
                <span className="v4-avatar" aria-hidden="true" />
              )}
              <div className="v4-post-who">
                <strong>{post.name}</strong>
                <span>
                  @{post.handle} · {shortDate(post.postedAt)}
                </span>
              </div>
              <a className="v4-post-link" href={post.url} target="_blank" rel="noreferrer" aria-label={`Open ${post.name}’s post on X`}>
                ↗
              </a>
            </header>
            <p className="v4-post-text">“{xPostText(post.text)}”</p>
            {post.take?.trim() && (
              <div className="v4-take">
                <p className="v4-cap">
                  <img src="/carriers/butterfly-1.webp" alt="" width={22} height={17} /> Our take
                </p>
                <p>{post.take}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
