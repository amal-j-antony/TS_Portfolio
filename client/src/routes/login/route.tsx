import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, ArrowRight, AtSign, Lock } from "lucide-react"
import { useAppForm } from "@/components/form"
import { login } from "@/lib/api"
import { sessionQueryKey } from "@/lib/session"
import { useServerStatus, type ServerStatus } from "@/lib/serverStatus"
import { loginSchema } from "./schema"

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
    const [searchParams] = useSearchParams()
    const queryClient = useQueryClient()
    const [remember, setRemember] = useState(true)
    const [serverError, setServerError] = useState<string | null>(null)
    const { status: serverStatus, retry: retryServer } = useServerStatus()

    const requestedNext = searchParams.get("next")
    const redirectTo =
        requestedNext && requestedNext.startsWith("/") && !requestedNext.startsWith("//")
            ? requestedNext
            : "/dashboard"

    const form = useAppForm({
        defaultValues: { email: "", password: "" },
        validators: { onSubmit: loginSchema },
        onSubmit: async ({ value }) => {
            setServerError(null)

            try {
                const { user } = await login(value.email, value.password)
                queryClient.setQueryData(sessionQueryKey, { user })
                navigate(redirectTo)
            } catch (submitError) {
                setServerError(submitError instanceof Error ? submitError.message : "Unable to sign in")
            }
        },
        onSubmitInvalid: ({ formApi }) => {
            const fieldMeta = formApi.state.fieldMeta
            const invalidField = (Object.keys(fieldMeta) as Array<keyof typeof fieldMeta>).find(
                (name) => (fieldMeta[name]?.errors.length ?? 0) > 0,
            )
            if (invalidField) document.getElementById(invalidField)?.focus()
        },
    })

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

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-gutter py-space-xl ">
                <div className="relative w-full max-w-[480px] overflow-hidden rounded-2xl bg-surface-container/70 p-space-xl shadow-xl shadow-surface-container-lowest/60 backdrop-blur-2xl">
                    <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                    <header className="flex flex-col items-center gap-space-md text-center">
                        <h1 className="my-space-md font-display text-headline-md font-semibold tracking-tight text-on-surface">
                            Login
                        </h1>
                    </header>

                    <form
                        noValidate
                        className="flex flex-col gap-space-lg"
                        onSubmit={(event) => {
                            event.preventDefault()
                            void form.handleSubmit()
                        }}
                    >
                        <div className="flex flex-col gap-space-md">
                            <form.AppField
                                name="email"
                                children={(field) => (
                                    <field.TextField
                                        type="email"
                                        required
                                        placeholder="curator@domain.dev"
                                        autoComplete="email"
                                        icon={<AtSign className="size-[18px]" />}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-space-xs">
                            <form.AppField
                                name="password"
                                children={(field) => (
                                    <field.PasswordField
                                        required
                                        placeholder="••••••••••••••••"
                                        autoComplete="current-password"
                                        icon={<Lock className="size-[18px]" />}
                                    />
                                )}
                            />
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

                        {serverError && (
                            <p
                                role="alert"
                                className="rounded-[1rem] bg-surface-container-lowest px-space-md py-2 font-display text-label-sm text-error"
                            >
                                {serverError}
                            </p>
                        )}

                        <form.AppForm>
                            <form.SubmitButton
                                pendingLabel="Authenticating Secure Node..."
                                className="mt-space-xs"
                                icon={
                                    <ArrowRight className="size-[18px] transition-transform group-hover:translate-x-0.5" />
                                }
                            >
                                Unlock Vault Dashboard
                            </form.SubmitButton>
                        </form.AppForm>
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
