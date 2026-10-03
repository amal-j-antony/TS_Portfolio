import type { Request, Response } from 'express'
import * as tagService from '../services/tagService.js'

export async function list(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ items: await tagService.list() })
}

export async function create(req: Request, res: Response): Promise<void> {
    const { name } = req.body as { name: string }
    res.status(201).json({ item: await tagService.create(name) })
}

export async function remove(req: Request, res: Response): Promise<void> {
    await tagService.remove(Number(req.params.id))
    res.status(204).send()
}
