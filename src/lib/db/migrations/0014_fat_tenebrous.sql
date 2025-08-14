CREATE TABLE "event_comments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"rating" integer,
	"parent_id" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_parent_id_event_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."event_comments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "event_comments_event_id_idx" ON "event_comments" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_comments_parent_id_idx" ON "event_comments" USING btree ("parent_id");