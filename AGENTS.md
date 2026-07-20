# AGENTS.md

Instructions for AI coding agents (Cursor, Claude Code, Copilot, etc.) working in this repository.
Read this file in full before making changes.

## What this project is

Crich Joved Veridiano's personal portfolio site — an AI Engineer's showcase of production and R&D
projects (agentic LLM systems, computer vision, RAG/vector search). Built with Next.js (App Router),
TypeScript, and Tailwind CSS. Deployed on Vercel.

## Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS (custom design tokens — see below, do not introduce new colors ad hoc)
- **Content:** Markdown files in `/content`, parsed with `gray-matter` (frontmatter) + `marked` (body)
- **Analytics:** `@vercel/analytics`, `@vercel/speed-insights`
- **Deployment:** Vercel (zero-config for Next.js; `vercel.json` present for explicitness)

## Folder structure

```
app/                     Next.js App Router pages
  layout.tsx             Root layout, fonts, <Analytics/>, <SpeedInsights/>
  page.tsx               Home page
  projects/[slug]/       Dynamic project case-study page (reads content/projects/{slug}.md)
  components/            Shared UI components
content/                 All editable copy lives here — see "Editing content" below
  profile.md             Name, tagline, bio, contact links, skills
  projects/*.md          One file per case-study project (frontmatter + body)
lib/                     Content-loading helpers (do not hardcode copy in components)
public/                  Static assets (photo, resume PDF, favicon, images per project)
```

## Editing content — read this before touching copy

**All portfolio copy (bios, project descriptions, metrics, tech stacks) lives in `/content/*.md`,
never hardcoded inside components.** If asked to change what a project page says, edit the relevant
`content/projects/*.md` file, not `app/projects/[slug]/page.tsx`.

**Do not invent or embellish project details.** Every claim in `/content` (metrics, architecture
details, "what's implemented vs. not") was written to match what Crich actually built, including
honest technical limitations where they exist. When adding or editing content:
- Don't upgrade a described capability (e.g. don't change "dense semantic search" to "hybrid search"
  unless the project file itself is updated to reflect a real change).
- Don't add deployment/production claims ("live", "used by X users") unless the frontmatter/body
  already says so.
- If asked to make a project "sound more impressive," push back and suggest surfacing a *real*
  detail from the existing content instead of adding unverified claims.
- If information needed to complete a request isn't in `/content`, ask the user for it rather than
  filling the gap with a plausible-sounding guess.

## Design system — don't freelance new tokens

Colors, type, and the signature motif are intentional choices (see design rationale in
`app/globals.css` comments). When building new UI:
- Use only the Tailwind colors defined in `tailwind.config.ts` (`bg`, `surface`, `raised`, `ink`,
  `muted`, `accent`, `accentSoft`, `line`). Don't introduce new hex values inline.
- Fonts: `font-display` (Space Grotesk, headings only), `font-body` (IBM Plex Sans, all prose),
  `font-mono` (IBM Plex Mono, tags/metadata/labels only — not body prose).
- The corner-bracket frame (`components/CornerFrame.tsx`) is the site's one signature visual
  element (a nod to Crich's computer-vision/bounding-box work). Reuse it for emphasis moments
  (project cards, featured images). Don't create competing signature elements (gradients, blobs,
  glassmorphism) elsewhere in the site.
- Keep motion restrained: one deliberate moment per view, not scattered hover effects everywhere.

## Commands

```bash
npm install       # install dependencies
npm run dev       # local dev server at http://localhost:3000
npm run build     # production build (run this before pushing — must succeed with zero errors)
npm run start     # run the production build locally
```

## Before committing / opening a PR

1. `npm run build` must succeed.
2. If you edited anything under `/content`, sanity-check it against the source project docs the
   user has (they know which claims are verified) — when unsure, ask rather than assume.
3. Check responsive layout at mobile width (375px) and desktop (1440px).
4. Keyboard focus must remain visible on all interactive elements (don't remove default focus
   rings without providing a replacement).

## Deployment

Connected to Vercel — pushes to `main` deploy to production automatically. Preview deployments are
created for other branches/PRs automatically once the Vercel GitHub integration is connected.
