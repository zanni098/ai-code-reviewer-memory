export const project = {
  "slug": "ai-code-reviewer-memory",
  "name": "AI Code Reviewer with Memory",
  "tagline": "A GitHub PR reviewer that learns a repository's conventions over time.",
  "accent": "#1f7a5c",
  "secondary": "#f4b740",
  "persona": "maintainers and engineering teams",
  "repoPitch": "Webhook-driven review workflow with HMAC validation, diff parsing, memory retrieval, structured LLM comments, and post-merge feedback signals.",
  "roleFit": "Shows API integration, prompt frameworks, structured JSON outputs, persistent memory, and feedback loops for improving AI workflow quality.",
  "inputLabel": "Paste a pull request diff",
  "sampleInput": "diff --git a/src/billing.ts b/src/billing.ts\\n+ export async function charge(user, amount) {\\n+   await fetch('/api/pay', { method: 'POST', body: JSON.stringify({ user, amount }) })\\n+ }",
  "cta": "Review diff",
  "stages": [
    "Validate GitHub webhook signature",
    "Parse changed files and hunks",
    "Retrieve matching style rules from SQLite memory",
    "Ask model for structured review findings",
    "Post inline PR comments through Octokit",
    "Update memory confidence after merge"
  ],
  "outputs": [
    {
      "label": "P1 Security",
      "text": "Payment call has no idempotency key. Add a request key before retryable operations."
    },
    {
      "label": "P2 Reliability",
      "text": "The team convention requires typed request bodies for billing endpoints."
    },
    {
      "label": "Memory hit",
      "text": "Matched billing/* rule: all external writes must include audit metadata."
    }
  ],
  "stack": [
    "TypeScript",
    "Node.js",
    "Express/Hono",
    "SQLite",
    "Octokit",
    "LLM structured output"
  ],
  "architecture": "GitHub webhook -> HMAC guard -> diff normalizer -> memory retriever -> review prompt -> JSON validator -> PR comment publisher -> learning updater"
} as const;
