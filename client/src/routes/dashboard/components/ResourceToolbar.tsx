import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components"
import { Download, Globe, ListFilter, SlidersHorizontal } from "lucide-react"
import type { ResourceStatus } from "@/lib/api"
import { cn } from "@/lib/utils"

export type StatusFilter = "all" | ResourceStatus
export type BulkAction = "publish" | "draft" | "delete"

interface ResourceToolbarProps {
    q: string
    onQChange: (value: string) => void
    domain: string
    onDomainChange: (value: string) => void
    status: StatusFilter
    onStatusChange: (value: StatusFilter) => void
    counts: { all: number; published: number; draft: number }
    selectedCount: number
    onBulk: (action: BulkAction) => void
    onExport: () => void
    isExporting: boolean
}

export default function ResourceToolbar({
    q,
    onQChange,
    domain,
    onDomainChange,
    status,
    onStatusChange,
    counts,
    selectedCount,
    onBulk,
    onExport,
    isExporting,
}: ResourceToolbarProps) {
    const pills: Array<{ value: StatusFilter; label: string; count: number }> = [
        { value: "all", label: "All", count: counts.all },
        { value: "published", label: "Published", count: counts.published },
        { value: "draft", label: "Drafts", count: counts.draft },
    ]

    return (
        <div className="flex flex-col gap-space-md rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-space-md backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-space-sm">
                <div className="relative min-w-[12rem] flex-1">
                    <ListFilter className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                    <input
                        type="search"
                        value={q}
                        onChange={(event) => onQChange(event.target.value)}
                        placeholder="Instant filter by title or excerpt"
                        className="w-full rounded-full bg-surface-container-lowest/80 py-2 pl-9 pr-4 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="relative w-44">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                    <input
                        type="text"
                        value={domain}
                        onChange={(event) => onDomainChange(event.target.value)}
                        placeholder="Domain (x.com)"
                        className="w-full rounded-full bg-surface-container-lowest/80 py-2 pl-9 pr-4 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <MenuTrigger>
                    <Button className="flex cursor-pointer items-center gap-space-xs rounded-full bg-surface-container px-space-md py-2 font-display text-label-md text-on-surface-variant outline-none transition-colors data-hovered:bg-surface-container-high data-focused:ring-2 data-focused:ring-primary/50">
                        <SlidersHorizontal className="size-4" />
                        Bulk Actions
                        {selectedCount > 0 && (
                            <span className="rounded-full bg-primary px-1.5 text-label-sm text-on-primary">
                                {selectedCount}
                            </span>
                        )}
                    </Button>
                    <Popover
                        placement="bottom end"
                        offset={8}
                        className="z-[60] min-w-[190px] rounded-xl border border-outline-variant/40 bg-surface-container/95 p-1 shadow-xl backdrop-blur-xl outline-none"
                    >
                        <Menu
                            className="outline-none"
                            onAction={(key) => onBulk(String(key) as BulkAction)}
                        >
                            <MenuItem
                                id="publish"
                                isDisabled={selectedCount === 0}
                                className="cursor-pointer rounded-lg px-space-md py-2 font-display text-label-sm text-on-surface outline-none data-focused:bg-primary/10 data-disabled:opacity-50"
                            >
                                Mark as Published
                            </MenuItem>
                            <MenuItem
                                id="draft"
                                isDisabled={selectedCount === 0}
                                className="cursor-pointer rounded-lg px-space-md py-2 font-display text-label-sm text-on-surface outline-none data-focused:bg-primary/10 data-disabled:opacity-50"
                            >
                                Move to Drafts
                            </MenuItem>
                            <MenuItem
                                id="delete"
                                isDisabled={selectedCount === 0}
                                className="cursor-pointer rounded-lg px-space-md py-2 font-display text-label-sm text-error outline-none data-focused:bg-error/10 data-disabled:opacity-50"
                            >
                                Remove Stashes
                            </MenuItem>
                        </Menu>
                    </Popover>
                </MenuTrigger>

                <button
                    type="button"
                    onClick={onExport}
                    disabled={isExporting}
                    className="flex items-center gap-space-xs rounded-full bg-surface-container px-space-md py-2 font-display text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high disabled:opacity-60"
                >
                    <Download className="size-4" />
                    {isExporting ? "Exporting…" : "Export"}
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-space-sm">
                {pills.map((pill) => (
                    <button
                        key={pill.value}
                        type="button"
                        onClick={() => onStatusChange(pill.value)}
                        className={cn(
                            "rounded-full px-space-md py-1 font-display text-label-sm transition-colors",
                            status === pill.value
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
                        )}
                    >
                        {pill.label} ({pill.count})
                    </button>
                ))}
            </div>
        </div>
    )
}
