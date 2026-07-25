# Young-Dahl Song Archive

A warm, readable digital home for Young-Dahl Song's writing and personal collection, beginning with the English translation of *As The Brush Goes*.

## Project outline

1. Establish a responsive public website with a calm home page, biography, and a dedicated poetry-reading section.
2. Model poems as separate, structured content records so the translation can be added, proofread, reordered, and extended without redesigning the site.
3. Build a distraction-free reader with clear chapter/poem navigation, previous/next controls, comfortable typography, and durable links to individual poems.
4. Add collection and archive sections later using the same content-first structure.
5. Test locally, then deploy the static site to a public host.

## Proposed tools and rationale

| Tool | Role | Why |
| --- | --- | --- |
| Node.js build script | Static-site generation | Converts the Markdown manuscript into fast, portable HTML while preserving its source as the editorial record. |
| Plain HTML/CSS | Site presentation | Keeps the first version lightweight, readable, and easy to host anywhere. |
| CSS custom properties | Visual system | Provides a small, warm palette and reusable typography/spacing without a heavy UI framework. |
| Vitest/Playwright | Checks | Covers content rules and key reader navigation as the site grows. |
| GitHub + Cloudflare Pages or Netlify | Source control and deployment | Gives a simple reviewable workflow and automatic public deployments. |

The specific hosting provider can be chosen when a repository and domain are available.

## Local development

```sh
npm run dev
```

Open `http://localhost:4321`. `npm run dev` rebuilds the site from the Word document before starting the local server. Use `npm run build` whenever the document is updated; the deployable static files are written to `dist/`.

## Editing content

Do not edit files in `dist/`: they are generated and will be replaced on the next build.

- Edit the About page in [content/about.md](content/about.md). It uses simple Markdown: `#` starts the page heading and blank lines make paragraphs.
- Edit the translation in [Copy of As The Brush Goes English Translation, pt 1.md](Copy%20of%20As%20The%20Brush%20Goes%20English%20Translation%2C%20pt%201.md), then run `npm run build`. Each `#` heading begins a new poem, and two spaces at the end of a line preserve a poem line break.
- The site layout, navigation, and visual design are in [scripts/build.mjs](scripts/build.mjs). This is only needed for design or structural changes.

## Content still needed

- Complete English translation manuscript for *As The Brush Goes*, including intended ordering, titles, sections, and translator/rights credit.
- Approved biography, portrait, and any preferred Korean/English name treatment.
- Collection items, captions, image permissions, and archival metadata for future sections.
- Domain and hosting/repository access when ready to publish.

See [SPECIFICATIONS.md](SPECIFICATIONS.md) for the detailed product and technical specification.
