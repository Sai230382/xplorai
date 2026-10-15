const BUTTERFLY_SPRITES = [
  "/carriers/butterfly-1.webp",
  "/carriers/butterfly-2.webp",
  "/carriers/butterfly-3.webp",
] as const

export function butterflySprite(nth: number) {
  return BUTTERFLY_SPRITES[nth % BUTTERFLY_SPRITES.length]
}
