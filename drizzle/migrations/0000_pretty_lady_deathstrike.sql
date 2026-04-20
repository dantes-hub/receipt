CREATE TYPE "public"."receipt_status" AS ENUM('pending', 'extracting', 'review', 'confirmed', 'error');--> statement-breakpoint
CREATE TYPE "public"."receipt_type" AS ENUM('uniform_invoice', 'receipt', 'other');--> statement-breakpoint
CREATE TABLE "export_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period_year" smallint NOT NULL,
	"period_month" smallint NOT NULL,
	"file_path" text,
	"receipt_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" text,
	"business_name" text,
	"ubn" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipt_corrections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"receipt_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"field_name" text NOT NULL,
	"old_value" text,
	"new_value" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"image_path" text NOT NULL,
	"status" "receipt_status" DEFAULT 'pending' NOT NULL,
	"receipt_type" "receipt_type",
	"extracted_data" jsonb,
	"confidence_scores" jsonb,
	"validation_results" jsonb,
	"ai_model" text,
	"processing_ms" integer,
	"period_year" smallint,
	"period_month" smallint,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "validation_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"receipt_id" uuid NOT NULL,
	"validator_name" text NOT NULL,
	"passed" boolean NOT NULL,
	"input_value" text,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
