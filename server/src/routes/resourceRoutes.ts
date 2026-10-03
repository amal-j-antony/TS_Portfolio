import { Router } from 'express'
import * as ResourceController from '../controllers/ResourceController.js'
import {
    idParamSchema,
    resourceBulkSchema,
    resourceCreateSchema,
    resourceListQuerySchema,
    resourceUpdateSchema,
} from '../lib/dashboardSchemas.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validate } from '../middleware/validate.js'

export const resourceRouter = Router()

resourceRouter.use(requireAuth)

resourceRouter.get('/', validate({ query: resourceListQuerySchema }), ResourceController.list)
resourceRouter.get('/stats', ResourceController.stats)
resourceRouter.get('/export', ResourceController.exportAll)
resourceRouter.post('/', validate({ body: resourceCreateSchema }), ResourceController.create)
resourceRouter.post('/bulk', validate({ body: resourceBulkSchema }), ResourceController.bulk)
resourceRouter.get('/:id', validate({ params: idParamSchema }), ResourceController.get)
resourceRouter.patch(
    '/:id',
    validate({ params: idParamSchema, body: resourceUpdateSchema }),
    ResourceController.update,
)
resourceRouter.delete('/:id', validate({ params: idParamSchema }), ResourceController.remove)
