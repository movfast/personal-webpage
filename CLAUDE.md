# Personal Portfolio Website — Marian Helcl

## Overview
A personal portfolio website for an aspiring AI engineer. Built with vanilla HTML, CSS, and JavaScript — no frameworks or build tools.

## Project Structure
```
personal_webpage/
├── index.html              — main page
├── projects.html           — dedicated projects page
├── writing.html            — writing/blog listing page
├── writing/                — individual article pages
│   ├── understanding-rag.html
│   ├── fine-tuning-on-a-budget.html
│   ├── supabase-security.html
│   ├── ai-security-risks-2026.html
│   ├── llm-chatbot-security.html
│   ├── ai-energy-consumption.html
│   ├── ai-businesses-2026.html
│   └── prompting-claude-effectively.html
├── css/
│   ├── base.css            — variables, resets, typography
│   ├── layout.css          — grid, section layouts, responsive
│   ├── components.css      — buttons, cards, nav, footer
│   ├── article.css         — article/blog post page styles
│   └── botanical.css       — botanical theme overrides
├── js/
│   ├── main.js             — mobile menu + scroll animations
│   ├── botanical.js        — botanical theme toggle + animations
│   ├── news.js             — AI news feed
│   └── quirks/             — easter egg system (split into modules)
│       ├── registry.js     — QuirkSystem core + scoreboard
│       ├── init.js         — bootstraps all quirks on DOMContentLoaded
│       ├── retro-clicks.js
│       ├── rainbow-wave.js
│       ├── particle-burst.js
│       ├── confetti.js
│       ├── typewriter.js
│       ├── card-tilt.js
│       ├── gravity-drop.js
│       ├── konami-matrix.js
│       ├── console-msg.js
│       ├── magnetic.js
│       ├── secret-word.js
│       ├── emoji-trail.js
│       └── night-mode.js
├── assets/
│   └── images/             — profile photo, project screenshots, logo
├── favicon.svg             — SVG favicon with "MH" initials
├── CV__Marian Øverli.pdf   — downloadable CV
└── CLAUDE.md               — this file
```

## Key Sections (index.html)
- **Hero** — intro with profile photo, tagline, CTA buttons, resume download
- **About** — bio, background (physics → acoustics → AI), detail cards
- **Projects** — project cards with screenshots, tags, links
- **Skills** — languages, ML/AI, tools, data
- **Writing/Blog** — blog post cards linking to full articles in `writing/`
- **AI News** — live AI news feed (`js/news.js`)
- **AI Twin Chat** — Gradio chatbot iframe for recruiters to chat with an AI version of Marian
- **Contact** — "Say Hello" button (Gmail compose link), GitHub and LinkedIn social links

## Design
- Dark theme with purple accent (`#6c63ff`)
- CSS custom properties in `:root` for easy theming
- Fully responsive with mobile hamburger menu
- Scroll fade-in animations via Intersection Observer
- SEO + Open Graph meta tags included

## Placeholders to Fill
- `og:url` meta tag — update to real domain when deployed
- AI Twin chat — set the `src` on the iframe in `#ai-twin` to your deployed Gradio app URL (e.g. HuggingFace Spaces)

## Quirks & Easter Eggs (`js/quirks/`)
Each quirk is its own module in `js/quirks/`, registered via `registerQuirk()` in `registry.js`. Disable a quirk by commenting out its `init()` call in `init.js`.

| Quirk | Trigger | XP |
|---|---|---|
| Retro clicks | Click any button/link | 5 |
| Rainbow wave | Click the "MHØ" logo | 15 |
| Particle burst | Click a project card | 10 |
| Confetti | Triple-click anywhere | 20 |
| Typewriter | Scroll a section title into view | 10 |
| Card tilt | Hover over any card | 5 |
| Gravity drop | Press Ctrl+Shift+G | 25 |
| Konami matrix | ↑↑↓↓←→←→BA | 50 |
| Console message | Type `discover()` in dev console | 10 |
| Magnetic buttons | Hover over any button | 10 |
| Secret word | Type "spies" anywhere | 30 |
| Emoji trail | Hold Shift + move mouse | 15 |
| Night mode | Double-press N | 15 |

XP scoreboard appears bottom-right. Click it to see discovered/undiscovered eggs. Progress saved in localStorage.

## Botanical Theme (`css/botanical.css` + `js/botanical.js`)
- Toggled via the flower/moon button (fixed, top-right)
- Saved in localStorage (`mh-botanical`)
- Light color scheme: cream bg, soft greens, lilac purples, warm wood tones
- Animated SVG branches grow from screen edges (left, right, top) with leaves and syringa flower clusters
- Floating lilac petals drift down the screen
- All botanical styles scoped under `body.botanical` so they cleanly override the default dark theme

## Guidelines
- Keep it vanilla HTML/CSS/JS — no frameworks
- CSS is split: `base.css` (variables/resets), `layout.css` (grids/responsive), `components.css` (UI elements), `article.css` (blog posts), `botanical.css` (theme)
- Scripts go in `js/`; quirks each get their own file in `js/quirks/`
- Images go in `assets/images/`
- Maintain the dark theme and accent color unless asked to change
- All sections use the `fade-in` class for scroll animations
