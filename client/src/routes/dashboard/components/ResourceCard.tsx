import { CalendarDays, ExternalLink, Eye, Pencil, Pin, Rocket, Trash2 } from "lucide-react"
import type { Resource } from "@/lib/api"
import { cn } from "@/lib/utils"
import { useDeleteResource, useUpdateResource } from "@/lib/resources"
import { resourceStatusMeta, resourceTypeMeta } from "../data"

interface ResourceCardProps {
    resource: Resource
    selected: boolean
    onToggleSelect: (id: number) => void
    onEdit: (resource: Resource) => void
}

export default function ResourceCard({ resource, selected, onToggleSelect, onEdit }: ResourceCardProps) {
    const updateResource = useUpdateResource()
    const deleteResource = useDeleteResource()

    const typeMeta = resourceTypeMeta[resource.type]
    const statusMeta = resourceStatusMeta[resource.status]
    const Icon = typeMeta.icon

    const togglePin = () => {
        updateResource.mutate({ id: resource.id, payload: { pinned: !resource.pinned } })
    }

    const publish = () => {
        updateResource.mutate({ id: resource.id, payload: { status: "published" } })
    }

    const remove = () => {
        if (window.confirm(`Delete "${resource.title}"?`)) {
            deleteResource.mutate(resource.id)
        }
    }

    return (
        <article className="group rounded-2xl border border-outline-variant/20 bg-surface-container-low/60 p-space-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/40 hover:bg-surface-container/70">
            <div className="flex items-start gap-space-md">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect(resource.id)}
                    aria-label={`Select ${resource.title}`}
                    className="mt-1 size-4 shrink-0 cursor-pointer rounded accent-primary focus:ring-0"
                />
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
                    <Icon className="size-5" />
                </span>

                <div className="flex min-w-0 flex-1 flex-col gap-space-xs">
                    <div className="flex flex-wrap items-center gap-space-xs">
                        <span className="rounded-full bg-surface-container-highest px-space-sm py-0.5 font-display text-label-sm text-on-surface-variant">
                            {typeMeta.label}
                        </span>
                        <span
                            className={cn(
                                "rounded-full px-space-sm py-0.5 font-display text-label-sm",
                                statusMeta.className,
                            )}
                        >
                            {statusMeta.label}
                        </span>
                        {resource.featured && (
                            <span className="rounded-full bg-primary/15 px-space-sm py-0.5 font-display text-label-sm text-primary">
                                Featured
                            </span>
                        )}
                        {resource.pinned && (
                            <span className="rounded-full bg-secondary-container/40 px-space-sm py-0.5 font-display text-label-sm text-secondary-fixed-dim">
                                Pinned
                            </span>
                        )}
                        <span className="truncate font-display text-label-sm text-outline">
                            {resource.sourceDomain || resource.url}
                        </span>
                    </div>

                    <h3 className="font-display text-headline-sm font-medium text-on-surface">
                        {resource.title}
                    </h3>

                    {resource.excerpt && (
                        <p className="font-body text-body-sm text-on-surface-variant">{resource.excerpt}</p>
                    )}

                    {resource.curatorNote && (
                        <p className="rounded-[1rem] bg-surface-container-lowest/80 px-space-md py-2 font-body text-body-sm text-on-surface-variant">
                            <span className="font-display text-label-sm text-primary">Amal Note: </span>
                            {resource.curatorNote}
                        </p>
                    )}

                    {resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-space-xs">
                            {resource.tags.map((tag) => (
                                <span key={tag.id} className="font-display text-label-sm text-primary">
                                    #{tag.slug}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-space-xs flex flex-wrap items-center justify-between gap-space-sm">
                        <div className="flex items-center gap-space-md font-display text-label-sm text-outline">
                            <span className="flex items-center gap-1">
                                <Eye className="size-3.5" />
                                {formatCompact(resource.reads)} reads
                            </span>
                            <span className="flex items-center gap-1">
                                <CalendarDays className="size-3.5" />
                                {formatDate(resource.publishedAt ?? resource.createdAt)}
                            </span>
                        </div>

                        <div className="flex items-center gap-space-xs">
                            {resource.status === "draft" && (
                                <button
                                    type="button"
                                    onClick={publish}
                                    className="flex items-center gap-space-xs rounded-full bg-primary/15 px-space-sm py-1 font-display text-label-sm text-primary transition-colors hover:bg-primary/25"
                                >
                                    <Rocket className="size-3.5" />
                                    Publish
                                </button>
                            )}
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Open resource"
                                className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                            >
                                <ExternalLink className="size-4" />
                            </a>
                            <button
                                type="button"
                                onClick={togglePin}
                                aria-label={resource.pinned ? "Unpin" : "Pin"}
                                className={cn(
                                    "rounded-full p-1.5 transition-colors hover:bg-surface-container",
                                    resource.pinned ? "text-primary" : "text-on-surface-variant hover:text-primary",
                                )}
                            >
                                <Pin className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => onEdit(resource)}
                                aria-label="Edit resource"
                                className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                            >
                                <Pencil className="size-4" />
                            </button>
                            <button
                                type="button"
                                onClick={remove}
                                aria-label="Delete resource"
                                className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}

function formatCompact(value: number): string {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
    return String(value)
}

function formatDate(value: string): string {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}
