---
slug: "agentic-ai-evaluator"
title: "Agentic AI Evaluator"
subtitle: "An agentic system that turns messy agricultural trial reports into structured, evaluated, and searchable knowledge — with the LLM grading and retrying its own output before anything is stored."
featured: true
order: 2
domain: "Agents · RAG"
coverImage: "/agentic-ai-evaluator.png"
techStack:
  - "Python"
  - "FastAPI"
  - "LangGraph"
  - "CrewAI"
  - "LangChain"
  - "Google Gemini"
  - "Qdrant"
  - "PostgreSQL"
  - "Redis/ARQ"
  - "Langfuse"
---

## The Problem

Agricultural product demo and field-trial reports arrive in wildly inconsistent formats — digital
PDFs, scanned PDFs, photos of handwritten forms, sometimes several trial reports bundled into one
file. Product names, dates, locations, treatments, measurements, and cooperator feedback can appear
anywhere in the document, with no consistent structure. Reviewing these by hand to produce a clean,
comparable dataset is slow and error-prone.

## What I Built

A backend system that converts raw trial documents into validated, structured analyses — and
doesn't stop at a single LLM pass. It evaluates its own output, retries when the analysis or chart
suggestions fall short, and only stores results in the knowledge base after a human approves them.

## Architecture

```
PDF / Image upload
        │
        ▼
extract (Gemini: PDF/image → Markdown)
        │
        ▼
validate_content (is this actually a trial report?)
        │
        ▼
analyze (structured JSON: product, metrics, treatments, yield, feedback, risks, recommendations…)
        │
        ▼
evaluate_analysis ──── CrewAI 4-agent crew:
        │               Document Context Analyst
        │               Output Quality Evaluator
        │               Processing Strategy Advisor
        │               Evaluation Decision Coordinator
        │
        ├── needs_reanalysis? → back to analyze (bounded retries)
        ▼
suggest_graphs (chart specs as JSON)
        │
        ▼
evaluate_graphs
        │
        ├── needs_regraph? → back to suggest_graphs (bounded retries)
        ▼
chunk (Markdown → storage/search chunks)
        │
        ▼
Redis cache (pending_storage) ── human review ──▶ approve
        │
        ▼
Qdrant (content chunks + structured analyses)
        │
        ▼
Chat agent (33 tools, PostgreSQL memory) ── search & conversational access
```

Both a synchronous path and a Redis/ARQ background-worker path run the identical LangGraph
workflow — background processing only changes how the job is enqueued and polled.

## Key Technical Decisions

- **Separating "is this good enough?" from "what happens next?"** The LLM only ever answers a
  quality question — a deterministic router, not the model, decides which node runs next. This
  keeps control flow testable and prevents the model from directly triggering arbitrary actions.
- **Human approval as a hard gate before permanent storage.** Every result lands in a temporary
  Redis cache first; nothing reaches the permanent Qdrant knowledge base until a person approves
  it — so an occasional model mistake can't quietly become "ground truth" that later queries rely
  on.
- **A 4-agent CrewAI evaluation crew instead of a single evaluator prompt.** Splitting judgment
  across a Document Context Analyst, Output Quality Evaluator, Processing Strategy Advisor, and
  Evaluation Decision Coordinator produces a specific verdict — "fixable analysis problem" vs. "the
  source document just doesn't contain this data" — instead of one evaluator conflating both into a
  vague low-confidence score.
- **Bounded, shared retry budget.** Analysis retries and chart-regeneration retries draw from the
  same counter, so a document that needed several analysis attempts has fewer retries left for
  chart generation — a deliberate cost/quality trade-off rather than unlimited retry loops.

## Engineering Lessons

- **Scoping the search layer honestly.** Dense + sparse (TF-IDF) hybrid retrieval exists for the
  content-chunk collection, but the active analysis-search and chat-tool queries currently run on
  dense semantic search only. Treating these as two distinct, clearly-scoped retrieval paths —
  instead of assuming "hybrid infrastructure exists" means "hybrid is everywhere" — mattered for
  knowing exactly what the system actually guarantees at query time.
- **Keeping quality decisions and business decisions separate.** It would've been easy to let the
  evaluation agent start recommending real-world actions ("email the farmer," "escalate to the
  technical team"). The scope was deliberately kept to quality-only judgments — retry, proceed, or
  stop — treating action-taking as a distinct, separately-reviewed layer for later, rather than
  letting the model's confidence about content quality quietly expand into confidence about
  real-world actions.

## Results

- 8-stage LangGraph workflow processing PDF/image trial reports end-to-end
- CrewAI 4-agent evaluation crew producing specific, actionable quality verdicts
- Conversational chat agent with 33 specialized tools and persistent PostgreSQL-backed memory
- Full observability via Langfuse (traces, sessions, scores) across every workflow node
- Redis/ARQ background processing alongside a synchronous path, both running the identical workflow
- Docker-supported deployment for the API and worker services

<!-- AGENT NOTE: do not change "dense semantic search" to "hybrid search" above — see AGENTS.md. -->
