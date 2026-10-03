import { ConflictError, NotFoundError } from '../lib/errors.js'
import { db } from '../db/index.js'
import * as tagRepository from '../repositories/tagRepository.js'
import type { TagRecord, TagWithCount } from '../repositories/tagRepository.js'

export function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export async function list(): Promise<TagWithCount[]> {
    return tagRepository.list(db)
}

export async function create(name: string): Promise<TagRecord> {
    const slug = slugify(name)
    if (!slug) {
        throw new ConflictError('Invalid tag name')
    }

    const existing = await tagRepository.findBySlug(db, slug)
    if (existing) {
        throw new ConflictError('Tag already exists')
    }

    return tagRepository.create(db, { name: name.trim(), slug })
}

export async function remove(id: number): Promise<void> {
    const deleted = await tagRepository.remove(db, id)
    if (!deleted) {
        throw new NotFoundError('Tag not found')
    }
}
