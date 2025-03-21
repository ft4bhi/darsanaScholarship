CREATE TABLE IF NOT EXISTS "scholarship" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_number" serial NOT NULL,
	"name" text NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"gender" text NOT NULL,
	"applicationtype" text NOT NULL,
	"category" text NOT NULL,
	"adhar_number" text NOT NULL,
	"father_name" text NOT NULL,
	"father_number" text NOT NULL,
	"mother_name" text,
	"mother_number" text,
	"income" text NOT NULL,
	"father_occupation" text,
	"mother_occupation" text,
	"student_number" text,
	"house_apartment_name" text,
	"place_state" text,
	"post_office" text,
	"country" text NOT NULL,
	"pin_code" text,
	"state" text NOT NULL,
	"district" text NOT NULL,
	"whatsapp_number" text,
	"student_email" text NOT NULL,
	"alternative_number" text,
	"name_of_the_college" text NOT NULL,
	"branch" text NOT NULL,
	"semester" text NOT NULL,
	"hostel_resident" boolean DEFAULT false,
	"cgpa" numeric NOT NULL,
	"bank_name" text NOT NULL,
	"account_number" text NOT NULL,
	"ifsc_code" text NOT NULL,
	"branch_name" text NOT NULL,
	"account_holder" text NOT NULL,
	"photo_url" text,
	"check_url" text,
	"aadhar_card_url" text,
	"college_id_card_url" text,
	"income_url" text,
	"status" text DEFAULT 'Pending',
	"remark" text,
	"application_date" timestamp DEFAULT now(),
	"verifyadmin" text DEFAULT 'null',
	"selectadmin" text DEFAULT 'null',
	"amountadmin" text DEFAULT 'null',
	"rejectadmin" text DEFAULT 'null',
	"revertedadmin" text DEFAULT 'null',
	CONSTRAINT "scholarship_application_number_unique" UNIQUE("application_number"),
	CONSTRAINT "scholarship_adhar_number_unique" UNIQUE("adhar_number"),
	CONSTRAINT "scholarship_student_email_unique" UNIQUE("student_email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_number" integer NOT NULL,
	"status" text NOT NULL,
	"admin_name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "savedata" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_number" serial NOT NULL,
	"name" text,
	"date_of_birth" timestamp,
	"gender" text,
	"applicationtype" text,
	"category" text,
	"adhar_number" text,
	"father_name" text,
	"father_number" text,
	"mother_name" text,
	"mother_number" text,
	"income" text,
	"father_occupation" text,
	"mother_occupation" text,
	"student_number" text,
	"house_apartment_name" text,
	"place_state" text,
	"post_office" text,
	"country" text,
	"pin_code" text,
	"state" text,
	"district" text,
	"whatsapp_number" text,
	"student_email" text,
	"alternative_number" text,
	"name_of_the_college" text,
	"branch" text,
	"semester" text,
	"hostel_resident" boolean DEFAULT false,
	"cgpa" numeric,
	"bank_name" text,
	"account_number" text,
	"ifsc_code" text,
	"branch_name" text,
	"account_holder" text,
	"photo_url" text,
	"check_url" text,
	"aadhar_card_url" text,
	"college_id_card_url" text,
	"income_url" text,
	CONSTRAINT "savedata_application_number_unique" UNIQUE("application_number"),
	CONSTRAINT "savedata_adhar_number_unique" UNIQUE("adhar_number"),
	CONSTRAINT "savedata_student_email_unique" UNIQUE("student_email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "occupations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "occupations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "applyButton" (
	"id" serial PRIMARY KEY NOT NULL,
	"case" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verification_logs" ADD CONSTRAINT "verification_logs_application_number_scholarship_application_number_fk" FOREIGN KEY ("application_number") REFERENCES "public"."scholarship"("application_number") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
