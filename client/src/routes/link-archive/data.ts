import type { LucideIcon } from "lucide-react"

export type BadgeTone = "neutral" | "primary" | "secondary" | "tertiary"

interface BaseCard {
    id: string
    badgeIcon: LucideIcon
    badgeLabel: string
    badgeTone: BadgeTone
    title: string
    href: string
}

export interface ArticleCard extends BaseCard {
    variant: "article"
    description: string
    tags: string[]
    source: string
    time: string
}

export interface WhitepaperCard extends BaseCard {
    variant: "whitepaper"
    description: string
    fileSize: string
    institution: string
    citations: string
    sourceUrl: string
    actionLabel: string
}

export interface ShaderCard extends BaseCard {
    variant: "shader"
    description: string
    engine: string
    bufferLabel: string
    tags: string[]
    source: string
    actionLabel: string
}

export interface PinnedCard extends BaseCard {
    variant: "pinned"
    description: string
    topRight: string
    callout: { title: string; body: string }
    source: string
    sourceNote: string
    actionLabel: string
}

export interface TweetCard extends BaseCard {
    variant: "tweet"
    content: string
    author: { name: string; handle: string; initials: string; verified: boolean }
    stats: { likes: string; reposts: string }
}

export interface LibraryCard extends BaseCard {
    variant: "library"
    description: string
    rating: string
    code: string
    source: string
}

export type ArchiveCard =
    | ArticleCard
    | WhitepaperCard
    | ShaderCard
    | PinnedCard
    | TweetCard
    | LibraryCard

export interface StatItem {
    id: string
    label: string
    count: number
    active?: boolean
}

export const stats: StatItem[] = [
    { id: "all", label: "All", count: 128, active: true },
    { id: "articles", label: "Articles", count: 34 },
    { id: "threads", label: "Tweets & Threads", count: 52 },
    { id: "tools", label: "Dev Tools", count: 42 },
]

export const tags = [
    { id: "distributed-systems", label: "#distributed-systems", active: true },
    { id: "webgl", label: "#webgl" },
    { id: "react", label: "#react" },
    { id: "spring-physics", label: "#spring-physics" },
    { id: "performance", label: "#performance" },
]

export const archiveFooterLinks = [
    { label: "Overview", to: "/" },
    { label: "Collections", to: "#" },
    { label: "RSS Feed", to: "#" },
    { label: "About", to: "#" },
]
