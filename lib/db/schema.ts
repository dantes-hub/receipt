import { pgTable, uuid, text, smallint, integer, boolean, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core'
import {
  receiptDocumentTypeValues,
  receiptProcessingJobStatusValues,
  receiptStatusValues,
} from '@/lib/receipts/model'

export const receiptStatusEnum = pgEnum('receipt_status', receiptStatusValues)
export const receiptTypeEnum = pgEnum('receipt_type', receiptDocumentTypeValues)
export const receiptProcessingJobStatusEnum = pgEnum('receipt_processing_job_status', receiptProcessingJobStatusValues)

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  displayName: text('display_name'),
  businessName: text('business_name'),
  ubn: text('ubn'),
  businessAddress: text('business_address'),
  accountantName: text('accountant_name'),
  accountantFirm: text('accountant_firm'),
  accountantEmail: text('accountant_email'),
  preferredFormat: text('preferred_format').default('xlsx'),
  notifyEmail: boolean('notify_email').default(true),
  notifyMonthly: boolean('notify_monthly').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const receipts = pgTable('receipts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  imagePath: text('image_path').notNull(),
  status: receiptStatusEnum('status').notNull().default('pending'),
  receiptType: receiptTypeEnum('receipt_type'),
  extractedData: jsonb('extracted_data'),
  confidenceScores: jsonb('confidence_scores'),
  validationResults: jsonb('validation_results'),
  aiModel: text('ai_model'),
  processingMs: integer('processing_ms'),
  periodYear: smallint('period_year'),
  periodMonth: smallint('period_month'),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const receiptCorrections = pgTable('receipt_corrections', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptId: uuid('receipt_id').notNull(),
  userId: uuid('user_id').notNull(),
  fieldName: text('field_name').notNull(),
  oldValue: text('old_value'),
  newValue: text('new_value'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const validationLogs = pgTable('validation_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptId: uuid('receipt_id').notNull(),
  validatorName: text('validator_name').notNull(),
  passed: boolean('passed').notNull(),
  inputValue: text('input_value'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const exportBatches = pgTable('export_batches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  periodYear: smallint('period_year').notNull(),
  periodMonth: smallint('period_month').notNull(),
  filePath: text('file_path'),
  receiptCount: integer('receipt_count'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const receiptProcessingJobs = pgTable('receipt_processing_jobs', {
  id: uuid('id').primaryKey().defaultRandom(),
  receiptId: uuid('receipt_id').notNull(),
  userId: uuid('user_id').notNull(),
  storagePath: text('storage_path').notNull(),
  originalFilename: text('original_filename').notNull(),
  mimeType: text('mime_type').notNull(),
  status: receiptProcessingJobStatusEnum('status').notNull().default('pending'),
  attempts: integer('attempts').notNull().default(0),
  maxAttempts: integer('max_attempts').notNull().default(3),
  availableAt: timestamp('available_at', { withTimezone: true }).defaultNow().notNull(),
  lockedAt: timestamp('locked_at', { withTimezone: true }),
  startedAt: timestamp('started_at', { withTimezone: true }),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
  lastAttemptAt: timestamp('last_attempt_at', { withTimezone: true }),
  lastError: text('last_error'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
