import {
    boolean,
    index,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
} from 'drizzle-orm/pg-core'

export const resourceTypeEnum = pgEnum('resource_type', [
    'article',
    'tweet',
    'tool',
    'paper',
    'video',
])
export const resourceStatusEnum = pgEnum('resource_status', ['draft', 'published'])

export type ResourceType = (typeof resourceTypeEnum.enumValues)[number]
export type ResourceStatus = (typeof resourceStatusEnum.enumValues)[number]

export const resourcesTable = pgTable(
    'resources',
    {
        id: integer().primaryKey().generatedAlwaysAsIdentity(),
        title: text().notNull(),
        url: text().notNull(),
        sourceDomain: text('source_domain'),
        type: resourceTypeEnum().notNull().default('article'),
        status: resourceStatusEnum().notNull().default('draft'),
        excerpt: text(),
        curatorNote: text('curator_note'),
        metadata: jsonb().$type<Record<string, unknown>>().notNull().default({}),
        featured: boolean().notNull().default(false),
        pinned: boolean().notNull().default(false),
        allowComments: boolean('allow_comments').notNull().default(false),
        reads: integer().notNull().default(0),
        publishedAt: timestamp('published_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    },
    (table) => [
        index('resources_status_idx').on(table.status),
        index('resources_type_idx').on(table.type),
        index('resources_created_at_idx').on(table.createdAt),
        index('resources_source_domain_idx').on(table.sourceDomain),
    ],
)

export const tagsTable = pgTable('tags', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: text().notNull(),
    slug: text().notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

export const resourceTagsTable = pgTable(
    'resource_tags',
    {
        resourceId: integer('resource_id')
            .notNull()
            .references(() => resourcesTable.id, { onDelete: 'cascade' }),
        tagId: integer('tag_id')
            .notNull()
            .references(() => tagsTable.id, { onDelete: 'cascade' }),
    },
    (table) => [primaryKey({ columns: [table.resourceId, table.tagId] })],
)

export const settingsTable = pgTable('settings', {
    key: text().primaryKey(),
    value: jsonb().$type<unknown>().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
