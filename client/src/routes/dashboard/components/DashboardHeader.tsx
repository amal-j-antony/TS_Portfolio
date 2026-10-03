import { useState } from "react"
import { useNavigate } from "react-router"
import { LogOut, Menu, Search, User } from "lucide-react"
import ConfirmLogoutDialog from "@/components/ConfirmLogoutDialog"
import { useSession } from "@/lib/session"

interface DashboardHeaderProps {
    onOpenNav: () => void
}

export default function DashboardHeader({ onOpenNav }: DashboardHeaderProps) {
    const navigate = useNavigate()
    const { user } = useSession()
    const [isLogoutOpen, setIsLogoutOpen] = useState(false)

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between gap-space-md bg-surface/85 px-gutter shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl lg:left-72">
                <div className="flex items-center gap-space-md">
                    <button
                        type="button"
                        onClick={onOpenNav}
                        aria-label="Open navigation"
                        className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface lg:hidden"
                    >
                        <Menu className="size-5" />
                    </button>
                    <div className="relative hidden w-72 sm:block lg:w-96">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-on-surface-variant" />
                        <input
                            type="search"
                            placeholder="Search vault resources..."
                            className="w-full rounded-full bg-surface-container-lowest/80 py-2 pl-10 pr-4 text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-space-md">
                    <button
                        type="button"
                        onClick={() => setIsLogoutOpen(true)}
                        className="flex items-center gap-space-xs rounded-full px-space-sm py-space-xs font-display text-label-md text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
                    >
                        <LogOut className="size-[18px]" />
                        <span>Exit</span>
                    </button>
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary text-on-primary">
                        <User className="size-[18px]" />
                    </div>
                </div>
            </header>

            <ConfirmLogoutDialog
                isOpen={isLogoutOpen}
                onOpenChange={setIsLogoutOpen}
                email={user?.email}
                onLoggedOut={() => navigate("/login")}
            />
        </>
    )
}
