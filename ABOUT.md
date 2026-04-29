# About AI Code Reviewer with Memory

AI Code Reviewer with Memory is a portfolio-grade AI workflow project by Asad Jehan Zeb.

## One-line summary

A GitHub PR reviewer that learns a repository's conventions over time.

## Audience

Built for maintainers and engineering teams.

## Problem

Many AI demos stop at a single prompt. Real automation work needs repeatable inputs, staged processing, structured output, and a way to evaluate or improve the result. This project packages those concerns into one visible workflow.

## Core idea

Webhook-driven review workflow with HMAC validation, diff parsing, memory retrieval, structured LLM comments, and post-merge feedback signals.

## Signal for hiring reviewers

Shows API integration, prompt frameworks, structured JSON outputs, persistent memory, and feedback loops for improving AI workflow quality.

## Implementation notes

- The browser demo is intentionally safe to run without API keys.
- The code is structured so real model/search/scraping/API clients can replace the simulated runner.
- The README documents deployment, environment variables, and architecture for handoff.
- The GitHub Pages workflow makes the project easy to review live.

## Repository owner

GitHub: https://github.com/zanni098
