import {
    BookOpen,
    Newspaper,
    Pin,
    Shapes,
    Terminal,
    type LucideIcon,
} from "lucide-react"

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

export const archiveCards: ArchiveCard[] = [
    {
        id: "distributed-sqlite",
        variant: "article",
        badgeIcon: Newspaper,
        badgeLabel: "Article • 6 min • System Design",
        badgeTone: "neutral",
        title: "How Distributed SQLite Systems like Turso and Litestream Work",
        description:
            "A deep dive into raft consensus, write-ahead logs, snapshots, and micro-second edge replication mechanisms across globally distributed clusters.",
        tags: ["#databases", "#sqlite", "#architecture"],
        source: "fly.io",
        time: "2d ago",
        href: "#",
    },
    {
        id: "extended-raft",
        variant: "whitepaper",
        badgeIcon: BookOpen,
        badgeLabel: "Whitepaper • 18 min read",
        badgeTone: "secondary",
        title: "In Search of an Understandable Consensus Algorithm (Extended Raft)",
        description:
            "Ongaro & Ousterhout's landmark Stanford thesis breaking down leader election, state machine log replication, and complete safety proofs in fault-tolerant clusters.",
        fileSize: "PDF 2.4MB",
        institution: "Stanford Computer Science",
        citations: "4,120 Citations",
        sourceUrl: "stanford.edu/raft.pdf",
        actionLabel: "Read Paper",
        href: "#",
    },
    {
        id: "shadertoy",
        variant: "shader",
        badgeIcon: Shapes,
        badgeLabel: "Dev Tool • Tagged #glsl",
        badgeTone: "tertiary",
        title: "ShaderToy GLSL Sandbox",
        description:
            "Browser-based sandbox for real-time fragment raymarching, Signed Distance Functions (SDF), and mathematical post-processing filters.",
        engine: "WebGL 2.0",
        bufferLabel: "Procedural Buffer A",
        tags: ["#webgl", "#shaders", "#math"],
        source: "shadertoy.com",
        actionLabel: "Launch Demo",
        href: "#",
    },
    {
        id: "micro-interactions",
        variant: "pinned",
        badgeIcon: Pin,
        badgeLabel: "Design Engineering • 4 min",
        badgeTone: "primary",
        title: "Crafting Micro-interactions with Framer Motion and Radix UI",
        description:
            "Techniques for eliminating layout thrash during complex modal mounts and orchestrating tactile spring-driven gestural dismissals.",
        topRight: "Pinned",
        callout: {
            title: "Amal's Review",
            body: "Check out the 200ms spring physics curves here for the portfolio redesign. The fluid scale-down dampening is exceptionally responsive.",
        },
        source: "emilkowal.ski",
        sourceNote: "UI Engineering",
        actionLabel: "Read Notes",
        href: "#",
    },
    {
        id: "rauch-tweet",
        variant: "tweet",
        badgeIcon: Terminal,
        badgeLabel: "Thread • Read on X",
        badgeTone: "neutral",
        title: "The web is moving towards instant-first architecture",
        content:
            "The web is moving towards instant-first architecture. Server Components aren't just for SSR, they change how we think about the boundary between client state and server cache.",
        author: { name: "Guillermo Rauch", handle: "@rauchg", initials: "GR", verified: true },
        stats: { likes: "1.2k", reposts: "248" },
        href: "#",
    },
    {
        id: "nuqs",
        variant: "library",
        badgeIcon: Terminal,
        badgeLabel: "Dev Tool • Open Source",
        badgeTone: "neutral",
        title: "Nuqs — Type-safe Search Params State Manager for React",
        description:
            "Parse URL query parameters directly into standard React state with zero-runtime schemas, Next.js App Router support, and optimistic updates.",
        rating: "4.8k",
        code: "npm i nuqs",
        source: "nuqs.47ng.com",
        href: "#",
    },
]

const cardById = Object.fromEntries(archiveCards.map((card) => [card.id, card])) as Record<
    string,
    ArchiveCard
>

export const archiveColumns: ArchiveCard[][] = [
    ["distributed-sqlite", "extended-raft"],
    ["micro-interactions", "rauch-tweet"],
    ["shadertoy", "nuqs"],
].map((column) =>
    column.map((id) => cardById[id]).filter((card): card is ArchiveCard => Boolean(card)),
)

export const archiveFooterLinks = [
    { label: "Overview", to: "/" },
    { label: "Collections", to: "#" },
    { label: "RSS Feed", to: "#" },
    { label: "About", to: "#" },
]
