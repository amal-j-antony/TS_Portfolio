import { useLocation } from "react-router"
import { useSession } from "@/lib/session"

export default function LoggedInBadge() {
    const { isAuthenticated, user } = useSession()
    const { pathname } = useLocation()

    if (!isAuthenticated || !user || pathname === "/login") return null

    return (
        <div
            aria-label={`Logged in as ${user.email}`}
            className="fixed top-4 right-4 z-50 flex max-w-[220px] items-center gap-space-xs rounded-full bg-surface-container/80 px-space-md py-1.5 font-display text-label-sm text-on-surface shadow-lg backdrop-blur-xl"
        >
            <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="truncate">{user.email}</span>
        </div>
    )
}
