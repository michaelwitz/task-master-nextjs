CREATE TABLE "PROJECTS" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"leader" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TAGS" (
	"tag" varchar(100) PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TASKS" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'todo' NOT NULL,
	"story_points" integer,
	"priority" varchar(20) DEFAULT 'Medium' NOT NULL,
	"assignee_id" integer,
	"description" text,
	"is_blocked" boolean DEFAULT false,
	"blocked_reason" text,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TASK_TAGS" (
	"task_id" integer NOT NULL,
	"tag" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "USERS" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "USERS_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "TASKS" ADD CONSTRAINT "TASKS_project_id_PROJECTS_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."PROJECTS"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TASKS" ADD CONSTRAINT "TASKS_assignee_id_USERS_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."USERS"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TASK_TAGS" ADD CONSTRAINT "TASK_TAGS_task_id_TASKS_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."TASKS"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "TASK_TAGS" ADD CONSTRAINT "TASK_TAGS_tag_TAGS_tag_fk" FOREIGN KEY ("tag") REFERENCES "public"."TAGS"("tag") ON DELETE cascade ON UPDATE no action;