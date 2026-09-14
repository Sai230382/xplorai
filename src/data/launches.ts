import { currentEdition } from "./edition"

export type LaunchSignal = {
  id: string
  raw: string
  topic: string
}

export const featuredLaunch = {
  kicker: "This week’s tool",
  name: "GPT-6 Astra",
  maker: "OpenAI · inside ChatGPT",
  released: "10 September 2026",
  overview:
    "Astra is ChatGPT’s new helper that can use a computer: fill forms, update customer records, organise a calendar, research online, and draft in your email or documents. It is rolling out this week to paid ChatGPT plans.",
  capabilities: [
    "Fill online forms and update customer records",
    "Organise a calendar",
    "Research online and draft in email or documents",
    "On the desktop: click, type, and move files when you allow it",
  ],
  useCases: [
    "Turn a pile of tabs into a draft email",
    "Update a list of contacts without copying cell by cell",
    "Reshuffle a week of meetings from a messy inbox",
  ],
  limitations: [
    "It still needs your accounts and your permission. It is not a colleague with judgement.",
    "OpenAI says it is less likely to go beyond what you asked. That is not the same as never making a mess.",
    "Workplace plans may take days to appear, and an admin can switch it off.",
    "Do not let it click on money, legal filings, or shared files without a person watching.",
  ],
  signals: currentEdition.signals,
}

export const lumenBriefings: Record<string, { changed: string; matters: string; watch: string; uncertainty: string }> =
  {
    default: {
      changed:
        "A ChatGPT helper can now click and type, Europe requires chatbots to say they are machines, and nearly half of surveyed offices are over budget on AI.",
      matters:
        "The scarce thing is no longer access to a helper. It is permission, a label, and a person who owns the result.",
      watch: "Whether workplaces write simple rules before they switch computer-use on — and whether the bill has a name on it.",
      uncertainty: "We do not yet know how often these helpers are used for real work, versus how often they are tried once.",
    },
    tools: {
      changed:
        "GPT-6 Astra can fill forms, tidy a calendar, research online, and draft in email or documents — not only chat.",
      matters:
        "The useful question is which chores you will let a helper finish, and which you still want a person to click.",
      watch: "Whether it stays careful on your real inbox and forms, not on a staged demo.",
      uncertainty: "Rollout to Plus, Pro, Business, and workplace plans is staggered. Your admin may not have switched it on.",
    },
    work: {
      changed:
        "ChatGPT on the desktop can click, type, and move files. OpenAI says last year’s model overstepped its brief 48% of the time in one test; Astra did so in none of the cases.",
      matters:
        "Safer is not the same as unsupervised. Someone still has to decide what it may touch, and who can switch it off.",
      watch: "A written permission list, and a log. If your company turns this on, ask who owns both.",
      uncertainty: "A lab test is not your shared drive. We do not know how often real workplaces will leave it unsupervised.",
    },
    rules: {
      changed:
        "From 2 August, EU rules require chatbots to tell people they are talking to a machine, and fake video to be labelled. Brussels has started asking the big labs for paperwork.",
      matters:
        "If you sell into Europe, customers and staff should be able to tell a person from a bot, and a real clip from a generated one.",
      watch: "2 December is the extra deadline for older tools to add machine-readable marks. Deepfake disclosure is already in force.",
      uncertainty: "How strictly this will be checked in small companies is not yet clear from public cases.",
    },
    money: {
      changed:
        "In a summer survey of technology leaders, 47% said AI spending was over plan, and 10% had no AI budget at all. Only 17% paused when the bill ran over.",
      matters:
        "Paying more for AI is not proof that Tuesday got better. Most still name it as a productivity tool, not a new line of work.",
      watch: "A line in the budget with a person’s name on it, and a sentence for what “good” looks like.",
      uncertainty: "Surveys of technology leaders are not the same as what a whole company actually uses.",
    },
    trust: {
      changed:
        "Eleven governments warned that people applying for remote jobs may not be who they appear to be on a video call, including video that looks manipulated or generated.",
      matters:
        "A video call is not, by itself, proof of who is there. That matters for hiring, and for any payment a familiar face asks you to send.",
      watch: "A check that is not the camera: in-person, a live ID match, or a call-back on a number you already trust.",
      uncertainty: "The alert names a specific hiring scam. How common fake faces are in ordinary video calls is still unnamed.",
    },
  }
