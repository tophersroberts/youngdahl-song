# Young-Dahl Song Archive — Specification

## Purpose

Create a public, accessible archive that introduces Young-Dahl Song and makes the English translation of *As The Brush Goes* inviting to read. The site must leave room for writing, collected objects, photographs, and other archival material to be added over time.

## Audience

- Readers discovering Young-Dahl Song and his poetry.
- Family, friends, students, and researchers looking for reliable biographical and archival material.
- Site editors adding translations and collection entries over time.

## Initial information architecture

| Route | Purpose |
| --- | --- |
| `/` | Welcome, short introduction, featured reading link, and selected archive previews. |
| `/about/` | Biography, timeline or portrait, and context for the archive. |
| `/as-the-brush-goes/` | Book introduction, credits, table of contents, and reading guidance. |
| `/as-the-brush-goes/[slug]/` | One poem/section per permanent, shareable page. |
| `/collection/` | Reserved landing page for future collected works and objects. |

## Reader requirements

- Use an uncluttered single-column layout and highly legible type.
- Provide a visible table of contents and previous/next navigation on every poem.
- Preserve poem line breaks, stanza spacing, punctuation, and translator notes exactly as approved.
- Give every poem a stable URL; do not depend on a single long scrolling page.
- Work with keyboard navigation, screen readers, narrow screens, and print.
- Make copyright and translation attribution clear.

## Visual direction

The design should be minimal but not stark: paper-like off-white backgrounds, ink-dark text, muted earth or celadon accents, generous whitespace, and restrained Korean visual references. Use such references as texture and proportion rather than decorative clichés. Typography should prioritize long-form reading over display impact.

## Content model

Each poem should be a Markdown/MDX file with front matter:

```yaml
title: "Poem title"
book: "As The Brush Goes"
order: 1
original_title: ""
translator: ""
published: false
rights: ""
```

The body holds the approved translation. Optional fields may capture source-page references, editorial notes, original Korean text, audio, images, and related collection objects. Collection entries should have a separate model with title, date/period, medium, provenance, description, alt text, and image-credit fields.

## Technical approach

Build as an Astro static site using TypeScript and Astro content collections. Keep presentation components separate from content. Prefer local, optimized images and system or self-hosted fonts. Avoid a CMS in the first version; Markdown-based content keeps ownership simple and makes future migration to a CMS possible.

## Quality and launch criteria

- All initial routes render without console errors or broken links.
- The reader is usable at mobile, tablet, and desktop widths.
- Images have meaningful alt text and page landmarks/headings are logical.
- Contrast and focus states meet WCAG 2.2 AA intent.
- Poem order and text are reviewed against the approved manuscript.
- Metadata, social preview image, sitemap, and basic analytics/privacy choices are configured before launch.
- Production build succeeds locally and deploys automatically from the main branch.

## Delivery phases

1. **Foundation:** initialize the site, implement navigation, design tokens, shared layout, and placeholder pages.
2. **Book reader:** add structured poem content, table of contents, reader navigation, and book credits.
3. **Editorial review:** load and proofread the complete translation; validate attribution, rights, and accessibility.
4. **Archive expansion:** add biography source material, collection entries, and image processing.
5. **Launch:** configure domain/hosting, production metadata, analytics policy, and final acceptance testing.

## Decisions needed before content implementation

1. The approved English translation and its final order.
2. Ownership/permission language for the book and each image.
3. Whether Korean originals, scans, or translator notes will appear alongside translations.
4. Approved biography and image assets.
5. Preferred host, domain, and repository owner for publication.
