-- Update feeding_type constraint to replace BREAST_BOTH with BREAST_START_LEFT and BREAST_START_RIGHT

-- Step 1: Drop the old constraint first
ALTER TABLE feeding_records DROP CONSTRAINT IF EXISTS feeding_records_feeding_type_check;

-- Step 2: Update existing BREAST_BOTH records to BREAST_START_LEFT (as default)
UPDATE feeding_records
SET feeding_type = 'BREAST_START_LEFT'
WHERE feeding_type = 'BREAST_BOTH';

-- Step 3: Add the new constraint with updated feeding types
ALTER TABLE feeding_records ADD CONSTRAINT feeding_records_feeding_type_check
    CHECK (feeding_type IN ('BREAST_LEFT', 'BREAST_RIGHT', 'BREAST_START_LEFT', 'BREAST_START_RIGHT', 'BOTTLE_FORMULA', 'BOTTLE_BREAST_MILK', 'SOLID_FOOD'));

