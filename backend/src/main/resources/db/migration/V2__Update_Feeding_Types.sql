-- Update feeding_type check constraint to support new feeding types

-- Drop the old constraint
ALTER TABLE feeding_records DROP CONSTRAINT IF EXISTS feeding_records_feeding_type_check;

-- Add the new constraint with updated feeding types
ALTER TABLE feeding_records ADD CONSTRAINT feeding_records_feeding_type_check
    CHECK (feeding_type IN ('BREAST_LEFT', 'BREAST_RIGHT', 'BREAST_BOTH', 'BOTTLE_FORMULA', 'BOTTLE_BREAST_MILK', 'SOLID_FOOD'));