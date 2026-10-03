import { db } from '../db/index.js'
import { NotFoundError } from '../lib/errors.js'
import {
    deriveHostname,
    normalizeOptionalText,
} from '../lib/url.js'
import type {
    ResourceBulkInput,
    ResourceCreateInput,
    ResourceListQuery,
    ResourceUpdateInput,
} from '../lib/dashboardSchemas.js'
import * as resourceRepository from '../repositories/resourceRepository.js'
import type {
    ResourceRecord,
    ResourceStats,
    ResourceWriteInput,
} from '../repositories/resourceRepository.js'
import * as tagRepository from '../repositories/tagRepository.js'
import type { TagRecord } from '../repositories/tagRepository.js'
import { slugify } from './tagService.js'

export interface ResourceDto extends ResourceRecord {
    tags: TagRecord[]
}

export interface ResourceListResult {
    items: ResourceDto[]
    total: number
    page: number
    perPage: number
}

function toDto(record: ResourceRecord, tags: TagRecord[]): ResourceDto {
    return { ...record, tags }
}

function resolveSourceDomain(provided: string | null | undefined, url: string): string | null {
    const normalized = normalizeOptionalText(provided)
    if (normalized) return normalized.toLowerCase()
    return deriveHostname(url)
}

async function resolveTagIds(
    client: Parameters<typeof tagRepository.upsertBySlug>[0],
    names: string[],
): Promise<number[]> {
    const unique = Array.from(new Set(names.map((name) => name.trim()).filter(Boolean)))
    const ids: number[] = []

    for (const name of unique) {
        const slug = slugify(name)
        if (!slug) continue
        const tag = await tagRepository.upsertBySlug(client, { name, slug })
        ids.push(tag.id)
    }

    return ids
}

async function withTags(
    client: Parameters<typeof resourceRepository.listTagsForResources>[0],
    records: ResourceRecord[],
): Promise<ResourceDto[]> {
    const tagsById = await resourceRepository.listTagsForResources(
        client,
        records.map((record) => record.id),
    )
    return records.map((record) => toDto(record, tagsById.get(record.id) ?? []))
}

export async function list(query: ResourceListQuery): Promise<ResourceListResult> {
    const { rows, total } = await resourceRepository.list(db, {
        status: query.status,
        type: query.type,
        tag: query.tag,
        domain: query.domain,
        q: query.q,
        page: query.page,
        perPage: query.perPage,
        sort: query.sort,
    })

    return {
        items: await withTags(db, rows),
        total,
        page: query.page,
        perPage: query.perPage,
    }
}

export async function get(id: number): Promise<ResourceDto> {
    const record = await resourceRepository.findById(db, id)
    if (!record) {
        throw new NotFoundError('Resource not found')
    }
    const [dto] = await withTags(db, [record])
    return dto as ResourceDto
}

export async function create(input: ResourceCreateInput): Promise<ResourceDto> {
    return db.transaction(async (tx) => {
        const tagIds = await resolveTagIds(tx, input.tags)

        const record = await resourceRepository.create(tx, {
            title: input.title,
            url: input.url,
            sourceDomain: resolveSourceDomain(input.sourceDomain, input.url),
            type: input.type,
            status: input.status,
            excerpt: normalizeOptionalText(input.excerpt),
            curatorNote: normalizeOptionalText(input.curatorNote),
            metadata: input.metadata,
            featured: input.featured,
            pinned: input.pinned,
            allowComments: input.allowComments,
            reads: input.reads,
            publishedAt: input.status === 'published' ? new Date() : null,
        })

        await resourceRepository.setTags(tx, record.id, tagIds)
        const [dto] = await withTags(tx, [record])
        return dto as ResourceDto
    })
}

export async function update(id: number, input: ResourceUpdateInput): Promise<ResourceDto> {
    return db.transaction(async (tx) => {
        const existing = await resourceRepository.findById(tx, id)
        if (!existing) {
            throw new NotFoundError('Resource not found')
        }

        const patch: Partial<ResourceWriteInput> = {}
        if (input.title !== undefined) patch.title = input.title
        if (input.url !== undefined) patch.url = input.url
        if (input.sourceDomain !== undefined) {
            patch.sourceDomain = resolveSourceDomain(input.sourceDomain, input.url ?? existing.url)
        }
        if (input.type !== undefined) patch.type = input.type
        if (input.excerpt !== undefined) patch.excerpt = normalizeOptionalText(input.excerpt)
        if (input.curatorNote !== undefined) patch.curatorNote = normalizeOptionalText(input.curatorNote)
        if (input.metadata !== undefined) patch.metadata = input.metadata
        if (input.featured !== undefined) patch.featured = input.featured
        if (input.pinned !== undefined) patch.pinned = input.pinned
        if (input.allowComments !== undefined) patch.allowComments = input.allowComments
        if (input.reads !== undefined) patch.reads = input.reads
        if (input.status !== undefined) {
            patch.status = input.status
            patch.publishedAt =
                input.status === 'published' ? (existing.publishedAt ?? new Date()) : null
        }

        const record = await resourceRepository.update(tx, id, patch)
        if (!record) {
            throw new NotFoundError('Resource not found')
        }

        if (input.tags !== undefined) {
            const tagIds = await resolveTagIds(tx, input.tags)
            await resourceRepository.setTags(tx, id, tagIds)
        }

        const [dto] = await withTags(tx, [record])
        return dto as ResourceDto
    })
}

export async function remove(id: number): Promise<void> {
    const deleted = await resourceRepository.remove(db, id)
    if (!deleted) {
        throw new NotFoundError('Resource not found')
    }
}

export async function bulk(input: ResourceBulkInput): Promise<{ affected: number }> {
    if (input.action === 'delete') {
        return { affected: await resourceRepository.deleteByIds(db, input.ids) }
    }

    const status = input.action === 'publish' ? 'published' : 'draft'
    return { affected: await resourceRepository.updateStatusByIds(db, input.ids, status) }
}

export async function getStats(): Promise<ResourceStats> {
    return resourceRepository.stats(db)
}

export async function exportAll(): Promise<ResourceDto[]> {
    const { rows } = await resourceRepository.list(db, {
        page: 1,
        perPage: 1000,
        sort: 'newest',
    })
    return withTags(db, rows)
}

export async function listPublic(): Promise<ResourceDto[]> {
    const rows = await resourceRepository.listPublished(db)
    return withTags(db, rows)
}
