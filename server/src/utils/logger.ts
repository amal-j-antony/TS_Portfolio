import pino from 'pino'
import { env } from '../config/env.js'

const isProduction = env.NODE_ENV === 'production'

export const logger = pino({
    level: isProduction ? 'info' : 'debug',
    redact: {
        paths: [
            'req.headers.cookie',
            'req.headers.authorization',
            'res.headers["set-cookie"]',
            'password',
            '*.password',
        ],
        remove: true,
    },
    ...(isProduction
        ? {}
        : {
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                      translateTime: 'SYS:HH:MM:ss.l',
                      ignore: 'pid,hostname',
                  },
              },
          }),
})
