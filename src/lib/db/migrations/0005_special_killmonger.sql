CREATE TABLE "users_in_community" (
	"user_id" text NOT NULL,
	"community_id" integer NOT NULL,
	CONSTRAINT "users_in_community_user_id_community_id_pk" PRIMARY KEY("user_id","community_id")
);
--> statement-breakpoint
ALTER TABLE "users_in_community" ADD CONSTRAINT "users_in_community_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_in_community" ADD CONSTRAINT "users_in_community_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;