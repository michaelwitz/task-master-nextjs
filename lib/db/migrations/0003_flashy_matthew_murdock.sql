CREATE TABLE "IMAGE_DATA" (
	"id" integer PRIMARY KEY NOT NULL,
	"data" text NOT NULL,
	"thumbnail_data" text
);
--> statement-breakpoint
CREATE TABLE "IMAGE_METADATA" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"content_type" varchar(100) NOT NULL,
	"file_size" integer NOT NULL,
	"url" varchar(500) NOT NULL,
	"storage_type" varchar(20) DEFAULT 'local' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "PROJECTS" ADD COLUMN "code" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "PROJECTS" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "IMAGE_DATA" ADD CONSTRAINT "IMAGE_DATA_id_IMAGE_METADATA_id_fk" FOREIGN KEY ("id") REFERENCES "public"."IMAGE_METADATA"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "IMAGE_METADATA" ADD CONSTRAINT "IMAGE_METADATA_task_id_TASKS_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."TASKS"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROJECTS" ADD CONSTRAINT "PROJECTS_code_unique" UNIQUE("code");