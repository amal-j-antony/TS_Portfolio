import { NavLink } from "react-router"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "../data"

interface DashboardSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
    return (
        <>
            {isOpen && (
                <div
                    aria-hidden
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                />
            )}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 flex h-full w-72 flex-col justify-between bg-surface-container-lowest/95 p-space-lg shadow-xl backdrop-blur-xl transition-transform duration-300 lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex flex-col gap-space-lg">
                    <div className="flex items-center gap-space-sm px-space-xs">
                        <span className="size-2.5 animate-pulse rounded-full bg-primary" />
                        <span className="font-display text-headline-sm font-semibold tracking-tight text-primary">
                            Amal.j
                        </span>
                        <span className="rounded-full bg-surface-container px-space-sm py-space-xs font-display text-label-sm text-on-surface-variant">
                            Admin
                        </span>
                    </div>

                    <button
                        type="button"
                        className="flex w-full items-center justify-center gap-space-sm rounded-[1rem] bg-primary-container px-space-md py-space-sm font-display text-label-lg text-on-primary-container shadow-[0_0_20px_rgba(167,139,250,0.25)] transition-all duration-200 hover:bg-primary hover:text-on-primary"
                    >
                        <Plus className="size-[18px]" />
                        <span>New Bookmark</span>
                    </button>

                    <nav className="flex flex-col gap-space-xs">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-space-md rounded-[1rem] px-space-md py-space-sm font-display text-label-lg transition-colors",
                                        isActive
                                            ? "bg-surface-container-high text-primary shadow-[0_0_12px_rgba(167,139,250,0.15)]"
                                            : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                                    )
                                }
                            >
                                <item.icon className="size-5" />
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="flex flex-col gap-space-sm rounded-[1rem] bg-surface-container-low/50 p-space-md">
                    <div className="flex items-center gap-space-xs text-on-surface-variant">
                        <span className="size-2 rounded-full bg-primary" />
                        <span className="font-display text-label-sm">Vault DB Connected</span>
                    </div>
                    <div className="font-display text-label-sm text-outline">Postgres / Drizzle / Neon</div>
                </div>
            </aside>
        </>
    )
}
