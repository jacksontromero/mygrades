CREATE TABLE IF NOT EXISTS "mygrades_account" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "mygrades_account_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mygrades_published_class" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"name" varchar(255) NOT NULL,
	"number" varchar(255) NOT NULL,
	"weights" jsonb NOT NULL,
	"university" varchar(255) NOT NULL,
	"semester" varchar(255),
	"num_users" integer DEFAULT 0 NOT NULL,
	"num_inaccurate_reports" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mygrades_saved_store" (
	"created_by" varchar(255) PRIMARY KEY NOT NULL,
	"updated_at" timestamp with time zone,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mygrades_session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mygrades_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mygrades_verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "mygrades_verification_token_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mygrades_account" ADD CONSTRAINT "mygrades_account_user_id_mygrades_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mygrades_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mygrades_saved_store" ADD CONSTRAINT "mygrades_saved_store_created_by_mygrades_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."mygrades_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mygrades_session" ADD CONSTRAINT "mygrades_session_user_id_mygrades_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."mygrades_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "mygrades_account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_search_idx" ON "mygrades_published_class" USING gin ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "number__search_idx" ON "mygrades_published_class" USING gin ("number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "mygrades_session" USING btree ("user_id");