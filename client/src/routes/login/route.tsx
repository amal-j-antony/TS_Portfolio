import { useEffect, useRef, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import {
    ArrowLeft,
    ArrowRight,
    AtSign,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    Lock,
} from "lucide-react"
import { useServerStatus, type ServerStatus } from "@/lib/serverStatus"

type AuthStatus = "idle" | "loading" | "success"

const serverStatusMeta: Record<ServerStatus, { label: string; dot: string; text: string }> = {
    checking: {
        label: "Checking…",
        dot: "bg-outline",
        text: "text-on-surface-variant",
    },
    waking: {
        label: "Waking…",
        dot: "bg-amber-400 animate-pulse",
        text: "text-amber-300",
    },
    online: {
        label: "Online",
        dot: "bg-emerald-400",
        text: "text-emerald-300",
    },
    offline: {
        label: "Offline",
        dot: "bg-error",
        text: "text-error",
    },
}

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [remember, setRemember] = useState(true)
    const [status, setStatus] = useState<AuthStatus>("idle")
    const timers = useRef<number[]>([])
    const { status: serverStatus, retry: retryServer } = useServerStatus()

    useEffect(() => {
        const currentTimers = timers.current
        return () => {
            currentTimers.forEach((timer) => window.clearTimeout(timer))
        }
    }, [])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!email.trim() || !password.trim() || status !== "idle") return

        setStatus("loading")
        timers.current.push(
            window.setTimeout(() => {
                setStatus("success")
                timers.current.push(
                    window.setTimeout(() => navigate("/"), 900),
                )
            }, 1200),
        )
    }

    return (
        <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#09080e]">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(45% 40% at 50% 0%, rgba(139,92,246,0.18), transparent 70%), radial-gradient(35% 35% at 85% 75%, rgba(98,37,155,0.22), transparent 70%)",
                }}
            />

            <div className="relative z-10 flex w-full items-center justify-between px-gutter py-space-lg">
                <Link
                    to="/"
                    className="inline-flex items-center gap-space-xs font-display text-label-sm text-on-surface-variant transition-colors hover:text-on-surface"
                >
                    <ArrowLeft className="size-4" />
                    <span>Return to Public Vault</span>
                </Link>
                <span className="inline-flex items-center gap-space-xs font-display text-label-lg font-semibold text-on-surface">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Amal.j
                </span>
            </div>

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-gutter py-space-xl">
                <div className="relative w-full max-w-[480px] overflow-hidden rounded-2xl bg-surface-container/70 p-space-xl shadow-xl shadow-surface-container-lowest/60 backdrop-blur-2xl">
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                    <header className="flex flex-col items-center gap-space-xs text-center">
                        <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container-high/80 px-space-md py-1 shadow-inner">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-primary" />
                            </span>
                            <span className="font-display text-label-sm uppercase tracking-wider text-on-surface-variant">
                                Restricted Node
                            </span>
                        </div>
                        <h1 className="mt-space-xs font-display text-headline-md font-semibold tracking-tight text-on-surface">
                            Curator Vault Access
                        </h1>
                        <p className="max-w-[340px] text-body-sm text-on-surface-variant">
                            Authenticate to manage bookmarks, portfolio highlights, and sync Turso DB.
                        </p>
                    </header>

                    <div className="relative my-space-lg flex items-center justify-center">
                        <div className="h-px w-full bg-surface-variant" />
                        <span className="absolute bg-surface-container px-space-sm font-display text-label-sm uppercase tracking-widest text-outline">
                            or credentials
                        </span>
                    </div>

                    <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-space-xs">
                            <label
                                htmlFor="admin-email"
                                className="flex items-center justify-between font-display text-label-sm text-on-surface-variant"
                            >
                                <span>Username</span>
                                <span className="text-[10px] tracking-wide text-primary">REQUIRED</span>
                            </label>
                            <div className="relative flex items-center">
                                <AtSign className="pointer-events-none absolute left-3 size-[18px] text-outline" />
                                <input
                                    id="admin-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="curator@domain.dev"
                                    className="w-full rounded-[1rem] bg-surface-container-lowest py-2.5 pl-10 pr-space-md text-body-sm text-on-surface shadow-inner transition-colors placeholder:text-outline-variant focus:bg-surface-container-low focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-space-xs">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="master-token"
                                    className="font-display text-label-sm text-on-surface-variant"
                                >
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="font-display text-label-sm text-primary transition-colors hover:text-primary-fixed"
                                >
                                    Emergency recovery
                                </a>
                            </div>
                            <div className="relative flex items-center">
                                <Lock className="pointer-events-none absolute left-3 size-[18px] text-outline" />
                                <input
                                    id="master-token"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="••••••••••••••••"
                                    className="w-full rounded-[1rem] bg-surface-container-lowest py-2.5 pl-10 pr-10 text-body-sm tracking-widest text-on-surface shadow-inner transition-colors placeholder:text-outline-variant focus:bg-surface-container-low focus:outline-none"
                                />
                                <button
                                    type="button"
                                    title="Toggle token visibility"
                                    onClick={() => setShowPassword((value) => !value)}
                                    className="absolute right-3 flex items-center justify-center rounded-full p-1 text-outline transition-colors hover:text-on-surface"
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-[18px]" />
                                    ) : (
                                        <Eye className="size-[18px]" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-space-xs">
                            <label className="flex cursor-pointer select-none items-center gap-space-sm">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(event) => setRemember(event.target.checked)}
                                    className="size-4 cursor-pointer rounded bg-surface-container-lowest accent-primary focus:ring-0"
                                />
                                <span className="font-display text-label-sm text-on-surface-variant">
                                    Remember me
                                </span>
                            </label>
                            
                        </div>

                        <button
                            type="submit"
                            disabled={status !== "idle"}
                            className="group mt-space-xs flex w-full items-center justify-center gap-space-sm rounded-[1rem] bg-primary px-space-md py-3 font-display text-label-lg font-medium text-on-primary shadow-lg shadow-on-tertiary-container/30 transition-all duration-200 hover:bg-primary-fixed active:scale-[0.98] disabled:cursor-default disabled:opacity-90"
                        >
                            <span>
                                {status === "idle" && "Unlock Vault Dashboard"}
                                {status === "loading" && "Authenticating Secure Node..."}
                                {status === "success" && "Decryption Complete"}
                            </span>
                            {status === "idle" && (
                                <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" />
                            )}
                            {status === "loading" && <Loader2 className="size-[18px] animate-spin" />}
                            {status === "success" && <CheckCircle2 className="size-[18px]" />}
                        </button>
                    </form>

                    
                </div>

                <div className="mt-space-lg flex items-center justify-center gap-space-lg">
                    <button
                        type="button"
                        onClick={serverStatus === "offline" ? retryServer : undefined}
                        disabled={serverStatus !== "offline"}
                        className="flex items-center gap-1.5 font-display text-label-sm text-outline transition-colors enabled:cursor-pointer enabled:hover:text-on-surface disabled:cursor-default"
                    >
                        <span
                            className={`size-1.5 rounded-full ${serverStatusMeta[serverStatus].dot}`}
                        />
                        <span>Server Status:</span>
                        <span className={serverStatusMeta[serverStatus].text}>
                            {serverStatusMeta[serverStatus].label}
                        </span>
                    </button>
                </div>
            </div>

            <footer className="relative z-10 mx-auto w-full max-w-[680px] px-gutter pb-space-lg text-center font-display text-label-sm text-outline">
                © Amal.j • Secure Vault Gateway
            </footer>
        </main>
    )
}
