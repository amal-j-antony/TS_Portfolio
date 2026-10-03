import { Eye, FileText, Globe, Inbox, Package } from "lucide-react"
import { useResources, useResourceStats } from "@/lib/resources"
import { resourceTypeMeta } from "../data"
import type { ResourceType } from "@/lib/api"

export default function Analytics() {
    const statsQuery = useResourceStats()
    const resourcesQuery = useResources({ perPage: 100, sort: "reads" })
    const stats = statsQuery.data
    const byType = stats?.byType

    const topResources = (resourcesQuery.data?.items ?? []).slice(0, 5)

    return (
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-space-xl">
            <header className="flex flex-col gap-space-xs">
                <h1 className="font-display text-headline-lg font-semibold text-on-surface">Analytics</h1>
                <p className="font-display text-label-lg text-on-surface-variant">
                    Aggregate signal across the vault. Derived from your resources.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Total Stashes" value={String(stats?.total ?? 0)} icon={<Package className="size-5 text-primary" />} />
                <MetricCard label="Published" value={String(stats?.published ?? 0)} icon={<Globe className="size-5 text-tertiary" />} />
                <MetricCard label="Drafts" value={String(stats?.drafts ?? 0)} icon={<Inbox className="size-5 text-secondary" />} />
                <MetricCard label="Total Reads" value={String(stats?.reads ?? 0)} icon={<Eye className="size-5 text-primary" />} />
            </div>

            <section className="flex flex-col gap-space-md rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-space-lg backdrop-blur-md">
                <h2 className="font-display text-headline-sm font-medium text-on-surface">Content Mix</h2>
                {(Object.keys(resourceTypeMeta) as ResourceType[]).map((type) => {
                    const count = byType?.[type] ?? 0
                    const total = stats?.total ?? 0
                    const percent = total === 0 ? 0 : Math.round((count / total) * 100)
                    return (
                        <div key={type} className="flex items-center gap-space-md">
                            <span className="w-32 shrink-0 font-display text-label-md text-on-surface-variant">
                                {resourceTypeMeta[type].label}
                            </span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
                                <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                            </div>
                            <span className="w-10 text-right font-display text-label-sm text-outline">{count}</span>
                        </div>
                    )
                })}
            </section>

            <section className="flex flex-col gap-space-md rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-space-lg backdrop-blur-md">
                <h2 className="font-display text-headline-sm font-medium text-on-surface">Most Read</h2>
                {topResources.length === 0 ? (
                    <p className="font-display text-label-lg text-on-surface-variant">No data yet.</p>
                ) : (
                    topResources.map((resource) => (
                        <div
                            key={resource.id}
                            className="flex items-center justify-between gap-space-md border-b border-outline-variant/10 pb-space-sm last:border-none last:pb-0"
                        >
                            <span className="flex items-center gap-space-sm truncate font-display text-label-lg text-on-surface">
                                <FileText className="size-4 text-on-surface-variant" />
                                {resource.title}
                            </span>
                            <span className="shrink-0 font-display text-label-sm text-outline">
                                {resource.reads} reads
                            </span>
                        </div>
                    ))
                )}
            </section>
        </div>
    )
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-surface-container-low/70 p-space-md backdrop-blur-md">
            <div className="flex flex-col gap-space-xs">
                <span className="font-display text-label-md text-on-surface-variant">{label}</span>
                <span className="font-display text-headline-md font-semibold text-on-surface">{value}</span>
            </div>
            {icon}
        </div>
    )
}
