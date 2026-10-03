import express, { type Express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import { pinoHttp } from 'pino-http'
import { allowedOrigins } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import { authRouter } from './routes/authRoutes.js'
import { mainRouter } from './routes/mainRoutes.js'
import { publicRouter } from './routes/publicRoutes.js'
import { resourceRouter } from './routes/resourceRoutes.js'
import { settingsRouter } from './routes/settingsRoutes.js'
import { tagRouter } from './routes/tagRoutes.js'
import { logger } from './utils/logger.js'

export function createApp(): Express {
    const app = express()

    app.disable('x-powered-by')
    app.use(helmet())
    app.use(cors({ origin: allowedOrigins, credentials: true }))
    app.use(express.json({ limit: '100kb' }))
    app.use(cookieParser())
    app.use(pinoHttp({ logger }))

    app.use(mainRouter)
    app.use('/api/v1/auth', authRouter)
    app.use('/api/v1/public', publicRouter)
    app.use('/api/v1/resources', resourceRouter)
    app.use('/api/v1/tags', tagRouter)
    app.use('/api/v1/settings', settingsRouter)

    app.use(notFound)
    app.use(errorHandler)

    return app
}
