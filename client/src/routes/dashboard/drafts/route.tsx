import { Loader2, Rocket, Trash2 } from "lucide-react"
import { useDeleteResource, useResources, useUpdateResource } from "@/lib/resources"
import { resourceTypeMeta } from "../data"

export default function Drafts() {
    const draftsQuery = useResources({ status: "draft", perPage: 50, sort: "newest" })
    const updateResource = useUpdateResource()
    const deleteResource = useDeleteResource()

    const drafts = draftsQuery.data?.items ?? []

    return (
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-space-lg">
            <header className="flex flex-col gap-space-xs">
                <h1 className="font-display text-headline-lg font-semibold text-on-surface">Drafts / Inbox</h1>
                <p className="font-display text-label-lg text-on-surface-variant">
                    Unpublished stashes awaiting review and categorization.
                </p>
            </header>

            {draftsQuery.isLoading && (
                <div className="flex items-center justify-center gap-space-sm rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-space-xl font-display text-label-lg text-on-surface-variant">
                    <Loader2 className="size-5 animate-spin" />
                    Loading drafts…
                </div>
            )}

            {!draftsQuery.isLoading && drafts.length === 0 && (
                <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-space-xl text-center font-display text-label-lg text-on-surface-variant">
                    Inbox zero. No drafts to review.
                </div>
            )}

            <div className="flex flex-col gap-space-sm">
                {drafts.map((draft) => {
                    const TypeIcon = resourceTypeMeta[draft.type].icon
                    return (
                        <div
                            key={draft.id}
                            className="flex items-center justify-between gap-space-md rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-space-md backdrop-blur-md"
                        >
                            <div className="flex min-w-0 items-center gap-space-md">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
                                    <TypeIcon className="size-4" />
                                </span>
                                <div className="flex min-w-0 flex-col">
                                    <span className="truncate font-display text-label-lg text-on-surface">
                                        {draft.title}
                                    </span>
                                    <span className="truncate font-display text-label-sm text-outline">
                                        {draft.sourceDomain ?? draft.url}
                                    </span>
                                </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-space-xs">
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateResource.mutate({
                                            id: draft.id,
                                            payload: { status: "published" },
                                        })
                                    }
                                    className="flex items-center gap-space-xs rounded-full bg-primary/15 px-space-sm py-1 font-display text-label-sm text-primary transition-colors hover:bg-primary/25"
                                >
                                    <Rocket className="size-3.5" />
                                    Publish
                                </button>
                                <button
                                    type="button"
                                    aria-label="Delete draft"
                                    onClick={() => {
                                        if (window.confirm(`Delete "${draft.title}"?`)) {
                                            deleteResource.mutate(draft.id)
                                        }
                                    }}
                                    className="rounded-full p-1.5 text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
                                >
                                    <Trash2 className="size-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
