import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { env } from '../config/env.js'
import { BCRYPT_ROUNDS } from '../lib/constants.js'
import { logger } from '../utils/logger.js'
import { db, pool } from './index.js'
import { resourceTagsTable, resourcesTable, tagsTable } from './dashboardSchema.js'
import { usersTable } from './userSchema.js'

async function seedAdmin(credentials: { email: string; password: string }): Promise<void> {
    const passwordHash = await bcrypt.hash(credentials.password, BCRYPT_ROUNDS)

    await db.transaction(async (tx) => {
        const existing = await tx
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.email, credentials.email))
            .limit(1)

        if (existing[0]) {
            await tx
                .update(usersTable)
                .set({ password: passwordHash, updatedAt: new Date() })
                .where(eq(usersTable.id, existing[0].id))
            return
        }

        await tx.insert(usersTable).values({ email: credentials.email, password: passwordHash })
    })

    logger.info({ email: credentials.email }, 'Admin user seeded')
}

type SeedResourceType = 'article' | 'tweet' | 'tool' | 'paper' | 'video'
type SeedResourceStatus = 'draft' | 'published'

interface SeedResource {
    title: string
    url: string
    sourceDomain: string
    type: SeedResourceType
    status: SeedResourceStatus
    excerpt: string
    curatorNote?: string
    metadata?: Record<string, unknown>
    featured?: boolean
    pinned?: boolean
    allowComments?: boolean
    reads?: number
    daysAgo: number
    tags: string[]
}

const seedResources: SeedResource[] = [
    {
        title: 'How Distributed SQLite Systems like Turso and Litestream Work',
        url: 'https://turso.tech/blog/distributed-sqlite',
        sourceDomain: 'turso.tech',
        type: 'article',
        status: 'published',
        excerpt:
            'Deep dive into physical WAL replication, vector search extension integration, and edge-native zero-latency reads.',
        featured: true,
        reads: 1800,
        daysAgo: 3,
        tags: ['databases', 'sqlite', 'systems'],
    },
    {
        title: 'ShaderToy GLSL Sandbox & Procedural Noise Algorithms',
        url: 'https://www.shadertoy.com/view/sandbox',
        sourceDomain: 'shadertoy.com',
        type: 'tool',
        status: 'published',
        excerpt:
            'Collection of Raymarching SDF formulas, volumetric cloud rendering tricks, and fragment shader math reference.',
        metadata: { engine: 'WebGL 2.0', bufferLabel: 'Procedural Buffer A', actionLabel: 'Launch Demo' },
        reads: 940,
        daysAgo: 7,
        tags: ['webgl', 'shaders', 'math'],
    },
    {
        title: 'Crafting Micro-interactions with Framer Motion and Radix UI',
        url: 'https://motion.dev/blog/micro-interactions',
        sourceDomain: 'motion.dev',
        type: 'article',
        status: 'published',
        excerpt:
            'Techniques for eliminating layout thrash during complex modal mounts and orchestrating tactile spring-driven gestural dismissals.',
        curatorNote:
            'Amal Note: Check spring physics config: stiffness 380, damping 28 for zero rubberband lag.',
        pinned: true,
        reads: 3100,
        daysAgo: 7,
        tags: ['ui-ux', 'animation', 'frontend'],
    },
    {
        title: 'Guillermo Rauch on Server Components & Instant-first Architecture',
        url: 'https://x.com/rauchg/status/server-components',
        sourceDomain: 'x.com',
        type: 'tweet',
        status: 'published',
        excerpt:
            'The shift from request-waterfalls to pre-rendered streaming graph partitions represents the single biggest architectural win for low-latency web.',
        metadata: {
            author: { name: 'Guillermo Rauch', handle: '@rauchg', initials: 'GR', verified: true },
            stats: { likes: '482', reposts: '92' },
        },
        reads: 482,
        daysAgo: 3,
        tags: ['rsc', 'architecture'],
    },
    {
        title: 'vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention',
        url: 'https://arxiv.org/abs/2309.06180',
        sourceDomain: 'arxiv.org',
        type: 'paper',
        status: 'draft',
        excerpt:
            'Virtual memory translation principles applied to Transformer KV cache management, reducing GPU fragmentation by 96%.',
        metadata: {
            institution: 'UC Berkeley',
            citations: '4,120 Citations',
            fileSize: 'PDF 2.4MB',
            actionLabel: 'Read Paper',
        },
        daysAgo: 1,
        tags: ['ai-systems', 'inference'],
    },
    {
        title: 'Nuqs — Type-safe Search Params State Manager for React',
        url: 'https://nuqs.47ng.com',
        sourceDomain: 'nuqs.47ng.com',
        type: 'tool',
        status: 'draft',
        excerpt:
            'Parse URL query parameters directly into standard React state with zero-runtime schemas and optimistic updates.',
        metadata: { rating: '4.8k', code: 'npm i nuqs', actionLabel: 'Open Docs' },
        daysAgo: 2,
        tags: ['react', 'typescript'],
    },
    {
        title: 'Understanding React Server Components',
        url: 'https://react.dev/reference/rsc/server-components',
        sourceDomain: 'react.dev',
        type: 'article',
        status: 'published',
        excerpt:
            'The official mental model for the server/client boundary, serialization rules, and when to reach for client components.',
        reads: 2200,
        daysAgo: 12,
        tags: ['react', 'rsc', 'architecture'],
    },
    {
        title: 'Types are tests: property-based testing in TypeScript',
        url: 'https://x.com/typescript/status/property-based',
        sourceDomain: 'x.com',
        type: 'tweet',
        status: 'draft',
        excerpt: 'Treating the type system as a test harness for invariants that runtime tests rarely reach.',
        metadata: {
            author: { name: 'TypeScript', handle: '@typescript', initials: 'TS', verified: true },
            stats: { likes: '318', reposts: '54' },
        },
        daysAgo: 5,
        tags: ['typescript', 'systems'],
    },
    {
        title: 'Build a Realtime Collaborative Editor — Architecture Walkthrough',
        url: 'https://www.youtube.com/watch?v=scoped-architecture-walkthrough',
        sourceDomain: 'youtube.com',
        type: 'video',
        status: 'published',
        excerpt:
            'A full walkthrough of CRDT-based collaboration, presence, and conflict-free merges in a production editor.',
        reads: 1260,
        daysAgo: 4,
        tags: ['react', 'architecture'],
    },
]

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

function daysAgo(days: number): Date {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000)
}

async function seedDashboardData(): Promise<void> {
    const tagNames = Array.from(new Set(seedResources.flatMap((resource) => resource.tags)))

    await db.transaction(async (tx) => {
        if (tagNames.length > 0) {
            await tx
                .insert(tagsTable)
                .values(tagNames.map((name) => ({ name, slug: slugify(name) })))
                .onConflictDoNothing({ target: tagsTable.slug })
        }

        const existing = await tx.select({ id: resourcesTable.id }).from(resourcesTable).limit(1)
        if (existing[0]) {
            logger.info('Resources already present, skipping dashboard seed')
            return
        }

        const tagRows = await tx.select({ id: tagsTable.id, slug: tagsTable.slug }).from(tagsTable)
        const tagIdBySlug = new Map(tagRows.map((row) => [row.slug, row.id]))

        for (const resource of seedResources) {
            const publishedAt = resource.status === 'published' ? daysAgo(resource.daysAgo) : null
            const inserted = await tx
                .insert(resourcesTable)
                .values({
                    title: resource.title,
                    url: resource.url,
                    sourceDomain: resource.sourceDomain,
                    type: resource.type,
                    status: resource.status,
                    excerpt: resource.excerpt,
                    curatorNote: resource.curatorNote ?? null,
                    metadata: resource.metadata ?? {},
                    featured: resource.featured ?? false,
                    pinned: resource.pinned ?? false,
                    allowComments: resource.allowComments ?? false,
                    reads: resource.reads ?? 0,
                    publishedAt,
                    createdAt: daysAgo(resource.daysAgo),
                    updatedAt: daysAgo(resource.daysAgo),
                })
                .returning({ id: resourcesTable.id })

            const resourceId = inserted[0]?.id
            if (resourceId === undefined) continue

            const links = resource.tags
                .map((tag) => ({ resourceId, tagId: tagIdBySlug.get(slugify(tag)) }))
                .filter((link): link is { resourceId: number; tagId: number } => link.tagId !== undefined)

            if (links.length > 0) {
                await tx.insert(resourceTagsTable).values(links).onConflictDoNothing()
            }
        }
    })

    logger.info({ count: seedResources.length }, 'Dashboard resources seeded')
}

function requireAdminCredentials(): { email: string; password: string } {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = env
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        logger.error('ADMIN_EMAIL and ADMIN_PASSWORD are required to run db:seed')
        process.exit(1)
    }
    return { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
}

const adminCredentials = requireAdminCredentials()

Promise.all([seedAdmin(adminCredentials), seedDashboardData()])
    .then(() => pool.end())
    .catch((err: unknown) => {
        logger.error({ err }, 'Seed failed')
        void pool.end()
        process.exit(1)
    })
