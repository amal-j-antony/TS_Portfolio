export class AppError extends Error {
    readonly statusCode: number
    readonly code: string
    readonly details?: unknown

    constructor(message: string, statusCode: number, code: string, details?: unknown) {
        super(message)
        this.name = new.target.name
        this.statusCode = statusCode
        this.code = code
        this.details = details
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, 401, 'UNAUTHORIZED')
    }
}

export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, 403, 'FORBIDDEN')
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not found') {
        super(message, 404, 'NOT_FOUND')
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict') {
        super(message, 409, 'CONFLICT')
    }
}
