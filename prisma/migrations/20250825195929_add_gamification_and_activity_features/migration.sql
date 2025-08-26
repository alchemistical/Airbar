-- CreateEnum
CREATE TYPE "public"."TrustLevel" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM');

-- CreateEnum
CREATE TYPE "public"."UserMode" AS ENUM ('SENDER', 'TRAVELER', 'DUAL');

-- CreateEnum
CREATE TYPE "public"."ActivityEventType" AS ENUM ('MATCH_FOUND', 'TRIP_POSTED', 'PACKAGE_DELIVERED', 'PAYMENT_RECEIVED', 'REVIEW_RECEIVED', 'ACHIEVEMENT_EARNED');

-- AlterTable
ALTER TABLE "public"."matches" ADD COLUMN     "ai_confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "compatibility_factors" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "match_score" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "public"."profiles" ADD COLUMN     "badges" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "last_activity_date" TIMESTAMP(3),
ADD COLUMN     "streak_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_earnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "total_savings" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "trust_level" "public"."TrustLevel" NOT NULL DEFAULT 'BRONZE';

-- CreateTable
CREATE TABLE "public"."activity_events" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "event_type" "public"."ActivityEventType" NOT NULL,
    "event_data" JSONB NOT NULL,
    "display_message" TEXT NOT NULL,
    "action_url" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 1,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "preferred_mode" "public"."UserMode" NOT NULL DEFAULT 'DUAL',
    "dashboard_layout" JSONB NOT NULL DEFAULT '{}',
    "notification_settings" JSONB NOT NULL DEFAULT '{}',
    "matching_preferences" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_events_user_id_created_at_idx" ON "public"."activity_events"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "activity_events_user_id_is_read_idx" ON "public"."activity_events"("user_id", "is_read");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "public"."user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "matches_match_score_idx" ON "public"."matches"("match_score");

-- AddForeignKey
ALTER TABLE "public"."activity_events" ADD CONSTRAINT "activity_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
