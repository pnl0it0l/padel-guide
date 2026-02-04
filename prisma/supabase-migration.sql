-- Tournament Management System - Database Schema
-- Execute this SQL in Supabase SQL Editor (https://bsgqfnxmmywozfqlxznp.supabase.co)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE "TournamentFormat" AS ENUM ('GROUPS_PLAYOFF', 'DIRECT_PLAYOFF');
CREATE TYPE "MatchFormat" AS ENUM ('BEST_OF_3', 'PRO_SET', 'TIMED');
CREATE TYPE "TournamentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED');
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- NextAuth tables (if not already created)
CREATE TABLE IF NOT EXISTS "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_provider_providerAccountId_key" UNIQUE ("provider", "providerAccountId")
);

CREATE TABLE IF NOT EXISTS "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT UNIQUE,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL UNIQUE,
    "expires" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "VerificationToken_identifier_token_key" UNIQUE ("identifier", "token")
);

-- Tournament tables
CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "format" "TournamentFormat" NOT NULL,
    "matchFormatType" "MatchFormat" NOT NULL,
    "timedDuration" INTEGER,
    "status" "TournamentStatus" NOT NULL DEFAULT 'DRAFT',
    "groupCount" INTEGER,
    "courtsAvailable" INTEGER NOT NULL DEFAULT 1,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Tournament_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Team" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "tournamentId" TEXT NOT NULL,
    "player1Name" TEXT NOT NULL,
    "player2Name" TEXT NOT NULL,
    "teamName" TEXT,
    "seedPosition" INTEGER,
    CONSTRAINT "Team_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Match" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "tournamentId" TEXT NOT NULL,
    "team1Id" TEXT NOT NULL,
    "team2Id" TEXT NOT NULL,
    "court" INTEGER,
    "round" INTEGER NOT NULL,
    "group" TEXT,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "winnerId" TEXT,
    "team1Sets" INTEGER NOT NULL DEFAULT 0,
    "team2Sets" INTEGER NOT NULL DEFAULT 0,
    "sets" JSONB,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    CONSTRAINT "Match_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Add foreign keys for NextAuth if tables already exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Account_userId_fkey'
    ) THEN
        ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Session_userId_fkey'
    ) THEN
        ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS "Tournament_createdBy_idx" ON "Tournament"("createdBy");
CREATE INDEX IF NOT EXISTS "Tournament_status_idx" ON "Tournament"("status");
CREATE INDEX IF NOT EXISTS "Team_tournamentId_idx" ON "Team"("tournamentId");
CREATE INDEX IF NOT EXISTS "Match_tournamentId_idx" ON "Match"("tournamentId");
CREATE INDEX IF NOT EXISTS "Match_status_idx" ON "Match"("status");

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Tournament database schema created successfully!';
END $$;
