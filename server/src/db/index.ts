import { neon } from '@neondatabase/serverless'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'


const DB_URL:string | undefined = process.env.DATABASE_URL 
export const sql = neon(DB_URL!)
export const db = drizzle(sql)