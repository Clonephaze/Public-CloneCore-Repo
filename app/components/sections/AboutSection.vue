<script setup lang="ts">
</script>

<template>
    <section id="about" class="about-section">
        <div class="section-container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <h3>Short Bio</h3>
                    <p>
                        I'm a part-time librarian and a freelance developer with a love for creating that spans
                        beyond any one medium. I code full stack projects, build Blender tools, and dabble in
                        everything from 3D and pixel art to video and sound editing.
                    </p>
                    <p>
                        If it's creative or technical, I like figuring out how it works. Whether it's developing
                        web applications, creating Blender add-ons, or crafting 3D renders, I approach each project
                        with curiosity and dedication to quality.
                    </p>
                    <p>
                        When I'm not coding or modeling, you'll find me helping library patrons discover new books
                        or experimenting with the latest tools and technologies in the creative space.
                    </p>
                </div>
                <div class="about-skills">
                    <h3>What I Do</h3>
                    <ul class="skills-list">
                        <li>
                            <Icon name="tabler:code" />
                            <span>Full Stack Web Development</span>
                        </li>
                        <li>
                            <Icon name="tabler:3d-cube-sphere" />
                            <span>Blender Add-on Development</span>
                        </li>
                        <li>
                            <Icon name="tabler:palette" />
                            <span>3D Modeling & Rendering</span>
                        </li>
                        <li>
                            <Icon name="tabler:photo" />
                            <span>Digital Art & Design</span>
                        </li>
                        <li>
                            <Icon name="tabler:video" />
                            <span>Video & Sound Editing</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.about-section {
    @include section-padding(var(--sub-bg-color));
}

.section-container {
    @include section-container;
}

.section-title {
    @include section-title;
    margin-bottom: $spacing-2xl;
}

.about-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-2xl;
    align-items: start;

    @include respond-to($breakpoint-md) {
        grid-template-columns: 1fr 1fr;
    }

    @include respond-to($breakpoint-lg) {
        grid-template-columns: 1.2fr 1fr;
    }
}

.about-text {
    @include flex-column;
    gap: $spacing-lg;

    p {
        color: var(--text-color);
        font-size: $font-size-body;
        line-height: 1.8;
        margin: 0;
    }

    h3 {
        font-size: $font-size-subtitle;
        font-weight: 700;
        color: var(--text-color);
        margin-bottom: $spacing-lg;
    }
}

.about-skills {
    h3 {
        font-size: $font-size-subtitle;
        font-weight: 700;
        color: var(--text-color);
        margin-bottom: $spacing-lg;
    }

    .skills-list {
        list-style: none;
        padding: 0;
        margin: 0;
        @include flex-column;
        gap: $spacing-md;

        li {
            display: flex;
            align-items: center;
            gap: $spacing-md;
            color: var(--text-color);
            font-size: $font-size-body;
            padding: $spacing-md;
            @include card-base;
            border-radius: $radius-sm;

            &:hover {
                border-color: var(--highlight-color);
                transform: translateX(8px);
            }

            .iconify {
                font-size: 1.5rem;
                color: var(--highlight-color);
                flex-shrink: 0;
            }
        }
    }
}
</style>
