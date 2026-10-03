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

export function logout(): Promise<void> {
    return request<void>("/api/v1/auth/logout", { method: "POST" })
}

export type ResourceType = "article" | "tweet" | "tool" | "paper"
export type ResourceStatus = "draft" | "published"
export type ResourceSort = "newest" | "oldest" | "reads"

export interface Tag {
    id: number
    name: string
    slug: string
    createdAt: string
    usageCount?: number
}

export interface Resource {
    id: number
    title: string
    url: string
    sourceDomain: string | null
    type: ResourceType
    status: ResourceStatus
    excerpt: string | null
    curatorNote: string | null
    metadata: Record<string, unknown>
    featured: boolean
    pinned: boolean
    allowComments: boolean
    reads: number
    publishedAt: string | null
    createdAt: string
    updatedAt: string
    tags: Tag[]
}

export interface ResourceListFilters {
    status?: ResourceStatus
    type?: ResourceType
    tag?: string
    domain?: string
    q?: string
    page?: number
    perPage?: number
    sort?: ResourceSort
}

export interface ResourceListResponse {
    items: Resource[]
    total: number
    page: number
    perPage: number
}

export interface ResourceStats {
    total: number
    published: number
    drafts: number
    pinned: number
    reads: number
    publishedPercent: number
}

export interface ResourceWritePayload {
    title: string
    url: string
    sourceDomain?: string | null
    type: ResourceType
    status?: ResourceStatus
    excerpt?: string | null
    curatorNote?: string | null
    metadata?: Record<string, unknown>
    featured?: boolean
    pinned?: boolean
    allowComments?: boolean
    reads?: number
    tags?: string[]
}

export interface DashboardSettings {
    portfolioGrid: boolean
    allowPublicComments: boolean
    siteTitle: string
    siteDescription: string
}

function buildQuery(params: Record<string, string | number | undefined>): string {
    const search = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== "") {
            search.set(key, String(value))
        }
    }
    const query = search.toString()
    return query ? `?${query}` : ""
}

function jsonInit(method: string, body?: unknown): RequestInit {
    return {
        method,
        headers: { "Content-Type": "application/json" },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    }
}

export function listResources(filters: ResourceListFilters = {}): Promise<ResourceListResponse> {
    return request<ResourceListResponse>(`/api/v1/resources${buildQuery({ ...filters })}`, {
        method: "GET",
    })
}

export function getResource(id: number): Promise<{ item: Resource }> {
    return request<{ item: Resource }>(`/api/v1/resources/${id}`, { method: "GET" })
}

export function createResource(payload: ResourceWritePayload): Promise<{ item: Resource }> {
    return request<{ item: Resource }>("/api/v1/resources", jsonInit("POST", payload))
}

export function updateResource(
    id: number,
    payload: Partial<ResourceWritePayload>,
): Promise<{ item: Resource }> {
    return request<{ item: Resource }>(`/api/v1/resources/${id}`, jsonInit("PATCH", payload))
}

export function deleteResource(id: number): Promise<void> {
    return request<void>(`/api/v1/resources/${id}`, { method: "DELETE" })
}

export function bulkResources(payload: {
    action: "publish" | "draft" | "delete"
    ids: number[]
}): Promise<{ affected: number }> {
    return request<{ affected: number }>("/api/v1/resources/bulk", jsonInit("POST", payload))
}

export function exportResources(): Promise<{ items: Resource[] }> {
    return request<{ items: Resource[] }>("/api/v1/resources/export", { method: "GET" })
}

export function getResourceStats(): Promise<ResourceStats> {
    return request<ResourceStats>("/api/v1/resources/stats", { method: "GET" })
}

export function listTags(): Promise<{ items: Tag[] }> {
    return request<{ items: Tag[] }>("/api/v1/tags", { method: "GET" })
}

export function createTag(name: string): Promise<{ item: Tag }> {
    return request<{ item: Tag }>("/api/v1/tags", jsonInit("POST", { name }))
}

export function deleteTag(id: number): Promise<void> {
    return request<void>(`/api/v1/tags/${id}`, { method: "DELETE" })
}

export function getSettings(): Promise<{ settings: DashboardSettings }> {
    return request<{ settings: DashboardSettings }>("/api/v1/settings", { method: "GET" })
}

export function updateSettings(
    payload: Partial<DashboardSettings>,
): Promise<{ settings: DashboardSettings }> {
    return request<{ settings: DashboardSettings }>("/api/v1/settings", jsonInit("PATCH", payload))
}

export function getPublicResources(): Promise<{ items: Resource[] }> {
    return request<{ items: Resource[] }>("/api/v1/public/resources", { method: "GET" })
}
