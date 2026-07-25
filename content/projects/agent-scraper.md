---
slug: "agent-scraper"
title: "Agent Scraper"
subtitle: "An agentic agricultural data platform — scrape to Plan-and-Execute answers with source grounding, built as a reusable backend for Digisaka and beyond."
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
  - "FlashRank"
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
a given province") had to manually cross-reference multiple sources by hand.

A scraper alone can download files, but that still isn't reusable: formats stay inconsistent, other
apps can't query safely, and ordinary users can't ask in plain language. No unified backend existed
for downstream products like Digisaka to build on top of.

## What I Built

An end-to-end agricultural data and intelligence platform over public institutional sources —
government yield APIs, market price tables, research publications, agri news, and knowledge
portals. It isn't just a scraper — linked subsystems cover the full path from raw sites to
farmer-facing answers:

1. **Scrapers** — HTTP and browser collection (Scrapling/Playwright + FlareSolverr where needed)
2. **Processors & validators** — standardized CSV and canonical CPT JSONL, with checkpoints
3. **Indexers** — structured records and searchable knowledge into Qdrant
4. **FastAPI `/v1`** — versioned, keyed HTTP boundary for other applications
5. **AgriDataAgent** — Plan-and-Execute: understand the question, emit a structured plan, call
   read-only tools, return a source-aware answer (Taglish-ready, multi-turn follow-up)
6. **Chainlit UI** — thin chat frontend for demos and testing
7. **Orchestrator** — scheduled scrape → validate → index → backup (Asia/Manila)
8. **Ops** — Docker, Wasabi backups, job-completion alerts (Telegram/Discord when enabled),
   Hostinger production deploy

The product role stays clear: Agent Scraper owns scrape/index/search/agent; Digisaka and other
consumers own accounts, UX, and business workflows — and call this backend over HTTPS + API key.

## Architecture

```
Public data sources
  Government Yield API · Market Price Tables · Research Publications
  Agri News · Knowledge Portals
  (public institutional sources only)
        │
        ▼
HTTP + browser scrapers (client → parser → spider → formatter on yield paths)
        │
        ▼
Processing → structured CSV + canonical CPT JSONL
        │
        ▼
Validation, checkpoints, run manifests
        │
        ▼
Hybrid vector layer
  ├── yield records / yield knowledge
  ├── price records / price knowledge
  └── unified corpus RAG (publications, news, portals — source_id scoped)
        │
        ▼
FastAPI /v1 (auth scopes, rate limits) ── no direct DB exposure for consumers
        │
        ├── Structured reads (yield, prices, summaries, exports)
        └── POST /v1/agent/chat → Plan-and-Execute agent
                │
                ├── Follow-up gate (history + session_state)
                ├── LLM PlanAgent → validate plan (keyword plan on fallback)
                ├── Read-only tools → Stage-1 retrieve + FlashRank
                ├── Weak hit? → Stage-2 multi-query rewrite + RRF
                └── Ground sources → answer + confidence + warnings
                        │
                        ▼
                Chat UI / Digisaka / dashboards / partner integrations

Orchestrator (~11 enabled jobs) → Wasabi corpus/checkpoint sync + Qdrant snapshots
```

## Key Technical Decisions

- **Verified substrate + LLM projection.** Tool results and prior sources are the evidence; the
  LLM shapes the reply in the user's language without inventing dates or prices.
- **Plan-and-Execute, not chat-only.** An LLM PlanAgent emits a structured plan (tool allowlist,
  source_ids, date/location fill-ins). On planner failure, a legacy keyword intent + search plan
  runs as fallback — with an explicit warning — instead of silently guessing.
- **Five collection roles, not one blob.** Yield and price each have structured *records* (exact
  filters/summaries) and *knowledge* (hybrid NL search); narrative publications/news/portals live
  in a unified corpus RAG with `source_id` scoping so agri news and knowledge portals don't mix
  when the user is explicit.
- **Client-carried multi-turn memory.** Follow-ups (`pa explain naman`, `article no. 2`,
  `magkano ulit?`) need the client to echo `history[]`, prior assistant `sources`, and
  `session_state`. There is no server-side persistent conversation store — by design.
- **Read-only tools + confidence/warnings.** The agent can search and summarize; it cannot
  scrape, write, or mutate indexes from chat. Responses carry `sources`, `warnings`,
  `confidence`, and `took_ms`. High confidence requires a deterministic structured summary;
  missing evidence stays low confidence rather than sounding sure.
- **Tiered API keys from day one** (public / agent / admin) so Digisaka and other consumers can
  call HTTPS endpoints without ever receiving vector-DB credentials or admin scope.

## Challenges & Engineering Lessons

- **Docker networking gotcha:** early on, service-to-service calls failed silently because
  `localhost` inside a container refers to the container itself. Fixed by routing through Docker
  DNS (`http://api:8000`, `http://qdrant-vector-db:6333`) on a shared network.
- **Silent collection-name drift:** indexer and API must share the exact Qdrant collection name —
  a mismatch returns zero hits with no error, identical to "no data." Distinguishing
  `no_results` (search worked) from `qdrant_unavailable` (something broke) made failures visible.
- **Structured vs narrative collections:** market price tables use dedicated price collections, not
  the unified corpus RAG. Putting tabular prices in the narrative corpus diluted exact queries.
- **Multi-turn is a client contract:** Chainlit echoes history and session state; any other app
  (including Digisaka) must do the same or follow-ups break even when the agent is healthy.

## Results

- Unified public institutional agricultural sources into one reusable scrape → index → API → agent
  backend
- Scheduled refresh via Asia/Manila orchestrator (~11 enabled jobs) with Wasabi backups and
  job-completion alerts when enabled
- Hybrid dense (BAAI/bge-small-en-v1.5) + sparse (BM25) retrieval with RRF; Stage-1 FlashRank and
  optional Stage-2 rewrite when corpus hits are weak
- Plan-and-Execute agent with Taglish replies, source grounding, and client-carried follow-up
- Deployed to production — Dockerized on Hostinger; Digisaka and other apps integrate via HTTPS +
  API key (and must echo session/history for multi-turn chat)
