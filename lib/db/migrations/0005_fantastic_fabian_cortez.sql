ALTER TABLE "PROJECTS" ADD COLUMN "next_task_sequence" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "TASKS" ADD COLUMN "task_id" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "TASKS" ADD CONSTRAINT "TASKS_task_id_unique" UNIQUE("task_id");