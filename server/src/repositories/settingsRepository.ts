import type { DbClient } from '../db/index.js'
import { settingsTable } from '../db/dashboardSchema.js'

export async function getAll(client: DbClient): Promise<Record<string, unknown>> {
    const rows = await client
        .select({ key: settingsTable.key, value: settingsTable.value })
        .from(settingsTable)

    const result: Record<string, unknown> = {}
    for (const row of rows) {
        result[row.key] = row.value
    }
    return result
}

export async function upsertMany(
    client: DbClient,
    entries: Array<{ key: string; value: unknown }>,
): Promise<void> {
    for (const entry of entries) {
        await client
            .insert(settingsTable)
            .values(entry)
            .onConflictDoUpdate({
                target: settingsTable.key,
                set: { value: entry.value, updatedAt: new Date() },
            })
    }
}
