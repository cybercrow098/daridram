/*
  # Add Year of Breach Field to Databases

  1. Changes
    - Add `year_of_breach` column to `databases` table
    - Column is nullable integer to store the year (e.g., 2023)

  2. Notes
    - Existing records will have NULL for this field until updated
*/

ALTER TABLE databases
ADD COLUMN IF NOT EXISTS year_of_breach integer;
