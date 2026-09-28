import { useState } from "react"
import { ChevronDown, LayoutGrid, Rows3 } from "lucide-react"
import { tags } from "./data"
import { cn } from "@/lib/utils"

type ViewMode = "grid" | "stream"

export default function FilterBar() {
    const [activeTag, setActiveTag] = useState(
        tags.find((tag) => tag.active)?.id ?? tags[0]?.id,
    )
    const [view, setView] = useState<ViewMode>("grid")

    return (
        <div className="flex flex-col items-center justify-between gap-space-md pt-space-xs md:flex-row">
            <div className="flex flex-wrap items-center gap-space-xs">
                <span className="mr-space-xs font-display text-label-sm uppercase text-outline-variant">
                    Tags:
                </span>
                {tags.map((tag) => {
                    const isActive = tag.id === activeTag
                    return (
                        <button
                            key={tag.id}
                            type="button"
                            onClick={() => setActiveTag(tag.id)}
                            className={cn(
                                "rounded-full px-3 py-1 font-display text-label-sm transition-colors",
                                isActive
                                    ? "bg-surface-container text-on-surface"
                                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                            )}
                        >
                            {tag.label}
                        </button>
                    )
                })}
            </div>

            <div className="ml-auto flex items-center gap-space-sm">
                <div className="flex items-center gap-space-xs rounded-full bg-surface-container-low p-1">
                    <button
                        type="button"
                        title="Masonry Grid View"
                        onClick={() => setView("grid")}
                        className={cn(
                            "rounded-full p-1.5 transition-colors",
                            view === "grid"
                                ? "bg-surface-container text-on-surface"
                                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                        )}
                    >
                        <LayoutGrid className="block size-[18px]" />
                    </button>
                    <button
                        type="button"
                        title="Stream View"
                        onClick={() => setView("stream")}
                        className={cn(
                            "rounded-full p-1.5 transition-colors",
                            view === "stream"
                                ? "bg-surface-container text-on-surface"
                                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                        )}
                    >
                        <Rows3 className="block size-[18px]" />
                    </button>
                </div>

                <button
                    type="button"
                    className="flex items-center gap-space-xs rounded-full bg-surface-container-low px-space-md py-1.5 font-display text-label-md text-on-surface-variant"
                >
                    <span>Sort:</span>
                    <span className="font-medium text-on-surface">Most Recent</span>
                    <ChevronDown className="size-4" />
                </button>
            </div>
        </div>
    )
}
