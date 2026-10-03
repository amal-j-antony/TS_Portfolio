import { z } from 'zod'

export const resourceTypeSchema = z.enum(['article', 'tweet', 'tool', 'paper'])
export const resourceStatusSchema = z.enum(['draft', 'published'])

export const idParamSchema = z.object({ id: z.coerce.number().int().positive() })

const articleMetadataSchema = z.object({}).default({})

const tweetMetadataSchema = z
    .object({
        author: z
            .object({
                name: z.string(),
                handle: z.string(),
                initials: z.string(),
                verified: z.boolean(),
            })
            .optional(),
        stats: z.object({ likes: z.string(), reposts: z.string() }).optional(),
    })
    .default({})

const toolMetadataSchema = z
    .object({
        engine: z.string().optional(),
        bufferLabel: z.string().optional(),
        actionLabel: z.string().optional(),
        rating: z.string().optional(),
        code: z.string().optional(),
    })
    .default({})

const paperMetadataSchema = z
    .object({
        institution: z.string().optional(),
        citations: z.string().optional(),
        fileSize: z.string().optional(),
        actionLabel: z.string().optional(),
    })
    .default({})

const resourceBaseSchema = z.object({
    title: z.string().min(1).max(300),
    url: z.url(),
    sourceDomain: z.string().max(200).nullish(),
    status: resourceStatusSchema.default('draft'),
    excerpt: z.string().max(2000).nullish(),
    curatorNote: z.string().max(4000).nullish(),
    featured: z.boolean().default(false),
    pinned: z.boolean().default(false),
    allowComments: z.boolean().default(false),
    reads: z.number().int().min(0).default(0),
    tags: z.array(z.string().min(1).max(50)).default([]),
})

export const resourceCreateSchema = z.discriminatedUnion('type', [
    resourceBaseSchema.extend({ type: z.literal('article'), metadata: articleMetadataSchema }),
    resourceBaseSchema.extend({ type: z.literal('tweet'), metadata: tweetMetadataSchema }),
    resourceBaseSchema.extend({ type: z.literal('tool'), metadata: toolMetadataSchema }),
    resourceBaseSchema.extend({ type: z.literal('paper'), metadata: paperMetadataSchema }),
])

export const resourceUpdateSchema = resourceBaseSchema.partial().extend({
    type: resourceTypeSchema.optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
})

export const resourceListQuerySchema = z.object({
    status: resourceStatusSchema.optional(),
    type: resourceTypeSchema.optional(),
    tag: z.string().min(1).optional(),
    domain: z.string().min(1).optional(),
    q: z.string().min(1).optional(),
    page: z.coerce.number().int().positive().default(1),
    perPage: z.coerce.number().int().positive().max(100).default(10),
    sort: z.enum(['newest', 'oldest', 'reads']).default('newest'),
})

export const resourceBulkSchema = z.object({
    action: z.enum(['publish', 'draft', 'delete']),
    ids: z.array(z.coerce.number().int().positive()).min(1).max(200),
})

export const tagCreateSchema = z.object({ name: z.string().min(1).max(50) })

export const settingsUpdateSchema = z
    .object({
        portfolioGrid: z.boolean().optional(),
        allowPublicComments: z.boolean().optional(),
        siteTitle: z.string().min(1).max(120).optional(),
        siteDescription: z.string().max(300).optional(),
    })
    .strict()

export type ResourceCreateInput = z.infer<typeof resourceCreateSchema>
export type ResourceUpdateInput = z.infer<typeof resourceUpdateSchema>
export type ResourceListQuery = z.infer<typeof resourceListQuerySchema>
export type ResourceBulkInput = z.infer<typeof resourceBulkSchema>
export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>
