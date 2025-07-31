-- Migration: Add code and description fields to PROJECTS table
-- This migration adds:
-- 1. code: varchar(10) NOT NULL UNIQUE - project code (ALL CAPS letters only, max 10 chars)
-- 2. description: text NULLABLE - markdown description of project

-- Step 1: Add the new columns as nullable first
ALTER TABLE "PROJECTS" 
ADD COLUMN "code" varchar(10),
ADD COLUMN "description" text;

-- Step 2: Populate existing projects with proper codes (ALL CAPS, letters only)
-- Generate codes based on project titles, removing spaces and non-letters
UPDATE "PROJECTS" 
SET "code" = CASE 
    WHEN title = 'Website Redesign' THEN 'WEBSITE'
    WHEN title = 'Mobile App Development' THEN 'MOBILEAPP'
    WHEN title = 'Database Migration' THEN 'DBMIGRATE'
    WHEN title = 'API Integration' THEN 'APIINT'
    WHEN title = 'Security Audit' THEN 'SECURITY'
    ELSE UPPER(SUBSTRING(REGEXP_REPLACE(title, '[^A-Za-z]', '', 'g'), 1, 10))
END
WHERE "code" IS NULL;

-- Step 3: Add some sample descriptions for existing projects
UPDATE "PROJECTS" 
SET "description" = CASE 
    WHEN title = 'Website Redesign' THEN '# Website Redesign Project

## Overview
Complete overhaul of the company website to improve user experience and modernize the design.

## Objectives
- Improve user engagement and conversion rates
- Implement responsive design for all devices
- Optimize for search engines (SEO)
- Enhance page load performance

## Key Features
- Modern, clean design
- Mobile-first approach
- Fast loading times
- Accessibility compliance'
    
    WHEN title = 'Mobile App Development' THEN '# Mobile App Development

## Overview
Develop a cross-platform mobile application using React Native to expand our digital presence.

## Objectives
- Create native mobile experience for iOS and Android
- Integrate with existing API infrastructure
- Provide offline functionality
- Implement push notifications

## Technology Stack
- React Native
- TypeScript
- Redux for state management
- Firebase for analytics'
    
    WHEN title = 'Database Migration' THEN '# Database Migration Project

## Overview
Migrate our current database infrastructure to a more scalable and performant solution.

## Objectives
- Improve database performance
- Enhance data security
- Implement better backup strategies
- Reduce operational costs

## Migration Plan
1. **Backup**: Create comprehensive backups
2. **Schema**: Update database schema
3. **Data Transfer**: Migrate all existing data
4. **Testing**: Verify data integrity
5. **Cutover**: Switch to new database'
    
    WHEN title = 'API Integration' THEN '# API Integration Project

## Overview
Integrate third-party services to enhance our platform capabilities.

## Objectives
- Implement payment processing
- Add email marketing capabilities
- Integrate analytics services
- Enhance user authentication

## Services to Integrate
- **Payment**: Stripe for payment processing
- **Email**: SendGrid for transactional emails
- **Analytics**: Google Analytics for insights
- **Auth**: OAuth providers for social login'
    
    WHEN title = 'Security Audit' THEN '# Security Audit Project

## Overview
Comprehensive security assessment of our entire technology stack.

## Objectives
- Identify security vulnerabilities
- Implement security best practices
- Ensure compliance with regulations
- Protect user data and privacy

## Audit Scope
- **Application Security**: Code review and vulnerability testing
- **Infrastructure**: Server and network security
- **Data Protection**: Encryption and access controls
- **Compliance**: GDPR, SOC2, and industry standards'
    
    ELSE NULL
END
WHERE "description" IS NULL;

-- Step 4: Make the code column NOT NULL and UNIQUE
ALTER TABLE "PROJECTS" 
ALTER COLUMN "code" SET NOT NULL;

ALTER TABLE "PROJECTS" 
ADD CONSTRAINT "PROJECTS_code_unique" UNIQUE ("code");

-- Step 5: Add index for better performance
CREATE INDEX "idx_projects_code" ON "PROJECTS" ("code");

-- Verification query to check the migration
SELECT id, title, code, LENGTH(description) as desc_length, created_at 
FROM "PROJECTS" 
ORDER BY created_at;

COMMIT;
