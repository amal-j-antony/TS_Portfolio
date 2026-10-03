import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as api from "./api"
import type { ResourceListFilters, ResourceWritePayload } from "./api"

export const resourceKeys = {
    all: ["resources"] as const,
    list: (filters: ResourceListFilters) => ["resources", "list", filters] as const,
    detail: (id: number) => ["resources", "detail", id] as const,
    stats: ["resources", "stats"] as const,
    export: ["resources", "export"] as const,
}

export const tagKeys = { all: ["tags"] as const }
export const settingsKeys = { all: ["settings"] as const }
export const publicResourceKeys = { all: ["public-resources"] as const }

export function useResources(filters: ResourceListFilters) {
    return useQuery({
        queryKey: resourceKeys.list(filters),
        queryFn: () => api.listResources(filters),
        placeholderData: keepPreviousData,
    })
}

export function useResourceStats() {
    return useQuery({ queryKey: resourceKeys.stats, queryFn: api.getResourceStats })
}

export function useTags() {
    return useQuery({ queryKey: tagKeys.all, queryFn: api.listTags })
}

export function useSettings() {
    return useQuery({ queryKey: settingsKeys.all, queryFn: api.getSettings })
}

export function usePublicResources() {
    return useQuery({ queryKey: publicResourceKeys.all, queryFn: api.getPublicResources })
}

function useInvalidateResources() {
    const queryClient = useQueryClient()
    return () => {
        void queryClient.invalidateQueries({ queryKey: resourceKeys.all })
        void queryClient.invalidateQueries({ queryKey: publicResourceKeys.all })
    }
}

export function useCreateResource() {
    const invalidate = useInvalidateResources()
    return useMutation({ mutationFn: api.createResource, onSuccess: invalidate })
}

export function useUpdateResource() {
    const invalidate = useInvalidateResources()
    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: Partial<ResourceWritePayload> }) =>
            api.updateResource(id, payload),
        onSuccess: invalidate,
    })
}

export function useDeleteResource() {
    const invalidate = useInvalidateResources()
    return useMutation({ mutationFn: api.deleteResource, onSuccess: invalidate })
}

export function useBulkResources() {
    const invalidate = useInvalidateResources()
    return useMutation({ mutationFn: api.bulkResources, onSuccess: invalidate })
}

export function useExportResources() {
    return useMutation({ mutationFn: api.exportResources })
}

export function useCreateTag() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.createTag,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tagKeys.all })
            void queryClient.invalidateQueries({ queryKey: resourceKeys.all })
        },
    })
}

export function useDeleteTag() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.deleteTag,
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: tagKeys.all })
            void queryClient.invalidateQueries({ queryKey: resourceKeys.all })
        },
    })
}

export function useUpdateSettings() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: api.updateSettings,
        onSuccess: (data) => {
            queryClient.setQueryData(settingsKeys.all, data)
        },
    })
}
