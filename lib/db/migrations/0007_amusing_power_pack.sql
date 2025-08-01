-- Step 1: Add the new full_name column (nullable initially)
ALTER TABLE "USERS" ADD COLUMN "full_name" varchar(200);
--> statement-breakpoint

-- Step 2: Populate full_name with concatenated first_name and last_name
UPDATE "USERS" SET "full_name" = "first_name" || ' ' || "last_name";
--> statement-breakpoint

-- Step 3: Make full_name NOT NULL
ALTER TABLE "USERS" ALTER COLUMN "full_name" SET NOT NULL;
--> statement-breakpoint

-- Step 4: Create index for full_name search performance
CREATE INDEX "users_full_name_idx" ON "USERS" ("full_name");
--> statement-breakpoint

-- Step 5: Create index for email search performance
CREATE INDEX "users_email_idx" ON "USERS" ("email");
--> statement-breakpoint

-- Step 6: Drop the old first_name and last_name columns
ALTER TABLE "USERS" DROP COLUMN "first_name";
--> statement-breakpoint
ALTER TABLE "USERS" DROP COLUMN "last_name";
