import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
    page: number
    perPage: number
    total: number
    onPageChange: (page: number) => void
    onPerPageChange: (perPage: number) => void
}

export default function Pagination({
    page,
    perPage,
    total,
    onPageChange,
    onPerPageChange,
}: PaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / perPage))
    const start = total === 0 ? 0 : (page - 1) * perPage + 1
    const end = Math.min(page * perPage, total)

    const pages = buildPageList(page, totalPages)

    return (
        <div className="flex flex-wrap items-center justify-between gap-space-md rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-space-md font-display text-label-sm text-on-surface-variant backdrop-blur-md">
            <span>
                Showing {start} - {end} of {total} stashes
            </span>

            <div className="flex items-center gap-space-sm">
                <label className="flex items-center gap-space-xs">
                    Per page:
                    <select
                        value={perPage}
                        onChange={(event) => onPerPageChange(Number(event.target.value))}
                        className="rounded-lg bg-surface-container-lowest px-space-sm py-1 text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                        {[10, 25, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </label>

                <button
                    type="button"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                    className="rounded-full p-1.5 transition-colors hover:bg-surface-container disabled:opacity-40"
                >
                    <ChevronLeft className="size-4" />
                </button>

                {pages.map((item, index) =>
                    item === "…" ? (
                        <span key={`ellipsis-${index}`} className="px-1">
                            …
                        </span>
                    ) : (
                        <button
                            key={item}
                            type="button"
                            onClick={() => onPageChange(item)}
                            className={cn(
                                "size-7 rounded-full transition-colors",
                                item === page
                                    ? "bg-primary text-on-primary"
                                    : "hover:bg-surface-container",
                            )}
                        >
                            {item}
                        </button>
                    ),
                )}

                <button
                    type="button"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    aria-label="Next page"
                    className="rounded-full p-1.5 transition-colors hover:bg-surface-container disabled:opacity-40"
                >
                    <ChevronRight className="size-4" />
                </button>
            </div>
        </div>
    )
}

function buildPageList(current: number, total: number): Array<number | "…"> {
    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1)
    }

    const pages = new Set<number>([1, total, current, current - 1, current + 1])
    const sorted = Array.from(pages)
        .filter((page) => page >= 1 && page <= total)
        .sort((a, b) => a - b)

    const result: Array<number | "…"> = []
    for (let index = 0; index < sorted.length; index += 1) {
        const pageNumber = sorted[index] as number
        if (index > 0 && pageNumber - (sorted[index - 1] as number) > 1) {
            result.push("…")
        }
        result.push(pageNumber)
    }
    return result
}
