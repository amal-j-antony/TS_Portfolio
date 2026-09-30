import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../lib/errors.js'
import { logger } from '../utils/logger.js'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ZodError) {
        res.status(400).json({
            error: {
                code: 'VALIDATION_FAILED',
                message: 'Validation failed',
                details: err.issues,
            },
        })
        return
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: {
                code: err.code,
                message: err.message,
                ...(err.details === undefined ? {} : { details: err.details }),
            },
        })
        return
    }

    logger.error({ err }, 'Unhandled error')
    res.status(500).json({
        error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
    })
}
