import { useEffect, useMemo, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import type { Resource, ResourceListFilters } from "@/lib/api"
import { useBulkResources, useExportResources, useResourceStats, useResources, useTags } from "@/lib/resources"
import CurateStashPanel from "./components/CurateStashPanel"
import DashboardFooter from "./components/DashboardFooter"
import Pagination from "./components/Pagination"
import ResourceCard from "./components/ResourceCard"
import ResourceToolbar, {
    type BulkAction,
    type StatusFilter,
    type TypeFilter,
} from "./components/ResourceToolbar"
import TelemetryStrip from "./components/TelemetryStrip"

export default function Dashboard() {
    const [q, setQ] = useState("")
    const [debouncedQ, setDebouncedQ] = useState("")
    const [domain, setDomain] = useState("")
    const [debouncedDomain, setDebouncedDomain] = useState("")
    const [status, setStatus] = useState<StatusFilter>("all")
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [editingResource, setEditingResource] = useState<Resource | null>(null)
    const panelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timeout = window.setTimeout(() => setDebouncedQ(q.trim()), 300)
        return () => window.clearTimeout(timeout)
    }, [q])

    useEffect(() => {
        const timeout = window.setTimeout(() => setDebouncedDomain(domain.trim()), 300)
        return () => window.clearTimeout(timeout)
    }, [domain])

    const filters: ResourceListFilters = {
        page,
        perPage,
        sort: "newest",
        ...(debouncedQ ? { q: debouncedQ } : {}),
        ...(debouncedDomain ? { domain: debouncedDomain } : {}),
        ...(status === "all" ? {} : { status }),
        ...(typeFilter === "all" ? {} : { type: typeFilter }),
    }

    const resourcesQuery = useResources(filters)
    const statsQuery = useResourceStats()
    const tagsQuery = useTags()
    const bulkMutation = useBulkResources()
    const exportMutation = useExportResources()

    const suggestions = useMemo(
        () => (tagsQuery.data?.items ?? []).slice(0, 6).map((tag) => tag.slug),
        [tagsQuery.data],
    )

    const counts = {
        all: statsQuery.data?.total ?? 0,
        published: statsQuery.data?.published ?? 0,
        draft: statsQuery.data?.drafts ?? 0,
    }

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const handleBulk = (action: BulkAction) => {
        if (selectedIds.size === 0) return
        if (action === "delete" && !window.confirm(`Delete ${selectedIds.size} stash(es)?`)) return
        bulkMutation.mutate(
            { action, ids: Array.from(selectedIds) },
            { onSuccess: () => setSelectedIds(new Set()) },
        )
    }

    const handleExport = () => {
        exportMutation.mutate(undefined, {
            onSuccess: (data) => {
                const blob = new Blob([JSON.stringify(data.items, null, 2)], {
                    type: "application/json",
                })
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = "vault-resources.json"
                link.click()
                URL.revokeObjectURL(url)
            },
        })
    }

    const handleEdit = (resource: Resource) => {
        setEditingResource(resource)
        panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    const resources = resourcesQuery.data?.items ?? []

    return (
        <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-space-xl">
            <TelemetryStrip />

            <div className="grid grid-cols-1 gap-space-lg xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex flex-col gap-space-lg">
                    <ResourceToolbar
                        q={q}
                        onQChange={(value) => {
                            setQ(value)
                            setPage(1)
                        }}
                        domain={domain}
                        onDomainChange={(value) => {
                            setDomain(value)
                            setPage(1)
                        }}
                        status={status}
                        onStatusChange={(value) => {
                            setStatus(value)
                            setPage(1)
                        }}
                        typeFilter={typeFilter}
                        onTypeFilterChange={(value) => {
                            setTypeFilter(value)
                            setPage(1)
                        }}
                        counts={counts}
                        typeCounts={
                            statsQuery.data?.byType ?? {
                                article: 0,
                                tweet: 0,
                                tool: 0,
                                paper: 0,
                                video: 0,
                            }
                        }
                        selectedCount={selectedIds.size}
                        onBulk={handleBulk}
                        onExport={handleExport}
                        isExporting={exportMutation.isPending}
                    />

                    {resourcesQuery.isLoading && (
                        <div className="flex items-center justify-center gap-space-sm rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-space-xl font-display text-label-lg text-on-surface-variant">
                            <Loader2 className="size-5 animate-spin" />
                            Loading vault stashes…
                        </div>
                    )}

                    {resourcesQuery.isError && (
                        <div className="rounded-2xl border border-error/30 bg-error/5 p-space-lg font-display text-label-lg text-error">
                            Failed to load stash: {(resourcesQuery.error as Error).message}
                        </div>
                    )}

                    {!resourcesQuery.isLoading && !resourcesQuery.isError && resources.length === 0 && (
                        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-space-xl text-center font-display text-label-lg text-on-surface-variant">
                            No stashes found. Curate your first one →
                        </div>
                    )}

                    <div className="flex flex-col gap-space-md">
                        {resources.map((resource) => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                                selected={selectedIds.has(resource.id)}
                                onToggleSelect={toggleSelect}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>

                    {resources.length > 0 && (
                        <Pagination
                            page={page}
                            perPage={perPage}
                            total={resourcesQuery.data?.total ?? 0}
                            onPageChange={setPage}
                            onPerPageChange={(size) => {
                                setPerPage(size)
                                setPage(1)
                            }}
                        />
                    )}
                </div>

                <div ref={panelRef} className="xl:sticky xl:top-20 xl:self-start">
                    <CurateStashPanel
                        editingResource={editingResource}
                        suggestions={suggestions}
                        onSaved={() => setEditingResource(null)}
                    />
                </div>
            </div>

            <DashboardFooter />
        </div>
    )
}
