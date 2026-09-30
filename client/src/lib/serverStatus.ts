import { useRef } from "react"
import { useQuery } from "@tanstack/react-query"

const API_BASE = import.meta.env.VITE_API_URL ?? ""
const REQUEST_TIMEOUT_MS = 8_000
const RETRY_INTERVAL_MS = 3_000
const MAX_WAIT_MS = 90_000

export type ServerStatus = "checking" | "waking" | "online" | "offline"

async function pingServer(): Promise<void> {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
        const response = await fetch(`${API_BASE}/api/v1/health`, { signal: controller.signal })
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`)
        }
    } finally {
        window.clearTimeout(timeout)
    }
}

export function useServerStatus() {
    const startedAt = useRef<number | null>(null)

    const query = useQuery({
        queryKey: ["server-status"],
        queryFn: async () => {
            startedAt.current ??= Date.now()
            await pingServer()
            startedAt.current = null
            return true
        },
        retry: () => {
            const started = startedAt.current ?? Date.now()
            return Date.now() - started < MAX_WAIT_MS
        },
        retryDelay: RETRY_INTERVAL_MS,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    })

    const status: ServerStatus = query.isSuccess
        ? "online"
        : query.isFetching
          ? "waking"
          : query.isError
            ? "offline"
            : "checking"

    return {
        status,
        isRefreshing: query.isFetching,
        retry: () => {
            startedAt.current = null
            void query.refetch()
        },
    }
}
