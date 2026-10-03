import { useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components"
import { ChevronDown } from "lucide-react"
import ConfirmLogoutDialog from "@/components/ConfirmLogoutDialog"
import { useSession } from "@/lib/session"

const HIDDEN_PREFIXES = ["/login", "/dashboard"]

export default function LoggedInBadge() {
    const { isAuthenticated, user } = useSession()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)

    if (!isAuthenticated || !user || HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
        return null
    }

    return (
        <>
            <MenuTrigger>
                <Button
                    aria-label={`Logged in as ${user.email}. Open account menu`}
                    className="fixed top-4 right-4 z-50 flex max-w-[220px] items-center gap-space-xs rounded-full bg-surface-container/80 px-space-md py-1.5 font-display text-label-sm text-on-surface shadow-lg backdrop-blur-xl outline-none transition-colors data-hovered:bg-surface-container-high/80 data-focused:ring-2 data-focused:ring-primary/50"
                >
                    <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
                    <span className="truncate">{user.email}</span>
                    <ChevronDown className="size-3.5 shrink-0 text-on-surface-variant" />
                </Button>
                <Popover
                    placement="bottom end"
                    offset={8}
                    className="z-[60] min-w-[160px] rounded-xl border border-outline-variant/40 bg-surface-container/95 p-1 shadow-xl backdrop-blur-xl outline-none data-entering:animate-in data-entering:fade-in-0 data-exiting:animate-out data-exiting:fade-out-0"
                >
                    <Menu className="outline-none">
                        <MenuItem
                            onAction={() => setIsConfirmOpen(true)}
                            className="cursor-pointer rounded-lg px-space-md py-2 font-display text-label-sm text-error outline-none data-focused:bg-error/10"
                        >
                            Log out
                        </MenuItem>
                    </Menu>
                </Popover>
            </MenuTrigger>

            <ConfirmLogoutDialog
                isOpen={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                email={user.email}
                onLoggedOut={() => navigate("/login")}
            />
        </>
    )
}
