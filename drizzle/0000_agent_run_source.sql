CREATE TYPE "public"."agent_run_source" AS ENUM('cron', 'manual_free', 'manual_pro');--> statement-breakpoint
ALTER TABLE "agent_runs" ADD COLUMN "run_source" "agent_run_source" DEFAULT 'cron' NOT NULL;
