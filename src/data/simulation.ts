/**
 * "Play with today's story" — schema and loader.
 *
 * Content lives in src/content/simulation.json, separate from edition.json.
 * The morning content routine can fill it in without colliding with the daily
 * edition PR. Full field notes: src/content/SIMULATION.md.
 *
 * The block renders nothing when the file is missing, `enabled` is not true,
 * `storyId` is not a story in the current edition, or the widget fails
 * validation. JSON never contains executable code. Calculator results come
 * from the whitelist in `evaluateFormula`.
 */
import { currentEdition, type EditionStory } from "./edition"

export type SimStat = {
  label: string
  value: string
}

export type SimSource = {
  label: string
  url: string
}

export type StepperItem = {
  label: string
  name: string
  caption?: string
  stats: SimStat[]
}

export type StepperWidget = {
  type: "stepper"
  label: string
  items: StepperItem[]
}

export type CalcControl = "slider" | "number"

export type CalcInput = {
  id: string
  label: string
  min: number
  max: number
  step: number
  value: number
  unit?: string
  control: CalcControl
}

export type CalcFormula =
  | { op: "multiply"; factors: string[] }
  | { op: "percentChange"; from: string; to: string }
  | { op: "unitCost"; unit: string; quantity: string }

export type CalcToggleOption = {
  id: string
  label: string
  multiplier: number
}

export type CalcToggle = {
  label: string
  options: CalcToggleOption[]
}

export type CalculatorWidget = {
  type: "calculator"
  inputs: CalcInput[]
  formula: CalcFormula
  result: {
    label: string
    unit: string
    decimals: number
  }
  toggle?: CalcToggle
}

export type CompareOption = {
  id: string
  label: string
  caption?: string
  stats: SimStat[]
}

export type CompareWidget = {
  type: "compare"
  label: string
  options: [CompareOption, CompareOption]
}

export type SimulationWidget = StepperWidget | CalculatorWidget | CompareWidget

export type Simulation = {
  enabled: true
  storyId: string
  kicker: string
  title: string
  intro: string
  note: string
  sources: SimSource[]
  widget: SimulationWidget
}

export type ActiveSimulation = {
  simulation: Simulation
  story: EditionStory
}

const simulationModules = import.meta.glob("../content/simulation.json", {
  eager: true,
  import: "default",
})

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function text(value: unknown): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function finite(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function optionalCaption(value: unknown): string | undefined {
  if (value === undefined || value === null || value === "") return undefined
  return text(value) ?? undefined
}

function stats(value: unknown): SimStat[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 6) return null
  const out: SimStat[] = []
  for (const item of value) {
    if (!isRecord(item)) return null
    const label = text(item.label)
    const statValue = text(item.value)
    if (!label || !statValue) return null
    out.push({ label, value: statValue })
  }
  return out
}

function sources(value: unknown): SimSource[] | null {
  if (!Array.isArray(value) || value.length < 1 || value.length > 6) return null
  const out: SimSource[] = []
  for (const item of value) {
    if (!isRecord(item)) return null
    const label = text(item.label)
    const url = text(item.url)
    if (!label || !url || !/^https?:\/\//i.test(url)) return null
    out.push({ label, url })
  }
  return out
}

function stepper(widget: Record<string, unknown>): StepperWidget | null {
  const label = text(widget.label)
  if (!label || !Array.isArray(widget.items) || widget.items.length < 2 || widget.items.length > 6) return null
  const items: StepperItem[] = []
  for (const item of widget.items) {
    if (!isRecord(item)) return null
    const itemLabel = text(item.label)
    const name = text(item.name)
    const itemStats = stats(item.stats)
    if (!itemLabel || !name || !itemStats) return null
    const caption = optionalCaption(item.caption)
    items.push(caption ? { label: itemLabel, name, caption, stats: itemStats } : { label: itemLabel, name, stats: itemStats })
  }
  return { type: "stepper", label, items }
}

function inputIds(inputs: CalcInput[]): Set<string> {
  return new Set(inputs.map((input) => input.id))
}

function knownId(ids: Set<string>, value: unknown): string | null {
  const id = text(value)
  if (!id || !ids.has(id)) return null
  return id
}

function formula(value: unknown, inputs: CalcInput[]): CalcFormula | null {
  if (!isRecord(value) || !text(value.op)) return null
  const ids = inputIds(inputs)
  if (value.op === "multiply") {
    if (!Array.isArray(value.factors) || value.factors.length < 1 || value.factors.length > 3) return null
    const factors: string[] = []
    for (const factor of value.factors) {
      const id = knownId(ids, factor)
      if (!id || factors.includes(id)) return null
      factors.push(id)
    }
    return { op: "multiply", factors }
  }
  if (value.op === "percentChange") {
    const from = knownId(ids, value.from)
    const to = knownId(ids, value.to)
    if (!from || !to || from === to) return null
    return { op: "percentChange", from, to }
  }
  if (value.op === "unitCost") {
    const unit = knownId(ids, value.unit)
    const quantity = knownId(ids, value.quantity)
    if (!unit || !quantity || unit === quantity) return null
    return { op: "unitCost", unit, quantity }
  }
  return null
}

function toggle(value: unknown): CalcToggle | null {
  if (!isRecord(value)) return null
  const label = text(value.label)
  if (!label || !Array.isArray(value.options) || value.options.length < 2 || value.options.length > 4) return null
  const options: CalcToggleOption[] = []
  for (const option of value.options) {
    if (!isRecord(option)) return null
    const id = text(option.id)
    const optionLabel = text(option.label)
    const multiplier = finite(option.multiplier)
    if (!id || !optionLabel || multiplier === null || options.some((item) => item.id === id)) return null
    options.push({ id, label: optionLabel, multiplier })
  }
  return { label, options }
}

function calculator(widget: Record<string, unknown>): CalculatorWidget | null {
  if (!Array.isArray(widget.inputs) || widget.inputs.length < 1 || widget.inputs.length > 3) return null
  const inputs: CalcInput[] = []
  for (const item of widget.inputs) {
    if (!isRecord(item)) return null
    const id = text(item.id)
    const label = text(item.label)
    const min = finite(item.min)
    const max = finite(item.max)
    const step = finite(item.step)
    const value = finite(item.value)
    if (!id || !label || min === null || max === null || step === null || value === null) return null
    if (inputs.some((input) => input.id === id)) return null
    if (max <= min || step <= 0 || value < min || value > max) return null
    const control = item.control === undefined || item.control === "slider" ? "slider" : item.control === "number" ? "number" : null
    if (!control) return null
    const unit = item.unit === undefined || item.unit === "" ? undefined : text(item.unit) ?? undefined
    if (item.unit !== undefined && item.unit !== "" && !unit) return null
    inputs.push(unit ? { id, label, min, max, step, value, unit, control } : { id, label, min, max, step, value, control })
  }
  const parsedFormula = formula(widget.formula, inputs)
  if (!parsedFormula || !isRecord(widget.result)) return null
  const resultLabel = text(widget.result.label)
  const unit = text(widget.result.unit)
  const decimals = widget.result.decimals === undefined ? 0 : finite(widget.result.decimals)
  if (!resultLabel || !unit || decimals === null || !Number.isInteger(decimals) || decimals < 0 || decimals > 4) return null
  const parsed: CalculatorWidget = {
    type: "calculator",
    inputs,
    formula: parsedFormula,
    result: { label: resultLabel, unit, decimals },
  }
  if (widget.toggle !== undefined) {
    const parsedToggle = toggle(widget.toggle)
    if (!parsedToggle) return null
    parsed.toggle = parsedToggle
  }
  return parsed
}

function compare(widget: Record<string, unknown>): CompareWidget | null {
  const label = text(widget.label)
  if (!label || !Array.isArray(widget.options) || widget.options.length !== 2) return null
  const options: CompareOption[] = []
  for (const item of widget.options) {
    if (!isRecord(item)) return null
    const id = text(item.id)
    const optionLabel = text(item.label)
    const optionStats = stats(item.stats)
    if (!id || !optionLabel || !optionStats || options.some((option) => option.id === id)) return null
    const caption = optionalCaption(item.caption)
    options.push(caption ? { id, label: optionLabel, caption, stats: optionStats } : { id, label: optionLabel, stats: optionStats })
  }
  return { type: "compare", label, options: [options[0], options[1]] }
}

function widgetOf(value: unknown): SimulationWidget | null {
  if (!isRecord(value)) return null
  if (value.type === "stepper") return stepper(value)
  if (value.type === "calculator") return calculator(value)
  if (value.type === "compare") return compare(value)
  return null
}

type LoadResult =
  | { ok: true; value: ActiveSimulation }
  | { ok: false; warn: boolean; reason: string }

function rawSimulation(): unknown {
  const values = Object.values(simulationModules)
  return values.length > 0 ? values[0] : null
}

export function loadSimulation(stories: readonly EditionStory[]): LoadResult {
  const raw = rawSimulation()
  if (raw === null || raw === undefined) {
    return { ok: false, warn: false, reason: "simulation.json is missing, so the block is hidden." }
  }
  if (!isRecord(raw)) {
    return { ok: false, warn: true, reason: "simulation.json is not an object, so the block is hidden." }
  }
  if (raw.enabled !== true) {
    return { ok: false, warn: false, reason: "simulation.json is disabled, so the block is hidden." }
  }
  const storyId = text(raw.storyId)
  const story = storyId ? stories.find((item) => item.id === storyId) : undefined
  if (!storyId || !story) {
    return {
      ok: false,
      warn: true,
      reason: "simulation.json storyId does not match a story in this edition, so the block is hidden.",
    }
  }
  const kicker = text(raw.kicker)
  const title = text(raw.title)
  const intro = text(raw.intro)
  const note = text(raw.note)
  const parsedSources = sources(raw.sources)
  const widget = widgetOf(raw.widget)
  if (!kicker || !title || !intro || !note || !parsedSources || !widget) {
    return { ok: false, warn: true, reason: "simulation.json failed validation, so the block is hidden." }
  }
  return {
    ok: true,
    value: {
      story,
      simulation: {
        enabled: true,
        storyId,
        kicker,
        title,
        intro,
        note,
        sources: parsedSources,
        widget,
      },
    },
  }
}

let warned = false

/** The simulation to render, or null when the block should disappear. */
export function activeSimulation(stories: readonly EditionStory[] = currentEdition.stories): ActiveSimulation | null {
  const loaded = loadSimulation(stories)
  if (!loaded.ok) {
    if (import.meta.env.DEV && loaded.warn && !warned) {
      warned = true
      console.warn(`[simulation] ${loaded.reason}`)
    }
    return null
  }
  return loaded.value
}

/**
 * Whitelisted arithmetic. Returns null when a percent change divides by zero.
 * The optional toggle is applied by the caller: result × multiplier.
 */
export function evaluateFormula(formula: CalcFormula, values: Record<string, number>): number | null {
  const read = (id: string) => {
    const value = values[id]
    return typeof value === "number" && Number.isFinite(value) ? value : null
  }
  if (formula.op === "multiply") {
    let product = 1
    for (const id of formula.factors) {
      const value = read(id)
      if (value === null) return null
      product *= value
    }
    return product
  }
  if (formula.op === "percentChange") {
    const from = read(formula.from)
    const to = read(formula.to)
    if (from === null || to === null || from === 0) return null
    return ((to - from) / from) * 100
  }
  const unit = read(formula.unit)
  const quantity = read(formula.quantity)
  if (unit === null || quantity === null) return null
  return unit * quantity
}

export function formatResult(value: number, decimals: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function formatResultWithUnit(value: number, unit: string, decimals: number): string {
  const formatted = formatResult(value, decimals)
  if (unit === "%") return `${formatted}%`
  return `${formatted} ${unit}`
}
