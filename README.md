# Crich Veridiano — Portfolio

Personal portfolio site. Next.js (App Router) + TypeScript + Tailwind CSS, deployed on Vercel.

If you're an AI coding agent (Cursor, etc.), **read `AGENTS.md` first** — it covers project
conventions, the design system, and rules for editing `/content` without introducing inaccurate
claims.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Editing content

All copy — bio, skills, project case studies — lives in `/content` as Markdown, not hardcoded in
components:

```
content/
  profile.md              Name, tagline, bio, skills, contact links
  projects/
    agent-scraper.md
    agentic-ai-evaluator.md
    black-sigatoka.md
    other-projects.md     Compact cards for non-featured projects
```

Edit these files directly — the site reads and renders them automatically. To add a new featured
case-study project, copy the frontmatter shape of an existing file in `content/projects/` and add
it to the grid (it's picked up automatically by slug).

## Before deploying

- [ ] Add a real headshot photo and favicon to `/public`
- [ ] Add `resume.pdf` to `/public` (referenced by `profile.md` → `resumeFile`)
- [ ] Fill in the `linkedin` field in `content/profile.md`
- [ ] Set `NEXT_PUBLIC_SITE_URL` in Vercel's environment variables to the real domain
- [ ] Connect the repo to Vercel (Import Project → this repo → deploy; no extra config needed,
      `vercel.json` is already present)

## Stack

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS (custom tokens — see `tailwind.config.ts` and the rationale comment in
  `app/globals.css`)
- `gray-matter` + `marked` for Markdown content
- `@vercel/analytics` + `@vercel/speed-insights`
