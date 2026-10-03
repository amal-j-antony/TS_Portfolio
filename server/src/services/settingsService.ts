import { db } from '../db/index.js'
import type { SettingsUpdateInput } from '../lib/dashboardSchemas.js'
import * as settingsRepository from '../repositories/settingsRepository.js'

export const defaultSettings = {
    portfolioGrid: true,
    allowPublicComments: false,
    siteTitle: 'Amal.j',
    siteDescription: 'Full Stack Developer',
}

export type DashboardSettings = typeof defaultSettings

export async function get(): Promise<DashboardSettings> {
    const stored = await settingsRepository.getAll(db)
    return { ...defaultSettings, ...stored } as DashboardSettings
}

export async function update(input: SettingsUpdateInput): Promise<DashboardSettings> {
    const entries = Object.entries(input)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => ({ key, value }))

    if (entries.length > 0) {
        await db.transaction(async (tx) => {
            await settingsRepository.upsertMany(tx, entries)
        })
    }

    return get()
}
