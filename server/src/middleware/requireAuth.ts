import type { RequestHandler } from 'express'
import { AUTH_COOKIE_NAME } from '../lib/constants.js'
import { UnauthorizedError } from '../lib/errors.js'
import { verifyToken } from '../services/authService.js'

export const requireAuth: RequestHandler = (req, _res, next) => {
    const token = req.cookies?.[AUTH_COOKIE_NAME]
    if (typeof token !== 'string' || token.length === 0) {
        throw new UnauthorizedError('Authentication required')
    }

    req.user = verifyToken(token)
    next()
}
