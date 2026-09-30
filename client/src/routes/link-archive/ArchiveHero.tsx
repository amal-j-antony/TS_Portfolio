import { stats } from "./data"
import { cn } from "@/lib/utils"

export default function ArchiveHero() {
    return (
        <div className="relative mx-auto flex max-w-3xl flex-col items-center pt-space-md text-center">
            <div className="pointer-events-none absolute -top-12 left-1/2 h-[180px] w-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

            <div className="mb-space-md inline-flex items-center gap-space-xs rounded-full bg-surface-container-high/80 px-space-md py-1 shadow-sm backdrop-blur-md">
                <span className="font-display text-label-sm uppercase tracking-wider text-primary">
                    ✦ Curated Archive
                </span>
                <span className="text-outline-variant">•</span>
                <span className="font-display text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Public Stash
                </span>
            </div>

            <h1 className="mb-space-sm font-display text-[36px] leading-[44px] tracking-[-0.02em] text-on-surface md:text-display">
                Bookmarks &amp; Curated Links
            </h1>

            <p className="mb-space-lg max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
                A high-signal digital cabinet of system design whitepapers, insightful
                engineering threads, and interactive developer artifacts.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-space-xs rounded-full bg-surface-container-lowest/80 p-1 shadow-md backdrop-blur-xl">
                {stats.map((stat) => (
                    <button
                        key={stat.id}
                        type="button"
                        className={cn(
                            "group flex items-center gap-space-xs rounded-full px-space-md py-1.5 transition-all",
                            stat.active
                                ? "bg-surface-container text-on-surface"
                                : "text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface",
                        )}
                    >
                        <span
                            className={cn(
                                "font-display text-label-sm uppercase tracking-wider",
                                stat.active ? "text-primary" : undefined,
                            )}
                        >
                            {stat.label}
                        </span>
                        <span
                            className={cn(
                                "rounded-full px-1.5 font-display text-label-sm",
                                stat.active
                                    ? "bg-primary/20 text-primary"
                                    : "bg-surface-container-high text-on-surface-variant",
                            )}
                        >
                            {stat.count}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
