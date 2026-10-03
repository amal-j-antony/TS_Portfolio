CREATE TYPE "public"."resource_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('article', 'tweet', 'tool', 'paper');--> statement-breakpoint
CREATE TABLE "resource_tags" (
	"resource_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "resource_tags_resource_id_tag_id_pk" PRIMARY KEY("resource_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "resources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"url" text NOT NULL,
	"source_domain" text,
	"type" "resource_type" DEFAULT 'article' NOT NULL,
	"status" "resource_status" DEFAULT 'draft' NOT NULL,
	"excerpt" text,
	"curator_note" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"allow_comments" boolean DEFAULT false NOT NULL,
	"reads" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "resource_tags" ADD CONSTRAINT "resource_tags_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_tags" ADD CONSTRAINT "resource_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "resources_status_idx" ON "resources" USING btree ("status");--> statement-breakpoint
CREATE INDEX "resources_type_idx" ON "resources" USING btree ("type");--> statement-breakpoint
CREATE INDEX "resources_created_at_idx" ON "resources" USING btree ("created_at");