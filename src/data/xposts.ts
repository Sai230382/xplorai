import posts from "../content/xposts.json"

export type XPost = {
  name: string
  handle: string
  avatarUrl?: string
  text: string
  url: string
  postedAt: string
  /** Optional editor's note shown as "Our take" on the front page. Posts with a take are featured first. */
  take?: string
}

export const xPosts = posts as XPost[]

/** Drop trailing t.co stubs from the card. The post body and the View on X url stay. */
export function xPostText(text: string) {
  return text.replace(/(?:\s*https?:\/\/t\.co\/[A-Za-z0-9]+)+\s*$/u, "").trim()
}

export function xPostDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date)
}
