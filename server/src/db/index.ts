import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { env } from '../config/env.js'

export const pool = new Pool({ connectionString: env.DATABASE_URL_POOLED })
export const db = drizzle(pool)

export type Db = typeof db
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0]
export type DbClient = Db | Tx
