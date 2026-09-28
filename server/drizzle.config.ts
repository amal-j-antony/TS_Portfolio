import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const baseSchemaURL:string = './src/db'

export default defineConfig({
  out: './drizzle',
  schema: [`${baseSchemaURL}/schema.ts`,`${baseSchemaURL}/user.ts`],
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});

