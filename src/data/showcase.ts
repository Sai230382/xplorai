import posts from "../content/showcase.json"

export type ShowcaseMetrics = {
  bookmark_count: number
  impression_count: number
  like_count: number
  quote_count: number
  reply_count: number
  retweet_count: number
}

export type ShowcasePost = {
  id: string
  url: string
  author_name: string
  author_handle: string
  created_at: string
  text: string
  model_or_tool: string | null
  what_they_built: string
  has_media: boolean
  public_metrics: ShowcaseMetrics
}

export const showcasePosts = posts as ShowcasePost[]

/** Group the stored like count. The number itself is not changed. */
export function showcaseLikeCount(count: number) {
  return new Intl.NumberFormat("en-US").format(count)
}

/**
 * Poster line for the preview. Always a verbatim prefix of what_they_built.
 * The card description keeps the full sentence.
 */
export function showcasePosterTitle(built: string) {
  const comma = built.indexOf(",")
  if (comma > 0 && comma <= 52) return built.slice(0, comma)
  const split = built.search(/\s(?:where|that|with|now|sung|made|set|designed)\s/u)
  if (split > 16) return built.slice(0, split)
  return built
}
