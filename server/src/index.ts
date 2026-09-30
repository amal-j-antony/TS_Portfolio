import { createApp } from './app.js'
import { env } from './config/env.js'
import { pool } from './db/index.js'
import { logger } from './utils/logger.js'

const app = createApp()

const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'Server started')
})

function shutdown(signal: NodeJS.Signals): void {
    logger.info({ signal }, 'Shutting down')

    server.close(() => {
        void pool.end().then(() => process.exit(0))
    })
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))
