<script lang="ts" setup>
/**
 * @credits NuxtLabs <https://nuxtlabs.com/>
 * @see https://github.com/nuxt/nuxt.com/blob/main/components/OgImage/Docs.vue
 */
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    title?: string,
    description?: string,
    headline?: string,
    tags?: string[]
}>(), {
    title: 'title',
    description: 'description',
    headline: 'CloneCore.net',
    tags: () => ['Accessibility A11y Compliant', 'Stunning Animations', "Understandable & Modern UI", 'Vue and Nuxt']
})

const title = computed(() => (props.title || '').slice(0, 60))
const description = computed(() => (props.description || '').slice(0, 300))
const formattedTags = computed(() => props.tags.slice(0, 5).join(' | '))
</script>

<template>
    <div class="w-full h-full flex flex-col justify-center bg-[#020420]">
        <svg class="absolute right-0 top-0" width="629" height="593" viewBox="0 0 629 593" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_f_199_94966)">
                <path
                    d="M628.5 -578L639.334 -94.4223L806.598 -548.281L659.827 -87.387L965.396 -462.344L676.925 -74.0787L1087.69 -329.501L688.776 -55.9396L1160.22 -164.149L694.095 -34.9354L1175.13 15.7948L692.306 -13.3422L1130.8 190.83L683.602 6.50012L1032.04 341.989L668.927 22.4412L889.557 452.891L649.872 32.7537L718.78 511.519L628.5 36.32L538.22 511.519L607.128 32.7537L367.443 452.891L588.073 22.4412L224.955 341.989L573.398 6.50012L126.198 190.83L564.694 -13.3422L81.8734 15.7948L562.905 -34.9354L96.7839 -164.149L568.224 -55.9396L169.314 -329.501L580.075 -74.0787L291.604 -462.344L597.173 -87.387L450.402 -548.281L617.666 -94.4223L628.5 -578Z"
                    fill="#0588cb" />
            </g>
            <defs>
                <filter id="filter0_f_199_94966" x="0.873535" y="-659" width="1255.25" height="1251.52" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                    <feFlood flood-opacity="0" result="BackgroundImageFix" />
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                    <feGaussianBlur stdDeviation="40.5" result="effect1_foregroundBlur_199_94966" />
                </filter>
            </defs>
        </svg>

        <div class="w-[800px] pl-[100px]">
            <p v-if="headline" class="text-[20px] text-[#e4e4e7] mb-4 font-semibold">
                {{ headline }}
            </p>
            <h1 v-if="title" class="uppercase w-[800px] m-0 text-[56px] text-[#0588cb] font-extrabold mb-4 text-white flex items-center">
                <span>{{ title }}</span>
            </h1>
            <p v-if="description" class="text-[24px] w-[600px] text-[#E4E4E7] text-pretty leading-tight">
                {{ description }}
            </p>
            <p v-if="formattedTags" class="text-[16px] w-[1000px] text-[#a1a1aa] opacity-80 mt-2">
                {{ formattedTags }}
            </p>
        </div>
        <svg
id="svg1" class="absolute top-[100px] right-[60px]" width="340" height="340" viewBox="0 0 340 340" version="1.1" xml:space="preserve" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
            <defs id="defs1">
                <linearGradient id="linearGradient64">
                    <stop id="stop64" style="stop-color:#d9928d;stop-opacity:1;" offset="0" />
                    <stop id="stop65" style="stop-color:#76d4d4;stop-opacity:1;" offset="1" />
                </linearGradient>
                <linearGradient
id="linearGradient65" xlink:href="#linearGradient64" x1="257.14148" y1="437.29205" x2="259.10114" y2="74.707939" gradientUnits="userSpaceOnUse"
                    gradientTransform="matrix(1.1042083,0,0,1.1042083,-26.677334,-26.677328)" />
            </defs>
            <g id="layer1" transform="matrix(0.84921791,0,0,0.84921792,-47.399785,-47.399789)">
                <path
id="path42"
                    style="fill:#d7b1a2;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 308.9232,281.41095 -31.33027,27.84913 31.44256,-2.47049 27.17536,-9.43276 z" />
                <path
id="path3" style="fill:none;fill-rule:evenodd;stroke:url(#linearGradient65);stroke-width:13.1776;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;paint-order:markers stroke fill"
                    d="M 449.59539,256 A 193.59539,193.59539 0 0 1 256.00304,449.59539 193.59539,193.59539 0 0 1 62.404609,256.00607 193.59539,193.59539 0 0 1 255.99089,62.404614 193.59539,193.59539 0 0 1 449.59539,255.98786 Z" />
                <path
id="path43"
                    style="fill:#dc948d;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 336.21085,297.35683 -15.49669,24.25569 -32.67781,23.58192 20.99914,-38.40485 z" />
                <path
id="path44"
                    style="fill:#e5a69c;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 309.03549,306.78959 -31.44256,2.47049 10.44342,35.93436 z" />
                <path
id="path45"
                    style="fill:#d9928d;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="M 277.59293,309.26008 256,347.88952 l 32.03635,-2.69508 z" />
                <path
id="path46"
                    style="fill:#de9f98;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="M 277.59293,309.26008 H 239.79759 L 256,347.88952 Z" />
                <path
id="path47"
                    style="fill:#d1908e;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 256,347.88952 -20.17989,-0.96526 -4.86136,-2.03293 8.83884,-35.63125 z" />
                <path
id="path48"
                    style="fill:#c18d92;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 230.95875,344.89133 8.83884,-35.63125 -39.24443,15.21354 z" />
                <path
id="path49"
                    style="fill:#b9989b;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 200.55316,324.47362 10.07627,-39.06765 29.16816,23.85411 z" />
                <path
id="path50"
                    style="fill:#b1a0a6;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 200.55316,324.47362 -22.09709,-29.07976 32.17336,-9.98789 z" />
                <path
id="path51"
                    style="fill:#acaab0;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 178.45607,295.39386 -3.53553,-12.10921 -0.0884,-20.77126 35.79728,22.89258 z" />
                <path
id="path52"
                    style="fill:#a0b3ba;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 210.62943,285.40597 -1e-5,-40.30508 -35.79728,17.4125 z" />
                <path
id="path53"
                    style="fill:#92bdc3;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 174.83214,262.51339 v -39.95153 l 35.79729,-2.47487 -1e-5,25.0139 z" />
                <path
id="path54"
                    style="fill:#89d5d1;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 174.83214,222.56186 3.0936,-14.4073 11.49049,-16.17507 25.98617,23.59969 -4.77297,4.50781 z" />
                <path
id="path55"
                    style="fill:#69ccc8;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 215.4024,215.57918 10.78338,-54.71239 -26.78167,20.06416 -9.98788,11.04854 z" />
                <path
id="path56"
                    style="fill:#6cc1c8;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 215.4024,215.57918 22.62742,-20.94804 -11.84404,-33.76435 z" />
                <path
id="path57"
                    style="fill:#85e0d9;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 226.18578,160.86679 15.82152,-3.09359 12.1092,-0.35355 -16.08668,37.21149 z" />
                <path
id="path58"
                    style="fill:#83d4d8;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 254.1165,157.41965 24.30679,37.21149 h -40.39347 z" />
                <path
id="path59"
                    style="fill:#76d4d4;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 278.42329,194.63114 c 0,-1.85615 0.97228,-37.21149 0.97228,-37.21149 H 254.1165 Z" />
                <path
id="path60"
                    style="fill:#75c4ca;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 279.39557,157.41965 39.4212,23.5113 -14.84924,13.70019 z" />
                <path
id="path61"
                    style="fill:#7dd0d2;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 279.39557,157.41965 -0.97228,37.21149 h 25.54424 z" />
                <path
id="path62"
                    style="fill:#7ac7cd;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 278.42329,194.63114 h 25.54424 l 32.17336,12.46276 -27.57717,16.52862 z" />
                <path
id="path63"
                    style="fill:#84d0d2;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:0.4;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:0;stroke-dasharray:none;stroke-opacity:0.397849;paint-order:markers stroke fill"
                    d="m 303.96753,194.63114 14.84924,-13.70019 17.32412,26.16295 z" />
            </g>
        </svg>

    </div>
</template>
