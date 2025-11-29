<script setup lang="ts">
interface UploadedFileData {
    path: string       // Web path (e.g., /images/addons/my-addon/image.png) - used after PR merge
    previewUrl: string // Data URL for immediate preview in browser
    repoPath: string   // Repo path for PR (e.g., public/images/addons/my-addon/image.png)
    content: string    // Base64 content for GitHub commit
    encoding: 'base64'
}

interface Props {
    category: 'addons' | 'artworks' | 'webProjects'
    itemId: string
    imageFolder: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
    uploaded: [data: { paths: string[]; previewUrls: string[]; files: UploadedFileData[] }]
}>()

const isDragging = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref('')
const uploadedFiles = ref<string[]>([])

const targetFolder = computed(() => {
    if (!props.itemId) return `images/${props.imageFolder}/[set item ID first]`
    return `images/${props.imageFolder}/${props.itemId}`
})

// Convert File to base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            // Remove data URL prefix to get pure base64
            const base64 = result.split(',')[1] || ''
            resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

// Convert File to data URL for preview
const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = true
}

const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = false
}

const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    isDragging.value = false

    if (!props.itemId) {
        uploadError.value = 'Please set an Item ID first before uploading images.'
        return
    }

    const files = e.dataTransfer?.files
    if (files && files.length > 0) {
        await uploadFiles(Array.from(files))
    }
}

const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = async (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files.length > 0) {
        await uploadFiles(Array.from(target.files))
        target.value = ''
    }
}

const triggerFileSelect = () => {
    fileInput.value?.click()
}

const uploadFiles = async (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'))

    if (imageFiles.length === 0) {
        uploadError.value = 'No valid image files selected. Please select PNG, JPG, WEBP, or GIF files.'
        return
    }

    isUploading.value = true
    uploadError.value = ''
    uploadProgress.value = 0
    uploadedFiles.value = []

    try {
        // Process files client-side for immediate preview
        const processedFiles: UploadedFileData[] = await Promise.all(
            imageFiles.map(async (file) => {
                const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
                const webPath = `/images/${props.imageFolder}/${props.itemId}/${safeName}`
                const repoPath = `public${webPath}`
                
                const [base64Content, dataUrl] = await Promise.all([
                    fileToBase64(file),
                    fileToDataUrl(file)
                ])
                
                return {
                    path: webPath,
                    previewUrl: dataUrl,  // Data URL works immediately for preview
                    repoPath,
                    content: base64Content,
                    encoding: 'base64' as const
                }
            })
        )

        uploadProgress.value = 50

        // In development, also upload to server for disk storage
        const isDev = import.meta.dev
        if (isDev) {
            const formData = new FormData()
            formData.append('itemId', props.itemId)
            formData.append('imageFolder', props.imageFolder)
            imageFiles.forEach(file => formData.append('files', file))
            
            await $fetch('/api/admin/upload', {
                method: 'POST',
                body: formData
            })
        }

        uploadedFiles.value = processedFiles.map(f => f.path)
        const previewUrls = processedFiles.map(f => f.previewUrl)
        
        emit('uploaded', { 
            paths: previewUrls,  // Use data URLs for immediate preview
            previewUrls,
            files: processedFiles 
        })
        uploadProgress.value = 100

        setTimeout(() => {
            uploadProgress.value = 0
            uploadedFiles.value = []
        }, 3000)

    } catch (error: unknown) {
        console.error('Upload error:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        uploadError.value = `Failed to upload images: ${errorMessage}`
    } finally {
        isUploading.value = false
    }
}
</script>

<template>
    <div class="image-uploader">
        <div class="drop-zone" :class="{
            dragging: isDragging,
            uploading: isUploading,
            disabled: !itemId
        }" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop" @click="triggerFileSelect">
            <input ref="fileInput" type="file" accept="image/*" multiple hidden :disabled="!itemId" @change="handleFileSelect">

            <div v-if="isUploading" class="upload-progress">
                <Icon name="tabler:loader-2" class="spinner" />
                <span>Uploading... {{ uploadProgress }}%</span>
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: `${uploadProgress}%` }" />
                </div>
            </div>

            <div v-else-if="uploadedFiles.length > 0" class="upload-success">
                <Icon name="tabler:check" />
                <span>{{ uploadedFiles.length }} image(s) uploaded!</span>
            </div>

            <div v-else class="drop-content">
                <Icon name="tabler:cloud-upload" class="upload-icon" />
                <p class="drop-text">
                    <strong>Drag & drop images here</strong>
                    <span>or click to browse</span>
                </p>
                <p class="drop-hint">
                    PNG, JPG, WEBP, GIF supported
                </p>
            </div>
        </div>

        <div class="target-info">
            <Icon name="tabler:folder" />
            <span>Target: <code>public/{{ targetFolder }}</code></span>
        </div>

        <div v-if="uploadError" class="upload-error">
            <Icon name="tabler:alert-circle" />
            {{ uploadError }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
@use "~/assets/styles/mixins" as *;

.image-uploader {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
}

.drop-zone {
    border: 2px dashed var(--border-color);
    border-radius: $radius-lg;
    padding: $spacing-xl;
    text-align: center;
    cursor: pointer;
    transition: all $transition-base;
    background: var(--sub-bg-color);

    &:hover:not(.disabled):not(.uploading) {
        border-color: var(--highlight-color);
        background: var(--highlight-color);
        background: oklch(from var(--highlight-color) l c h / 0.1);
    }

    &.dragging {
        border-color: var(--highlight-color);
        background: oklch(from var(--highlight-color) l c h / 0.15);
        transform: scale(1.02);
    }

    &.uploading {
        cursor: wait;
        border-style: solid;
    }

    &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.drop-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;

    .upload-icon {
        font-size: 3rem;
        color: var(--highlight-color);
    }

    .drop-text {
        display: flex;
        flex-direction: column;
        margin: 0;

        strong {
            font-size: $font-size-body;
        }

        span {
            font-size: $font-size-small;
            opacity: 0.7;
        }
    }

    .drop-hint {
        font-size: $font-size-small;
        opacity: 0.5;
        margin: 0;
    }
}

.upload-progress {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;

    .spinner {
        font-size: 2rem;
        color: var(--highlight-color);
        animation: spin 1s linear infinite;
    }

    .progress-bar {
        width: 100%;
        max-width: 200px;
        height: 6px;
        background: var(--border-color);
        border-radius: 3px;
        overflow: hidden;

        .progress-fill {
            height: 100%;
            background: var(--highlight-color);
            transition: width $transition-fast;
        }
    }
}

.upload-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $spacing-sm;
    color: oklch(70% 0.15 145);

    svg {
        font-size: 2rem;
    }
}

.target-info {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    font-size: $font-size-small;
    color: var(--text-color);
    opacity: 0.7;

    code {
        background: var(--sub-bg-color);
        padding: $spacing-xs $spacing-sm;
        border-radius: $radius-sm;
        font-family: monospace;
    }
}

.upload-error {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-sm $spacing-md;
    background: oklch(65% 0.2 25 / 0.15);
    color: oklch(65% 0.2 25);
    border-radius: $radius-md;
    font-size: $font-size-small;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
