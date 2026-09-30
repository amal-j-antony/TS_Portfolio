import { Router } from 'express'

export const mainRouter = Router()

mainRouter.get('/', (_req, res) => {
    res.status(200).json({ status: 'ok' })
})

mainRouter.get('/api/v1/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
})
