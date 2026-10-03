import { Router } from 'express'
import * as SettingsController from '../controllers/SettingsController.js'
import { settingsUpdateSchema } from '../lib/dashboardSchemas.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validate } from '../middleware/validate.js'

export const settingsRouter = Router()

settingsRouter.use(requireAuth)

settingsRouter.get('/', SettingsController.get)
settingsRouter.patch('/', validate({ body: settingsUpdateSchema }), SettingsController.update)
