import { useMemo } from "react"
import { Link } from "react-router"
import { ArrowLeft, ChevronDown } from "lucide-react"
import { usePublicResources } from "@/lib/resources"
import AmbientBackdrop from "./AmbientBackdrop"
import ArchiveHero from "./ArchiveHero"
import QuickStashBar from "./QuickStashBar"
import FilterBar from "./FilterBar"
import BookmarkCard from "./BookmarkCard"
import ArchiveFooter from "./ArchiveFooter"
import { mapResourceToCard, toColumns } from "./mapResource"

export default function LinkArchive() {
    const { data, isLoading, isError } = usePublicResources()
    const items = data?.items

    const columns = useMemo(
        () => toColumns((items ?? []).map(mapResourceToCard)),
        [items],
    )

    return (
        <>
            <AmbientBackdrop />
            <div className="relative z-10 flex min-h-screen flex-col">
                <div className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-space-xl px-gutter py-space-xl">
                    <Link
                        to="/"
                        className="inline-flex w-fit items-center gap-space-xs font-display text-label-lg text-on-surface-variant transition-colors hover:text-primary"
                    >
                        <ArrowLeft className="size-4" />
                        Link Archive
                    </Link>

                    <ArchiveHero />

                    <div className="flex w-full flex-col gap-space-md">
                        <QuickStashBar />
                        <FilterBar />
                    </div>

                    {isLoading && (
                        <div className="rounded-card border border-outline-variant/20 bg-surface-container-low/40 p-space-xl text-center font-display text-label-lg text-on-surface-variant">
                            Loading stashed artifacts…
                        </div>
                    )}

                    {isError && (
                        <div className="rounded-card border border-error/30 bg-error/5 p-space-xl text-center font-display text-label-lg text-error">
                            Could not load the archive.
                        </div>
                    )}

                    {!isLoading && !isError && (items?.length ?? 0) === 0 && (
                        <div className="rounded-card border border-outline-variant/20 bg-surface-container-low/40 p-space-xl text-center font-display text-label-lg text-on-surface-variant">
                            No published stashes yet.
                        </div>
                    )}

                    {(items?.length ?? 0) > 0 && (
                        <div className="grid grid-cols-1 items-start gap-space-lg md:grid-cols-2 lg:grid-cols-3">
                            {columns.map((column, index) => (
                                <div key={index} className="flex flex-col gap-space-lg">
                                    {column.map((card) => (
                                        <BookmarkCard key={card.id} card={card} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex flex-col items-center justify-center gap-space-sm pt-space-lg pb-space-xl">
                        <span className="font-display text-label-sm tracking-wide text-on-surface-variant">
                            Showing {items?.length ?? 0} published stashes
                        </span>
                        <button
                            type="button"
                            className="group flex items-center gap-space-xs rounded-full bg-surface-container-high/90 px-space-xl py-3 font-display text-label-md font-semibold text-on-surface shadow-md backdrop-blur-xl transition-all duration-300 hover:bg-primary hover:text-on-primary"
                        >
                            <span>Load More Bookmarks</span>
                            <ChevronDown className="size-[18px] transition-transform group-hover:translate-y-0.5" />
                        </button>
                    </div>
                </div>

                <ArchiveFooter />
            </div>
        </>
    )
}
