import { Link } from "react-router"

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#09080e] px-gutter text-center text-on-surface">
            <h1 className="font-display text-headline-lg font-semibold">404</h1>
            <p className="text-body-sm text-on-surface-variant">This page does not exist.</p>
            <Link to="/" className="text-primary hover:underline">
                Return home
            </Link>
        </main>
    )
}
