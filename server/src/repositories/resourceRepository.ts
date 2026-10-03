import { and, asc, count, desc, eq, exists, ilike, inArray, or, sql, type SQL } from 'drizzle-orm'
import type { DbClient } from '../db/index.js'
import {
    resourceTagsTable,
    resourcesTable,
    tagsTable,
    type ResourceStatus,
    type ResourceType,
} from '../db/dashboardSchema.js'
import type { TagRecord } from './tagRepository.js'

export interface ResourceRecord {
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
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
}

export interface ResourceWriteInput {
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
    publishedAt: Date | null
}

export interface ResourceFilters {
    status?: ResourceStatus | undefined
    type?: ResourceType | undefined
    tag?: string | undefined
    domain?: string | undefined
    q?: string | undefined
    page: number
    perPage: number
    sort: 'newest' | 'oldest' | 'reads'
}

export interface ResourceStats {
    total: number
    published: number
    drafts: number
    pinned: number
    reads: number
    publishedPercent: number
    byType: Record<ResourceType, number>
}

const resourceColumns = {
    id: resourcesTable.id,
    title: resourcesTable.title,
    url: resourcesTable.url,
    sourceDomain: resourcesTable.sourceDomain,
    type: resourcesTable.type,
    status: resourcesTable.status,
    excerpt: resourcesTable.excerpt,
    curatorNote: resourcesTable.curatorNote,
    metadata: resourcesTable.metadata,
    featured: resourcesTable.featured,
    pinned: resourcesTable.pinned,
    allowComments: resourcesTable.allowComments,
    reads: resourcesTable.reads,
    publishedAt: resourcesTable.publishedAt,
    createdAt: resourcesTable.createdAt,
    updatedAt: resourcesTable.updatedAt,
}

function buildWhere(client: DbClient, filters: ResourceFilters): SQL | undefined {
    const conditions: SQL[] = []

    if (filters.status) {
        conditions.push(eq(resourcesTable.status, filters.status))
    }
    if (filters.type) {
        conditions.push(eq(resourcesTable.type, filters.type))
    }
    if (filters.domain) {
        conditions.push(eq(resourcesTable.sourceDomain, filters.domain.toLowerCase()))
    }
    if (filters.q) {
        const term = `%${filters.q}%`
        const search = or(ilike(resourcesTable.title, term), ilike(resourcesTable.excerpt, term))
        if (search) conditions.push(search)
    }
    if (filters.tag) {
        conditions.push(
            exists(
                client
                    .select({ one: sql`1` })
                    .from(resourceTagsTable)
                    .innerJoin(tagsTable, eq(tagsTable.id, resourceTagsTable.tagId))
                    .where(
                        and(
                            eq(resourceTagsTable.resourceId, resourcesTable.id),
                            eq(tagsTable.slug, filters.tag),
                        ),
                    ),
            ),
        )
    }

    if (conditions.length === 0) return undefined
    return and(...conditions)
}

function buildOrder(filters: ResourceFilters) {
    if (filters.sort === 'oldest') return asc(resourcesTable.createdAt)
    if (filters.sort === 'reads') return desc(resourcesTable.reads)
    return desc(resourcesTable.createdAt)
}

export async function list(
    client: DbClient,
    filters: ResourceFilters,
): Promise<{ rows: ResourceRecord[]; total: number }> {
    const where = buildWhere(client, filters)

    const rows = await client
        .select(resourceColumns)
        .from(resourcesTable)
        .where(where)
        .orderBy(buildOrder(filters))
        .limit(filters.perPage)
        .offset((filters.page - 1) * filters.perPage)

    const totalRows = await client.select({ value: count() }).from(resourcesTable).where(where)

    return { rows, total: Number(totalRows[0]?.value ?? 0) }
}

export async function listPublished(client: DbClient, limit = 100): Promise<ResourceRecord[]> {
    return client
        .select(resourceColumns)
        .from(resourcesTable)
        .where(eq(resourcesTable.status, 'published'))
        .orderBy(desc(resourcesTable.pinned), desc(resourcesTable.createdAt))
        .limit(limit)
}

export async function findById(client: DbClient, id: number): Promise<ResourceRecord | null> {
    const rows = await client
        .select(resourceColumns)
        .from(resourcesTable)
        .where(eq(resourcesTable.id, id))
        .limit(1)
    return rows[0] ?? null
}

export async function create(client: DbClient, input: ResourceWriteInput): Promise<ResourceRecord> {
    const rows = await client.insert(resourcesTable).values(input).returning(resourceColumns)
    const row = rows[0]
    if (!row) throw new Error('Failed to create resource')
    return row
}

export async function update(
    client: DbClient,
    id: number,
    input: Partial<ResourceWriteInput>,
): Promise<ResourceRecord | null> {
    const rows = await client
        .update(resourcesTable)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(resourcesTable.id, id))
        .returning(resourceColumns)
    return rows[0] ?? null
}

export async function remove(client: DbClient, id: number): Promise<boolean> {
    const rows = await client
        .delete(resourcesTable)
        .where(eq(resourcesTable.id, id))
        .returning({ id: resourcesTable.id })
    return rows.length > 0
}

export async function setTags(client: DbClient, resourceId: number, tagIds: number[]): Promise<void> {
    await client.delete(resourceTagsTable).where(eq(resourceTagsTable.resourceId, resourceId))
    if (tagIds.length === 0) return
    await client
        .insert(resourceTagsTable)
        .values(tagIds.map((tagId) => ({ resourceId, tagId })))
        .onConflictDoNothing()
}

export async function listTagsForResources(
    client: DbClient,
    resourceIds: number[],
): Promise<Map<number, TagRecord[]>> {
    const result = new Map<number, TagRecord[]>()
    if (resourceIds.length === 0) return result

    const rows = await client
        .select({
            resourceId: resourceTagsTable.resourceId,
            id: tagsTable.id,
            name: tagsTable.name,
            slug: tagsTable.slug,
            createdAt: tagsTable.createdAt,
        })
        .from(resourceTagsTable)
        .innerJoin(tagsTable, eq(tagsTable.id, resourceTagsTable.tagId))
        .where(inArray(resourceTagsTable.resourceId, resourceIds))

    for (const row of rows) {
        const { resourceId, ...tag } = row
        const list = result.get(resourceId) ?? []
        list.push(tag)
        result.set(resourceId, list)
    }
    return result
}

export async function listTagIdsForResource(
    client: DbClient,
    resourceId: number,
): Promise<number[]> {
    const rows = await client
        .select({ tagId: resourceTagsTable.tagId })
        .from(resourceTagsTable)
        .where(eq(resourceTagsTable.resourceId, resourceId))
    return rows.map((row) => row.tagId)
}

export async function stats(client: DbClient): Promise<ResourceStats> {
    const rows = await client
        .select({
            total: count(),
            published: sql<number>`count(*) filter (where ${resourcesTable.status} = 'published')`,
            drafts: sql<number>`count(*) filter (where ${resourcesTable.status} = 'draft')`,
            pinned: sql<number>`count(*) filter (where ${resourcesTable.pinned} = true)`,
            reads: sql<number>`coalesce(sum(${resourcesTable.reads}), 0)`,
        })
        .from(resourcesTable)

    const row = rows[0]
    const total = Number(row?.total ?? 0)
    const published = Number(row?.published ?? 0)

    const byTypeRows = await client
        .select({ type: resourcesTable.type, value: count() })
        .from(resourcesTable)
        .groupBy(resourcesTable.type)

    const byType: Record<ResourceType, number> = {
        article: 0,
        tweet: 0,
        tool: 0,
        paper: 0,
        video: 0,
    }
    for (const typeRow of byTypeRows) {
        byType[typeRow.type] = Number(typeRow.value)
    }

    return {
        total,
        published,
        drafts: Number(row?.drafts ?? 0),
        pinned: Number(row?.pinned ?? 0),
        reads: Number(row?.reads ?? 0),
        publishedPercent: total === 0 ? 0 : Math.round((published / total) * 1000) / 10,
        byType,
    }
}

export async function updateStatusByIds(
    client: DbClient,
    ids: number[],
    status: ResourceStatus,
): Promise<number> {
    if (ids.length === 0) return 0
    const publishedAt =
        status === 'published' ? sql`coalesce(${resourcesTable.publishedAt}, now())` : null

    const rows = await client
        .update(resourcesTable)
        .set({ status, publishedAt, updatedAt: new Date() })
        .where(inArray(resourcesTable.id, ids))
        .returning({ id: resourcesTable.id })
    return rows.length
}

export async function deleteByIds(client: DbClient, ids: number[]): Promise<number> {
    if (ids.length === 0) return 0
    const rows = await client
        .delete(resourcesTable)
        .where(inArray(resourcesTable.id, ids))
        .returning({ id: resourcesTable.id })
    return rows.length
}
