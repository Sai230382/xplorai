export type LearnStep = {
  id: string
  title: string
  minutes: number
  body: string
  example: string
}

export const featuredModule = {
  kicker: "AI Academy",
  title: "Build an AI research assistant",
  dek: "A working loop that searches, extracts, verifies, and writes a briefing — without pretending the model is a librarian.",
  time: "90 minutes",
  difficulty: "Intermediate",
  outcome: "A small agent you can run on a real question, with traces you can inspect.",
  tools: [
    { name: "A frontier chat model", use: "Planning, extraction, and synthesis" },
    { name: "Web or corpus search", use: "Evidence, not memory" },
    { name: "A trace log", use: "Every tool call, source, and decision" },
    { name: "A citation checker", use: "Quotes must exist in the retrieved text" },
  ],
  diagram: [
    { id: "q", label: "Question", note: "Scope it" },
    { id: "s", label: "Search", note: "Retrieve" },
    { id: "e", label: "Extract", note: "Quote" },
    { id: "v", label: "Verify", note: "Check" },
    { id: "w", label: "Write", note: "Brief" },
  ],
  steps: [
    {
      id: "scope",
      title: "Scope the question so a machine can finish it",
      minutes: 10,
      body: "Write one sentence that names the subject, the time window, and the output. “What matters in AI this week for a product lead” is a task. “Tell me about AI” is a fog.",
      example:
        "Output: a 400-word briefing with three changes, three implications, and three things to watch. Sources must be from the last ten days.",
    },
    {
      id: "retrieve",
      title: "Retrieve before you reason",
      minutes: 20,
      body: "Give the model a search tool and a budget of five queries. Force it to store titles, URLs, and a one-line claim for each hit. Do not let it answer from parametric memory.",
      example:
        "Tool result: {title, url, date, claim}. Reject anything without a date. Rank by recency and specificity, not by how confident the model sounds.",
    },
    {
      id: "extract",
      title: "Extract quotes, not vibes",
      minutes: 20,
      body: "For each kept source, pull a short quotation that actually supports the claim. If the quote is not in the retrieved text, drop the claim. This single rule removes most fluent nonsense.",
      example:
        "Claim: “First AI Act fines targeted documentation.” Quote must appear in the source snippet, with a character range you could highlight.",
    },
    {
      id: "loop",
      title: "Run a short agent loop with a stop condition",
      minutes: 25,
      body: "Plan → search → extract → decide whether the brief is complete. Cap the loop at four turns. If evidence is thin, say so. A stopped, honest assistant is more useful than a busy one.",
      example:
        "Stop if: three independent sources exist for the main change, or the budget is spent. Write “insufficient evidence” rather than filling the gap.",
    },
    {
      id: "present",
      title: "Present as a briefing, not a dump",
      minutes: 15,
      body: "Use the XplorAI shape: what changed, why it matters, what to watch. Attach sources under each claim. The reader should be able to disagree with you, because they can see the evidence.",
      example:
        "Three short columns. No scoreboard. No “exciting developments.” Every paragraph should survive deletion of the adjectives.",
    },
  ] satisfies LearnStep[],
} as const

export const learnCatalog = [
  {
    title: "Evaluate a new model without a leaderboard",
    time: "45 min",
    level: "Foundational",
  },
  {
    title: "Design a human approval gate for tool use",
    time: "60 min",
    level: "Intermediate",
  },
  {
    title: "Write a one-page system card",
    time: "40 min",
    level: "Foundational",
  },
] as const
