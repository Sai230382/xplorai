export type LibraryVolume = {
  id: string
  title: string
  genre: string
  tip: string
  dek: string
  summary: string
  takeaways: string[]
  href: string
  external?: boolean
  cta: string
  height: number
  skin: string
  cover: string
}

export const libraryVolumes: LibraryVolume[] = [
  {
    id: "academy",
    title: "AI Academy",
    genre: "Course",
    tip: "14 modules · ~45–60 min",
    dek: "The live Training Academy: AI basics for working people — how it works, how to prompt it, which tools to use, and how to stay responsible.",
    summary:
      "Fourteen modules of foundations, copied from the current xplorai.in academy. You start with what AI actually is, then models, the spectrum from copilots to agents, the 2026 tools map, prompting plus a prompt lab, industry playbooks, pricing, ethics, the near future, client FAQs, objection handling, and a final quiz bank. Each module ends with a three-question check.",
    takeaways: [
      "What AI, machine learning, NLP, and generative AI actually are — and how they differ from plain automation.",
      "How language models and image models work: tokens, context windows, temperature, diffusion.",
      "The spectrum from copilots to agents, plus a deep dive on agentic AI.",
      "Prompting frameworks and a lab to practise them; then industry playbooks and how AI is priced.",
      "Ethics, client FAQs, and objection handling so you can use it at work without bluffing.",
    ],
    href: "/academy/index.html",
    external: true,
    cta: "Open the full piece",
    height: 360,
    skin: "s-gold",
    cover: "/library/spine-academy.jpg",
  },
  {
    id: "playbook",
    title: "AI Playbook",
    genre: "Desk",
    tip: "Primer · models · pricing",
    dek: "The live Strategy Playbook: what AI is, where the money sits, which model to pick, and how to price the work.",
    summary:
      "The full playbook from xplorai.in — Primer, Ecosystem, Models, Signals, Decide, Pricing, and Studio. It starts with the horizontal/vertical split, then the value stack (who pays whom), the 2026 model menu, signal versus hype, build-versus-buy, seven pricing frameworks, and a calculator you can run on a real job.",
    takeaways: [
      "AI is both a horizontal substrate and a vertical specialist — mixing those up is the usual strategy mistake.",
      "Every AI app is paying someone above it. Know where you sit before you price.",
      "Pick models by job, not by brand. Capability and cost are different maps.",
      "Seven ways to charge, from seats to outcomes — and why measurement has to come before the contract.",
      "Use Studio to run the numbers on a real workflow before you promise a price.",
    ],
    href: "/playbook/index.html",
    external: true,
    cta: "Open the full piece",
    height: 340,
    skin: "s-peri",
    cover: "/library/spine-playbook.jpg",
  },
  {
    id: "open-weight",
    title: "Model market",
    genre: "Field note",
    tip: "12-month read · Sept 2026",
    dek: "Downloadable models now do most of the work. The famous rented ones still take most of the money.",
    summary:
      "Over twelve months, models you can download (or rent cheaply through a router) went from about 30% of usage to 56%. The well-known company models did not shrink — the cheap ones just grew faster. Those downloadable models still collect only about 7% of enterprise dollars. The operating rule: do not buy one helper for everything. Start cheap; pay more only when the cheap pass fails.",
    takeaways: [
      "Usage and billing are different maps. Most work now runs on cheaper models; most money still goes to the famous ones.",
      "Do not rent the most expensive helper for routine tagging, extraction, or first drafts.",
      "Price a finished job, not a unit of text. A cheap helper that retries three times can cost more.",
      "Do not lock yourself to one family. The leader has changed every few months this year.",
      "The current discount is a land grab. Budget for cheap tiers to get less cheap.",
    ],
    href: "/library/open-weight-turn.html",
    external: true,
    cta: "Open the full piece",
    height: 352,
    skin: "",
    cover: "/library/spine-market.jpg",
  },
  {
    id: "evals",
    title: "Evals, plainly",
    genre: "Field note",
    tip: "16 sections · interactive",
    dek: "An eval is a repeatable test that turns “is it better?” into two numbers you can compare.",
    summary:
      "Everyone writes sample tasks. Almost nobody builds the instrument — the way you decide pass or fail, how noisy the score is, and whether a bump is real. Running the same test twice often gives different numbers. That is not a bug. Before you celebrate a change, ask how wide the noise is, and whether you would bet a launch on the suite.",
    takeaways: [
      "Without a procedure you have an anecdote: “it felt better on the three things I tried.”",
      "The grader — how you mark pass or fail — is the real work.",
      "A score is a sample. Small tests hide both wins and regressions.",
      "Keep every bug you fixed as a permanent test so it cannot sneak back.",
      "Report the hard slice next to the headline number. Averages are where trouble hides.",
    ],
    href: "/library/evals-explained.html",
    external: true,
    cta: "Open the full piece",
    height: 324,
    skin: "s-lav",
    cover: "/library/spine-evals.jpg",
  },
  {
    id: "harness",
    title: "Harness engineering",
    genre: "Field note",
    tip: "17 slides · interactive",
    dek: "The model is the engine. The harness is the vehicle you actually ship.",
    summary:
      "A model is a function: text in, text out. The harness is everything around it — what it sees, what it may touch, when it must stop, and how you check the answer. As models get more capable, that wrapper is where most of the difference between a useful helper and a mess now lives. Checking is cheaper than generating. Build checks before you give it more freedom.",
    takeaways: [
      "What it sees, what it can do, what happens next, and whether the answer counts: that layer is the product.",
      "Do not stuff everything into one long prompt. Tools, tests, and stop rules should be written as rules.",
      "Generation is expensive. Checking is cheap. Grant freedom in proportion to the checks.",
      "Treat context like a budget. Leave room for the answer.",
      "Measure the setup before you rewrite the prompt.",
    ],
    href: "/library/harness-engineering.html",
    external: true,
    cta: "Open the full piece",
    height: 336,
    skin: "s-ink",
    cover: "/library/spine-harness.jpg",
  },
]
