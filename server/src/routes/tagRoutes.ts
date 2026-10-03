import { Router } from 'express'
import * as TagController from '../controllers/TagController.js'
import { idParamSchema, tagCreateSchema } from '../lib/dashboardSchemas.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validate } from '../middleware/validate.js'

export const tagRouter = Router()

tagRouter.use(requireAuth)

tagRouter.get('/', TagController.list)
tagRouter.post('/', validate({ body: tagCreateSchema }), TagController.create)
tagRouter.delete('/:id', validate({ params: idParamSchema }), TagController.remove)
