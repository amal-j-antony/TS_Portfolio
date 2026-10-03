import { useState } from "react"
import { Loader2, Plus, Tag as TagIcon, Trash2 } from "lucide-react"
import { useCreateTag, useDeleteTag, useTags } from "@/lib/resources"

export default function Tags() {
    const [name, setName] = useState("")
    const tagsQuery = useTags()
    const createTag = useCreateTag()
    const deleteTag = useDeleteTag()

    const tags = tagsQuery.data?.items ?? []

    const handleCreate = () => {
        const value = name.trim()
        if (!value) return
        createTag.mutate(value, { onSuccess: () => setName("") })
    }

    return (
        <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-space-lg">
            <header className="flex flex-col gap-space-xs">
                <h1 className="font-display text-headline-lg font-semibold text-on-surface">
                    Categories & Tags
                </h1>
                <p className="font-display text-label-lg text-on-surface-variant">
                    The taxonomy used to organize vault stashes.
                </p>
            </header>

            <div className="flex flex-wrap items-center gap-space-sm rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-space-md backdrop-blur-md">
                <div className="relative min-w-[12rem] flex-1">
                    <TagIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault()
                                handleCreate()
                            }
                        }}
                        placeholder="New tag name"
                        className="w-full rounded-full bg-surface-container-lowest/80 py-2 pl-9 pr-4 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>
                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={createTag.isPending || !name.trim()}
                    className="flex items-center gap-space-xs rounded-full bg-primary px-space-md py-2 font-display text-label-md text-on-primary transition-colors hover:bg-primary-fixed disabled:opacity-60"
                >
                    <Plus className="size-4" />
                    Add Tag
                </button>
            </div>

            {createTag.isError && (
                <p role="alert" className="font-display text-label-sm text-error">
                    {createTag.error.message}
                </p>
            )}

            {tagsQuery.isLoading && (
                <div className="flex items-center justify-center gap-space-sm rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-space-xl font-display text-label-lg text-on-surface-variant">
                    <Loader2 className="size-5 animate-spin" />
                    Loading tags…
                </div>
            )}

            {!tagsQuery.isLoading && (
                <div className="flex flex-wrap gap-space-sm">
                    {tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="flex items-center gap-space-sm rounded-full border border-outline-variant/30 bg-surface-container-low/60 px-space-md py-1.5 font-display text-label-md text-on-surface backdrop-blur-md"
                        >
                            #{tag.slug}
                            <span className="text-label-sm text-outline">{tag.usageCount ?? 0}</span>
                            <button
                                type="button"
                                aria-label={`Delete ${tag.slug}`}
                                onClick={() => deleteTag.mutate(tag.id)}
                                className="text-on-surface-variant transition-colors hover:text-error"
                            >
                                <Trash2 className="size-3.5" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}
