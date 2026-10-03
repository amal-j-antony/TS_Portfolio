import { Archive, Globe, Hourglass, TrendingUp, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useResourceStats } from "@/lib/resources"

interface Metric {
    label: string
    value: string
    badge: string
    badgeClassName: string
    footer: string
    progress: number
    progressClassName: string
    icon: LucideIcon
    iconClassName: string
}

export default function TelemetryStrip() {
    const { data, isLoading } = useResourceStats()

    if (isLoading || !data) {
        return (
            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-32 animate-pulse rounded-xl bg-surface-container-low/70"
                    />
                ))}
            </div>
        )
    }

    const metrics: Metric[] = [
        {
            label: "Total Stashed Resources",
            value: String(data.total),
            badge: "+12 wk",
            badgeClassName: "bg-primary/15 text-primary",
            footer: "Sync Postgres",
            progress: 78,
            progressClassName: "bg-primary",
            icon: Archive,
            iconClassName: "text-primary",
        },
        {
            label: "Pending Drafts",
            value: String(data.drafts).padStart(2, "0"),
            badge: "Review Req",
            badgeClassName: "bg-secondary-container/40 text-secondary-fixed-dim",
            footer: "Needs categorizing",
            progress: data.total === 0 ? 0 : Math.round((data.drafts / data.total) * 100),
            progressClassName: "bg-secondary-fixed-dim",
            icon: Hourglass,
            iconClassName: "text-secondary",
        },
        {
            label: "Public Showcase Items",
            value: String(data.published),
            badge: "Live on Web",
            badgeClassName: "bg-surface-container-highest text-on-surface",
            footer: `${data.publishedPercent}% published`,
            progress: data.publishedPercent,
            progressClassName: "bg-tertiary",
            icon: Globe,
            iconClassName: "text-tertiary",
        },
        {
            label: "Vault CTR / Reads",
            value: formatCompact(data.reads),
            badge: "+18.4%",
            badgeClassName: "bg-primary/20 text-primary",
            footer: "Rolling 30d",
            progress: 64,
            progressClassName: "bg-primary",
            icon: TrendingUp,
            iconClassName: "text-primary-container",
        },
    ]

    return (
        <section className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <div
                    key={metric.label}
                    className="group relative rounded-xl bg-surface-container-low/70 p-space-md shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-surface-container/80"
                >
                    <div className="mb-space-xs flex items-center justify-between">
                        <span className="flex items-center gap-space-xs font-display text-label-md text-on-surface-variant">
                            <metric.icon className={cn("size-4", metric.iconClassName)} />
                            {metric.label}
                        </span>
                        <span
                            className={cn(
                                "rounded-full px-space-xs py-0.5 font-display text-label-sm",
                                metric.badgeClassName,
                            )}
                        >
                            {metric.badge}
                        </span>
                    </div>
                    <div className="mt-space-xs flex items-baseline justify-between">
                        <span className="font-display text-headline-lg font-semibold tracking-tight text-on-surface">
                            {metric.value}
                        </span>
                        <span className="font-display text-label-sm text-outline">{metric.footer}</span>
                    </div>
                    <div className="mt-space-sm h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
                        <div
                            className={cn("h-full rounded-full", metric.progressClassName)}
                            style={{ width: `${Math.min(100, metric.progress)}%` }}
                        />
                    </div>
                </div>
            ))}
        </section>
    )
}

function formatCompact(value: number): string {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`
    }
    return String(value)
}
