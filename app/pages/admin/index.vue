<script setup lang="ts">
import type { PortfolioItem } from '~/types/portfolio'
import addonsData from '~/data/addons.json'
import artworksData from '~/data/artworks.json'
import webProjectsData from '~/data/webProjects.json'

defineOptions({ name: 'AdminPage' })

// Protect this route with auth middleware
definePageMeta({
    middleware: ['admin']
})

// Auth session
const { data: session, signOut } = useAuth()

if (import.meta.client) {
    window.addEventListener('error', (e) => {
        if (e.message?.includes('dynamically imported module')) {
            window.location.reload()
        }
    })
}

type PortfolioCategory = 'addons' | 'artworks' | 'webProjects'

const categories: { key: PortfolioCategory; label: string; folder: string }[] = [
    { key: 'addons', label: 'Blender Addons', folder: 'addons' },
    { key: 'artworks', label: '3D Artworks', folder: 'art' },
    { key: 'webProjects', label: 'Web Projects', folder: 'web-projects' }
]

const activeCategory = ref<PortfolioCategory>('addons')
const editingItem = ref<PortfolioItem | null>(null)
const isAddingNew = ref(false)
const saveStatus = ref<'idle' | 'saving' | 'success' | 'error'>('idle')
const saveMessage = ref('')
const hasOrderChanges = ref(false)

const portfolioData = reactive<Record<PortfolioCategory, PortfolioItem[]>>({
    addons: [...addonsData] as PortfolioItem[],
    artworks: [...artworksData] as PortfolioItem[],
    webProjects: [...webProjectsData] as PortfolioItem[]
})

const originalOrder = reactive<Record<PortfolioCategory, string[]>>({
    addons: addonsData.map(i => i.id),
    artworks: artworksData.map(i => i.id),
    webProjects: webProjectsData.map(i => i.id)
})

const currentItems = computed(() => portfolioData[activeCategory.value])
const currentCategoryInfo = computed(() => categories.find(c => c.key === activeCategory.value)!)

const createNewItem = (): PortfolioItem => ({
    id: '',
    title: '',
    description: '',
    externalLink: '',
    tags: [],
    images: [],
    badge: ''
})

const startEdit = (item: PortfolioItem) => {
    editingItem.value = JSON.parse(JSON.stringify(item))
    isAddingNew.value = false
}

const startAdd = () => {
    editingItem.value = createNewItem()
    isAddingNew.value = true
}

const cancelEdit = async (cleanup?: { imageFolder: string; itemId: string; paths: string[] } | null) => {
    // If cleanup info provided and in dev mode, delete uploaded files from disk
    // In production, files aren't saved to disk (they go directly to PR), so no cleanup needed
    if (cleanup && cleanup.paths.length > 0 && import.meta.dev) {
        try {
            await $fetch('/api/admin/cleanup', {
                method: 'POST',
                body: {
                    imageFolder: cleanup.imageFolder,
                    itemId: cleanup.itemId,
                    paths: cleanup.paths
                }
            })
        } catch (error) {
            console.error('Failed to cleanup uploaded files:', error)
        }
    }
    editingItem.value = null
    isAddingNew.value = false
}

const switchCategory = (cat: PortfolioCategory) => {
    if (hasOrderChanges.value) {
        if (!confirm('You have unsaved order changes. Discard them?')) {
            return
        }
        cancelOrderChanges()
    }
    activeCategory.value = cat
    cancelEdit()
}

// Track uploaded files for current save operation
const currentUploadedFiles = ref<UploadedFileData[]>([])

const saveItem = async (item: PortfolioItem, uploadedFiles: UploadedFileData[] = []) => {
    const items = portfolioData[activeCategory.value]

    if (isAddingNew.value) {
        items.push(item)
    } else {
        const index = items.findIndex(i => i.id === item.id)
        if (index !== -1) {
            items[index] = item
        }
    }

    // Store uploaded files for PR creation
    currentUploadedFiles.value = uploadedFiles
    await saveToFile()
    editingItem.value = null
    isAddingNew.value = false
}

const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    const items = portfolioData[activeCategory.value]
    const index = items.findIndex(i => i.id === id)
    if (index !== -1) {
        items.splice(index, 1)
        await saveToFile()
    }
}

const moveItem = (id: string, direction: 'up' | 'down') => {
    const items = portfolioData[activeCategory.value]
    const index = items.findIndex(i => i.id === id)

    if (direction === 'up' && index > 0) {
        const temp = items[index - 1]!
        items[index - 1] = items[index]!
        items[index] = temp
        hasOrderChanges.value = true
    } else if (direction === 'down' && index < items.length - 1) {
        const temp = items[index]!
        items[index] = items[index + 1]!
        items[index + 1] = temp
        hasOrderChanges.value = true
    }
}

const confirmOrderChanges = async () => {
    await saveToFile()
    originalOrder[activeCategory.value] = portfolioData[activeCategory.value].map(i => i.id)
    hasOrderChanges.value = false
}

const cancelOrderChanges = () => {
    const original = originalOrder[activeCategory.value]
    const items = portfolioData[activeCategory.value]
    items.sort((a, b) => original.indexOf(a.id) - original.indexOf(b.id))
    hasOrderChanges.value = false
}

// Track pending changes for PR
interface UploadedFileData {
    path: string
    previewUrl: string
    repoPath: string
    content: string
    encoding: 'base64'
}

const pendingChanges = ref<{
    jsonData: PortfolioItem[]
    images: UploadedFileData[]
} | null>(null)

const prUrl = ref<string | null>(null)
const showPrModal = ref(false)
const prTitle = ref('')
const prDescription = ref('')

// Prepare changes for PR (instead of direct file save)
const prepareChanges = async () => {
    pendingChanges.value = {
        jsonData: JSON.parse(JSON.stringify(portfolioData[activeCategory.value])),
        images: [...currentUploadedFiles.value]  // Include uploaded images
    }
    
    // Generate default PR title
    prTitle.value = `Update ${currentCategoryInfo.value.label}`
    prDescription.value = ''
    showPrModal.value = true
}

const submitPR = async () => {
    if (!pendingChanges.value) return
    
    saveStatus.value = 'saving'
    saveMessage.value = 'Creating pull request...'
    showPrModal.value = false

    try {
        // Map category to JSON file path
        const categoryFileMap: Record<PortfolioCategory, string> = {
            addons: 'app/data/addons.json',
            artworks: 'app/data/artworks.json',
            webProjects: 'app/data/webProjects.json'
        }

        const files = [
            {
                path: categoryFileMap[activeCategory.value],
                content: JSON.stringify(pendingChanges.value.jsonData, null, 2),
                encoding: 'utf-8' as const
            },
            // Add any uploaded images (use repoPath for the commit)
            ...pendingChanges.value.images.map(img => ({
                path: img.repoPath,
                content: img.content,
                encoding: 'base64' as const
            }))
        ]

        const response = await $fetch('/api/admin/create-pr', {
            method: 'POST',
            body: {
                title: prTitle.value || `Update ${currentCategoryInfo.value.label}`,
                description: prDescription.value || `Changes to ${currentCategoryInfo.value.label} submitted via Admin Panel`,
                files,
                category: activeCategory.value
            }
        })

        saveStatus.value = 'success'
        saveMessage.value = 'Pull request created!'
        prUrl.value = response.pullRequest.url
        
        // Reset state
        pendingChanges.value = null
        currentUploadedFiles.value = []
        editingItem.value = null
        isAddingNew.value = false
        
    } catch (error) {
        saveStatus.value = 'error'
        saveMessage.value = error instanceof Error ? error.message : 'Failed to create PR'
        console.error('PR creation error:', error)
    }
}

const saveToFile = async () => {
    // Now opens PR modal instead of direct save
    await prepareChanges()
}

const handleImagesUploaded = (_paths: string[]) => {
    // Images are handled internally by PortfolioForm
    // This event is available if parent needs to react to uploads
}

const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
}

const clearPrSuccess = () => {
    prUrl.value = null
    saveStatus.value = 'idle'
    saveMessage.value = ''
}
</script>

<template>
    <div class="admin-page">
        <div class="admin-header">
            <div class="header-top">
                <h1>Portfolio Admin</h1>
                <div class="user-info">
                    <img 
                        v-if="session?.user?.image" 
                        :src="session.user.image" 
                        :alt="session?.user?.name || 'User'" 
                        class="user-avatar"
                    >
                    <span class="user-name">{{ session?.user?.name || session?.user?.email }}</span>
                    <button class="sign-out-btn" @click="handleSignOut">
                        <Icon name="tabler:logout" />
                        Sign Out
                    </button>
                </div>
            </div>
            
            <div v-if="saveMessage" :class="['save-status', saveStatus]">
                {{ saveMessage }}
                <a v-if="prUrl" :href="prUrl" target="_blank" class="pr-link">
                    View Pull Request <Icon name="tabler:external-link" />
                </a>
                <button v-if="prUrl" class="dismiss-btn" @click="clearPrSuccess">
                    <Icon name="tabler:x" />
                </button>
            </div>
        </div>

        <!-- PR Creation Modal -->
        <Teleport to="body">
            <div v-if="showPrModal" class="modal-overlay" @click.self="showPrModal = false">
                <div class="pr-modal">
                    <h2>Create Pull Request</h2>
                    <p class="modal-description">
                        Your changes will be submitted as a pull request for review.
                    </p>
                    
                    <div class="form-group">
                        <label for="pr-title">PR Title</label>
                        <input 
                            id="pr-title" 
                            v-model="prTitle" 
                            type="text" 
                            placeholder="Brief description of changes"
                        >
                    </div>
                    
                    <div class="form-group">
                        <label for="pr-description">Description (optional)</label>
                        <textarea 
                            id="pr-description" 
                            v-model="prDescription" 
                            rows="3" 
                            placeholder="Additional details about the changes..."
                        />
                    </div>
                    
                    <div class="modal-actions">
                        <button class="cancel-btn" @click="showPrModal = false">Cancel</button>
                        <button class="submit-btn" @click="submitPR">
                            <Icon name="tabler:git-pull-request" />
                            Create PR
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>

        <nav class="category-tabs">
            <button v-for="cat in categories" :key="cat.key" :class="['tab-btn', { active: activeCategory === cat.key }]" @click="switchCategory(cat.key)">
                {{ cat.label }}
                <span class="count">{{ portfolioData[cat.key].length }}</span>
            </button>
        </nav>

        <div class="admin-content">
            <section class="items-panel">
                <div class="panel-header">
                    <h2>{{ currentCategoryInfo.label }}</h2>
                    <div class="panel-actions">
                        <div v-if="hasOrderChanges" class="order-actions">
                            <button class="confirm-btn" title="Save order changes" @click="confirmOrderChanges">
                                <Icon name="tabler:check" />
                            </button>
                            <button class="cancel-order-btn" title="Cancel order changes" @click="cancelOrderChanges">
                                <Icon name="tabler:x" />
                            </button>
                        </div>
                        <button class="add-btn" @click="startAdd">
                            <Icon name="tabler:plus" /> Add New
                        </button>
                    </div>
                </div>

                <ul class="items-list">
                    <li v-for="(item, index) in currentItems" :key="item.id" :class="['item-row', { editing: editingItem?.id === item.id }]">
                        <div class="item-info">
                            <img v-if="item.images && item.images.length > 0" :src="item.images[0]" :alt="item.title" class="item-thumb">
                            <div v-else class="item-thumb item-thumb-placeholder">
                                <Icon name="tabler:photo-off" />
                            </div>
                            <div class="item-details">
                                <strong>{{ item.title }}</strong>
                                <span class="item-id">{{ item.id }}</span>
                            </div>
                        </div>
                        <div class="item-actions">
                            <button class="icon-btn" :disabled="index === 0" title="Move up" @click="moveItem(item.id, 'up')">
                                <Icon name="tabler:chevron-up" />
                            </button>
                            <button class="icon-btn" :disabled="index === currentItems.length - 1" title="Move down" @click="moveItem(item.id, 'down')">
                                <Icon name="tabler:chevron-down" />
                            </button>
                            <button class="icon-btn edit" title="Edit" @click="startEdit(item)">
                                <Icon name="tabler:edit" />
                            </button>
                            <button class="icon-btn delete" title="Delete" @click="deleteItem(item.id)">
                                <Icon name="tabler:trash" />
                            </button>
                        </div>
                    </li>
                </ul>
            </section>

            <section v-if="editingItem" class="edit-panel">
                <AdminPortfolioForm 
                    :item="editingItem" 
                    :category="activeCategory" 
                    :image-folder="currentCategoryInfo.folder" 
                    :is-new="isAddingNew" 
                    @save="saveItem" 
                    @cancel="cancelEdit"
                    @images-uploaded="handleImagesUploaded"
                    @update:item="(item) => editingItem = item"
                />
            </section>

            <section v-if="editingItem" class="preview-panel">
                <h3>Live Preview</h3>
                <div class="preview-card-wrapper">
                    <PortfolioCard :item="editingItem" />
                </div>
            </section>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.admin-page {
    min-height: 100vh;
    background: var(--bg-color);
    color: var(--text-color);
    padding: $spacing-xl $spacing-lg;
}

.admin-header {
    margin-bottom: $spacing-xl;

    .header-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: $spacing-md;
        margin-bottom: $spacing-md;

        h1 {
            font-size: $font-size-title;
            font-weight: 900;
            margin: 0;
        }
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: $spacing-md;

        .user-avatar {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 2px solid var(--border-color);
        }

        .user-name {
            font-weight: 600;
            font-size: $font-size-small;
        }

        .sign-out-btn {
            @include button-tertiary;
            padding: $spacing-xs $spacing-sm;
            font-size: $font-size-small;
            display: flex;
            align-items: center;
            gap: $spacing-xs;
        }
    }

    .save-status {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: $spacing-md;
        padding: $spacing-sm $spacing-lg;
        border-radius: $radius-md;
        font-weight: 600;

        &.saving {
            background: oklch(70% 0.1 220 / 0.2);
            color: oklch(70% 0.1 220);
        }

        &.success {
            background: oklch(70% 0.15 145 / 0.2);
            color: oklch(70% 0.15 145);
        }

        &.error {
            background: oklch(65% 0.2 25 / 0.2);
            color: oklch(65% 0.2 25);
        }

        .pr-link {
            display: inline-flex;
            align-items: center;
            gap: $spacing-xs;
            color: inherit;
            text-decoration: underline;
        }

        .dismiss-btn {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: $spacing-xs;
            opacity: 0.7;

            &:hover {
                opacity: 1;
            }
        }
    }
}

// PR Modal styles
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: $spacing-lg;
}

.pr-modal {
    background: var(--sub-bg-color);
    border: 2px solid var(--border-color);
    border-radius: $radius-lg;
    padding: $spacing-xl;
    max-width: 500px;
    width: 100%;

    h2 {
        margin: 0 0 $spacing-sm;
        font-size: $font-size-body;
        font-weight: 700;
    }

    .modal-description {
        color: var(--text-color);
        opacity: 0.7;
        font-size: $font-size-small;
        margin-bottom: $spacing-lg;
    }

    .form-group {
        margin-bottom: $spacing-md;

        label {
            display: block;
            font-weight: 600;
            font-size: $font-size-small;
            margin-bottom: $spacing-xs;
        }

        input,
        textarea {
            width: 100%;
            padding: $spacing-sm;
            background: var(--bg-color);
            border: 2px solid var(--border-color);
            border-radius: $radius-md;
            color: var(--text-color);
            font-size: $font-size-small;

            &:focus {
                outline: none;
                border-color: var(--highlight-color);
            }
        }

        textarea {
            resize: vertical;
            min-height: 80px;
        }
    }

    .modal-actions {
        display: flex;
        gap: $spacing-md;
        justify-content: flex-end;
        margin-top: $spacing-lg;

        .cancel-btn {
            @include button-tertiary;
            padding: $spacing-sm $spacing-lg;
        }

        .submit-btn {
            @include button-primary;
            padding: $spacing-sm $spacing-lg;
            display: flex;
            align-items: center;
            gap: $spacing-sm;
        }
    }
}

.category-tabs {
    display: flex;
    gap: $spacing-sm;
    justify-content: center;
    margin-bottom: $spacing-xl;
    flex-wrap: wrap;

    .tab-btn {
        @include button-tertiary;
        padding: $spacing-sm $spacing-lg;

        &.active {
            background: var(--highlight-color);
            color: var(--bg-color);
            border-color: var(--highlight-color);
        }

        .count {
            background: var(--sub-bg-color);
            padding: $spacing-xs $spacing-sm;
            border-radius: $radius-sm;
            font-size: $font-size-small;
            margin-left: $spacing-sm;
        }

        &.active .count {
            background: var(--bg-color);
            color: var(--highlight-color);
        }
    }
}

.admin-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: $spacing-xl;
    max-width: 1600px;
    margin: 0 auto;

    @include respond-to($breakpoint-lg) {
        grid-template-columns: 400px 1fr;
        grid-template-rows: auto auto;
    }
}

.items-panel {
    @include card-base;
    padding: $spacing-lg;
    overflow: hidden;

    .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: $spacing-lg;
        gap: $spacing-md;

        h2 {
            font-size: $font-size-body;
            font-weight: 700;
        }

        .panel-actions {
            display: flex;
            align-items: center;
            gap: $spacing-sm;
        }

        .order-actions {
            display: flex;
            gap: $spacing-xs;
        }

        .confirm-btn {
            @include button-base;
            padding: $spacing-sm;
            background: oklch(70% 0.15 145);
            color: white;
            border: 2px solid oklch(70% 0.15 145);

            &:hover {
                background: oklch(60% 0.15 145);
            }
        }

        .cancel-order-btn {
            @include button-base;
            padding: $spacing-sm;
            background: oklch(65% 0.2 25);
            color: white;
            border: 2px solid oklch(65% 0.2 25);

            &:hover {
                background: oklch(55% 0.2 25);
            }
        }

        .add-btn {
            @include button-primary;
            padding: $spacing-sm $spacing-md;
        }
    }
}

.items-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    max-height: 600px;
    overflow-y: auto;
    @include custom-scrollbar;
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $spacing-sm;
    border-radius: $radius-md;
    background: var(--sub-bg-color);
    transition: all $transition-fast;

    &:hover {
        background: var(--border-color);
    }

    &.editing {
        border: 2px solid var(--highlight-color);
    }

    .item-info {
        display: flex;
        align-items: center;
        gap: $spacing-md;
        flex: 1;
        min-width: 0;

        .item-thumb {
            width: 60px;
            height: 40px;
            object-fit: cover;
            border-radius: $radius-sm;
            flex-shrink: 0;
        }

        .item-thumb-placeholder {
            @include flex-center;
            background: var(--border-color);
            color: var(--text-color);
            opacity: 0.5;
        }

        .item-details {
            display: flex;
            flex-direction: column;
            min-width: 0;

            strong {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                font-size: $font-size-small;
            }

            .item-id {
                font-size: $font-size-small;
                color: var(--text-color);
                opacity: 0.6;
            }
        }
    }

    .item-actions {
        display: flex;
        gap: $spacing-xs;
        flex-shrink: 0;
    }
}

.icon-btn {
    @include button-base;
    padding: $spacing-xs;
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-color);

    &:hover:not(:disabled) {
        background: var(--border-color);
    }

    &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    &.edit:hover {
        color: var(--highlight-color);
        border-color: var(--highlight-color);
    }

    &.delete:hover {
        color: oklch(65% 0.2 25);
        border-color: oklch(65% 0.2 25);
    }
}

.edit-panel {
    @include card-base;
    padding: $spacing-lg;

    @include respond-to($breakpoint-lg) {
        grid-row: 1 / 3;
        grid-column: 2;
    }
}

.preview-panel {
    @include card-base;
    padding: $spacing-lg;

    h3 {
        font-size: $font-size-body;
        font-weight: 700;
        margin-bottom: $spacing-md;
        text-align: center;
    }

    .preview-card-wrapper {
        max-width: 400px;
        margin: 0 auto;
    }
}
</style>
