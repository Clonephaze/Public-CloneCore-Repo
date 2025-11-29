<script setup lang="ts">
import type { PortfolioItem } from '~/types/portfolio'

interface Props {
    item: PortfolioItem
    category: 'addons' | 'artworks' | 'webProjects'
    imageFolder: string
    isNew: boolean
}

const props = defineProps<Props>()
interface UploadedFileData {
    path: string        // Final web path after PR merge
    previewUrl: string  // Data URL for immediate preview
    repoPath: string
    content: string
    encoding: 'base64'
}

const emit = defineEmits<{
    save: [item: PortfolioItem, uploadedFiles: UploadedFileData[]]
    cancel: [cleanup: { imageFolder: string; itemId: string; paths: string[] } | null]
    imagesUploaded: [paths: string[]]
    'update:item': [item: PortfolioItem]
}>()

const form = ref<PortfolioItem>(JSON.parse(JSON.stringify(props.item)))

// Track images uploaded during this session (for cleanup on cancel)
const sessionUploadedPaths = ref<string[]>([])
// Track uploaded file data (with base64) for PR creation
const sessionUploadedFiles = ref<UploadedFileData[]>([])
// Map preview URLs to final paths (for converting before save)
const previewToPathMap = ref<Map<string, string>>(new Map())

// Only reset form when switching to a different item (by ID), not on every prop change
watch(() => props.item.id, (newId, oldId) => {
    if (newId !== oldId) {
        form.value = JSON.parse(JSON.stringify(props.item))
        sessionUploadedPaths.value = [] // Reset tracked uploads for new item
        sessionUploadedFiles.value = []
        previewToPathMap.value.clear()
    }
})

// Emit form changes for live preview
watch(form, (newForm) => {
    emit('update:item', JSON.parse(JSON.stringify(newForm)))
}, { deep: true })

// Use a separate ref for tags input to avoid cursor issues
const tagsInput = ref(props.item.tags?.join(', ') || '')

// Sync tagsInput when switching items
watch(() => props.item.id, () => {
    tagsInput.value = props.item.tags?.join(', ') || ''
})

// Update form.tags when tagsInput changes (debounced effect)
watch(tagsInput, (val) => {
    form.value.tags = val.split(',').map(t => t.trim()).filter(t => t)
})

const badgeOptions = computed(() => {
    switch (props.category) {
        case 'addons':
            return ['Created', 'Maintained', 'Updated & Maintained']
        case 'artworks':
            return ['Animation', 'Render', 'Procedural', 'Stylized']
        case 'webProjects':
            return ['Created', 'Designed & Built']
        default:
            return []
    }
})

const isValid = computed(() => {
    return form.value.id.trim() !== '' &&
        form.value.title.trim() !== '' &&
        form.value.description.trim() !== '' &&
        form.value.externalLink.trim() !== '' &&
        form.value.images.length > 0
})

const generateId = () => {
    const id = form.value.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    form.value.id = id
}

const handleSubmit = () => {
    if (!isValid.value) return
    
    // Convert preview URLs back to final paths before saving
    const formToSave = JSON.parse(JSON.stringify(form.value)) as PortfolioItem
    formToSave.images = formToSave.images.map(img => {
        // If it's a data URL, convert it to the final path
        if (img.startsWith('data:')) {
            return previewToPathMap.value.get(img) || img
        }
        return img
    })
    
    emit('save', formToSave, sessionUploadedFiles.value)
}

const removeImage = (index: number) => {
    form.value.images?.splice(index, 1)
}

const moveImageToFirst = (index: number) => {
    if (index > 0 && form.value.images) {
        const [image] = form.value.images.splice(index, 1)
        if (image) {
            form.value.images.unshift(image)
        }
    }
}

// Get display path for an image (converts data URLs to final paths for display)
const getDisplayPath = (img: string): string => {
    if (img.startsWith('data:')) {
        return previewToPathMap.value.get(img) || 'Uploading...'
    }
    return img
}

const handleImagesUploaded = (data: { paths: string[]; previewUrls: string[]; files: UploadedFileData[] }) => {
    emit('imagesUploaded', data.paths)
    // Use preview URLs for immediate display in the form
    form.value.images = [...(form.value.images || []), ...data.previewUrls]
    // Track uploaded paths for potential cleanup on cancel
    sessionUploadedPaths.value = [...sessionUploadedPaths.value, ...data.files.map(f => f.path)]
    // Track file data with base64 for PR creation
    sessionUploadedFiles.value = [...sessionUploadedFiles.value, ...data.files]
    // Map preview URLs to final paths
    data.files.forEach(f => {
        previewToPathMap.value.set(f.previewUrl, f.path)
    })
}

const handleCancel = () => {
    // If this is a new item and we uploaded images, provide cleanup info
    if (props.isNew && sessionUploadedPaths.value.length > 0 && form.value.id) {
        emit('cancel', {
            imageFolder: props.imageFolder,
            itemId: form.value.id,
            paths: sessionUploadedPaths.value
        })
    } else {
        emit('cancel', null)
    }
    sessionUploadedPaths.value = []
    sessionUploadedFiles.value = []
    previewToPathMap.value.clear()
}
</script>

<template>
    <form class="portfolio-form" @submit.prevent="handleSubmit">
        <h3>{{ isNew ? 'Add New Item' : 'Edit Item' }}</h3>

        <div class="form-grid">
            <div class="form-group">
                <label for="item-id">ID <span class="required">*</span></label>
                <div class="input-with-action">
                    <input id="item-id" v-model="form.id" type="text" placeholder="unique-item-id" pattern="^[a-zA-Z0-9_-]+$" :disabled="!isNew" required>
                    <button v-if="isNew" type="button" class="generate-btn" title="Generate from title" @click="generateId">
                        <Icon name="tabler:wand" />
                    </button>
                </div>
                <small>Used for image folder naming. Letters, numbers, hyphens, underscores only.</small>
            </div>

            <div class="form-group">
                <label for="item-title">Title <span class="required">*</span></label>
                <input id="item-title" v-model="form.title" type="text" placeholder="Project Title" required>
            </div>

            <div class="form-group full-width">
                <label for="item-description">Description <span class="required">*</span></label>
                <textarea id="item-description" v-model="form.description" placeholder="Brief description of the project..." rows="3" required />
            </div>

            <div class="form-group full-width">
                <label for="item-link">External Link <span class="required">*</span></label>
                <input id="item-link" v-model="form.externalLink" type="url" placeholder="https://example.com/project" required>
            </div>

            <div class="form-group">
                <label for="item-tags">Tags</label>
                <input id="item-tags" v-model="tagsInput" type="text" placeholder="Tag1, Tag2, Tag3">
                <small>Comma-separated list of tags</small>
            </div>

            <div class="form-group">
                <label for="item-badge">Badge</label>
                <div class="badge-input">
                    <input id="item-badge" v-model="form.badge" type="text" placeholder="Created" list="badge-options">
                    <datalist id="badge-options">
                        <option v-for="opt in badgeOptions" :key="opt" :value="opt" />
                    </datalist>
                </div>
                <small>Displayed as a badge on the card</small>
            </div>

            <div class="form-group full-width">
                <label>Upload Images <span class="required">*</span></label>
                <small>First image will be used as thumbnail</small>
                <AdminImageUploader :category="category" :item-id="form.id" :image-folder="imageFolder" @uploaded="handleImagesUploaded" />
            </div>

            <div v-if="form.images && form.images.length > 0" class="form-group full-width">
                <label>Gallery Images</label>
                <ul class="images-list">
                    <li v-for="(img, index) in form.images" :key="img" class="image-item">
                        <img :src="img" :alt="`Image ${index + 1}`" class="image-preview">
                        <span class="image-path">{{ getDisplayPath(img) }}</span>
                        <span v-if="index === 0" class="thumbnail-badge">Thumbnail</span>
                        <div class="image-actions">
                            <button v-if="index !== 0" type="button" class="thumb-btn" title="Set as thumbnail (move to first)" @click="moveImageToFirst(index)">
                                <Icon name="tabler:photo" />
                            </button>
                            <button type="button" class="remove-btn" title="Remove from list" @click="removeImage(index)">
                                <Icon name="tabler:x" />
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="form-actions">
            <button type="button" class="cancel-btn" @click="handleCancel">
                Cancel
            </button>
            <button type="submit" class="save-btn" :disabled="!isValid">
                <Icon name="tabler:device-floppy" />
                {{ isNew ? 'Add Item' : 'Save Changes' }}
            </button>
        </div>
    </form>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.portfolio-form {
    h3 {
        font-size: $font-size-subtitle;
        font-weight: 700;
        margin-bottom: $spacing-lg;
        padding-bottom: $spacing-md;
        border-bottom: 2px solid var(--border-color);
    }
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $spacing-lg;

    @include respond-below($breakpoint-md) {
        grid-template-columns: 1fr;
    }
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    min-width: 0; // Prevent grid blowout
    overflow: hidden;

    &.full-width {
        grid-column: 1 / -1;
    }

    label {
        font-weight: 600;
        font-size: $font-size-body-sm;

        .required {
            color: oklch(65% 0.2 25);
        }
    }

    input,
    textarea {
        padding: $spacing-sm $spacing-md;
        border: 2px solid var(--border-color);
        border-radius: $radius-md;
        background: var(--sub-bg-color);
        color: var(--text-color);
        font-family: inherit;
        font-size: $font-size-body-sm;
        transition: border-color $transition-fast;

        &:focus {
            outline: none;
            border-color: var(--highlight-color);
        }

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        &::placeholder {
            color: var(--text-color);
            opacity: 0.4;
        }
    }

    textarea {
        resize: vertical;
        min-height: 80px;
    }

    small {
        font-size: $font-size-small;
        color: var(--text-color);
        opacity: 0.6;
    }
}

.input-with-action {
    display: flex;
    gap: $spacing-sm;

    input {
        flex: 1;
    }

    .generate-btn {
        @include button-tertiary;
        padding: $spacing-sm;
        flex-shrink: 0;
    }
}

.badge-input {
    position: relative;
    overflow: hidden;

    input {
        width: 100%;
        box-sizing: border-box;
    }
}

.images-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    max-height: 300px;
    overflow-y: auto;
    @include custom-scrollbar;
}

.image-item {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm;
    background: var(--sub-bg-color);
    border-radius: $radius-md;

    .image-preview {
        width: 60px;
        height: 40px;
        object-fit: cover;
        border-radius: $radius-sm;
        flex-shrink: 0;
    }

    .image-path {
        flex: 1;
        font-size: $font-size-small;
        word-break: break-all;
        opacity: 0.8;
    }

    .thumbnail-badge {
        font-size: $font-size-small;
        font-weight: 600;
        color: var(--bg-color);
        background: var(--highlight-color);
        padding: $spacing-xs $spacing-sm;
        border-radius: $radius-sm;
        flex-shrink: 0;
    }

    .image-actions {
        display: flex;
        gap: $spacing-xs;
        flex-shrink: 0;
    }

    .thumb-btn,
    .remove-btn {
        @include button-base;
        padding: $spacing-xs;
        background: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-color);

        &:hover {
            background: var(--border-color);
        }
    }

    .thumb-btn:hover {
        color: var(--highlight-color);
        border-color: var(--highlight-color);
    }

    .remove-btn:hover {
        color: oklch(65% 0.2 25);
        border-color: oklch(65% 0.2 25);
    }
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: $spacing-md;
    margin-top: $spacing-xl;
    padding-top: $spacing-lg;
    border-top: 2px solid var(--border-color);

    .cancel-btn {
        @include button-tertiary;
        padding: $spacing-sm $spacing-lg;
    }

    .save-btn {
        @include button-primary;
        padding: $spacing-sm $spacing-lg;

        &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    }
}
</style>
