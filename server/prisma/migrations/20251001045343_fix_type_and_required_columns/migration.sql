/*
  Migration: 20251001045343_fix_type_and_required_columns

  Fixes:
  1. Safe type change for "Registration"."paymentMode" (String -> Enum) with data migration.
  2. Adds a DEFAULT value for the required new column "Users"."apparId".
*/

-- CreateEnum: Define the new PaymentMode enum first
CREATE TYPE "public"."PaymentMode" AS ENUM ('UPI', 'CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'PENDING_CASH', 'PENDING_NET_BANKING', 'PENDING_CREDIT_CARD', 'PENDING_UPI');

-------------------------------------------------------------------------------------
-- USERS TABLE FIX (Adding required 'apparId' with a default value)
-------------------------------------------------------------------------------------

-- AlterTable: Add the 'apparId' column to the "Users" table with a default of FALSE.
-- This ensures all existing 23 rows get a value and the NOT NULL constraint passes.
ALTER TABLE "public"."Users" ADD COLUMN "apparId" BOOLEAN NOT NULL DEFAULT false;


-------------------------------------------------------------------------------------
-- REGISTRATION TABLE FIX (Changing 'paymentMode' type with data migration)
-------------------------------------------------------------------------------------

-- 1. Add a temporary column with the new Enum type (optional initially)
ALTER TABLE "public"."Registration" ADD COLUMN "paymentMode_new" "public"."PaymentMode";

-- 2a. Migrate valid data from the old String column to the new Enum column
-- NOTE: This UPDATE statement maps your old string values to the new enum values.
UPDATE "public"."Registration"
SET "paymentMode_new" =
    CASE "paymentMode"
        WHEN 'UPI' THEN 'UPI'::"public"."PaymentMode"
        WHEN 'Credit Card' THEN 'CREDIT_CARD'::"public"."PaymentMode"
        WHEN 'Debit Card' THEN 'DEBIT_CARD'::"public"."PaymentMode"
        WHEN 'Net Banking' THEN 'NET_BANKING'::"public"."PaymentMode"
        WHEN 'Cash' THEN 'CASH'::"public"."PaymentMode"
        WHEN 'Pending (Cash)' THEN 'PENDING_CASH'::"public"."PaymentMode"
        WHEN 'Pending (Net Banking)' THEN 'PENDING_NET_BANKING'::"public"."PaymentMode"
        WHEN 'Pending (Credit Card)' THEN 'PENDING_CREDIT_CARD'::"public"."PaymentMode"
        WHEN 'Pending (UPI)' THEN 'PENDING_UPI'::"public"."PaymentMode"
        ELSE NULL -- If no valid match, set to NULL for the next step
    END
WHERE "paymentMode" IS NOT NULL AND "paymentMode" != '';

-- 2b. Force a default value for any rows that were left unmapped (i.e., are still NULL).
-- This handles any bad or missing data from the original column, preventing the NOT NULL error.
UPDATE "public"."Registration"
SET "paymentMode_new" = 'CASH'::"public"."PaymentMode" -- Using 'CASH' as the fallback default
WHERE "paymentMode_new" IS NULL;


-- 3. Drop the old (unsafe) string column
ALTER TABLE "public"."Registration" DROP COLUMN "paymentMode";

-- 4. Rename the new Enum column to the original name
ALTER TABLE "public"."Registration" RENAME COLUMN "paymentMode_new" TO "paymentMode";

-- 5. Make the final column REQUIRED (NOT NULL) as defined in your schema
-- This will now succeed because step 2b ensured no NULL values remain.
ALTER TABLE "public"."Registration" ALTER COLUMN "paymentMode" SET NOT NULL;


-------------------------------------------------------------------------------------
-- OTHER SCHEMA CHANGES (FROM ORIGINAL MIGRATION)
-------------------------------------------------------------------------------------

-- DropTable: If you intended to drop BalanceSheet, keep this line.
DROP TABLE "public"."BalanceSheet";