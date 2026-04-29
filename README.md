# AI Code Reviewer with Memory

A GitHub PR reviewer that learns a repository's conventions over time.

This repository is part of Asad Jehan Zeb's AI workflow engineering portfolio for freelance AI automation roles, especially the Mindrift AI Workflow Engineer track. It is designed to show how an LLM product can be structured as a repeatable workflow instead of a one-off chat prompt.

## Live demo

After GitHub Pages is enabled for this repository, the demo is available at:

`https://zanni098.github.io/ai-code-reviewer-memory/`

The hosted demo runs as a browser-safe simulation so it can be reviewed without private API keys. The architecture is ready to connect to real providers by adding the environment variables shown in `.env.example`.

## What it demonstrates

- Webhook-driven review workflow with HMAC validation, diff parsing, memory retrieval, structured LLM comments, and post-merge feedback signals.
- Clear prompt-chain stages that can be tested and improved independently.
- Structured outputs that are suitable for downstream automation.
- A production-facing UI that explains the workflow by letting a reviewer run the pipeline.
- Documentation written for a client, hiring manager, or technical reviewer.

## Workflow

1. Validate GitHub webhook signature
2. Parse changed files and hunks
3. Retrieve matching style rules from SQLite memory
4. Ask model for structured review findings
5. Post inline PR comments through Octokit
6. Update memory confidence after merge

## Why this matters for Mindrift

Shows API integration, prompt frameworks, structured JSON outputs, persistent memory, and feedback loops for improving AI workflow quality.

Mindrift's Tendem-style work depends on reliable multi-step automations: data comes in messy, gets enriched, passes through prompt frameworks, returns structured artifacts, and improves through evaluation. This project is intentionally built around that pattern.

## Tech stack

- TypeScript
- Node.js
- Express/Hono
- SQLite
- Octokit
- LLM structured output

## Architecture

```text
GitHub webhook -> HMAC guard -> diff normalizer -> memory retriever -> review prompt -> JSON validator -> PR comment publisher -> learning updater
```

## Local development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Environment

Copy `.env.example` to `.env.local` if you want to connect live APIs. The public demo does not require these values.

## Deployment

This repo includes `.github/workflows/pages.yml`. On every push to `main`, GitHub Actions builds the Vite app and deploys `dist/` to GitHub Pages.

If Pages is not active yet:

1. Open repository settings.
2. Go to Pages.
3. Set source to GitHub Actions.
4. Re-run the `Deploy GitHub Pages` workflow.

## About Asad

Asad Jehan Zeb is a project manager and developer from Mardan, Pakistan. He led E-study card from idea to product, generating roughly $50,000 in revenue through government education digitalization work, and is building Mjord, an agentic AI installation service for non-technical users.

This project exists to make that AI workflow experience visible in public GitHub form.
