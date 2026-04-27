DO $$
BEGIN
  CREATE TYPE "receipt_processing_job_status" AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "receipt_processing_jobs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "receipt_id" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "storage_path" text NOT NULL,
  "original_filename" text NOT NULL,
  "mime_type" text NOT NULL,
  "status" "receipt_processing_job_status" NOT NULL DEFAULT 'pending',
  "attempts" integer NOT NULL DEFAULT 0,
  "max_attempts" integer NOT NULL DEFAULT 3,
  "available_at" timestamp with time zone NOT NULL DEFAULT now(),
  "locked_at" timestamp with time zone,
  "started_at" timestamp with time zone,
  "finished_at" timestamp with time zone,
  "last_attempt_at" timestamp with time zone,
  "last_error" text,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "receipt_processing_jobs_status_available_idx"
  ON "receipt_processing_jobs" ("status", "available_at");

CREATE INDEX IF NOT EXISTS "receipt_processing_jobs_receipt_idx"
  ON "receipt_processing_jobs" ("receipt_id");
