import { Link, Outlet, isRouteErrorResponse, useRouteError } from "react-router"
import LoggedInBadge from "./components/LoggedInBadge"

export default function RootLayout() {
    return (
        <>
            <LoggedInBadge />
            <Outlet />
        </>
    )
}

export function RootError() {
    const error = useRouteError()
    const message = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : "Something went wrong."

    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#09080e] px-gutter text-center text-on-surface">
            <h1 className="font-display text-headline-md font-semibold">Something broke</h1>
            <p className="text-body-sm text-on-surface-variant">{message}</p>
            <Link to="/" className="text-primary hover:underline">
                Return home
            </Link>
        </main>
    )
}
