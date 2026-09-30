import type { Request, Response } from 'express'
import { env } from '../config/env.js'
import { AUTH_COOKIE_MAX_AGE_MS, AUTH_COOKIE_NAME } from '../lib/constants.js'
import * as authService from '../services/authService.js'

const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
} as const

export async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email: string; password: string }
    const user = await authService.login(email, password)

    res.cookie(AUTH_COOKIE_NAME, authService.signToken(user), {
        ...cookieOptions,
        maxAge: AUTH_COOKIE_MAX_AGE_MS,
    })
    res.status(200).json({ user })
}

export function logout(_req: Request, res: Response): void {
    res.clearCookie(AUTH_COOKIE_NAME, cookieOptions)
    res.status(204).send()
}

export function me(req: Request, res: Response): void {
    if (!req.user) {
        res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Authentication required' } })
        return
    }

    res.status(200).json({ user: req.user })
}
