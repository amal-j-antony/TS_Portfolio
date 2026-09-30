import { eq } from 'drizzle-orm'
import type { DbClient } from '../db/index.js'
import { usersTable } from '../db/userSchema.js'

export interface UserRecord {
    id: number
    email: string
    password: string
}

const userColumns = {
    id: usersTable.id,
    email: usersTable.email,
    password: usersTable.password,
}

export async function findByEmail(client: DbClient, email: string): Promise<UserRecord | null> {
    const rows = await client.select(userColumns).from(usersTable).where(eq(usersTable.email, email)).limit(1)
    return rows[0] ?? null
}

const publicUserColumns = {
    id: usersTable.id,
    email: usersTable.email,
}

export async function findById(client: DbClient, id: number): Promise<{ id: number; email: string } | null> {
    const rows = await client.select(publicUserColumns).from(usersTable).where(eq(usersTable.id, id)).limit(1)
    return rows[0] ?? null
}

export async function upsertByEmail(
    client: DbClient,
    input: { email: string; password: string },
): Promise<{ id: number; email: string }> {
    const rows = await client
        .insert(usersTable)
        .values(input)
        .onConflictDoUpdate({
            target: usersTable.email,
            set: { password: input.password, updatedAt: new Date() },
        })
        .returning(publicUserColumns)

    const row = rows[0]
    if (!row) {
        throw new Error('Failed to upsert user')
    }
    return row
}
