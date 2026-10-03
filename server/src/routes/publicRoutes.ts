import { Router } from 'express'
import * as ResourceController from '../controllers/ResourceController.js'

export const publicRouter = Router()

publicRouter.get('/resources', ResourceController.listPublic)
