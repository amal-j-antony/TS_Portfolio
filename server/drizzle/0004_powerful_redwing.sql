CREATE INDEX "resources_source_domain_idx" ON "resources" USING btree ("source_domain");--> statement-breakpoint
UPDATE "resources"
SET "source_domain" = NULLIF(split_part(lower(regexp_replace("url", '^https?://(www\.)?', '')), '/', 1), '')
WHERE "source_domain" IS NULL OR "source_domain" = '';--> statement-breakpoint
UPDATE "resources" SET "excerpt" = NULL WHERE "excerpt" = '';--> statement-breakpoint
UPDATE "resources" SET "curator_note" = NULL WHERE "curator_note" = '';