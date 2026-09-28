CREATE TABLE "linkArchive" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "linkArchive_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"linkName" text,
	"linkUrl" text
);
