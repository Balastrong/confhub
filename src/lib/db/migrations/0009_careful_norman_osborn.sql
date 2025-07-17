ALTER TABLE "communities" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_slug_unique" UNIQUE("slug");