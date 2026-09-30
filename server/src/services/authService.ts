import bcrypt from 'bcrypt'
import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken'
import { env } from '../config/env.js'
import { db } from '../db/index.js'
import { UnauthorizedError } from '../lib/errors.js'
import { findByEmail, findById } from '../repositories/userRepository.js'

export interface AuthUser {
    id: number
    email: string
}

export async function login(email: string, password: string): Promise<AuthUser> {
    const user = await findByEmail(db, email)
    if (!user) {
        throw new UnauthorizedError('Invalid email or password')
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
        throw new UnauthorizedError('Invalid email or password')
    }

    return { id: user.id, email: user.email }
}

export function signToken(user: AuthUser): string {
    return jwt.sign({ sub: String(user.id), email: user.email }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as NonNullable<SignOptions['expiresIn']>,
    })
}

export function verifyToken(token: string): AuthUser {
    let payload: string | JwtPayload
    try {
        payload = jwt.verify(token, env.JWT_SECRET)
    } catch {
        throw new UnauthorizedError('Invalid or expired session')
    }

    if (typeof payload === 'string' || !payload.sub) {
        throw new UnauthorizedError('Invalid or expired session')
    }

    return { id: Number(payload.sub), email: String(payload.email ?? '') }
}

export async function getUserById(id: number): Promise<AuthUser | null> {
    const user = await findById(db, id)
    return user ? { id: user.id, email: user.email } : null
}
