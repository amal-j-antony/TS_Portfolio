import { BookOpen, Newspaper, Pin, Shapes, Terminal } from "lucide-react"
import type { Resource } from "@/lib/api"
import type { ArchiveCard, BadgeTone } from "./data"

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null
}

function str(value: unknown, fallback = ""): string {
    return typeof value === "string" && value.length > 0 ? value : fallback
}

function formatRelative(value: string): string {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""

    const days = Math.floor((Date.now() - date.getTime()) / 86_400_000)
    if (days <= 0) return "today"
    if (days === 1) return "1 day ago"
    if (days < 7) return `${days} days ago`

    const weeks = Math.floor(days / 7)
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`
}

const typeBadge: Record<Resource["type"], { icon: typeof Newspaper; label: string; tone: BadgeTone }> = {
    article: { icon: Newspaper, label: "Article", tone: "neutral" },
    tweet: { icon: Terminal, label: "Thread", tone: "neutral" },
    tool: { icon: Shapes, label: "Dev Tool", tone: "tertiary" },
    paper: { icon: BookOpen, label: "Whitepaper", tone: "secondary" },
}

export function mapResourceToCard(resource: Resource): ArchiveCard {
    const meta = isRecord(resource.metadata) ? resource.metadata : {}
    const author = isRecord(meta.author) ? meta.author : {}
    const stats = isRecord(meta.stats) ? meta.stats : {}

    const tags = resource.tags.map((tag) => `#${tag.slug}`)
    const source = resource.sourceDomain ?? resource.url
    const href = resource.url
    const time = formatRelative(resource.publishedAt ?? resource.createdAt)
    const description = resource.excerpt ?? resource.curatorNote ?? ""
    const badge = typeBadge[resource.type]

    if (resource.type === "tweet") {
        return {
            id: String(resource.id),
            variant: "tweet",
            badgeIcon: badge.icon,
            badgeLabel: badge.label,
            badgeTone: badge.tone,
            title: resource.title,
            content: resource.excerpt ?? resource.title,
            author: {
                name: str(author.name, source),
                handle: str(author.handle, "@"),
                initials: str(author.initials, "𝕏"),
                verified: author.verified === true,
            },
            stats: { likes: str(stats.likes, "0"), reposts: str(stats.reposts, "0") },
            href,
        }
    }

    if (resource.type === "paper") {
        return {
            id: String(resource.id),
            variant: "whitepaper",
            badgeIcon: badge.icon,
            badgeLabel: badge.label,
            badgeTone: badge.tone,
            title: resource.title,
            description,
            fileSize: str(meta.fileSize, "PDF"),
            institution: str(meta.institution, source),
            citations: str(meta.citations, ""),
            sourceUrl: source,
            actionLabel: str(meta.actionLabel, "Read Paper"),
            href,
        }
    }

    if (resource.type === "tool") {
        return {
            id: String(resource.id),
            variant: "shader",
            badgeIcon: badge.icon,
            badgeLabel: badge.label,
            badgeTone: badge.tone,
            title: resource.title,
            description,
            engine: str(meta.engine, "Web"),
            bufferLabel: str(meta.bufferLabel, source),
            tags,
            source,
            actionLabel: str(meta.actionLabel, "Launch"),
            href,
        }
    }

    if (resource.pinned || resource.curatorNote) {
        return {
            id: String(resource.id),
            variant: "pinned",
            badgeIcon: Pin,
            badgeLabel: badge.label,
            badgeTone: "primary",
            title: resource.title,
            description,
            topRight: resource.pinned ? "Pinned" : "Featured",
            callout: {
                title: "Amal's Review",
                body: resource.curatorNote ?? resource.excerpt ?? "",
            },
            source,
            sourceNote: time,
            actionLabel: "Read Notes",
            href,
        }
    }

    return {
        id: String(resource.id),
        variant: "article",
        badgeIcon: badge.icon,
        badgeLabel: badge.label,
        badgeTone: badge.tone,
        title: resource.title,
        description,
        tags,
        source,
        time,
        href,
    }
}

export function toColumns(cards: ArchiveCard[], columnCount = 3): ArchiveCard[][] {
    const columns: ArchiveCard[][] = Array.from({ length: columnCount }, () => [])
    cards.forEach((card, index) => {
        columns[index % columnCount]?.push(card)
    })
    return columns
}
