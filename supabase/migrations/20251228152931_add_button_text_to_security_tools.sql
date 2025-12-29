/*
  # Add button text to security tools

  1. Changes
    - Add `button_text` column to `security_tools` table
    - This allows custom button labels when a URL is provided
    - Defaults to 'Visit' for existing records

  2. Notes
    - Non-destructive migration
    - Existing tools will use 'Visit' as default button text
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'security_tools' AND column_name = 'button_text'
  ) THEN
    ALTER TABLE security_tools ADD COLUMN button_text text DEFAULT 'Visit';
  END IF;
END $$;