import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.url(),
    DATABASE_URL_POOLED: z.url(),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    ADMIN_EMAIL: z.email().optional(),
    ADMIN_PASSWORD: z.string().min(8).optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error('Invalid environment configuration:')
    console.error(parsed.error.issues)
    process.exit(1)
}

export const env = parsed.data

export const allowedOrigins = env.CORS_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
