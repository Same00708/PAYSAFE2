-- Frais annulés si litige (0 % commission PaySafe)
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS fees_waived BOOLEAN NOT NULL DEFAULT FALSE;
