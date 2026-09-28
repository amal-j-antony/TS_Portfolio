
import { pgTable,integer, text } from "drizzle-orm/pg-core";

export const linksTable = pgTable("linkArchive",{
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    linkName: text(),
    linkUrl: text(),
    
})