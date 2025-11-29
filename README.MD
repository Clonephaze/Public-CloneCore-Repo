# CloneCore

A full-stack, themeable, content-driven portfolio system built with Nuxt 3, Vercel, GitHub, and a pinch of absolutely unhinged stubbornness.

This README is written for the folks who want to peek behind the curtain. If you're browsing the repo or discovering this from a showcase channel: welcome — this is the technical deep dive.

## About CloneCore
CloneCore is a personal portfolio system built as a complete ecosystem, not just a site. The goal is maintainability, flexibility, performance, and a bit of personality baked into every pixel.

It leans on static generation wherever it makes sense and switches to SSR only when authentication or admin interactions require it. The entire content pipeline is version-controlled. Themes, sprites, layouts, and portfolio items all live inside JSON-defined structures.

This README describes how those systems work and how the repo is structured.

---

## Features at a Glance
- Statically-generated pages with dynamic layers where needed.
- Admin panel powered by custom server routes, authenticated via GitHub.
- Theme engine with color palettes, sprite themes, and global styling rules.
- Portfolio content powered entirely by JSON files in version control.
- Automated preview deployments for every content or code change.
- Nuxt-based file routing, composables, and server functions.
- Shared design language across UI, sprites, layout, and interactions.

---

## Project Architecture
CloneCore is divided into **four major systems**:

### 1. The Frontend (Nuxt 3)
The frontend is built on Nuxt 3 with hybrid rendering:
- Static Generation (SSG) for public routes.
- SSR only where authentication or dynamic data is required.

The project uses:
- **TypeScript** for predictable, strongly typed logic.
- **SCSS** for theme-aware styling and clean variable management.
- **Nuxt components auto-import** for a tidy and readable structure.
- **Composables** for shared logic (themes, admin, content loading).

The design language is consistent across pages, pixel sprites, theme colors, and even the spacing logic.

### 2. The Backend (Server Routes)
Nuxt server routes power all backend functionality:
- Authentication handshake with GitHub.
- Admin API endpoints.
- Secure write operations to update JSON files.
- Automatic pull request creation.

This turns the project into a CMS without needing a CMS.

### 3. The Admin Panel
The admin panel runs client-side but communicates with secure server routes.

It supports:
- Login with GitHub.
- Add / Edit / Reorder / Remove portfolio items.
- File uploads to the repo (handled through GitHub API calls).
- Opening pull requests automatically.
- Automatic preview deployments from Vercel.

The admin UI is minimal, responsive, and theme-aware.

### 4. Content Infrastructure (JSON Files)
All content lives in JSON files inside the repo. This includes:
- Portfolio items
- Theme config
- Sprite config
- Site structure definitions
- Admin metadata

Anything the user sees on the site is parsed from JSON, including the pixel sprites and the custom theme palettes.

This keeps the repo portable, version-controlled, and clean.

---

## File Structure Overview
Below is a high-level snapshot of the organization.

(**Note: some sections may need to be filled in by you as you refine the codebase.**)

```bash
├── assets
│   ├── scss           # Global styling, theme maps, utilities
│   ├── sprites        # Pixel art sprites by theme
│   └── media          # Images, backgrounds
├── components
│   ├── ui             # Buttons, cards, inputs, modals
│   ├── layout         # Header, footer, shell components
│   └── content        # Portfolio-specific components
├── composables
│   ├── useTheme.ts    # Theme resolution + palette tools
│   ├── useContent.ts  # Load portfolio/content JSON
│   └── useAdmin.ts    # Auth flows + GitHub interactions
├── public
│   └── sprites        # Optimized sprite exports
├── server
│   ├── api            # Auth + content update routes
│   └── utils          # GitHub API + PR utilities
├── content
│   ├── portfolio.json # Main portfolio data
│   ├── themes.json    # Theme definitions
│   └── sprites.json   # Sprite mappings
├── pages
│   ├── index.vue
│   ├── behind.vue
│   └── admin
│       ├── index.vue
│       └── edit.vue
└── nuxt.config.ts
```

---

## Theme Engine
The theme engine is one of the core systems of CloneCore.

It includes:
- Color palettes
- Semantic variables
- Sprite themes
- Background patterns
- Theme-controlled UI states

A theme is defined in JSON and interpreted by SCSS maps + utility functions. Sprites automatically switch based on the resolved theme.

The entire site respects theme boundaries — from the admin UI to the blog post pages.

---

## Sprite System
Sprites are maintained as pixel art and exported in multiple theme variants.

Each sprite definition includes:
- Theme-specific color variants
- Resolution metadata
- Frame definitions for animations (if any)
- Accessibility labels

Sprites swap dynamically based on the active theme.

---

## Admin Panel Internals
The admin panel deserves its own documentation due to how unusual it is.

### How it Works
- The user authenticates via GitHub OAuth.
- Nuxt obtains a temporary token and stores the session securely.
- Edits in the admin panel generate changes to JSON files.
- The server routes assemble a commit + PR using the GitHub API.
- Vercel fires off a preview build.

This replicates a full CMS workflow with:
- Version history
- Code review
- Revertability
- Preview deployments

…without the weight of a traditional CMS.

### Admin UI Features
- Add/remove items
- Reorder with drag & drop
- Inline editing
- Light form validation
- Integrated themes
- Fully statically served (SSR only for auth)

---

## Deployment Pipeline
Vercel handles all deployment duties:
- Production deploys on merge to `main`.
- Preview deploys on every PR (code or content).
- Edge caching for all statically generated routes.

This creates a smooth content workflow: make a change → generate PR → preview → merge → production.

---

## Performance Considerations
CloneCore follows a few performance principles:
- Statically generate everything possible.
- Lazy-load sprites and media.
- Only hydrate components when necessary.
- Minimize global CSS; rely on theme maps.
- Keep payload size predictable by using JSON sources.

---

## Accessibility Considerations
Accessibility is built in:
- Semantic headings
- Keyboard navigability
- ARIA labels
- High-contrast dark theme
- Reduced motion options (optional future feature)

Sprite descriptions are intentionally included for screen readers.

---

## Future Roadmap (Fill These In)
This section is here for you to edit as the project evolves.

### Planned
- [ ] Searchable blog system
- [ ] Additional sprite animations
- [ ] Theme presets for users
- [ ] Extra admin panel features
- [ ] API for external integrations

### Long-Term Ideas
- [ ] Asset CDN
- [ ] Public theme builder
- [ ] Multi-user admin roles

---

## Local Development
Install dependencies:
```bash
pnpm install
```

Run dev server:
```bash
pnpm dev
```

Generate static site:
```bash
pnpm generate
```

---

## Contributing
This is primarily a personal portfolio ecosystem, but pull requests for improvements are welcome — especially around accessibility, DX, and performance.

---

## License
MIT License. Free to adapt, remix, or study.

---

## Final Notes
CloneCore is designed to be read, modified, forked, and learned from. If you're a developer exploring this repo from the public release or a showcase submission, the codebase is intentionally transparent so you can see how every part of the system fits together.

Have fun digging into it.

