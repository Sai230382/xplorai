export const methodology = {
  kicker: "Methodology",
  title: "How a loud week becomes a short briefing.",
  dek: "XplorAI is a weekly desk, not a firehose. Four passes sit between the pile and the page.",
  pipeline: [
    { id: "market", label: "This week", count: 4200, unit: "items" },
    { id: "filter", label: "Filter", count: 310, unit: "candidates" },
    { id: "verify", label: "Verify", count: 41, unit: "sourced" },
    { id: "synthesize", label: "Synthesize", count: 5, unit: "themes" },
    { id: "present", label: "Present", count: 1, unit: "briefing" },
  ],
  steps: [
    {
      id: "filter",
      title: "Filter",
      body: "We drop duplicates, marketing recaps, and scoreboard noise that does not change a decision. A story must change a tool you can use, a bill you will pay, a rule you must follow, or who you can trust — or it does not enter the desk.",
    },
    {
      id: "verify",
      title: "Verify",
      body: "Claims need a source you can open: a company post, a government alert, a law firm note, a survey with a date. If two sources conflict, we keep the conflict and say so. We do not average them into false calm.",
    },
    {
      id: "synthesize",
      title: "Synthesize",
      body: "Editors — human, with model assistance — group remaining items into themes. Each theme must answer three questions: what changed, why it matters, who should care. Style is a constraint: a smart friend with no GitHub should understand it in one pass.",
    },
    {
      id: "present",
      title: "Present",
      body: "You see the pattern first, then the evidence. The week’s tool sits beside the brief so you can try the idea, not only read it.",
    },
  ],
} as const

export const about = {
  kicker: "About",
  title: "Understand what matters.",
  body: "XplorAI exists because AI produces more language than understanding. We treat attention as finite: a short weekly briefing, and an honest look at the week’s tool. The site you are reading is the first public prototype of that desk.",
} as const

export const problem = {
  kicker: "The problem",
  title: "More information does not automatically create more understanding.",
  body: "Every week there are new helpers, new bills, new rules, and new reasons not to trust a video. The volume feels like progress. It is often just weather. XplorAI is built for the moment after the weather — when a few things have actually changed, and a working person needs to know which.",
} as const
