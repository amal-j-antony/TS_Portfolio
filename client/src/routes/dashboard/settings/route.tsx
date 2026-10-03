import { useState } from "react"
import { Loader2, Save } from "lucide-react"
import type { DashboardSettings } from "@/lib/api"
import { useSettings, useUpdateSettings } from "@/lib/resources"

const fallback: DashboardSettings = {
    portfolioGrid: true,
    allowPublicComments: false,
    siteTitle: "Amal.j",
    siteDescription: "Full Stack Developer",
}

export default function Settings() {
    const settingsQuery = useSettings()
    const updateSettings = useUpdateSettings()
    const [draft, setDraft] = useState<DashboardSettings | null>(null)
    const [saved, setSaved] = useState(false)

    const settings = draft ?? settingsQuery.data?.settings ?? fallback

    const handleSave = () => {
        setSaved(false)
        updateSettings.mutate(settings, { onSuccess: () => setSaved(true) })
    }

    if (settingsQuery.isLoading) {
        return (
            <div className="flex items-center justify-center gap-space-sm rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-space-xl font-display text-label-lg text-on-surface-variant">
                <Loader2 className="size-5 animate-spin" />
                Loading settings…
            </div>
        )
    }

    return (
        <div className="mx-auto flex w-full max-w-[720px] flex-col gap-space-lg">
            <header className="flex flex-col gap-space-xs">
                <h1 className="font-display text-headline-lg font-semibold text-on-surface">Settings</h1>
                <p className="font-display text-label-lg text-on-surface-variant">
                    Vault and public showcase preferences.
                </p>
            </header>

            <section className="flex flex-col gap-space-lg rounded-2xl border border-outline-variant/20 bg-surface-container-low/50 p-space-lg backdrop-blur-md">
                <div className="flex flex-col gap-space-xs">
                    <label htmlFor="siteTitle" className="font-display text-label-md text-on-surface-variant">
                        Site Title
                    </label>
                    <input
                        id="siteTitle"
                        value={settings.siteTitle}
                        onChange={(event) => setDraft({ ...settings, siteTitle: event.target.value })}
                        className="rounded-[1rem] bg-surface-container-lowest px-space-md py-2.5 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <div className="flex flex-col gap-space-xs">
                    <label htmlFor="siteDescription" className="font-display text-label-md text-on-surface-variant">
                        Site Description
                    </label>
                    <input
                        id="siteDescription"
                        value={settings.siteDescription}
                        onChange={(event) => setDraft({ ...settings, siteDescription: event.target.value })}
                        className="rounded-[1rem] bg-surface-container-lowest px-space-md py-2.5 text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                </div>

                <label className="flex cursor-pointer items-start gap-space-md">
                    <input
                        type="checkbox"
                        checked={settings.portfolioGrid}
                        onChange={(event) => setDraft({ ...settings, portfolioGrid: event.target.checked })}
                        className="mt-0.5 size-4 cursor-pointer rounded accent-primary focus:ring-0"
                    />
                    <span className="flex flex-col gap-0.5">
                        <span className="font-display text-label-lg text-on-surface">Feature Portfolio Grid</span>
                        <span className="font-display text-label-sm text-on-surface-variant">
                            Display the resource grid on the public homepage
                        </span>
                    </span>
                </label>

                <label className="flex cursor-pointer items-start gap-space-md">
                    <input
                        type="checkbox"
                        checked={settings.allowPublicComments}
                        onChange={(event) => setDraft({ ...settings, allowPublicComments: event.target.checked })}
                        className="mt-0.5 size-4 cursor-pointer rounded accent-primary focus:ring-0"
                    />
                    <span className="flex flex-col gap-0.5">
                        <span className="font-display text-label-lg text-on-surface">Allow Public Comments</span>
                        <span className="font-display text-label-sm text-on-surface-variant">
                            Enable webmentions and discussion threads by default
                        </span>
                    </span>
                </label>

                {updateSettings.isError && (
                    <p role="alert" className="font-display text-label-sm text-error">
                        {updateSettings.error.message}
                    </p>
                )}

                <div className="flex items-center gap-space-md">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={updateSettings.isPending}
                        className="flex items-center gap-space-sm rounded-[1rem] bg-primary px-space-md py-2.5 font-display text-label-lg font-medium text-on-primary transition-colors hover:bg-primary-fixed disabled:opacity-60"
                    >
                        <Save className="size-4" />
                        {updateSettings.isPending ? "Saving…" : "Save Settings"}
                    </button>
                    {saved && !updateSettings.isPending && (
                        <span className="font-display text-label-sm text-primary">Saved</span>
                    )}
                </div>
            </section>
        </div>
    )
}
