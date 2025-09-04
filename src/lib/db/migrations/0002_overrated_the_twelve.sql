CREATE TABLE "rate_limits" (
	"user_id" text NOT NULL,
	"route" text NOT NULL,
	"window_name" text NOT NULL,
	"window_start" timestamp NOT NULL,
	"expires_at" timestamp NOT NULL,
	"count" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "rate_limits_pk" PRIMARY KEY("user_id","route","window_name","window_start")
);
--> statement-breakpoint
ALTER TABLE "rate_limits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "rate_limits_expires_at_idx" ON "rate_limits" USING btree ("expires_at");