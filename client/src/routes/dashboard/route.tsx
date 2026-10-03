import { useState } from "react"
import { Outlet } from "react-router"
import DashboardHeader from "./components/DashboardHeader"
import DashboardSidebar from "./components/DashboardSidebar"

export default function DashboardLayout() {
    const [navOpen, setNavOpen] = useState(false)

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <DashboardSidebar isOpen={navOpen} onClose={() => setNavOpen(false)} />
            <div className="flex min-h-screen flex-col lg:pl-72">
                <DashboardHeader onOpenNav={() => setNavOpen(true)} />
                <main className="flex-1 px-gutter pb-space-xl pt-20">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
