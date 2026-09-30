import type { RequestHandler } from 'express'
import type { ZodType } from 'zod'

interface ValidationSchemas {
    body?: ZodType
    params?: ZodType
    query?: ZodType
}

export function validate(schemas: ValidationSchemas): RequestHandler {
    return (req, _res, next) => {
        if (schemas.body) {
            req.body = schemas.body.parse(req.body)
        }
        if (schemas.params) {
            Object.assign(req.params, schemas.params.parse(req.params))
        }
        if (schemas.query) {
            schemas.query.parse(req.query)
        }
        next()
    }
}
