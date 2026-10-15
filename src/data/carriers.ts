const BUTTERFLY_SPRITES = [
  "/carriers/butterfly-1.webp",
  "/carriers/butterfly-2.webp",
  "/carriers/butterfly-3.webp",
] as const

const BIRD_SPRITES = ["/carriers/bird-1.webp", "/carriers/bird-2.webp"] as const

export function carrierSprite(carrier: "butterfly" | "bird", nth: number) {
  const set = carrier === "bird" ? BIRD_SPRITES : BUTTERFLY_SPRITES
  return set[nth % set.length]
}
