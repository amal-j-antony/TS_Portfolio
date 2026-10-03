import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'

interface ValidationSchemas {
    body?: ZodType
    params?: ZodType
    query?: ZodType
}

export function validate(schemas: ValidationSchemas): RequestHandler {
    return (req, res, next) => {
        if (schemas.body) {
            req.body = schemas.body.parse(req.body)
        }
        if (schemas.params) {
            Object.assign(req.params, schemas.params.parse(req.params))
        }
        if (schemas.query) {
            // Express 5 exposes `req.query` as a read-only getter, so the parsed
            // (and coerced) result is handed to controllers via `res.locals`.
            res.locals.query = schemas.query.parse(req.query)
        }
        next()
    }
}
