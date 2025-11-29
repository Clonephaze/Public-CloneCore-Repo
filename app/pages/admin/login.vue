<script setup lang="ts">
definePageMeta({
    layout: false
})

const { signIn, status } = useAuth()
const route = useRoute()

const error = computed(() => {
    const err = route.query.error as string
    if (err === 'unauthorized') {
        return 'You do not have access to this repository. Only collaborators can access the admin panel.'
    }
    if (err === 'verification-failed') {
        return 'Failed to verify your access. Please try again.'
    }
    return null
})

const isLoading = ref(false)

const handleSignIn = async () => {
    isLoading.value = true
    await signIn('github', { callbackUrl: '/admin' })
}

// If already authenticated, redirect to admin
watch(status, (newStatus) => {
    if (newStatus === 'authenticated' && !error.value) {
        navigateTo('/admin')
    }
}, { immediate: true })
</script>

<template>
    <div class="login-page">
        <div class="login-card">
            <div class="login-header">
                <Icon name="tabler:lock" class="lock-icon" />
                <h1>Admin Access</h1>
                <p>Sign in with GitHub to manage your portfolio</p>
            </div>

            <div v-if="error" class="error-message">
                <Icon name="tabler:alert-circle" />
                <span>{{ error }}</span>
            </div>

            <button 
                class="github-button" 
                :disabled="isLoading"
                @click="handleSignIn"
            >
                <Icon v-if="isLoading" name="tabler:loader-2" class="spin" />
                <Icon v-else name="tabler:brand-github" />
                <span>{{ isLoading ? 'Signing in...' : 'Sign in with GitHub' }}</span>
            </button>

            <div class="login-footer">
                <p>Only repository collaborators can access the admin panel.</p>
                <NuxtLink to="/" class="back-link">
                    <Icon name="tabler:arrow-left" />
                    Back to site
                </NuxtLink>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-color, #1a1a2e);
    padding: 1rem;
}

.login-card {
    background: var(--sub-bg-color, #16213e);
    border: 2px solid var(--border-color, #333);
    border-radius: 16px;
    padding: 2.5rem;
    max-width: 400px;
    width: 100%;
    text-align: center;
}

.login-header {
    margin-bottom: 2rem;

    .lock-icon {
        font-size: 3rem;
        color: var(--highlight-color, #7c3aed);
        margin-bottom: 1rem;
    }

    h1 {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-color, #fff);
        margin: 0 0 0.5rem;
    }

    p {
        color: var(--text-color, #ccc);
        opacity: 0.7;
        margin: 0;
    }
}

.error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    text-align: left;

    .iconify {
        flex-shrink: 0;
    }
}

.github-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: #24292e;
    color: #fff;
    border: 2px solid #444;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    .iconify {
        font-size: 1.25rem;
    }

    &:hover:not(:disabled) {
        background: #2f363d;
        border-color: #666;
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .spin {
        animation: spin 1s linear infinite;
    }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.login-footer {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--border-color, #333);

    p {
        font-size: 0.75rem;
        color: var(--text-color, #ccc);
        opacity: 0.5;
        margin: 0 0 1rem;
    }

    .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--highlight-color, #7c3aed);
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
