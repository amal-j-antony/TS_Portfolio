import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const baseSchemaURL = './src/db'

export default defineConfig({
  out: './drizzle',
  schema: [
    `${baseSchemaURL}/schema.ts`,
    `${baseSchemaURL}/userSchema.ts`,
    `${baseSchemaURL}/dashboardSchema.ts`,
  ],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

