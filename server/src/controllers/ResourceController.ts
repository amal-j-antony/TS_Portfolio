import type { Request, Response } from 'express'
import type { ResourceListQuery } from '../lib/dashboardSchemas.js'
import * as resourceService from '../services/resourceService.js'

export async function list(_req: Request, res: Response): Promise<void> {
    const query = res.locals.query as ResourceListQuery
    const result = await resourceService.list(query)
    res.status(200).json(result)
}

export async function stats(_req: Request, res: Response): Promise<void> {
    res.status(200).json(await resourceService.getStats())
}

export async function exportAll(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ items: await resourceService.exportAll() })
}

export async function get(req: Request, res: Response): Promise<void> {
    const item = await resourceService.get(Number(req.params.id))
    res.status(200).json({ item })
}

export async function create(req: Request, res: Response): Promise<void> {
    const item = await resourceService.create(req.body)
    res.status(201).json({ item })
}

export async function update(req: Request, res: Response): Promise<void> {
    const item = await resourceService.update(Number(req.params.id), req.body)
    res.status(200).json({ item })
}

export async function remove(req: Request, res: Response): Promise<void> {
    await resourceService.remove(Number(req.params.id))
    res.status(204).send()
}

export async function bulk(req: Request, res: Response): Promise<void> {
    res.status(200).json(await resourceService.bulk(req.body))
}

export async function listPublic(_req: Request, res: Response): Promise<void> {
    res.status(200).json({ items: await resourceService.listPublic() })
}
