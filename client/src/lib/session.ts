import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { redirect } from "react-router"
import { ApiError, getMe, logout, type AuthUser } from "@/lib/api"

export const sessionQueryKey = ["auth", "me"] as const

interface Session {
    user: AuthUser | null
    isAuthenticated: boolean
    isLoading: boolean
}

export function useSession(): Session {
    const query = useQuery({
        queryKey: sessionQueryKey,
        queryFn: async () => {
            try {
                return await getMe()
            } catch (error) {
                if (error instanceof ApiError && error.status === 401) return null
                throw error
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000,
    })

    const user = query.data?.user ?? null
    return { user, isAuthenticated: user !== null, isLoading: query.isLoading }
}

export function useLogout() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: logout,
        onSuccess: () => queryClient.setQueryData(sessionQueryKey, null),
    })
}

export async function requireSession({
    request,
}: {
    request: Request
}): Promise<{ user: AuthUser }> {
    try {
        return await getMe()
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            const url = new URL(request.url)
            const next = `${url.pathname}${url.search}`
            throw redirect(`/login?next=${encodeURIComponent(next)}`)
        }
        throw error
    }
}
