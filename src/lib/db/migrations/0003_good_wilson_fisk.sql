CREATE TABLE "communities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "communities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"home_url" text
);
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "name" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "tags" SET DATA TYPE text[];--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "date_end" date;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "cfp_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "cfp_closing_date" date;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "mode" "eventMode";--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "draft" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "community_id" integer;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;