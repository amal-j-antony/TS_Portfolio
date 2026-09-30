import { Link } from "react-router"
import { ArrowLeft, ChevronDown } from "lucide-react"
import AmbientBackdrop from "./AmbientBackdrop"
import ArchiveHero from "./ArchiveHero"
import QuickStashBar from "./QuickStashBar"
import FilterBar from "./FilterBar"
import BookmarkCard from "./BookmarkCard"
import ArchiveFooter from "./ArchiveFooter"
import { archiveCards, archiveColumns } from "./data"

export default function LinkArchive() {
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

                    <div className="grid grid-cols-1 items-start gap-space-lg md:grid-cols-2 lg:grid-cols-3">
                        {archiveColumns.map((column, index) => (
                            <div key={index} className="flex flex-col gap-space-lg">
                                {column.map((card) => (
                                    <BookmarkCard key={card.id} card={card} />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col items-center justify-center gap-space-sm pt-space-lg pb-space-xl">
                        <span className="font-display text-label-sm tracking-wide text-on-surface-variant">
                            Showing {archiveCards.length} of 128 stashed artifacts
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
