import { useState } from "react"
import { BookmarkPlus, Link as LinkIcon } from "lucide-react"

export default function QuickStashBar() {
    const [url, setUrl] = useState("")

    return (
        <div className="relative mx-auto w-full max-w-2xl">
            <div className="flex items-center gap-space-sm rounded-full bg-surface-container/70 p-1.5 pl-space-md shadow-xl backdrop-blur-2xl transition-all duration-300 focus-within:bg-surface-container-high">
                <LinkIcon className="size-5 shrink-0 text-primary" />
                <input
                    type="text"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="Paste URL to stash directly into vault..."
                    className="flex-1 bg-transparent text-body-md text-on-surface outline-none placeholder:text-outline"
                />
                <div className="hidden items-center gap-space-xs rounded-full bg-surface-container-lowest px-2.5 py-1 font-display text-label-sm text-on-surface-variant sm:flex">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    <span>Auto-detect</span>
                </div>
                <button
                    type="button"
                    className="flex items-center gap-space-xs rounded-full bg-primary-container px-space-md py-2 font-display text-label-md font-semibold text-on-primary-container transition-all hover:bg-primary hover:text-on-primary"
                >
                    <BookmarkPlus className="size-4" />
                    <span>Quick Stash</span>
                </button>
            </div>
        </div>
    )
}
