const BUTTERFLY_SPRITES = [
  "/doors/butterfly-1.png",
  "/doors/butterfly-2.png",
  "/doors/butterfly-3.png",
] as const

const BIRD_SPRITES = ["/doors/bird-1.png", "/doors/bird-2.png"] as const

export function carrierSprite(carrier: "butterfly" | "bird", nth: number) {
  const set = carrier === "bird" ? BIRD_SPRITES : BUTTERFLY_SPRITES
  return set[nth % set.length]
}
