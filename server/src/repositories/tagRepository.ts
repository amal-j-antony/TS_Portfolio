import { asc, count, eq, inArray } from 'drizzle-orm'
import type { DbClient } from '../db/index.js'
import { resourceTagsTable, tagsTable } from '../db/dashboardSchema.js'

export interface TagRecord {
    id: number
    name: string
    slug: string
    createdAt: Date
}

export interface TagWithCount extends TagRecord {
    usageCount: number
}

const tagColumns = {
    id: tagsTable.id,
    name: tagsTable.name,
    slug: tagsTable.slug,
    createdAt: tagsTable.createdAt,
}

export async function list(client: DbClient): Promise<TagWithCount[]> {
    const rows = await client
        .select({ ...tagColumns, usageCount: count(resourceTagsTable.resourceId) })
        .from(tagsTable)
        .leftJoin(resourceTagsTable, eq(resourceTagsTable.tagId, tagsTable.id))
        .groupBy(tagsTable.id)
        .orderBy(asc(tagsTable.name))

    return rows.map((row) => ({ ...row, usageCount: Number(row.usageCount) }))
}

export async function findById(client: DbClient, id: number): Promise<TagRecord | null> {
    const rows = await client.select(tagColumns).from(tagsTable).where(eq(tagsTable.id, id)).limit(1)
    return rows[0] ?? null
}

export async function findBySlug(client: DbClient, slug: string): Promise<TagRecord | null> {
    const rows = await client.select(tagColumns).from(tagsTable).where(eq(tagsTable.slug, slug)).limit(1)
    return rows[0] ?? null
}

export async function findByIds(client: DbClient, ids: number[]): Promise<TagRecord[]> {
    if (ids.length === 0) return []
    return client.select(tagColumns).from(tagsTable).where(inArray(tagsTable.id, ids))
}

export async function create(client: DbClient, input: { name: string; slug: string }): Promise<TagRecord> {
    const rows = await client.insert(tagsTable).values(input).returning(tagColumns)
    const row = rows[0]
    if (!row) throw new Error('Failed to create tag')
    return row
}

export async function upsertBySlug(
    client: DbClient,
    input: { name: string; slug: string },
): Promise<TagRecord> {
    const rows = await client
        .insert(tagsTable)
        .values(input)
        .onConflictDoUpdate({ target: tagsTable.slug, set: { name: input.name } })
        .returning(tagColumns)
    const row = rows[0]
    if (!row) throw new Error('Failed to upsert tag')
    return row
}

export async function remove(client: DbClient, id: number): Promise<boolean> {
    const rows = await client.delete(tagsTable).where(eq(tagsTable.id, id)).returning({ id: tagsTable.id })
    return rows.length > 0
}
