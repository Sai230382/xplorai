# Play with today’s story

The interactive block at the top of The Brief reads `src/content/simulation.json`. It is separate from `edition.json` so a daily briefing PR and a simulation edit do not have to land in the same diff.

If this file is missing, `enabled` is not `true`, or `storyId` is not the `id` of a story in the current edition, the page renders nothing. An invalid widget also hides the block. Check the dev-server console for a `[simulation]` warning.

## Morning routine

1. Open today’s `edition.json` and pick one story whose own text or `source.quote` contains real numbers.
2. Copy only those numbers. Do not invent a figure, and do not turn “under 7” or “more than 30%” into a precise value.
3. Set `storyId` to that story’s `id`. If no story has a number you can show honestly, set `"enabled": false`.
4. Write the `title`, `intro`, and `note` in plain words. The `note` is the caveat: what was counted, and what was left out.
5. Add at least one `sources` entry. `url` must start with `http://` or `https://`.
6. Set `widget.type` to `stepper`, `calculator`, or `compare`.

Extra keys (such as `_readme`) are ignored. The page does not run code from this file.

## Fields on every block

| Field | Required | Notes |
| --- | --- | --- |
| `enabled` | yes | `true` shows the block. Anything else hides it. |
| `storyId` | yes | Must match `stories[].id` in the current `edition.json`. The block links through to that story. |
| `kicker` | yes | Short label above the title. The live block uses “Play with today’s story”. |
| `title` | yes | One sentence, Newsreader on the page. |
| `intro` | yes | What the reader is looking at, and what to do with the control. |
| `note` | yes | Assumption or caveat. Shown under the widget. |
| `sources` | yes | 1–6 items of `{ "label", "url" }`. |
| `widget` | yes | One of the three types below. |

## `stepper`

A slider across 2–6 items. Each item shows a name, an optional caption, and 1–6 labeled stats. Stats are text. The page does not calculate them.

```json
{
  "type": "stepper",
  "label": "Name of the slider, read by screen readers",
  "items": [
    {
      "label": "Short mark under the slider",
      "name": "Name shown beside the stats",
      "caption": "Optional",
      "stats": [{ "label": "Stat label", "value": "Figure copied from the story" }]
    }
  ]
}
```

`label` on an item is the short mark (a date, a model, a place). `name` is the longer heading. Include 2–6 items.

## `calculator`

1–3 numeric inputs and a formula from a fixed list. The result is `formula × selected multiplier`. The first toggle option is selected on load. Put a multiplier of `1` first if the opening number should be the unscaled formula.

`control` is `slider` (the default) or `number`. `min` must be less than `max`, `step` must be greater than 0, and `value` must sit inside the range. Input `id`s are short names you make up (`price`, `seats`). They are not shown.

| `formula.op` | Fields | Result |
| --- | --- | --- |
| `multiply` | `factors`: 1–3 input ids | Product of those inputs |
| `percentChange` | `from`, `to`: input ids | `(to − from) / from × 100`. If `from` is 0, the result shows a dash. |
| `unitCost` | `unit`, `quantity`: input ids | `unit × quantity` |

`result.unit` is a suffix, except `%`, which sits against the number. `result.decimals` is optional, 0–4, and defaults to 0. `result.label` must say what the number means. The page does not explain the arithmetic beyond that label, the unit, and the note.

`toggle` is optional. When present it needs a `label` and 2–4 options of `{ "id", "label", "multiplier" }`. The multiplier is a plain number (`1`, `0.5`, `2`), not an expression.

```json
{
  "type": "calculator",
  "inputs": [
    {
      "id": "price",
      "label": "Price per user",
      "min": 0,
      "max": 1,
      "step": 1,
      "value": 0,
      "unit": "USD",
      "control": "slider"
    }
  ],
  "formula": { "op": "multiply", "factors": ["price"] },
  "result": { "label": "What this number is", "unit": "USD", "decimals": 0 },
  "toggle": {
    "label": "Scale",
    "options": [
      { "id": "once", "label": "As entered", "multiplier": 1 },
      { "id": "half", "label": "Half", "multiplier": 0.5 }
    ]
  }
}
```

Replace the placeholder range with numbers that appear in the story. A slider whose ends are not in the story is an invented figure.

## `compare`

Exactly two options. A before/after or A-versus-B toggle. Each option has 1–6 labeled stats, written as text.

```json
{
  "type": "compare",
  "label": "Name of the toggle",
  "options": [
    {
      "id": "a",
      "label": "First side",
      "caption": "Optional",
      "stats": [{ "label": "Stat label", "value": "Figure copied from the story" }]
    },
    {
      "id": "b",
      "label": "Second side",
      "stats": [{ "label": "Stat label", "value": "Figure copied from the story" }]
    }
  ]
}
```

The live edition uses this type for Anthropic’s S-1: first-half revenue of $16.28 billion (about $13.1 billion, roughly 80%, from usage) set against compute commitments of at least $475 billion.
