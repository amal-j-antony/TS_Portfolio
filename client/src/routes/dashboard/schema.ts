import { z } from "zod"

export const curateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    url: z.url("Enter a valid URL"),
    sourceDomain: z.string(),
    type: z.enum(["article", "tweet", "tool", "paper", "video"]),
    excerpt: z.string(),
    curatorNote: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean(),
    pinned: z.boolean(),
    allowComments: z.boolean(),
})

export type CurateFormValues = z.infer<typeof curateSchema>
