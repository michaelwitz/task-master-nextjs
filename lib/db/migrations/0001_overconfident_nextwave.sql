ALTER TABLE "PROJECTS" ADD COLUMN "leader_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "PROJECTS" ADD CONSTRAINT "PROJECTS_leader_id_USERS_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."USERS"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROJECTS" DROP COLUMN "leader";