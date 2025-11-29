<script setup lang="ts">
defineOptions({ name: 'BehindCloneCorePage' })

onMounted(() => {
    if (import.meta.client) {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }
})

useSeoMeta({
    title: 'Behind CloneCore - How This Portfolio Works',
    ogTitle: 'Behind CloneCore - How This Portfolio Works',
    description:
        'A behind the scenes tour of the systems, themes, admin tools, and content engine that power the CloneCore portfolio.',
    ogDescription:
        'A behind the scenes tour of the systems, themes, admin tools, and content engine that power the CloneCore portfolio.',
    ogImage: 'https://clonecore.net/CloneCoreHeroStill.png',
    ogUrl: 'https://clonecore.net/behind-clonecore',
    ogSiteName: 'Clone-Core',
    twitterCard: 'summary_large_image'
})

useHead(() => ({
    link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/clone-coreUpdated.svg' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
    ],
    htmlAttrs: { lang: 'en' },
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
}))
</script>

<template>
    <div class="behind-page">
        <div class="back-nav">
            <NuxtLink to="/" class="back-button">
                <Icon name="tabler:arrow-left" />
                Back to Home
            </NuxtLink>
        </div>

        <main class="behind-layout">
            <header class="behind-hero">
                <div class="hero-copy">
                    <p class="hero-badge">Journal Post · CloneCore</p>
                    <h1>Behind CloneCore</h1>
                    <p class="subtitle">A look behind how CloneCore works under the hood, and why I chose to build it this way.</p>
                </div>
                <figure class="hero-sprite">
                    <div class="sprite-image" role="img" aria-label="Pixel art of Jack as your tour guide" />
                </figure>
            </header>

            <section id="intent" class="behind-section">
                <h2>The Intent</h2>
                <p class="section-kicker">What CloneCore has going on</p>
                <div class="section-body two-column">
                    <p>
                        CloneCore runs on Nuxt 3 with Vercel handling deploys, builds, and caching. TypeScript and SCSS keep everything clean and maintainable, and GitHub acts as both version control and the content backend — including admin authentication. Most of the site is statically generated for raw speed, while dynamic features like the admin panel and auth are layered on top where they actually matter.
                    </p>
                    <p>
                        The goal was pretty simple: build the kind of portfolio I'd be proud to hand to a client. So the whole thing comes with a managed theme system, a content dashboard for adding and organizing portfolio items, and a consistent visual identity that carries across pages, components, and even the pixel mascot around the UI. Everything is designed to feel like pieces of the same world instead of random features glued together.
                    </p>
                </div>
                <p class="section-note">
                    The animated background and the theme-reactive sprites on the homepage follow the same philosophy: visuals and systems work together, not separately.
                </p>
            </section>

            <section id="stack" class="behind-section">
                <h2>The Tech Stack, Minus the Buzzwords</h2>
                <p class="section-kicker">How Nuxt, Vercel, and a streak of precision-obsessed stubbornness turned into a whole ecosystem.</p>

                <div class="section-body cards-grid">
                    <article class="info-card">
                        <h3>Nuxt as the backbone</h3>
                        <p>
                            Nuxt gives the whole site structure: sections for narrative flow, components for reusable UI patterns, composables for shared behavior, and server routes for real backend logic. Most pages are statically generated so they load instantly, with dynamic features like auth, admin tools, and modals added only where they're genuinely needed.
                        </p>
                    </article>

                    <article class="info-card">
                        <h3>Vercel for the boring-but-critical bits</h3>
                        <p>
                            Vercel handles deployments, previews, and edge caching. Every pull request from the admin panel or the codebase gets its own preview build. That effectively turns this site into a full CI workflow: I can test content or features in a live sandbox before it ever hits production.
                        </p>
                    </article>

                    <article class="info-card">
                        <h3>GitHub instead of a traditional CMS</h3>
                        <p>
                            All site content lives inside version-controlled JSON files. The admin panel updates them by opening pull requests through custom API endpoints instead of mutating files directly. That gives me commit history, code review, preview environments, and an audit trail — all without dragging in a full CMS or database.
                        </p>
                    </article>
                </div>

                <aside class="callout">
                    <Icon name="tabler:file-text" class="callout-icon" />
                    <p>
                        Everything that defines this site's content fits neatly into a handful of JSON files.
                    </p>
                </aside>
            </section>

            <section id="admin" class="behind-section">
                <h2>The Admin Panel</h2>
                <p class="section-kicker">The part nobody sees, but everyone should appreciate.</p>

                <div class="section-body two-column">
                    <p>
                        The admin panel is a private dashboard locked behind GitHub authentication. Once you're in, you can manage three content areas: web projects, Blender add-ons, and 3D artworks. Each category is a clean list of entries with thumbnails, titles, and an associated image folder. You can reorder items, delete them, or edit them through a simple form UI. Adding something new works the same way: fill out the form, drop images in the right folder, and the panel handles the rest.
                    </p>
                    <p>
                        Whenever you submit changes, the admin bundles up the JSON updates and any new images, then asks the backend to create a GitHub branch and a pull request. Vercel builds a preview automatically. You check it. You merge it. The site updates. The workflow stays civilized.
                    </p>
                </div>

                <div class="panel-details">
                    <ul class="feature-list">
                        <li>
                            <Icon name="tabler:git-pull-request" />
                            <span>Changes ship as GitHub PRs with their own preview deploys.</span>
                        </li>
                        <li>
                            <Icon name="tabler:layout-list" />
                            <span>Order in the admin maps exactly to the homepage layout.</span>
                        </li>
                        <li>
                            <Icon name="tabler:lock" />
                            <span>Access is restricted to repo collaborators via GitHub OAuth.</span>
                        </li>
                    </ul>

                    <div class="panel-screenshot">
                        <NuxtImg 
                            src="/AdminPanelExample.png"
                            alt="Screenshot of the CloneCore admin panel showing a list of web projects"
                        />
                        <p>
                            The admin panel in action — managing web projects with live preview and drag-to-reorder.
                        </p>
                    </div>
                </div>
            </section>

            <section id="themes" class="behind-section">
                <h2>Theme System & Pixel Sprites</h2>
                <p class="section-kicker">Four themes. One face. Infinite charm.</p>

                <div class="theme-grid">
                    <figure class="theme-figure">
                        <div class="sprite-image sprite-image--dark" role="img" aria-label="Pixel sprite in the default CloneCore theme" />
                        <figcaption>Default theme · The baseline look.</figcaption>
                    </figure>
                    <figure class="theme-figure">
                        <div class="sprite-image sprite-image--contrast" role="img" aria-label="Pixel sprite in the high-contrast theme" />
                        <figcaption>Contrast · Built for clarity and punch.</figcaption>
                    </figure>
                    <figure class="theme-figure">
                        <div class="sprite-image sprite-image--light" role="img" aria-label="Pixel sprite in the light theme" />
                        <figcaption>Light · For bright environments and softer palettes.</figcaption>
                    </figure>
                    <figure class="theme-figure">
                        <div class="sprite-image sprite-image--sepia" role="img" aria-label="Pixel sprite in the sepia theme" />
                        <figcaption>Sepia · A warm, bookish variant (librarian-approved).</figcaption>
                    </figure>
                </div>

                <div class="theme-details">
                    <div class="section-body">
                        <p>
                            The whole theme system is powered by global color-mode logic backed by a set of CSS variables. All four themes share the same layout but switch out their surface, accent, and border colors. The pixel mascot tags along automatically: each theme includes its own matching sprite. The Contrast theme was built specifically with accessibility in mind — dialed-back blur, a more readable font, and UI colors chosen to meet WCAG AA standards.
                        </p>
                        <p>
                            The sprites stay intentionally low-res so they remain crisp on every device without weird scaling artifacts. They're not decorative; they're tiny avatars tied to the current theme, which helps the UI and character design feel like they belong to the same world.
                        </p>
                    </div>

                    <figure class="theme-selector-screenshot">
                        <NuxtImg 
                            src="/ThemePanelScreenshot.png"
                            alt="Screenshot of the theme selector showing four theme options: light, dark, sepia, and contrast"
                        />
                        <figcaption>The theme picker — one click to switch the whole vibe.</figcaption>
                    </figure>
                </div>
            </section>

            <section id="performance" class="behind-section">
                <h2>Performance, Images, and Accessibility</h2>
                <p class="section-kicker">The invisible but essential stuff.</p>

                <div class="section-body two-column">
                    <p>
                        Nuxt Image handles almost all the heavy lifting with media. Images get served in WebP or AVIF where possible, with responsive breakpoints tuned for everything from tiny pixel sprites to full-width gallery shots. Paired with Vercel's caching and static generation, the site stays quick even when the artwork isn't small.
                    </p>
                    <p>
                        Most of the real work here shows up in the details: proper alt text for portfolio images, motion that respects reduced-motion settings, and layouts that are built mobile-first instead of squeezed down from desktop designs. The “Build with Me” page, for example, is written so screen readers get the same narrative experience as sighted visitors.
                    </p>
                </div>

                <ul class="feature-list feature-list--inline">
                    <li>
                        <Icon name="tabler:photo-scan" />
                        <span>Nuxt Image with WebP/AVIF for efficient media.</span>
                    </li>
                    <li>
                        <Icon name="tabler:ripple" />
                        <span>Animations tuned for motion sensitivity and readability.</span>
                    </li>
                    <li>
                        <Icon name="tabler:device-mobile-check" />
                        <span>Layouts designed for desktop and mobile.</span>
                    </li>
                    <li>
                        <Icon name="tabler:accessible" />
                        <span>Semantic HTML, alt text, and ARIA labels for screen readers.</span>
                    </li>
                    <li>
                        <Icon name="tabler:bolt" />
                        <span>Optimizations throughout for fast load times.</span>
                    </li>
                    <li>
                        <Icon name="tabler:eye-check" />
                        <span>WCAG AAA contrast compliance in the Contrast theme.</span>
                    </li>
                </ul>
            </section>

            <section id="content" class="behind-section">
                <h2>Content Architecture</h2>
                <p class="section-kicker">The JSON brain at the center of everything.</p>

                <div class="section-body two-column">
                    <p>
                        Every card on the homepage — whether it's a web project, an add-on, or an artwork entry — comes from structured JSON. Each item has an ID, title, description, tags, images, and optional badges or status flags. The front end doesn't care where it came from; it just maps the data into cards, modals, and galleries.
                    </p>
                    <p>
                        Because the content structure and the UI are cleanly separated, the admin doesn't need to know anything about how the site is built. They just fill out a form, upload images, and the system generates the JSON automatically. No hand-editing components. No digging through config. Just content in, site updates out.
                    </p>
                </div>

                <pre class="json-snippet" aria-label="Example of a trimmed web project JSON entry">
{
  "id": "example-project",
  "title": "Example Project",
  "description": "A short summary of what this thing is.",
  "externalLink": "https://example.com",
  "tags": [
    "Web Design", 
    "Nuxt"
  ],
  "images": [
    "/images/web-projects/example/hero.png"
  ],
  "badge": "Designed & Built"
}
        </pre>

                <p class="section-note">
                    The same pattern powers add-ons, artwork, and web projects. 
                </p>
            </section>

            <section id="closing" class="behind-section closing-section">
                <div class="closing-inner">
                    <figure class="closing-sprite">
                        <div class="sprite-image" role="img" aria-label="Pixel sprite of Jack waving goodbye" />
                    </figure>
                    <div class="closing-copy">
                        <h2>If you're building something too…</h2>
                        <p>
                            If you're building something yourself — whether it's a tool, a site, or an odd idea that needs clean execution — I'd love to help make it real. This portfolio exists to show that I care about the details, from the way a JSON object is shaped to how a tiny pixel sprite tilts its head.
                        </p>
                        <p>
                            Reach out if you want someone who thinks in systems, ships deliberately, and still has fun with the small stuff.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<style lang="scss">
@use "~/assets/styles/mixins" as *;

.behind-page {
    @include flex-column;
    align-items: center;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;

    section {
        scroll-margin-top: $navbar-height;
        width: 100%;
    }
}

.back-nav {
    position: fixed;
    top: calc(#{$navbar-height} + $spacing-md);
    left: $spacing-md;
    z-index: 1000;

    .back-button {
        display: inline-flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm $spacing-md;
        background: var(--bg-color);
        color: var(--text-color);
        text-decoration: none;
        border: 2px solid var(--border-color);
        border-radius: $radius-md;
        font-weight: 700;
        font-size: $font-size-small;
        transition: all $transition-base;
        box-shadow: $shadow-md;

        .iconify {
            font-size: 1.25rem;
        }

        &:hover {
            background: var(--border-color);
            transform: translateX(-4px);
        }

        @include focus-visible-highlight;
    }

    @include respond-below($breakpoint-md) {
        top: calc(#{$navbar-height} + $spacing-sm);
        left: $spacing-sm;

        .back-button {
            padding: $spacing-sm $spacing-md;
            font-size: $font-size-small;
        }
    }
}

.behind-layout {
    @include section-padding;
    @include section-container($container-max-width);
    padding-top: calc(#{$navbar-height} + $spacing-xl);
    padding-bottom: $spacing-3xl;
    box-sizing: border-box;

    @include respond-below($breakpoint-md) {
        padding-inline: $spacing-md;
    }
}

.behind-hero {
    position: relative;
    padding: $spacing-3xl $spacing-xl $spacing-2xl;
    border-radius: $radius-lg;
    background: radial-gradient(circle at top left, var(--sub-bg-color), var(--bg-color));
    border: 2px solid var(--border-color);
    overflow: hidden;
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: $spacing-xl;
    align-items: center;

    @include respond-below($breakpoint-md) {
        grid-template-columns: 1fr;
        padding: $spacing-xl $spacing-lg;
        text-align: center;
    }

    .hero-copy {
        position: relative;
        z-index: 1;

        .hero-badge {
            font-size: $font-size-small;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            margin-bottom: $spacing-xs;
            color: var(--highlight-color);
        }

        h1 {
            font-size: $font-size-title;
            font-weight: 900;
            margin-bottom: $spacing-sm;
            color: var(--text-color);
        }

        .subtitle {
            font-size: $font-size-body;
            color: var(--text-color);
            opacity: 0.85;
            max-width: $container-narrow;
            margin: 0;

            @include respond-below($breakpoint-md) {
                max-width: 100%;
            }
        }
    }

    .hero-sprite {
        position: relative;
        z-index: 1;
        text-align: center;
        @include flex-column;
        align-items: center;

        .sprite-image {
            width: clamp(140px, 15vw, 200px);
            height: clamp(140px, 15vw, 200px);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            border-radius: $radius-lg;
            border: 2px solid var(--border-color);
            background-color: var(--bg-color);
            padding: $spacing-sm;
            box-shadow: $shadow-lg;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .sprite-caption {
            margin-top: $spacing-sm;
            font-size: $font-size-small;
            color: var(--text-color);
            opacity: 0.8;
        }
    }
}

.behind-section {
    margin-top: $spacing-3xl;

    h2 {
        font-size: $font-size-subtitle;
        font-weight: 900;
        margin-bottom: $spacing-xs;
        color: var(--text-color);
    }

    .section-kicker {
        font-size: $font-size-small;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--highlight-color);
        margin-bottom: $spacing-lg;
    }

    .section-body {
        font-size: $font-size-body;
        color: var(--text-color);
        line-height: 1.8;
        @include flex-column;
        gap: $spacing-md;

        p {
            margin: 0;
        }
    }

    .two-column {
        @include respond-to($breakpoint-md) {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: $spacing-xl;
        }
    }

    .section-note {
        margin-top: $spacing-md;
        font-size: $font-size-small;
        color: var(--text-color);
        opacity: 0.75;
    }
}

.cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-lg;

    @include respond-to($breakpoint-md) {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}

.info-card {
    @include card-base;
    padding: $spacing-lg;
    height: 100%;

    &:hover {
        border-color: var(--highlight-color);
        transform: translateY(-4px);
        box-shadow: $shadow-lg;
    }

    h3 {
        font-size: $font-size-body;
        font-weight: 700;
        color: var(--text-color);
        margin-bottom: $spacing-sm;
    }

    p {
        font-size: $font-size-body-sm;
        color: var(--text-color);
        line-height: 1.7;
        margin: 0;
    }
}

.callout {
    margin-top: $spacing-xl;
    padding: $spacing-md $spacing-lg;
    border-radius: $radius-md;
    border: 2px dashed var(--border-color);
    background: var(--sub-bg-color);
    display: flex;
    align-items: center;
    gap: $spacing-md;

    @include respond-below($breakpoint-sm) {
        flex-direction: column;
        text-align: center;
        padding: $spacing-lg;
    }

    .callout-icon {
        font-size: 1.5rem;
        color: var(--highlight-color);
        flex-shrink: 0;
    }

    p {
        margin: 0;
        font-size: $font-size-body-sm;
        color: var(--text-color);
    }
}

.panel-details {
    margin-top: $spacing-xl;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    gap: $spacing-xl;
    align-items: start;

    @include respond-below($breakpoint-md) {
        grid-template-columns: 1fr;
    }
}

.feature-list {
    list-style: none;
    padding: 0;
    margin: 0;
    @include flex-column;
    gap: $spacing-md;

    li {
        display: flex;
        align-items: flex-start;
        gap: $spacing-sm;
        font-size: $font-size-body-sm;
        color: var(--text-color);

        .iconify {
            font-size: 1.25rem;
            color: var(--highlight-color);
            flex-shrink: 0;
            margin-top: 0.1em;
        }
    }
}

.feature-list--inline {
    margin-top: $spacing-xl;
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-md;

    @include respond-to($breakpoint-md) {
        grid-template-columns: repeat(2, 1fr);
    }

    li {
        background: var(--sub-bg-color);
        border: 1px solid var(--border-color);
        border-radius: $radius-md;
        padding: $spacing-sm $spacing-md;
        transition: border-color $transition-fast;

        &:hover {
            border-color: var(--highlight-color);
        }
    }
}

.panel-screenshot {
    @include card-base;
    padding: $spacing-lg;
    text-align: center;
    @include flex-column;
    align-items: center;
    overflow: hidden;

    img {
        width: 100%;
        max-width: 100%;
        height: auto;
        border-radius: $radius-md;
        border: 2px solid var(--border-color);
        margin-bottom: $spacing-md;
        box-shadow: $shadow-md;
    }

    p {
        font-size: $font-size-small;
        color: var(--text-color);
        opacity: 0.85;
        margin: 0;
    }
}

.theme-grid {
    margin-top: $spacing-md;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: $spacing-lg;

    @include respond-to($breakpoint-md) {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}

.theme-figure {
    text-align: center;
    @include flex-column;
    align-items: center;

    .sprite-image {
        width: clamp(100px, 12vw, 140px);
        height: clamp(100px, 12vw, 140px);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: $radius-md;
        border: 2px solid var(--border-color);
        padding: $spacing-sm;
        background-color: var(--bg-color);
        transition: border-color $transition-fast, box-shadow $transition-fast;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    &:hover .sprite-image {
        border-color: var(--highlight-color);
        box-shadow: $shadow-md;
    }

    figcaption {
        margin-top: $spacing-sm;
        font-size: $font-size-small;
        color: var(--text-color);
        opacity: 0.85;
    }
}

.theme-details {
    margin-top: $spacing-xl;
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: $spacing-xl;
    align-items: start;

    @include respond-below($breakpoint-md) {
        grid-template-columns: 1fr;
    }

    .section-body {
        margin-top: 0;
    }
}

.theme-selector-screenshot {
    @include card-base;
    padding: $spacing-lg;
    text-align: center;
    @include flex-column;
    align-items: center;

    img {
        max-width: 100%;
        height: auto;
        border-radius: $radius-md;
        border: 2px solid var(--border-color);
        margin-bottom: $spacing-sm;
        box-shadow: $shadow-md;
    }

    figcaption {
        font-size: $font-size-small;
        color: var(--text-color);
        opacity: 0.85;
        margin: 0;
    }
}

.json-snippet {
    margin-top: $spacing-lg;
    padding: $spacing-lg;
    border-radius: $radius-lg;
    background: var(--sub-bg-color);
    border: 2px solid var(--border-color);
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
    font-size: $font-size-small;
    color: var(--text-color);
    line-height: 1.6;
    overflow-x: auto;
    white-space: pre;
    max-width: 100%;
    box-sizing: border-box;
    @include custom-scrollbar;
}

.closing-section {
    margin-top: $spacing-3xl;

    .closing-inner {
        @include card-base;
        padding: $spacing-2xl $spacing-xl;
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
        gap: $spacing-xl;
        align-items: center;

        @include respond-below($breakpoint-md) {
            grid-template-columns: 1fr;
            padding: $spacing-xl $spacing-lg;
            text-align: center;
        }
    }

    .closing-copy {
        h2 {
            font-size: $font-size-subtitle;
            font-weight: 900;
            margin-bottom: $spacing-md;
            color: var(--text-color);
        }

        p {
            font-size: $font-size-body;
            line-height: 1.8;
            margin: 0 0 $spacing-md;
            color: var(--text-color);

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    .closing-sprite {
        text-align: center;
        @include flex-column;
        align-items: center;

        .sprite-image {
            width: clamp(120px, 14vw, 180px);
            height: clamp(120px, 14vw, 180px);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            border-radius: $radius-lg;
            border: 2px solid var(--border-color);
            padding: $spacing-sm;
            background-color: var(--bg-color);
            box-shadow: $shadow-lg;
            filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
    }
}
</style>

<style lang="scss">
.behind-page .sprite-image {
    background-image: url('/images/jack-sprite/JackSmaller.png');
}

html.light-mode .behind-page .sprite-image {
    background-image: url('/images/jack-sprite/JackSmallerLight.png');
}

html.dark-mode .behind-page .sprite-image {
    background-image: url('/images/jack-sprite/JackSmaller.png');
}

html.sepia-mode .behind-page .sprite-image {
    background-image: url('/images/jack-sprite/JackSmallerSepia.png');
}

html.contrast-mode .behind-page .sprite-image {
    background-image: url('/images/jack-sprite/JackSmallerContrast.png');
}

@media (prefers-color-scheme: light) {
    html:not(.light-mode):not(.dark-mode):not(.sepia-mode):not(.contrast-mode) .behind-page .sprite-image {
        background-image: url('/images/jack-sprite/JackSmallerLight.png');
    }
}

@media (prefers-color-scheme: dark) {
    html:not(.light-mode):not(.dark-mode):not(.sepia-mode):not(.contrast-mode) .behind-page .sprite-image {
        background-image: url('/images/jack-sprite/JackSmaller.png');
    }
}

.behind-page .sprite-image--dark {
    background-image: url('/images/jack-sprite/JackSmaller.png') !important;
}

.behind-page .sprite-image--light {
    background-image: url('/images/jack-sprite/JackSmallerLight.png') !important;
}

.behind-page .sprite-image--sepia {
    background-image: url('/images/jack-sprite/JackSmallerSepia.png') !important;
}

.behind-page .sprite-image--contrast {
    background-image: url('/images/jack-sprite/JackSmallerContrast.png') !important;
}
</style>
