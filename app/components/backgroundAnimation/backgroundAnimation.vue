<template>
    <div class="background-animation">
        <ul>
            <li v-for="(square, index) in squares" :key="index" class="animate-square" :style="getSquareStyles(square, index)" />
        </ul>
    </div>
</template>

<script setup lang="ts">
interface Square {
    size: number;
    top: number;
    delay: number;
    duration: number;
    rotation: number;
}

const isMobile = ref(false)

onMounted(() => {
    if (import.meta.client) {
        isMobile.value = window.matchMedia('(max-width: 768px)').matches
    }
})

// Values are random but designed to look good together
const allSquares: Square[] = [
    { size: 200, top: 10, delay: 0, duration: 45, rotation: -320 },
    { size: 150, top: 30, delay: -8, duration: 45, rotation: -360 },
    { size: 280, top: 50, delay: -16, duration: 45, rotation: -380 },
    { size: 180, top: 15, delay: -24, duration: 45, rotation: -340 },
    { size: 250, top: 70, delay: -32, duration: 45, rotation: -400 },
    { size: 160, top: 85, delay: -40, duration: 45, rotation: -350 },
    { size: 220, top: 60, delay: -5, duration: 45, rotation: -370 },
    { size: 190, top: 25, delay: -13, duration: 45, rotation: -330 },
    { size: 240, top: 45, delay: -21, duration: 45, rotation: -390 },
    { size: 170, top: 65, delay: -29, duration: 45, rotation: -355 },
    { size: 210, top: 80, delay: -37, duration: 45, rotation: -345 },
    { size: 230, top: 35, delay: -3, duration: 45, rotation: -365 },
];

const mobileSquares: Square[] = [
    { size: 150, top: 20, delay: 0, duration: 45, rotation: -320 },
    { size: 180, top: 50, delay: -15, duration: 45, rotation: -360 },
    { size: 140, top: 75, delay: -30, duration: 45, rotation: -340 },
];

const squares = computed(() => isMobile.value ? mobileSquares : allSquares)

const getSquareStyles = (square: Square, _index: number) => ({
    width: `${square.size}px`,
    height: `${square.size}px`,
    top: `${square.top}%`,
    animationDuration: `${square.duration}s`,
    animationDelay: `${square.delay}s`,
    '--rotation-amount': `${square.rotation}deg`,
});
</script>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.background-animation {
    z-index: -1;
    position: fixed;
    width: 100lvw;
    height: 100lvh;

    >ul {
        position: fixed;
        inset: 0;
        margin: 0;
        padding: 0;
        overflow: hidden;
        filter: blur(3px);

        :root.contrast-mode & {
            filter: blur(0);
        }

        li {
            position: absolute;
            display: block;
            list-style: none;
            border-radius: $radius-md;
            opacity: 0.8;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            background: var(--bg-color);
            animation: animate linear infinite;

            &::before {
                content: '';
                border-radius: inherit;
                position: absolute;
                inset: 0;
                box-shadow: var(--border-color) 0 0 20px 1px;
                opacity: 0.5;
            }

            :root {
                &.dark-mode & {
                    filter: brightness(1.1);
                }

                &.light-mode & {
                    filter: brightness(0.8);

                    &::before {
                        box-shadow: var(--highlight-color) 0 0 12px 3px;
                    }
                }

                &.sepia-mode & {
                    filter: saturate(1.2) brightness(0.95);

                    &::before {
                        box-shadow: var(--highlight-color) 0 0 16px 4px;
                    }
                }

                &.contrast-mode & {
                    background: rgb(1, 1, 1);

                    &::before {
                        box-shadow: var(--highlight-color) 0 0 8px;
                    }
                }
            }
        }

        @include respond-below($breakpoint-md) {
            filter: blur(1px);
        }
    }
}

@keyframes animate {
    0% {
        transform: translateX(110vw) rotate(0deg);
    }

    100% {
        transform: translateX(-110vw) rotate(var(--rotation-amount));
    }
}
</style>