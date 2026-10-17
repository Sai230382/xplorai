/** Small display helpers for the V4 front page. Data is never changed, only formatted. */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/**
 * "6 October 2026" or an ISO timestamp -> "6 Oct".
 * Plain dates are read as written (no timezone shift); timestamps use their UTC day.
 */
export function shortDate(input: string) {
  const plain = input.match(/^(\d{1,2})\s+([A-Za-z]+)\s+\d{4}$/u)
  if (plain) return `${Number(plain[1])} ${plain[2].slice(0, 3)}`
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return input
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`
}

/** "Jotbus (jotbus.com)" -> { name: "Jotbus", where: "jotbus.com", href: "https://jotbus.com" } */
export function splitLaunchName(raw: string) {
  const match = raw.match(/^(.*?)\s*\(([^)]+)\)\s*$/u)
  if (!match) return { name: raw, where: "", href: "" }
  const target = match[2].trim()
  const href = /^https?:\/\//u.test(target) ? target : `https://${target}`
  let where = target
  try {
    where = new URL(href).hostname.replace(/^www\./u, "")
  } catch {
    /* keep the raw label */
  }
  return { name: match[1].trim(), where, href }
}
