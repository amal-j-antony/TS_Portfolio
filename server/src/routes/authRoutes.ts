import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import * as AuthController from '../controllers/AuthController.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { validate } from '../middleware/validate.js'

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
})

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: { code: 'RATE_LIMITED', message: 'Too many login attempts, try again later' },
    },
})

export const authRouter = Router()

authRouter.post('/login', loginLimiter, validate({ body: loginSchema }), AuthController.login)
authRouter.post('/logout', AuthController.logout)
authRouter.get('/me', requireAuth, AuthController.me)
