CREATE TABLE IF NOT EXISTS "mygrades_users_to_inacc_reports" (
	"user_id" varchar(255) NOT NULL,
	"class_id" varchar(255) NOT NULL,
	CONSTRAINT "mygrades_users_to_inacc_reports_user_id_class_id_pk" PRI
	RY KEY("user_id","class_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mygrades_users_to_inacc_reports" ADD CONSTRAINT "mygrades_users_to_inacc_reports_user_id_mygrades_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mygrades_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mygrades_users_to_inacc_reports" ADD CONSTRAINT "mygrades_users_to_inacc_reports_class_id_mygrades_published_class_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."mygrades_published_class"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "mygrades_published_class" DROP COLUMN IF EXISTS "semester";
