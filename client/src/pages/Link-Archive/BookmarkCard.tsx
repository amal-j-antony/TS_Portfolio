import {
    ArrowRight,
    ArrowUpRight,
    BadgeCheck,
    Copy,
    ExternalLink,
    GraduationCap,
    Heart,
    PenLine,
    Repeat2,
    Star,
    type LucideIcon,
} from "lucide-react"
import {
    type ArchiveCard,
    type ArticleCard,
    type BadgeTone,
    type LibraryCard,
    type PinnedCard,
    type ShaderCard,
    type TweetCard,
    type WhitepaperCard,
} from "./data"
import { cn } from "@/lib/utils"

const CARD =
    "group relative flex flex-col rounded-card p-space-lg shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1"

const badgeTones: Record<BadgeTone, string> = {
    neutral: "bg-surface-container-lowest text-primary",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary-container/30 text-secondary",
    tertiary: "bg-tertiary-container/30 text-tertiary",
}

function Badge({ icon: Icon, label, tone }: { icon: LucideIcon; label: string; tone: BadgeTone }) {
    return (
        <div
            className={cn(
                "inline-flex items-center gap-space-xs rounded-full px-2.5 py-1 font-display text-label-sm",
                badgeTones[tone],
            )}
        >
            <Icon className="size-3.5" />
            <span>{label}</span>
        </div>
    )
}

function CardTitle({ title }: { title: string }) {
    return (
        <h2 className="mb-space-sm font-display text-headline-sm tracking-tight text-on-surface transition-colors group-hover:text-primary">
            {title}
        </h2>
    )
}

function CardDescription({ text, className }: { text: string; className?: string }) {
    return (
        <p className={cn("text-body-md leading-relaxed text-on-surface-variant", className)}>
            {text}
        </p>
    )
}

function TagChip({ label }: { label: string }) {
    return (
        <span className="rounded-full bg-surface-container-lowest px-2 py-0.5 font-display text-label-sm text-on-surface-variant">
            {label}
        </span>
    )
}

function Meta({
    source,
    note,
    dot,
}: {
    source: string
    note?: string
    dot?: boolean
}) {
    return (
        <div className="flex items-center gap-space-xs font-display text-label-sm text-on-surface-variant">
            {dot && <span className="size-2 rounded-full bg-primary/70" />}
            <span className="font-medium text-on-surface">{source}</span>
            {note && (
                <>
                    <span className="text-outline-variant">•</span>
                    <span>{note}</span>
                </>
            )}
        </div>
    )
}

function ActionPill({
    label,
    icon: Icon,
    href,
}: {
    label: string
    icon: LucideIcon
    href: string
}) {
    return (
        <a
            href={href}
            className="inline-flex items-center gap-space-xs rounded-full bg-surface-container px-space-md py-1.5 font-display text-label-sm font-medium text-on-surface transition-all hover:bg-primary hover:text-on-primary"
        >
            <span>{label}</span>
            <Icon className="size-3.5" />
        </a>
    )
}

function CopyButton({ bare = false }: { bare?: boolean }) {
    return (
        <button
            type="button"
            title="Copy"
            className={cn(
                "transition-colors",
                bare
                    ? "text-on-surface-variant hover:text-on-surface"
                    : "flex size-8 items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface",
            )}
        >
            <Copy className="size-4" />
        </button>
    )
}

function Underglow() {
    return (
        <div className="pointer-events-none absolute inset-0 rounded-card bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    )
}

function ArticleCardView({ card }: { card: ArticleCard }) {
    return (
        <article className={cn(CARD, "bg-surface-container/60 hover:bg-surface-container-high/80")}>
            <Underglow />
            <header className="mb-space-md flex items-center justify-between gap-space-sm">
                <Badge icon={card.badgeIcon} label={card.badgeLabel} tone={card.badgeTone} />
                <button
                    type="button"
                    title="Favorite"
                    className="text-outline transition-colors hover:text-primary"
                >
                    <Star className="size-[18px] fill-current" />
                </button>
            </header>
            <CardTitle title={card.title} />
            <CardDescription text={card.description} className="mb-space-md line-clamp-3" />
            <div className="mb-space-md flex flex-wrap gap-space-xs">
                {card.tags.map((tag) => (
                    <TagChip key={tag} label={tag} />
                ))}
            </div>
            <footer className="mt-auto flex items-center justify-between pt-space-sm">
                <Meta source={card.source} note={card.time} dot />
                <div className="flex items-center gap-space-xs">
                    <CopyButton />
                    <a
                        href={card.href}
                        title="Open link"
                        className="flex size-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container transition-all group-hover:bg-primary group-hover:text-on-primary"
                    >
                        <ArrowUpRight className="size-4" />
                    </a>
                </div>
            </footer>
        </article>
    )
}

function WhitepaperCardView({ card }: { card: WhitepaperCard }) {
    return (
        <article className={cn(CARD, "bg-surface-container-low/70 hover:bg-surface-container/90")}>
            <Underglow />
            <header className="mb-space-md flex items-center justify-between gap-space-sm">
                <Badge icon={card.badgeIcon} label={card.badgeLabel} tone={card.badgeTone} />
                <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-display text-label-sm text-on-surface-variant">
                    {card.fileSize}
                </span>
            </header>
            <CardTitle title={card.title} />
            <CardDescription text={card.description} className="mb-space-md" />
            <div className="mb-space-md flex items-center justify-between rounded bg-surface-container-lowest/80 p-space-sm font-display text-label-sm">
                <div className="flex items-center gap-space-xs text-on-surface-variant">
                    <GraduationCap className="size-4 text-primary" />
                    <span>{card.institution}</span>
                </div>
                <span className="font-semibold text-primary">{card.citations}</span>
            </div>
            <footer className="mt-auto flex items-center justify-between">
                <span className="font-display text-label-sm text-outline">{card.sourceUrl}</span>
                <ActionPill label={card.actionLabel} icon={ExternalLink} href={card.href} />
            </footer>
        </article>
    )
}

function ShaderCardView({ card }: { card: ShaderCard }) {
    return (
        <article className={cn(CARD, "bg-surface-container/60 hover:bg-surface-container-high/80")}>
            <Underglow />
            <header className="mb-space-md flex items-center justify-between gap-space-sm">
                <Badge icon={card.badgeIcon} label={card.badgeLabel} tone={card.badgeTone} />
                <span className="font-display text-label-sm text-on-surface-variant">
                    {card.engine}
                </span>
            </header>
            <div className="relative mb-space-md flex h-36 w-full items-center justify-center overflow-hidden rounded-card bg-surface-container-lowest">
                <svg
                    className="absolute inset-0 h-full w-full opacity-60 mix-blend-screen"
                    preserveAspectRatio="none"
                    viewBox="0 0 400 160"
                >
                    <defs>
                        <linearGradient id="archiveShaderGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#cebdff" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#490081" stopOpacity="0.9" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0,80 C60,40 120,120 180,70 C240,20 300,110 400,60 L400,160 L0,160 Z"
                        fill="url(#archiveShaderGrad)"
                    />
                    <path
                        d="M0,100 C80,60 160,130 240,80 C320,30 360,110 400,90 L400,160 L0,160 Z"
                        fill="#62259b"
                        opacity="0.4"
                    />
                </svg>
                <div className="relative z-10 flex items-center gap-space-xs rounded-full bg-surface-dim/80 px-3 py-1 font-display text-label-sm text-on-surface backdrop-blur-md">
                    <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
                    <span>{card.bufferLabel}</span>
                </div>
            </div>
            <CardTitle title={card.title} />
            <CardDescription text={card.description} className="mb-space-md line-clamp-2" />
            <div className="mb-space-md flex flex-wrap gap-space-xs">
                {card.tags.map((tag) => (
                    <TagChip key={tag} label={tag} />
                ))}
            </div>
            <footer className="mt-auto flex items-center justify-between pt-space-xs">
                <span className="font-display text-label-sm font-medium text-on-surface-variant">
                    {card.source}
                </span>
                <ActionPill label={card.actionLabel} icon={ExternalLink} href={card.href} />
            </footer>
        </article>
    )
}

function PinnedCardView({ card }: { card: PinnedCard }) {
    return (
        <article className={cn(CARD, "bg-surface-container/70 hover:bg-surface-container-high/80")}>
            <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            <header className="mb-space-md flex items-center justify-between gap-space-sm">
                <Badge icon={card.badgeIcon} label={card.badgeLabel} tone={card.badgeTone} />
                <span className="font-display text-label-sm font-semibold uppercase tracking-wider text-tertiary">
                    {card.topRight}
                </span>
            </header>
            <CardTitle title={card.title} />
            <div className="mb-space-md rounded bg-surface-container-high/90 p-space-sm text-on-surface shadow-sm">
                <div className="mb-1 flex items-center gap-space-xs font-display text-label-sm font-semibold text-secondary">
                    <PenLine className="size-3.5" />
                    <span>{card.callout.title}</span>
                </div>
                <p className="text-body-sm leading-snug text-on-surface-variant">
                    &ldquo;{card.callout.body}&rdquo;
                </p>
            </div>
            <CardDescription text={card.description} className="mb-space-md" />
            <footer className="mt-auto flex items-center justify-between pt-space-xs">
                <Meta source={card.source} note={card.sourceNote} />
                <a
                    href={card.href}
                    className="inline-flex items-center gap-space-xs font-display text-label-md font-semibold text-primary hover:underline"
                >
                    <span>{card.actionLabel}</span>
                    <ArrowRight className="size-4" />
                </a>
            </footer>
        </article>
    )
}

function TweetCardView({ card }: { card: TweetCard }) {
    return (
        <article className={cn(CARD, "bg-surface-container-lowest/90 hover:bg-surface-container-low/90")}>
            <header className="mb-space-md flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                    <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary-container to-primary-container font-display text-label-md font-semibold text-on-primary shadow-sm">
                        {card.author.initials}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                            <span className="font-display text-label-md font-semibold text-on-surface">
                                {card.author.name}
                            </span>
                            {card.author.verified && (
                                <BadgeCheck className="size-3.5 fill-current text-primary" />
                            )}
                        </div>
                        <span className="font-display text-label-sm text-on-surface-variant">
                            {card.author.handle}
                        </span>
                    </div>
                </div>
                <div className="flex size-7 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                </div>
            </header>
            <div className="mb-space-md border-l-2 border-primary/30 py-1 pl-space-sm">
                <p className="text-body-md leading-relaxed text-on-surface">
                    &ldquo;{card.content}&rdquo;
                </p>
            </div>
            <footer className="mt-auto flex items-center justify-between pt-space-xs font-display text-label-sm text-on-surface-variant">
                <div className="flex items-center gap-space-md">
                    <span className="flex items-center gap-1 transition-colors hover:text-on-surface">
                        <Heart className="size-[15px]" />
                        {card.stats.likes}
                    </span>
                    <span className="flex items-center gap-1 transition-colors hover:text-on-surface">
                        <Repeat2 className="size-[15px]" />
                        {card.stats.reposts}
                    </span>
                </div>
                <a
                    href={card.href}
                    className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:text-primary-fixed"
                >
                    <span>Read on 𝕏</span>
                    <ArrowUpRight className="size-3.5" />
                </a>
            </footer>
        </article>
    )
}

function LibraryCardView({ card }: { card: LibraryCard }) {
    return (
        <article className={cn(CARD, "bg-surface-container/60 hover:bg-surface-container-high/80")}>
            <Underglow />
            <header className="mb-space-md flex items-center justify-between gap-space-sm">
                <Badge icon={card.badgeIcon} label={card.badgeLabel} tone={card.badgeTone} />
                <div className="flex items-center gap-1 font-display text-label-sm text-on-surface-variant">
                    <Star className="size-[15px] text-amber-300" />
                    <span className="font-semibold text-on-surface">{card.rating}</span>
                </div>
            </header>
            <CardTitle title={card.title} />
            <CardDescription text={card.description} className="mb-space-md" />
            <div className="mb-space-md flex items-center justify-between rounded bg-surface-container-lowest p-space-sm">
                <code className="truncate font-mono text-xs text-primary">{card.code}</code>
                <CopyButton bare />
            </div>
            <footer className="mt-auto flex items-center justify-between">
                <span className="font-display text-label-sm text-on-surface-variant">
                    {card.source}
                </span>
            </footer>
        </article>
    )
}

export default function BookmarkCard({ card }: { card: ArchiveCard }) {
    switch (card.variant) {
        case "article":
            return <ArticleCardView card={card} />
        case "whitepaper":
            return <WhitepaperCardView card={card} />
        case "shader":
            return <ShaderCardView card={card} />
        case "pinned":
            return <PinnedCardView card={card} />
        case "tweet":
            return <TweetCardView card={card} />
        case "library":
            return <LibraryCardView card={card} />
        default:
            return null
    }
}
