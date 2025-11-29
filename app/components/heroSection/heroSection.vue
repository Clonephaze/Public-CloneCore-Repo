<script setup lang="ts">
import { animate } from 'motion';
const lastScrollTop = ref<number>(0);
const isMobile = ref<boolean>(false);
const heroSection = ref<HTMLElement | null>(null);
const heroTitle = ref<HTMLDivElement | null>(null);
const titleText = ref<HTMLSpanElement | null>(null);

const handleScroll = (): void => {
    const scrollTop: number = window.pageYOffset || document.documentElement.scrollTop
    const scrollIndicator: HTMLElement | null = document.querySelector('.scroll-indicator')

    if (scrollIndicator) {
        if (scrollTop > lastScrollTop.value) {
            setTimeout(() => {
                scrollIndicator.classList.replace('fade-in', 'fade-out')
            }, 150)
        }
    }
    lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop
};
const accessibleWord: string = 'Accessible';
const contentWord: string = 'Content';
const idealSiteWords: string = 'Your Ideal Website';

const isStillViewingHero = (): boolean => {
    if (!heroSection.value) return false;
    const rect = heroSection.value.getBoundingClientRect();
    return rect.bottom > window.innerHeight * 0.5;
};

onMounted(async () => {
    const mobileCheck: MediaQueryList = window.matchMedia("(max-width: 768px)");
    isMobile.value = mobileCheck.matches;
    initiateHeroAnimation()

    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
})

const initiateHeroAnimation = (): void => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        animateHeroSequence();
    } else {
        reducedHeroAnimation();
    }
}

const animateHeroSequence = async (): Promise<void> => {
    if (!heroTitle.value || !titleText.value) return;
    await dropInCloneCore(heroTitle.value);

    await new Promise(resolve => setTimeout(resolve, 1200));

    await animateText((text: string) => { titleText.value!.textContent = text; }, 130);

    await new Promise(resolve => setTimeout(resolve, 1200));

    const secondWord: HTMLSpanElement | null = titleText.value.querySelector('[data-word="Beautiful"]');
    const thirdWord: HTMLSpanElement | null = titleText.value.querySelector('[data-word="Designs"]');

    await flipBeautiful(secondWord!, thirdWord!);

    await eyeToAccessible(secondWord!, thirdWord!);

    await new Promise(resolve => setTimeout(resolve, 1200));

    await accessibleToIdeal(secondWord!, thirdWord!);
}

const dropInCloneCore = async (
    heroTitle: HTMLDivElement
): Promise<void> => {
    await Promise.all([
        animate(heroTitle,
            {
                opacity: [0, 1],
                scale: [2.5, 1],
            },
            {
                duration: 1.5,
                ease: easeOutBounce
            }
        ),
        animate(heroTitle,
            {
                filter: ['blur(2px)', 'blur(0px)'],
            },
            {
                duration: 1.25
            }
        )
    ]);
}

const flipBeautiful = async (
    secondWord: HTMLSpanElement,
    thirdWord: HTMLSpanElement
): Promise<void> => {
    secondWord.style.transformOrigin = 'top center'
    await animate(secondWord, {
        rotateX: -90
    }, {
        duration: 0.5,
        ease: [.25, .01, .97, .51]
    });
    await animate(secondWord, {
        width: '12ch'
    }, {
        duration: 0.5,
    }).then(() => {
        secondWord.textContent = 'Eye-Catching'
        secondWord.style.textAlign = 'center'
    })

    await Promise.all([
        animate(secondWord,
            {
                width: 'auto'
            },
            {
                duration: 0.6,
                ease: 'easeOut'
            }),
        animate(secondWord,
            {
                rotateX: 0
            },
            {
                type: 'spring',
                stiffness: 200,
                damping: 5,
                mass: 1.5,
                restDelta: 10,
                restSpeed: 6
            }).then(() => {
                secondWord.style.transformOrigin = 'bottom right'
                thirdWord.style.transformOrigin = 'bottom right'
            })

    ])
}

const desktopEyeToAccessible = async (
    secondWord: HTMLSpanElement,
    thirdWord: HTMLSpanElement
): Promise<void> => {
    await animate([secondWord, thirdWord],
        {
            rotate: 80,
            opacity: 0,
        },
        {
            duration: 0.8,
            ease: 'easeOut'
        }).then(() => {
            secondWord.style.whiteSpace = 'nowrap'
        })

    await Promise.all([
        animate(secondWord,
            {
                width: `${accessibleWord.length}ch`
            },
            {
                duration: 0.3,
                ease: 'easeOut'
            }).then(() => {
                secondWord.textContent = accessibleWord
            }),

        animate(thirdWord,
            {
                width: `${contentWord.length}ch`
            },
            {
                duration: 0.3,
                ease: 'easeOut'
            }).then(() => {
                thirdWord.textContent = contentWord
            })
    ])

    await Promise.all([
        animate(secondWord,
            {
                width: 'auto'
            },
            {
                duration: 1.2,
            }),
        animate(secondWord,
            {
                rotate: 0,
                opacity: 1
            },
            {
                duration: 1.2,
                ease: easeOutBounce
            }),
        animate(thirdWord,
            {
                width: 'auto'
            },
            {
                duration: 1.2,
            }),
        animate(thirdWord,
            {
                rotate: 0,
                opacity: 1
            },
            {
                duration: 1.2,
                ease: easeOutBounce
            }).then(() => {
                secondWord.style.transformOrigin = 'center center'
                thirdWord.style.transformOrigin = 'center center'
            })
    ])
}

const mobileEyeToAccessible = async (
    secondWord: HTMLSpanElement,
    thirdWord: HTMLSpanElement
): Promise<void> => {
    Object.assign(secondWord.style, { overflow: 'clip', whiteSpace: 'nowrap' })
    Object.assign(thirdWord.style, { overflow: 'clip', whiteSpace: 'nowrap' })
    await Promise.all([
        animate(secondWord,
            {
                skewX: -20,
                textIndent: ['0%', '100%']
            },
            {
                duration: 1.1,
                ease: 'easeOut'
            }),
        animate(thirdWord,
            {
                skewX: 20,
                textIndent: ['0%', '-200%']
            },
            {
                duration: 1.1,
                ease: 'easeOut'
            })
            .then(() => {
                secondWord.textContent = accessibleWord
                thirdWord.textContent = contentWord
            })
    ])

    await new Promise(resolve => setTimeout(resolve, 200))

    await Promise.all([
        animate(secondWord,
            {
                skewX: 0,
                textIndent: '0%'
            },
            {
                duration: 0.8,
            }),
        animate(thirdWord,
            {
                skewX: 0,
                textIndent: '0%'
            },
            {
                duration: 0.8,
            })
    ])
}

const eyeToAccessible = async (
    secondWord: HTMLSpanElement,
    thirdWord: HTMLSpanElement
): Promise<void> => {
    if (isMobile.value) {
        await mobileEyeToAccessible(secondWord, thirdWord)
    } else {
        await desktopEyeToAccessible(secondWord, thirdWord)
    }
}

const accessibleToIdeal = async (
    secondWord: HTMLSpanElement,
    thirdWord: HTMLSpanElement
): Promise<void> => {
    await animate([secondWord, thirdWord],
        {
            scaleY: 0,
            scaleX: [1, 1, 1.05, 1]
        },
        {
            duration: 0.5,
            ease: [.67, .19, .83, .98]
        }
    ).then(() => {
        if (isMobile.value) { thirdWord.style.display = 'block' }
    })

    await Promise.all([
        animate(secondWord,
            {
                width: `${idealSiteWords.length - 4}ch`
            },
            {
                duration: 0.4,
                ease: 'easeIn'
            }
        ),
        animate(thirdWord,
            {
                width: 0,
                height: 0
            },
            {
                duration: 0.3,
            }
        ).then(() => {
            secondWord.textContent = idealSiteWords
        })
    ])

    await animate(secondWord,
        {
            scaleY: 1,
            scaleX: [1, 0.99, 1, 1]
        },
        {
            duration: 0.7,
            ease: [.79, .45, .29, 1.5]
        }
    ).then(() => {
        wrapIdeal(secondWord)
        if (isStillViewingHero()) {
            document.querySelector('.scroll-indicator')?.classList.add('fade-in')
        }
    })
}

const easeOutBounce = function (x: number): number {
    const n1: number = 7.5625;
    const d1: number = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

const splitTextIntoWords = (element: Element | null) => {
    if (!element) return null
    const text: string = element.textContent || ''
    element.textContent = ''
    const words: string[] = text.split(' ')
    words.forEach((word, index) => {
        const span: HTMLSpanElement = document.createElement('span')
        span.textContent = word
        span.setAttribute('data-word', word)
        span.style.display = 'inline-block'
        if (index < words.length) {
            const space = document.createTextNode(' ')
            element.appendChild(space)
        }
        element.appendChild(span)
    })
    return element
}

const animateText = async (
    setText: (text: string) => void,
    delay: number = 100
): Promise<void> => {
    const initialText: string = "CLONE-CORE";
    const finalText: string = "Creating Beautiful Designs";

    if (titleText.value) {
        titleText.value.classList.add('typing-cursor');
    }

    setText(initialText);

    for (let i = initialText.length; i > 1; i--) {
        await new Promise(resolve => setTimeout(resolve, delay));
        setText(initialText.slice(0, i - 1));
    }

    await new Promise(resolve => setTimeout(resolve, delay * 2));

    for (let i = 1; i <= finalText.length; i++) {
        await new Promise(resolve => setTimeout(resolve, delay * 0.8));
        setText(finalText.slice(0, i));
    }

    setTimeout(() => {
        if (titleText.value) {
            titleText.value.classList.remove('typing-cursor');
        }
    }, 800);

    splitTextIntoWords(titleText.value)
};

const wrapIdeal = (
    wordToWrap: HTMLElement
): void => {
    const targetWord: string = "Ideal"
    const regex = new RegExp(`\\b${targetWord}\\b`, "g")
    if (wordToWrap) {
        wordToWrap.innerHTML = wordToWrap.innerHTML.replace(
            regex,
            `<span class='animate-ideal'>${targetWord}</span>`
        )
    }
}

const reducedHeroAnimation = async (): Promise<void> => {
    await fadeInTitle(heroTitle.value!);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await animateText((text: string) => { titleText.value!.textContent = text; }, 130);
    const secondWord: HTMLSpanElement | null = titleText.value!.querySelector('[data-word="Beautiful"]');
    const thirdWord: HTMLSpanElement | null = titleText.value!.querySelector('[data-word="Designs"]');
    await fadeBeautiful(secondWord!);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fadeEyeToAccessible(secondWord!, thirdWord!);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await fadeAccessibleToIdeal(secondWord!, thirdWord!);
}

const fadeInTitle = async (
    heroTitle: HTMLDivElement
): Promise<void> => {
    await animate(heroTitle,
        {
            opacity: 1
        },
        {
            duration: 1.5
        }
    );
}

const fadeBeautiful = async (
    secondWord: HTMLSpanElement
): Promise<void> => {
    secondWord.style.transformOrigin = 'top center'
    await animate(secondWord, {
        opacity: 0
    }, {
        duration: 1.5
    });
    await animate(secondWord, {
        width: '12ch'
    }, {
        duration: 0.5,
    }).then(() => {
        secondWord.textContent = 'Eye-Catching'
        secondWord.style.textAlign = 'center'
    })

    await Promise.all([
        animate(secondWord,
            {
                width: 'auto'
            },
            {
                duration: 0.6,
                ease: 'easeOut'
            }),
        animate(secondWord,
            {
                opacity: 1
            },
            {
                duration: 1.5
            })

    ])
}

const fadeEyeToAccessible = async (
    secondWord: HTMLSpanElement,
    thirdWord: HTMLSpanElement
): Promise<void> => {
    await animate([secondWord, thirdWord],
        {
            opacity: 0
        },
        {
            duration: 0.8,
            ease: 'easeOut'
        }).then(() => {
            secondWord.style.whiteSpace = 'nowrap'
        })

    await Promise.all([
        animate(secondWord,
            {
                width: `${accessibleWord.length}ch`
            },
            {
                duration: 0.3,
                ease: 'easeOut'
            }).then(() => {
                secondWord.textContent = accessibleWord
            }),

        animate(thirdWord,
            {
                width: `${contentWord.length}ch`
            },
            {
                duration: 0.3,
                ease: 'easeOut'
            }).then(() => {
                thirdWord.textContent = contentWord
            })
    ])

    await Promise.all([
        animate(secondWord,
            {
                width: 'auto'
            },
            {
                duration: 1.2,
            }),
        animate(secondWord,
            {
                opacity: 1
            },
            {
                duration: 1.2
            }),
        animate(thirdWord,
            {
                width: 'auto'
            },
            {
                duration: 1.2,
            }),
        animate(thirdWord,
            {
                opacity: 1
            },
            {
                duration: 1.2
            })
    ])
}

const fadeAccessibleToIdeal = async (
    secondWord: HTMLSpanElement,
    thirdWord: HTMLSpanElement
): Promise<void> => {
    await animate([secondWord, thirdWord],
        {
            opacity: 0
        },
        {
            duration: 1.2
        }
    ).then(() => {
        if (isMobile.value) { thirdWord.style.display = 'block' }
    })

    await Promise.all([
        animate(secondWord,
            {
                width: `${idealSiteWords.length - 4}ch`
            },
            {
                duration: 0.4,
                ease: 'easeIn'
            }
        ),
        animate(thirdWord,
            {
                width: 0,
                height: 0
            },
            {
                duration: 0.3,
            }
        ).then(() => {
            secondWord.textContent = idealSiteWords
        })
    ])

    await animate(secondWord,
        {
            opacity: 1
        },
        {
            duration: 1.2
        }
    ).then(() => {
        wrapIdeal(secondWord)
        if (isStillViewingHero()) {
            document.querySelector('.scroll-indicator')?.classList.add('fade-in')
        }
    })
}

const scrollIndicatorClick = (): void => {
    const projectSection: HTMLElement | null = document.querySelector('.projectsSection');
    if (projectSection) {
        projectSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}
</script>

<template>
    <section ref="heroSection" class="hero-section">
        <div ref="heroTitle" class="title-container">
            <h1 ref="mainTitle" class="hero-title" aria-label="Clone Core, creating beautiful, eye-catching designs. Creating Accessible content. Creating your ideal website.">
                <span ref="titleText" class="title-text" aria-hidden="true">CLONE-CORE</span>
            </h1>
        </div>
        <button id="scroll-indicator" class="scroll-indicator" @click="scrollIndicatorClick">
            <span class="scroll-line">Scroll</span>
            <Icon name="tabler:chevron-down" />
            <Icon name="tabler:chevron-down" />
        </button>
    </section>
</template>

<style lang="scss">
@use "~/assets/styles/mixins" as *;

.hero-section {
    display: grid;
    place-items: center;
    justify-content: center;

    .title-container {
        opacity: 0;
        container-type: normal;

        .hero-title {
            font-size: clamp(3rem, 5cqw, 6rem);
            line-height: 1.2;
            font-weight: 900;
            color: $text-color;
            perspective: 1000px;

            .title-line {
                display: block;
            }

            .typing-cursor {
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    right: -4px;
                    top: 10%;
                    height: 80%;
                    width: 3px;

                    @include respond-to($breakpoint-md) {
                        background-color: currentColor;
                        animation: blink 0.8s step-end infinite;
                    }
                }
            }

            @keyframes blink {
                0%,
                100% {
                    opacity: 1;
                }

                50% {
                    opacity: 0;
                }
            }
        }

        @include respond-below($breakpoint-md) {
            text-align: center;
            max-width: 90vw;

            >h1>span {
                display: block;
                white-space: pre-line;
                text-align: center;
                word-spacing: 100vw;

                [data-word="Beautiful"] {
                    word-spacing: normal;
                }
            }
        }

        .animate-ideal {
            animation: highlightText 3s 0.8s ease forwards;
        }

        @keyframes highlightText {
            0% {
                color: inherit;
                text-shadow: none;
            }

            50% {
                color: var(--highlight-color);
            }

            100% {
                color: var(--highlight-color);
                text-shadow: color(from currentColor srgb r g b / 50%) 0px 0px 15px;
            }
        }
    }

    .scroll-indicator {
        @include flex-column;
        align-items: center;
        position: fixed;
        bottom: $spacing-xl;
        right: 50%;
        transform: translateX(50%);
        color: $text-color;
        font-size: clamp(1rem, 2cqi, 1.5rem);
        z-index: 999;
        font-weight: 900;
        text-shadow: var(--border-color) 0px 0px 15px;
        opacity: 0;
        border: unset;
        background: unset;
        cursor: unset;
        pointer-events: none;

        &.fade-in {
            cursor: pointer;
            pointer-events: auto;
            animation: fade-in 1.5s 2.8s ease-in forwards;
        }

        &.fade-out {
            animation: fade-out 0.75s ease-out forwards;
        }

        @keyframes fade-in {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        @keyframes fade-out {
            from {
                opacity: 1;
            }

            to {
                opacity: 0;
            }
        }

        >.iconify {
            font-size: $font-size-body;
            color: currentColor;
            margin-bottom: -10px;
            will-change: transform;
            animation: bounce 1.5s ease-in-out infinite;

            &:nth-of-type(1) {
                animation-delay: 0s;
            }

            &:nth-of-type(2) {
                animation-delay: 0.08s;
            }
        }

        @keyframes bounce {
            0%,
            100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(7px);
            }
        }
    }
}
</style>