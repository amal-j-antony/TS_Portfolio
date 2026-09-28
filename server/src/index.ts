import express, { type Application } from 'express'
import cors from 'cors'
import { logger } from './utils/logger.js'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import 'dotenv/config'
import { mainRouter } from './routes/mainRoutes.js'

const app:Application = express()

app.use(cors())

app.use(mainRouter)

const PORT = process.env.PORT

app.listen(PORT,()=>{
    logger.info('SERVER STARTED')
})