import { useQuery } from "@tanstack/react-query"
import { ApiError, getMe, type AuthUser } from "@/lib/api"

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
