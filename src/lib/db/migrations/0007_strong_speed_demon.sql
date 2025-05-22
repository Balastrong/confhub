CREATE TYPE "public"."user_in_community_role" AS ENUM('admin', 'member');--> statement-breakpoint
ALTER TABLE "users_in_community" RENAME TO "user_in_community";--> statement-breakpoint
ALTER TABLE "user_in_community" DROP CONSTRAINT "users_in_community_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "user_in_community" DROP CONSTRAINT "users_in_community_community_id_communities_id_fk";
--> statement-breakpoint
ALTER TABLE "user_in_community" DROP CONSTRAINT "users_in_community_user_id_community_id_pk";--> statement-breakpoint
ALTER TABLE "user_in_community" ADD CONSTRAINT "user_in_community_user_id_community_id_pk" PRIMARY KEY("user_id","community_id");--> statement-breakpoint
ALTER TABLE "user_in_community" ADD COLUMN "role" "user_in_community_role" DEFAULT 'member';--> statement-breakpoint
ALTER TABLE "user_in_community" ADD CONSTRAINT "user_in_community_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_in_community" ADD CONSTRAINT "user_in_community_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE no action ON UPDATE no action;