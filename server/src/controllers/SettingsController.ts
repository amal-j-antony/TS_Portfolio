import type { Request, Response } from 'express'
import * as settingsService from '../services/settingsService.js'

export async function get(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ settings: await settingsService.get() })
}

export async function update(req: Request, res: Response): Promise<void> {
    const settings = await settingsService.update(req.body)
    res.status(200).json({ settings })
}
