---
slug: "agent-scraper"
title: "Agent Scraper"
subtitle: "An agentic data and intelligence platform unifying scattered Philippine agricultural data sources — from raw scraping to a reasoning agent, deployed in production."
featured: true
order: 1
domain: "Agents · RAG"
coverImage: "/agent-scraper.png"
techStack:
  - "Python 3.12"
  - "FastAPI"
  - "LangChain"
  - "DeepSeek / Kimi"
  - "Qdrant"
  - "Scrapling/Playwright"
  - "FlareSolverr"
  - "Chainlit"
  - "Docker"
  - "Wasabi (S3)"
---

## The Problem

Philippine agricultural data — rice yield statistics, crop prices, and research/news content —
lives scattered across separate government and research portals, each with its own format, none
queryable together. Anyone needing a straight answer (e.g. "what's the current rice yield trend in
a given province") had to manually cross-reference multiple sources by hand. No unified backend
existed for downstream products like Digisaka to build on top of.

## What I Built

An end-to-end platform that scrapes, validates, indexes, and reasons over 6 public agricultural
data sources — exposed through both a versioned API and a conversational agent, fully automated
and running in production.

## Architecture

```
Public data sources (PRiSM, PSA OpenSTAT, PhilRice, PhilRice News, PinoyRice, IRRI)
        │
        ▼
Layered scrapers (HTTP APIs + Scrapling/Playwright + FlareSolverr for JS-heavy pages)
        │
        ▼
Validation, checkpointing → dual CSV / JSONL data contracts
        │
        ▼
Qdrant (dual collections: structured records + semantic knowledge — dense + sparse hybrid)
        │
        ▼
FastAPI /v1 service (tiered API-key auth, rate limiting)
        │
        ├── Direct structured queries (yield, price, summaries)
        └── LangChain reasoning agent (DeepSeek primary, Kimi fallback)
                │
                ▼
        Chainlit conversational UI

Cron orchestrator (11 scheduled jobs) → Wasabi backups + dev-only Telegram/Discord error alerts
```

## Key Technical Decisions

- **Read-only agent, by design.** The reasoning agent can only query, never write or mutate data —
  a deliberate safety boundary, not a limitation. It means the agent can never corrupt or fabricate
  its own knowledge base.
- **Dual-collection Qdrant, not one.** Structured records (yield/price tables) and semantic
  knowledge (narrative content) live in separate collections, so a structured query never gets
  diluted by loosely-related narrative matches, and vice versa.
- **Confidence over confidence-sounding.** The agent returns explicit confidence tiers and will say
  "insufficient evidence" rather than produce a plausible-sounding but ungrounded answer.
- **Tiered API-key scopes from day one** (public / agent / admin) — designed for multiple future
  consumers (like Digisaka) without over-exposing admin-level access.

## Challenges & Engineering Lessons

- **Docker networking gotcha:** early on, service-to-service calls failed silently because
  `localhost` inside a container refers to the container itself — not sibling containers or the
  host. Fixed by routing everything through Docker's internal service DNS (`http://api:8000`,
  `http://qdrant-vector-db:6333`) over a shared network.
- **Silent collection-name drift:** the indexer and the API must reference the exact same Qdrant
  collection name — a mismatch returns zero results with no error, which looks identical to "no
  data exists." Solved by explicitly distinguishing a `no_results` state (search worked, nothing
  matched) from a `qdrant_unavailable` state (something's actually broken) so failures surface
  instead of hiding as empty answers.

## Results

- Unified 6 public agricultural data sources into one reusable backend
- 11 scheduled jobs fully automated (Asia/Manila cron orchestration)
- Hybrid dense (BAAI/bge-small-en-v1.5) + sparse (BM25) retrieval with RRF fusion
- Deployed to production — Dockerized, running on Hostinger
- Architected for downstream integration (Digisaka, via HTTPS + API key)
