import { currentEdition } from "./edition"

export type LaunchSignal = {
  id: string
  raw: string
  topic: string
}

export const featuredLaunch = {
  kicker: "This week’s tool",
  name: "Salesforce in Claude",
  maker: "Anthropic · with Salesforce",
  released: "15 September 2026",
  overview:
    "Salesforce in Claude is a plugin built with Salesforce that brings a seller’s accounts, opportunities, and pipeline into Claude under their existing Salesforce permissions. It ships 37 sales skills. By default Claude proposes changes and waits for seller approval before writing back.",
  capabilities: [
    "Accounts, opportunities, and pipeline in Claude under existing Salesforce permissions",
    "37 sales skills: account research, call prep, pipeline review, CRM updates, morning briefs, forecast narratives",
    "Proposes changes and waits for seller approval before writing back",
    "Available on paid Claude plans after admin setup via AgentExchange",
  ],
  useCases: [
    "Pilot on one team with approval-required writes; measure prep time and CRM hygiene before org-wide rollout.",
    "Confirm Salesforce permission inheritance — Claude should see only what the seller already can.",
    "Decide which skills may auto-run (briefs) vs which must always wait (stage changes, forecasts to leadership).",
  ],
  limitations: [
    "Beta. Anthropic says GitLab, Siemens, and Legora have deployed it; about 7,000 Salesforce sellers already use it.",
    "CRM stays the system of record. Claude does prep and drafts; humans approve the write.",
    "Admin setup via AgentExchange is required on paid Claude plans.",
    "Watch how often sellers approve writes without reading — and whether audit logs catch bad updates fast.",
  ],
  signals: currentEdition.signals,
}

export const lumenBriefings: Record<string, { changed: string; matters: string; watch: string; uncertainty: string }> =
  {
    default: {
      changed:
        "Frontier lab CEOs publicly agreed to embed independent evaluators, Anthropic’s threat report shows attackers using AI across the kill chain, and Google gated a cyber model behind Fairwind.",
      matters:
        "The scarce thing is no longer a safety slogan. It is desks inside the lab, a named off switch, and treating AI keys as production credentials.",
      watch:
        "Whether evaluator desks actually appear — and whether your incident playbook still assumes a human tempo.",
      uncertainty:
        "We do not yet know whether ‘pacing’ will change what ships next quarter, or only what CEOs say on social media.",
    },
    tools: {
      changed:
        "Google launched Gemini 3.8 Flash for general work, and Flash Cyber for trusted defenders only, through the Fairwind Program.",
      matters:
        "Labs are splitting a helpful coding model from a cyber-capable model with a gate. That is a product decision with a security policy inside it.",
      watch: "How tightly Fairwind stays limited — and whether copycats ship cyber skills with no gate.",
      uncertainty:
        "Eligibility is not a public list you can check in a vendor slide. Ask which exact variant runs, and under whose contract.",
    },
    work: {
      changed:
        "Altman said OpenAI agrees the industry must pace the frontier and welcomed independent evaluators with employee-like access. The desks are not yet a settled industry standard.",
      matters:
        "A pledge is not a permission model. Inside your company, name who can stop a risky automation, and who reviews the log.",
      watch: "First concrete evaluator appointments and first public notes that are not glowing.",
      uncertainty:
        "Public agreement is new. We do not yet know who will actually get badges, or what they will be allowed to publish.",
    },
    rules: {
      changed:
        "Amodei called for pacing frontier models and embedding third-party evaluators with desks, badges, laptops, and the right to publish with only narrow redactions. Altman and Musk publicly backed the call.",
      matters:
        "Safety promises used to be company blogs. This is a rare public agreement on a concrete check: outsiders who can see training and incidents, not only a model card.",
      watch:
        "Whether desks and badges actually appear — and whether unfavorable findings get published, not only praised.",
      uncertainty:
        "We do not yet know whether ‘pacing’ will change what ships next quarter, or only what CEOs say on social media.",
    },
    money: {
      changed:
        "The same Anthropic report shows criminals treating AI API keys and session tokens as loot, compute, and cover: steal them, resell them, run attacks on the victim’s bill, and blame the account owner.",
      matters:
        "An AI key is a production credential. Companies still leave them in apps and repos the way they once left AWS keys.",
      watch: "Sudden spend on an AI account nobody remembers provisioning — treat it as theft until proven otherwise.",
      uncertainty:
        "We do not yet know how many production keys already sit in public repos and APKs, only that attackers are farming them at scale.",
    },
    trust: {
      changed:
        "Anthropic’s threat report describes cyber operations where actors used Claude across reconnaissance, phishing, exploit work, and theft. In several cases AI rebuilt malware when it was detected.",
      matters:
        "Sophistication is no longer a reliable clue to who is behind an attack. A lone operator with AI can run what used to need a team.",
      watch:
        "Whether your incident playbook assumes a human tempo. If cleanup takes a week, the attacker may already have a new build.",
      uncertainty:
        "The report names disrupted cases. How far this operating model has spread beyond those cases is still unnamed.",
    },
  }
