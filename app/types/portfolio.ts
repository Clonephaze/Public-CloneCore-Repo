// types/portfolio.ts
export interface PortfolioItem {
    id: string
    title: string
    description: string
    externalLink: string
    images: string[]
    tags?: string[]
    badge?: string
}
