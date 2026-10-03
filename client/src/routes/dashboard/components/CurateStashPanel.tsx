import { useEffect, useRef } from "react"
import { FileText, Link2, RotateCcw, Rocket } from "lucide-react"
import { useAppForm } from "@/components/form"
import type { Resource, ResourceStatus } from "@/lib/api"
import { useCreateResource, useUpdateResource } from "@/lib/resources"
import { resourceTypeOptions } from "../data"
import { curateSchema, type CurateFormValues } from "../schema"

const emptyValues: CurateFormValues = {
    title: "",
    url: "",
    sourceDomain: "",
    type: "article",
    excerpt: "",
    curatorNote: "",
    tags: [],
    featured: false,
    pinned: false,
    allowComments: false,
}

function toFormValues(resource: Resource): CurateFormValues {
    return {
        title: resource.title,
        url: resource.url,
        sourceDomain: resource.sourceDomain ?? "",
        type: resource.type,
        excerpt: resource.excerpt ?? "",
        curatorNote: resource.curatorNote ?? "",
        tags: resource.tags.map((tag) => tag.slug),
        featured: resource.featured,
        pinned: resource.pinned,
        allowComments: resource.allowComments,
    }
}

interface CurateStashPanelProps {
    editingResource: Resource | null
    suggestions: string[]
    onSaved: () => void
}

export default function CurateStashPanel({
    editingResource,
    suggestions,
    onSaved,
}: CurateStashPanelProps) {
    const intentRef = useRef<ResourceStatus>("draft")
    const createResource = useCreateResource()
    const updateResource = useUpdateResource()

    const form = useAppForm({
        defaultValues: emptyValues,
        validators: { onSubmit: curateSchema },
        onSubmit: async ({ value, formApi }) => {
            const payload = {
                ...value,
                status: intentRef.current,
                metadata: {},
            }

            if (editingResource) {
                await updateResource.mutateAsync({ id: editingResource.id, payload })
            } else {
                await createResource.mutateAsync(payload)
            }

            formApi.reset(emptyValues)
            intentRef.current = "draft"
            onSaved()
        },
    })

    useEffect(() => {
        form.reset(editingResource ? toFormValues(editingResource) : emptyValues)
    }, [editingResource, form])

    const isSaving = createResource.isPending || updateResource.isPending
    const mutationError = createResource.error ?? updateResource.error

    return (
        <section className="flex flex-col gap-space-lg rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-space-lg backdrop-blur-md">
            <header className="flex items-start justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                    <FileText className="size-5 text-primary" />
                    <div className="flex flex-col">
                        <h2 className="font-display text-headline-sm font-medium text-on-surface">
                            {editingResource ? "Edit Vault Stash" : "Curate New Vault Stash"}
                        </h2>
                        <span className="font-display text-label-sm text-on-surface-variant">
                            {editingResource ? "Update an existing stash" : "Direct publish into portfolio feed"}
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        form.reset(emptyValues)
                        onSaved()
                    }}
                    className="flex items-center gap-space-xs rounded-full px-space-sm py-1 font-display text-label-sm text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface"
                >
                    <RotateCcw className="size-3.5" />
                    Reset
                </button>
            </header>

            <form
                noValidate
                className="flex flex-col gap-space-lg"
                onSubmit={(event) => {
                    event.preventDefault()
                    void form.handleSubmit()
                }}
            >
                <div className="flex flex-col gap-space-xs">
                    <label htmlFor="title" className="font-display text-label-md text-on-surface-variant">
                        Resource Title <span className="text-error">Required</span>
                    </label>
                    <form.AppField
                        name="title"
                        children={(field) => (
                            <field.TextField placeholder="e.g. Building an In-memory Distributed Key-Value" />
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
                    <div className="flex flex-col gap-space-xs">
                        <span className="font-display text-label-md text-on-surface-variant">Target URL</span>
                        <form.AppField
                            name="url"
                            children={(field) => (
                                <field.TextField type="text" placeholder="https://…" icon={<Link2 className="size-4" />} />
                            )}
                        />
                    </div>
                    <div className="flex flex-col gap-space-xs">
                        <span className="font-display text-label-md text-on-surface-variant">Source Domain</span>
                        <form.AppField
                            name="sourceDomain"
                            children={(field) => <field.TextField placeholder="github.com, arxiv…" />}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-space-xs">
                    <span className="font-display text-label-md text-on-surface-variant">Resource Type</span>
                    <form.AppField
                        name="type"
                        children={(field) => <field.SegmentedField options={resourceTypeOptions} />}
                    />
                </div>

                <div className="flex flex-col gap-space-xs">
                    <span className="font-display text-label-md text-on-surface-variant">Excerpt</span>
                    <form.AppField
                        name="excerpt"
                        children={(field) => (
                            <field.TextAreaField rows={2} placeholder="Short summary shown in the feed" />
                        )}
                    />
                </div>

                <div className="flex flex-col gap-space-xs">
                    <span className="font-display text-label-md text-on-surface-variant">
                        Personal Curator Note / Why It Matters
                    </span>
                    <form.AppField
                        name="curatorNote"
                        children={(field) => (
                            <field.TextAreaField rows={3} placeholder="Why this resource is high signal…" />
                        )}
                    />
                </div>

                <div className="flex flex-col gap-space-xs">
                    <span className="font-display text-label-md text-on-surface-variant">Tags & Taxonomy</span>
                    <form.AppField
                        name="tags"
                        children={(field) => <field.TagInput suggestions={suggestions} />}
                    />
                </div>

                <div className="flex flex-col gap-space-md">
                    <form.AppField
                        name="featured"
                        children={(field) => (
                            <field.CheckboxField
                                label="Feature on Portfolio Grid"
                                description="Display high-prominence card on homepage"
                            />
                        )}
                    />
                    <form.AppField
                        name="pinned"
                        children={(field) => (
                            <field.CheckboxField
                                label="Pin to Top of Vault"
                                description="Force item into VIP pinned section"
                            />
                        )}
                    />
                    <form.AppField
                        name="allowComments"
                        children={(field) => (
                            <field.CheckboxField
                                label="Allow Public Comments"
                                description="Enable webmentions and discussion thread"
                            />
                        )}
                    />
                </div>

                {mutationError && (
                    <p
                        role="alert"
                        className="rounded-[1rem] bg-surface-container-lowest px-space-md py-2 font-display text-label-sm text-error"
                    >
                        {mutationError.message}
                    </p>
                )}

                <div className="flex flex-col gap-space-sm sm:flex-row">
                    <button
                        type="submit"
                        disabled={isSaving}
                        onClick={() => {
                            intentRef.current = "draft"
                        }}
                        className="flex flex-1 items-center justify-center gap-space-sm rounded-[1rem] bg-surface-container-high px-space-md py-3 font-display text-label-lg text-on-surface transition-colors hover:bg-surface-container-highest disabled:opacity-60"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        onClick={() => {
                            intentRef.current = "published"
                        }}
                        className="flex flex-1 items-center justify-center gap-space-sm rounded-[1rem] bg-primary px-space-md py-3 font-display text-label-lg font-medium text-on-primary shadow-lg shadow-on-tertiary-container/30 transition-colors hover:bg-primary-fixed disabled:opacity-60"
                    >
                        <Rocket className="size-[18px]" />
                        {isSaving ? "Saving…" : "Publish to Vault"}
                    </button>
                </div>
            </form>
        </section>
    )
}
