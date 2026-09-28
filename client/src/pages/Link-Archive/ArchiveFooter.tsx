import { Link } from "react-router-dom"
import { archiveFooterLinks } from "./data"

export default function ArchiveFooter() {
    return (
        <footer className="relative z-10 w-full bg-surface-container-lowest py-space-xl">
            <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-between gap-space-md px-gutter font-display text-label-md text-on-surface-variant md:flex-row">
                <div className="flex items-center gap-space-sm">
                    <span>Designed &amp; Maintained by Amal.j</span>
                    <span className="text-outline-variant">•</span>
                    <span>Next-gen Stash &amp; Resource Archive</span>
                </div>
                <div className="flex items-center gap-space-lg">
                    {archiveFooterLinks.map((link) =>
                        link.to.startsWith("/") ? (
                            <Link
                                key={link.label}
                                to={link.to}
                                className="transition-colors hover:text-on-surface"
                            >
                                {link.label}
                            </Link>
                        ) : (
                            <a
                                key={link.label}
                                href={link.to}
                                className="transition-colors hover:text-on-surface"
                            >
                                {link.label}
                            </a>
                        ),
                    )}
                </div>
            </div>
        </footer>
    )
}
