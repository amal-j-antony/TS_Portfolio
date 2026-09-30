import bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { env } from '../config/env.js'
import { BCRYPT_ROUNDS } from '../lib/constants.js'
import { logger } from '../utils/logger.js'
import { db, pool } from './index.js'
import { usersTable } from './userSchema.js'

async function seedAdmin(): Promise<void> {
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, BCRYPT_ROUNDS)

    await db.transaction(async (tx) => {
        const existing = await tx
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.email, env.ADMIN_EMAIL))
            .limit(1)

        if (existing[0]) {
            await tx
                .update(usersTable)
                .set({ password: passwordHash, updatedAt: new Date() })
                .where(eq(usersTable.id, existing[0].id))
            return
        }

        await tx.insert(usersTable).values({ email: env.ADMIN_EMAIL, password: passwordHash })
    })

    logger.info({ email: env.ADMIN_EMAIL }, 'Admin user seeded')
}

seedAdmin()
    .then(() => pool.end())
    .catch((err: unknown) => {
        logger.error({ err }, 'Seed failed')
        void pool.end()
        process.exit(1)
    })
