import { pgTable, uuid, text, smallint, integer, boolean, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core'
import { receiptStatuses } from '@/types/receipt'

export const receiptStatusEnum = pgEnum('receipt_status', receiptStatuses)

export const receiptTypeEnum = pgEnum('receipt_type', [
  'uniform_invoice',
  'receipt',
  'other',
])

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
