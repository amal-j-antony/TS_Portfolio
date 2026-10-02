const API_BASE = import.meta.env.VITE_API_URL ?? ""

export interface AuthUser {
    id: number
    email: string
}

interface ApiErrorBody {
    error?: { code?: string; message?: string }
}

export class ApiError extends Error {
    readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = "ApiError"
        this.status = status
    }
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        ...init,
    })

    if (!response.ok) {
        let message = `Request failed with status ${response.status}`
        try {
            const body = (await response.json()) as ApiErrorBody
            if (body.error?.message) {
                message = body.error.message
            }
        } catch {
            // Response body was not JSON; keep the generic message.
        }
        throw new ApiError(message, response.status)
    }

    if (response.status === 204) {
        return undefined as T
    }
    return (await response.json()) as T
}

export function login(email: string, password: string): Promise<{ user: AuthUser }> {
    return request<{ user: AuthUser }>("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })
}

export function getMe(): Promise<{ user: AuthUser }> {
    return request<{ user: AuthUser }>("/api/v1/auth/me", { method: "GET" })
}
